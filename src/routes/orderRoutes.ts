import { Router, Request, Response } from 'express';
import { prisma } from '../models';
import { paginate, generateTrackingCode } from '../utils';

const router = Router();

// GET /api/orders - List with filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;
    const customerId = req.query.customerId as string;
    const courierId = req.query.courierId as string;

    const where: any = {};
    if (status) where.status = status;
    if (customerId) where.customerId = customerId;
    if (courierId) where.courierId = courierId;

    // NOTE: The status filter above is case-sensitive
    // Some statuses in the DB are lowercase ("pending"), some uppercase ("DELIVERED")
    // This means filtering for "pending" won't match "PENDING" — known issue

    const orders = await prisma.order.findMany({
      where,
      include: {
        customer: true,
        courier: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Manual pagination — should use Prisma skip/take but whatever
    const paginated = paginate(orders, page, limit);

    res.json({
      data: paginated,
      total: orders.length,
      page,
      limit,
      totalPages: Math.ceil(orders.length / limit),
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch orders', details: err.message });
  }
});

// GET /api/orders/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        customer: true,
        courier: true,
        delivery: true,
        route: true,
        statusHistory: {
          orderBy: { createdAt: 'asc' },
        },
        notifications: true,
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch order', details: err.message });
  }
});

// POST /api/orders
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      customerId,
      pickupAddress,
      deliveryAddress,
      pickupLatitude,
      pickupLongitude,
      deliveryLatitude,
      deliveryLongitude,
      weight,
      notes,
    } = req.body;

    // Minimal validation — should use zod
    if (!customerId || !pickupAddress || !deliveryAddress) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const trackingCode = generateTrackingCode(customer.city);

    const order = await prisma.order.create({
      data: {
        trackingCode,
        status: 'pending',
        customerId,
        pickupAddress,
        deliveryAddress,
        pickupLatitude: pickupLatitude || null,
        pickupLongitude: pickupLongitude || null,
        deliveryLatitude: deliveryLatitude || null,
        deliveryLongitude: deliveryLongitude || null,
        weight: weight || null,
        notes: notes || null,
      },
      include: {
        customer: true,
      },
    });

    // Create initial status history
    await prisma.statusHistory.create({
      data: {
        orderId: order.id,
        status: 'pending',
        previousStatus: null,
        changedBy: 'system',
        note: 'Order created',
      },
    });

    // Send notification
    await prisma.notification.create({
      data: {
        orderId: order.id,
        customerId,
        type: 'email',
        message: `Your order has been received. Tracking code: ${trackingCode}`,
        status: 'pending',
      },
    });

    res.status(201).json(order);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create order', details: err.message });
  }
});

// PUT /api/orders/:id
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { status, courierId, ...updateData } = req.body;

    const existing = await prisma.order.findUnique({
      where: { id: req.params.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // BUG: No transition validation — can go from DELIVERED back to pending
    // The VALID_TRANSITIONS in utils/index.ts was never wired up
    if (status) {
      // We should check if this is a valid transition here...
      // TODO: Add state machine validation
    }

    const updated = await prisma.order.update({
      where: { id: req.params.id },
      data: {
        ...updateData,
        status: status || existing.status,
        courierId: courierId !== undefined ? courierId : existing.courierId,
      },
      include: {
        customer: true,
        courier: true,
      },
    });

    // Record status history
    if (status && status !== existing.status) {
      await prisma.statusHistory.create({
        data: {
          orderId: req.params.id,
          status,
          previousStatus: existing.status,
          changedBy: 'dispatcher',
          note: `Status updated from ${existing.status} to ${status}`,
        },
      });
    }

    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update order', details: err.message });
  }
});

// DELETE /api/orders/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.order.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Order deleted' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete order', details: err.message });
  }
});

export default router;
