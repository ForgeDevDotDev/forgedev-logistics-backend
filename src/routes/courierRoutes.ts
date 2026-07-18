import { Router, Request, Response } from 'express';
import { prisma } from '../models';
import { paginate } from '../utils';

const router = Router();

// GET /api/couriers - List with availability filter
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;

    const where: any = {};
    if (status) where.status = status;

    const couriers = await prisma.courier.findMany({
      where,
      include: {
        orders: {
          where: {
            status: {
              notIn: ['DELIVERED', 'CANCELLED', 'failed'],
            },
          },
          select: {
            id: true,
            trackingCode: true,
            status: true,
            pickupAddress: true,
            deliveryAddress: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    const paginated = paginate(couriers, page, limit);

    res.json({
      data: paginated,
      total: couriers.length,
      page,
      limit,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch couriers', details: err.message });
  }
});

// GET /api/couriers/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const courier = await prisma.courier.findUnique({
      where: { id: req.params.id },
      include: {
        orders: {
          include: {
            customer: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        deliveries: true,
      },
    });

    if (!courier) {
      return res.status(404).json({ error: 'Courier not found' });
    }

    res.json(courier);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch courier', details: err.message });
  }
});

// POST /api/couriers
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, vehicle, company, city } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const courier = await prisma.courier.create({
      data: {
        name,
        email,
        phone,
        vehicle: vehicle || 'van',
        status: 'available',
        company: company || null,
        city: city || null,
      },
    });

    res.status(201).json(courier);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create courier', details: err.message });
  }
});

// PUT /api/couriers/:id
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, vehicle, status, company, city, latitude, longitude } = req.body;

    const existing = await prisma.courier.findUnique({
      where: { id: req.params.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Courier not found' });
    }

    const updated = await prisma.courier.update({
      where: { id: req.params.id },
      data: {
        name: name || existing.name,
        email: email || existing.email,
        phone: phone || existing.phone,
        vehicle: vehicle || existing.vehicle,
        status: status || existing.status,
        company: company !== undefined ? company : existing.company,
        city: city !== undefined ? city : existing.city,
        latitude: latitude !== undefined ? latitude : existing.latitude,
        longitude: longitude !== undefined ? longitude : existing.longitude,
      },
    });

    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update courier', details: err.message });
  }
});

// DELETE /api/couriers/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    // Check if courier has active orders
    const activeOrders = await prisma.order.findMany({
      where: {
        courierId: req.params.id,
        status: {
          notIn: ['DELIVERED', 'CANCELLED', 'failed'],
        },
      },
    });

    if (activeOrders.length > 0) {
      return res.status(400).json({
        error: 'Cannot delete courier with active orders',
        activeOrders: activeOrders.length,
      });
    }

    await prisma.courier.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Courier deleted' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete courier', details: err.message });
  }
});

export default router;
