import { Router, Request, Response } from 'express';
import { prisma } from '../models';

const router = Router();

// GET /api/notifications - List notifications
router.get('/', async (req: Request, res: Response) => {
  try {
    const orderId = req.query.orderId as string;
    const customerId = req.query.customerId as string;
    const status = req.query.status as string;

    const where: any = {};
    if (orderId) where.orderId = orderId;
    if (customerId) where.customerId = customerId;
    if (status) where.status = status;

    const notifications = await prisma.notification.findMany({
      where,
      include: {
        order: true,
        customer: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ data: notifications, total: notifications.length });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch notifications', details: err.message });
  }
});

// POST /api/notifications/send - Send a notification
router.post('/send', async (req: Request, res: Response) => {
  try {
    const { orderId, type, message } = req.body;

    if (!orderId || !type || !message) {
      return res.status(400).json({ error: 'Missing orderId, type, or message' });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { customer: true },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // TODO: Actually send the email/SMS
    // For now we just create a record with "sent" status
    // This should integrate with a real email/SMS provider

    const notification = await prisma.notification.create({
      data: {
        orderId,
        customerId: order.customerId,
        type,
        message,
        status: 'sent', // Pretend we sent it
        sentAt: new Date(),
      },
      include: {
        order: true,
        customer: true,
      },
    });

    res.status(201).json(notification);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to send notification', details: err.message });
  }
});

// GET /api/notifications/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const notification = await prisma.notification.findUnique({
      where: { id: req.params.id },
      include: {
        order: true,
        customer: true,
      },
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json(notification);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch notification', details: err.message });
  }
});

export default router;
