import { Router, Request, Response } from 'express';
import { prisma } from '../models';
import { paginate } from '../utils';

const router = Router();

// GET /api/deliveries - List deliveries
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;
    const courierId = req.query.courierId as string;

    const where: any = {};
    if (status) where.status = status;
    if (courierId) where.courierId = courierId;

    const deliveries = await prisma.delivery.findMany({
      where,
      include: {
        order: {
          include: {
            customer: true,
          },
        },
        courier: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const paginated = paginate(deliveries, page, limit);

    res.json({
      data: paginated,
      total: deliveries.length,
      page,
      limit,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch deliveries', details: err.message });
  }
});

// GET /api/deliveries/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const delivery = await prisma.delivery.findUnique({
      where: { id: req.params.id },
      include: {
        order: {
          include: {
            customer: true,
            courier: true,
            statusHistory: {
              orderBy: { createdAt: 'asc' },
            },
          },
        },
        courier: true,
      },
    });

    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    res.json(delivery);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch delivery', details: err.message });
  }
});

// POST /api/deliveries/assign - Assign a courier to an order
router.post('/assign', async (req: Request, res: Response) => {
  try {
    const { orderId, courierId } = req.body;

    if (!orderId || !courierId) {
      return res.status(400).json({ error: 'Missing orderId or courierId' });
    }

    // BUG: No check for overlapping deliveries
    // A courier can be assigned to multiple deliveries with overlapping time windows
    // This should check if the courier already has an active delivery

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const courier = await prisma.courier.findUnique({
      where: { id: courierId },
    });

    if (!courier) {
      return res.status(404).json({ error: 'Courier not found' });
    }

    // TODO: Check if courier is available (status === 'available')
    // Right now we just assign regardless of courier status

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        courierId,
        status: 'ASSIGNED',
      },
    });

    // Create delivery record
    const delivery = await prisma.delivery.create({
      data: {
        orderId,
        courierId,
        status: 'assigned',
        estimatedTime: new Date(Date.now() + 3600000), // 1 hour estimate
      },
      include: {
        order: true,
        courier: true,
      },
    });

    // Update courier status
    await prisma.courier.update({
      where: { id: courierId },
      data: { status: 'on_delivery' },
    });

    // Record status history
    await prisma.statusHistory.create({
      data: {
        orderId,
        status: 'ASSIGNED',
        previousStatus: order.status,
        changedBy: 'dispatcher',
        note: `Assigned to ${courier.name}`,
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        orderId,
        customerId: order.customerId,
        type: 'email',
        message: `Your order ${order.trackingCode} has been assigned to a courier.`,
        status: 'pending',
      },
    });

    res.status(201).json(delivery);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to assign courier', details: err.message });
  }
});

// PUT /api/deliveries/:id/status - Update delivery status
router.put('/:id/status', async (req: Request, res: Response) => {
  try {
    const { status, note } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Missing status' });
    }

    const delivery = await prisma.delivery.findUnique({
      where: { id: req.params.id },
      include: { order: true },
    });

    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    // BUG: No state transition validation
    // Can go from DELIVERED back to pending, or from failed to DELIVERED
    // The VALID_TRANSITIONS map exists in utils but is never imported here

    // Update delivery status
    const updatedDelivery = await prisma.delivery.update({
      where: { id: req.params.id },
      data: {
        status,
        pickupTime: status === 'in_transit' && !delivery.pickupTime ? new Date() : delivery.pickupTime,
        deliveryTime: status === 'DELIVERED' ? new Date() : null,
        notes: note || delivery.notes,
      },
    });

    // Sync order status
    // NOTE: inconsistent casing — delivery uses lowercase, order uses mixed
    const orderStatus = status; // just pass through, no normalization
    await prisma.order.update({
      where: { id: delivery.orderId },
      data: { status: orderStatus },
    });

    // Record status history
    await prisma.statusHistory.create({
      data: {
        orderId: delivery.orderId,
        status,
        previousStatus: delivery.status,
        changedBy: 'courier',
        note: note || `Status updated to ${status}`,
      },
    });

    // Send notification for key transitions
    if (status === 'in_transit' || status === 'DELIVERED' || status === 'failed') {
      const order = await prisma.order.findUnique({
        where: { id: delivery.orderId },
      });

      if (order) {
        let message = '';
        switch (status) {
          case 'in_transit':
            message = `Your order ${order.trackingCode} is now in transit!`;
            break;
          case 'DELIVERED':
            message = `Your order ${order.trackingCode} has been delivered. Thank you!`;
            break;
          case 'failed':
            message = `Delivery attempt failed for order ${order.trackingCode}. We will contact you.`;
            break;
        }

        await prisma.notification.create({
          data: {
            orderId: order.id,
            customerId: order.customerId,
            type: 'sms',
            message,
            status: 'pending',
          },
        });
      }
    }

    res.json(updatedDelivery);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update delivery status', details: err.message });
  }
});

// GET /api/deliveries/tracking/:trackingCode - Get delivery tracking info
router.get('/tracking/:trackingCode', async (req: Request, res: Response) => {
  try {
    const delivery = await prisma.delivery.findFirst({
      where: {
        order: {
          trackingCode: req.params.trackingCode,
        },
      },
      include: {
        order: {
          include: {
            customer: true,
            courier: true,
            statusHistory: {
              orderBy: { createdAt: 'asc' },
            },
          },
        },
      },
    });

    if (!delivery) {
      return res.status(404).json({ error: 'Tracking code not found' });
    }

    // BUG: This returns customer data (name, email, phone, address) publicly
    // Anyone with the tracking code can see the customer's personal info
    // This is a privacy issue — should strip sensitive fields

    res.json(delivery);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch tracking info', details: err.message });
  }
});

export default router;
