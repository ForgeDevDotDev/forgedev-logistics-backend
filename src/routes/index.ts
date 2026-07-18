import { Router } from 'express';
import orderRoutes from './orderRoutes';
import courierRoutes from './courierRoutes';
import deliveryRoutes from './deliveryRoutes';
import routeRoutes from './routeRoutes';
import notificationRoutes from './notificationRoutes';
import trackingRoutes from './trackingRoutes';

const router = Router();

router.use('/orders', orderRoutes);
router.use('/couriers', courierRoutes);
router.use('/deliveries', deliveryRoutes);
router.use('/routes', routeRoutes);
router.use('/notifications', notificationRoutes);
router.use('/tracking', trackingRoutes);

export { router as routes };
