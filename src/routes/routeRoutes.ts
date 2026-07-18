import { Router, Request, Response } from 'express';
import { prisma } from '../models';

const router = Router();

// GET /api/routes - List routes
router.get('/', async (req: Request, res: Response) => {
  try {
    const courierId = req.query.courierId as string;
    const status = req.query.status as string;

    const where: any = {};
    if (courierId) where.courierId = courierId;
    if (status) where.status = status;

    const routes = await prisma.route.findMany({
      where,
      include: {
        order: {
          include: {
            customer: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ data: routes, total: routes.length });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch routes', details: err.message });
  }
});

// GET /api/routes/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const route = await prisma.route.findUnique({
      where: { id: req.params.id },
      include: {
        order: {
          include: {
            customer: true,
            courier: true,
          },
        },
      },
    });

    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }

    // Parse waypoints JSON
    const waypoints = JSON.parse(route.waypoints);

    res.json({
      ...route,
      waypoints,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch route', details: err.message });
  }
});

// POST /api/routes
router.post('/', async (req: Request, res: Response) => {
  try {
    const { orderId, courierId, waypoints, distance, estimatedDuration } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'Missing orderId' });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if route already exists for this order
    const existingRoute = await prisma.route.findUnique({
      where: { orderId },
    });

    if (existingRoute) {
      return res.status(400).json({ error: 'Route already exists for this order' });
    }

    const route = await prisma.route.create({
      data: {
        orderId,
        courierId: courierId || null,
        waypoints: JSON.stringify(waypoints || []),
        distance: distance || null,
        estimatedDuration: estimatedDuration || null,
        status: 'planned',
      },
    });

    res.status(201).json(route);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create route', details: err.message });
  }
});

// PUT /api/routes/:id/optimize — placeholder
router.put('/:id/optimize', async (req: Request, res: Response) => {
  try {
    const route = await prisma.route.findUnique({
      where: { id: req.params.id },
    });

    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }

    // TODO: Wire up the route optimizer from utils/routeOptimizer.ts
    // For now this just returns the route unchanged
    // The optimizeRoute function exists but was never called here

    res.json({
      ...route,
      waypoints: JSON.parse(route.waypoints),
      message: 'Route optimization not yet implemented',
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to optimize route', details: err.message });
  }
});

// PUT /api/routes/:id
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { waypoints, distance, estimatedDuration, actualDuration, status, courierId } = req.body;

    const existing = await prisma.route.findUnique({
      where: { id: req.params.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Route not found' });
    }

    const updated = await prisma.route.update({
      where: { id: req.params.id },
      data: {
        waypoints: waypoints ? JSON.stringify(waypoints) : existing.waypoints,
        distance: distance !== undefined ? distance : existing.distance,
        estimatedDuration: estimatedDuration !== undefined ? estimatedDuration : existing.estimatedDuration,
        actualDuration: actualDuration !== undefined ? actualDuration : existing.actualDuration,
        status: status || existing.status,
        courierId: courierId !== undefined ? courierId : existing.courierId,
      },
    });

    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update route', details: err.message });
  }
});

// DELETE /api/routes/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.route.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Route deleted' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete route', details: err.message });
  }
});

export default router;
