import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding logistics database...');

  // Clear existing data
  await prisma.notification.deleteMany();
  await prisma.statusHistory.deleteMany();
  await prisma.route.deleteMany();
  await prisma.delivery.deleteMany();
  await prisma.order.deleteMany();
  await prisma.courier.deleteMany();
  await prisma.customer.deleteMany();

  // --- Customers ---
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: 'María García',
        email: 'maria.garcia@gmail.com',
        phone: '+34 612 345 678',
        address: 'Calle Gran Vía 45',
        city: 'Madrid',
        postalCode: '28013',
        latitude: 40.4203,
        longitude: -3.7058,
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Carlos Rodríguez',
        email: 'carlos.rodriguez@hotmail.com',
        phone: '+34 623 456 789',
        address: 'Passeig de Gràcia 92',
        city: 'Barcelona',
        postalCode: '08008',
        latitude: 41.3953,
        longitude: 2.1619,
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Ana Martínez',
        email: 'ana.martinez@gmail.com',
        phone: '+34 634 567 890',
        address: 'Carrer de Colón 12',
        city: 'Valencia',
        postalCode: '46004',
        latitude: 39.4699,
        longitude: -0.3763,
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Javier López',
        email: 'javier.lopez@yahoo.es',
        phone: '+34 645 678 901',
        address: 'Calle de Serrano 14',
        city: 'Madrid',
        postalCode: '28001',
        latitude: 40.4255,
        longitude: -3.6889,
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Elena Sánchez',
        email: 'elena.sanchez@gmail.com',
        phone: '+34 656 789 012',
        address: 'Avinguda del Portal de l\'Àngel 30',
        city: 'Barcelona',
        postalCode: '08002',
        latitude: 41.3825,
        longitude: 2.1769,
      },
    }),
  ]);

  // --- Couriers ---
  const couriers = await Promise.all([
    prisma.courier.create({
      data: {
        name: 'Mensajería Madrid Express',
        email: 'dispatch@madridexpress.es',
        phone: '+34 91 234 5678',
        vehicle: 'van',
        status: 'available',
        company: 'Madrid Express S.L.',
        city: 'Madrid',
        latitude: 40.4168,
        longitude: -3.7038,
      },
    }),
    prisma.courier.create({
      data: {
        name: 'Barcelona Delivery Co.',
        email: 'ops@bcndelivery.es',
        phone: '+34 93 345 6789',
        vehicle: 'motorbike',
        status: 'available',
        company: 'Barcelona Delivery Co.',
        city: 'Barcelona',
        latitude: 41.3851,
        longitude: 2.1734,
      },
    }),
    prisma.courier.create({
      data: {
        name: 'Valencia Mensajeros',
        email: 'info@valmensajeros.es',
        phone: '+34 96 456 7890',
        vehicle: 'van',
        status: 'on_delivery',
        company: 'Valencia Mensajeros S.L.',
        city: 'Valencia',
        latitude: 39.4699,
        longitude: -0.3763,
      },
    }),
    prisma.courier.create({
      data: {
        name: 'Pedro Jiménez',
        email: 'pedro.jimenez@madridexpress.es',
        phone: '+34 667 890 123',
        vehicle: 'bicycle',
        status: 'available',
        company: 'Madrid Express S.L.',
        city: 'Madrid',
        latitude: 40.4154,
        longitude: -3.7074,
      },
    }),
    prisma.courier.create({
      data: {
        name: 'Laura Fernández',
        email: 'laura.fernandez@bcndelivery.es',
        phone: '+34 678 901 234',
        vehicle: 'motorbike',
        status: 'offline',
        company: 'Barcelona Delivery Co.',
        city: 'Barcelona',
        latitude: 41.4036,
        longitude: 2.1744,
      },
    }),
  ]);

  // --- Orders ---
  const trackingCodes = ['TRK-001-MAD', 'TRK-002-BCN', 'TRK-003-VLC', 'TRK-004-MAD', 'TRK-005-BCN'];

  const ordersData = [
    {
      trackingCode: trackingCodes[0],
      status: 'pending',
      customerId: customers[0].id,
      pickupAddress: 'Almacén Central Madrid, Calle Alcalá 100',
      deliveryAddress: 'Calle Gran Vía 45, Madrid',
      pickupLatitude: 40.4171,
      pickupLongitude: -3.7018,
      deliveryLatitude: 40.4203,
      deliveryLongitude: -3.7058,
      weight: 2.5,
      notes: 'Fragile - handle with care',
    },
    {
      trackingCode: trackingCodes[1],
      status: 'ASSIGNED',
      customerId: customers[1].id,
      courierId: couriers[1].id,
      pickupAddress: 'Warehouse Barcelona, Carrer Aragó 50',
      deliveryAddress: 'Passeig de Gràcia 92, Barcelona',
      pickupLatitude: 41.3870,
      pickupLongitude: 2.1700,
      deliveryLatitude: 41.3953,
      deliveryLongitude: 2.1619,
      weight: 1.2,
      notes: 'Leave at reception',
    },
    {
      trackingCode: trackingCodes[2],
      status: 'in_transit',
      customerId: customers[2].id,
      courierId: couriers[2].id,
      pickupAddress: 'Centro Logístico Valencia, Av. del Cardenal Benlloch 20',
      deliveryAddress: 'Carrer de Colón 12, Valencia',
      pickupLatitude: 39.4700,
      pickupLongitude: -0.3600,
      deliveryLatitude: 39.4699,
      deliveryLongitude: -0.3763,
      weight: 5.0,
      notes: null,
    },
    {
      trackingCode: trackingCodes[3],
      status: 'DELIVERED',
      customerId: customers[3].id,
      courierId: couriers[0].id,
      pickupAddress: 'Almacén Central Madrid, Calle Alcalá 100',
      deliveryAddress: 'Calle de Serrano 14, Madrid',
      pickupLatitude: 40.4171,
      pickupLongitude: -3.7018,
      deliveryLatitude: 40.4255,
      deliveryLongitude: -3.6889,
      weight: 0.8,
      notes: 'Delivered to concierge',
    },
    {
      trackingCode: trackingCodes[4],
      status: 'PICKED_UP',
      customerId: customers[4].id,
      courierId: couriers[1].id,
      pickupAddress: 'Warehouse Barcelona, Carrer Aragó 50',
      deliveryAddress: 'Avinguda del Portal de l\'Àngel 30, Barcelona',
      pickupLatitude: 41.3870,
      pickupLongitude: 2.1700,
      deliveryLatitude: 41.3825,
      deliveryLongitude: 2.1769,
      weight: 3.3,
      notes: 'Customer requested morning delivery',
    },
  ];

  const orders = [];
  for (const data of ordersData) {
    const order = await prisma.order.create({ data });
    orders.push(order);

    // Create status history
    await prisma.statusHistory.create({
      data: {
        orderId: order.id,
        status: order.status,
        previousStatus: null,
        changedBy: 'system',
        note: 'Order created',
      },
    });
  }

  // Create deliveries for assigned/transit/delivered/picked_up orders
  const deliveries = [
    { orderId: orders[1].id, courierId: couriers[1].id, status: 'assigned', estimatedTime: new Date(Date.now() + 3600000) },
    { orderId: orders[2].id, courierId: couriers[2].id, status: 'in_transit', estimatedTime: new Date(Date.now() + 1800000), pickupTime: new Date(Date.now() - 1800000) },
    { orderId: orders[3].id, courierId: couriers[0].id, status: 'delivered', estimatedTime: new Date(Date.now() - 7200000), pickupTime: new Date(Date.now() - 10800000), deliveryTime: new Date(Date.now() - 5400000) },
    { orderId: orders[4].id, courierId: couriers[1].id, status: 'picked_up', estimatedTime: new Date(Date.now() + 2700000), pickupTime: new Date(Date.now() - 900000) },
  ];

  for (const d of deliveries) {
    await prisma.delivery.create({ data: d });
  }

  // Create routes
  for (const order of orders) {
    await prisma.route.create({
      data: {
        orderId: order.id,
        courierId: order.courierId,
        waypoints: JSON.stringify([
          { lat: order.pickupLatitude, lng: order.pickupLongitude, address: order.pickupAddress },
          { lat: order.deliveryLatitude, lng: order.deliveryLongitude, address: order.deliveryAddress },
        ]),
        distance: Math.random() * 30 + 2,
        estimatedDuration: Math.floor(Math.random() * 60 + 15),
        status: order.status === 'DELIVERED' ? 'completed' : 'planned',
      },
    });
  }

  // Create some notifications
  await prisma.notification.create({
    data: {
      orderId: orders[0].id,
      customerId: customers[0].id,
      type: 'email',
      message: 'Your order has been received and is pending assignment.',
      status: 'sent',
      sentAt: new Date(),
    },
  });
  await prisma.notification.create({
    data: {
      orderId: orders[2].id,
      customerId: customers[2].id,
      type: 'sms',
      message: 'Your order is in transit! Track it with code TRK-003-VLC',
      status: 'sent',
      sentAt: new Date(),
    },
  });
  await prisma.notification.create({
    data: {
      orderId: orders[3].id,
      customerId: customers[3].id,
      type: 'email',
      message: 'Your order has been delivered. Thank you!',
      status: 'sent',
      sentAt: new Date(),
    },
  });

  console.log('Seed completed successfully!');
  console.log(`  Customers: ${customers.length}`);
  console.log(`  Couriers: ${couriers.length}`);
  console.log(`  Orders: ${orders.length}`);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
