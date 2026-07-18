# ForgeDev Logistics Backend

> Express + TypeScript + Prisma + SQLite API for delivery tracking and dispatch dashboard

**Part of [ForgeDev](https://forgedev.dev)** — Structured work simulation for junior developers.

---

## 📜 License

This project is dual-licensed:

| Version | License | Use Case |
|---------|---------|----------|
| Community | AGPL-3.0 | Free for personal and open-source use. Network service modifications must be published. |
| Commercial | Commercial License | For organizations that want to use this project without AGPL obligations. Contact **info@forgedev.dev** |

See [LICENSE](./LICENSE), [COMMERCIAL-LICENSE.md](./COMMERCIAL-LICENSE.md), and [CLA.md](./CLA.md) for details.

---

## 🤝 Contributing

Contributions are welcome! Please read:

- [CONTRIBUTING.md](./CONTRIBUTING.md) — Contribution guide, revenue sharing model, and PR process
- [CLA.md](./CLA.md) — Contributor License Agreement (must sign before merging)

---

## 🏗 Project Structure

```
forgedev-logistics-backend/
├── prisma/
│   ├── schema.prisma      # Database models
│   └── seed.ts            # Seed data (Spanish delivery companies)
├── src/
│   ├── index.ts           # Express app entry
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   │   ├── orderRoutes.ts       # /api/orders
│   │   ├── courierRoutes.ts     # /api/couriers
│   │   ├── deliveryRoutes.ts    # /api/deliveries
│   │   ├── routeRoutes.ts       # /api/routes
│   │   ├── notificationRoutes.ts # /api/notifications
│   │   └── trackingRoutes.ts    # /api/tracking/:code
│   ├── utils/
│   │   ├── index.ts
│   │   └── routeOptimizer.ts    # Dead code — optimization never finished
│   └── tests/
├── .env.example
├── Dockerfile
└── package.json
```

---

## 🚀 Getting Started

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run prisma:seed
npm run dev
```

Server runs on `http://localhost:3000`.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | List orders (with filters) |
| GET | `/api/orders/:id` | Get order details |
| POST | `/api/orders` | Create order |
| PUT | `/api/orders/:id` | Update order |
| DELETE | `/api/orders/:id` | Delete order |
| GET | `/api/couriers` | List couriers (with availability filter) |
| GET | `/api/couriers/:id` | Get courier details |
| POST | `/api/couriers` | Create courier |
| PUT | `/api/couriers/:id` | Update courier |
| DELETE | `/api/couriers/:id` | Delete courier |
| GET | `/api/deliveries` | List deliveries |
| GET | `/api/deliveries/:id` | Get delivery details |
| POST | `/api/deliveries/assign` | Assign courier to order |
| PUT | `/api/deliveries/:id/status` | Update delivery status |
| GET | `/api/deliveries/tracking/:code` | Track delivery by code |
| GET | `/api/routes` | List routes |
| GET | `/api/routes/:id` | Get route details |
| POST | `/api/routes` | Create route |
| PUT | `/api/routes/:id` | Update route |
| PUT | `/api/routes/:id/optimize` | Optimize route (TODO) |
| DELETE | `/api/routes/:id` | Delete route |
| GET | `/api/notifications` | List notifications |
| POST | `/api/notifications/send` | Send notification |
| GET | `/api/notifications/:id` | Get notification |
| GET | `/api/tracking/:code` | Public tracking endpoint |

---

## 📦 Order Status Flow

```
PENDING → ASSIGNED → PICKED_UP → IN_TRANSIT → DELIVERED
                                              ↘ FAILED (terminal)
                         ↘ CANCELLED (terminal)
```

---

## 🔗 Links

- **ForgeDev:** https://forgedev.dev
- **GitHub Org:** https://github.com/ForgeDevDotDev
- **Contact:** info@forgedev.dev

---

## 📁 Related Repositories

Backend API for the **Logistics** domain. Serves these frontends:

| Repo | Framework |
|------|-----------|
| forgedev-logistics-react | React |
| forgedev-logistics-vue | Vue |
