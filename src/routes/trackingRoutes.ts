import { Router, Request, Response } from 'express';
import { prisma } from '../models';

const router = Router();

// GET /api/tracking/:code - Public tracking endpoint
// This is the public endpoint used by the tracking page
// FIXME: No rate limiting on this endpoint — anyone can hammer it
// TODO: Add rate limiting middleware (express-rate-limit)
router.get('/:code', async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.findUnique({
      where: { trackingCode: req.params.code },
      include: {
        courier: true,
        statusHistory: {
          orderBy: { createdAt: 'asc' },
        },
        delivery: true,
        customer: true, // BUG: Including full customer data on a public endpoint
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Tracking code not found' });
    }

    // BUG: This returns ALL customer data — name, email, phone, full address
    // The public tracking page should only show minimal info like the city
    // but right now we just return everything

    // BUG 2: No caching — every tracking request hits the database
    // Should add Redis caching for frequently tracked orders

    res.json({
      trackingCode: order.trackingCode,
      status: order.status,
      pickupAddress: order.pickupAddress,
      deliveryAddress: order.deliveryAddress,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      courier: order.courier ? {
        name: order.courier.name,
        company: order.courier.company,
      } : null,
      delivery: order.delivery,
      statusHistory: order.statusHistory,
      customer: order.customer, // <-- this should not be here
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch tracking info', details: err.message });
  }
});

export default router;
