# TripSync

A production-ready, microservices-based vacation reservation platform where customers can reserve
hotel rooms & vacation rentals, book tours & activities, and rent cars — with an event-driven
core (Apache Kafka), a unified API gateway, a Next.js web frontend, and a Flutter mobile app.

## Architecture

```
                          ┌───────────────┐
                          │    Nginx      │  :80
                          └──────┬────────┘
                  ┌───────────────┴───────────────┐
                  │        api-gateway            │  :4000  (NestJS, JWT + Swagger + rate limit)
                  └───┬───────┬───────┬───────┬───┘
                      │       │       │       │
              ┌───────▼──┐ ┌──▼─────┐ ┌▼──────┐ ┌▼────────┐
              │ tour-svc │ │property│ │ car   │ │ booking │
              │  :3000   │ │ :8081  │ │ :8082 │ │  :8083  │
              │  NestJS  │ │ Spring │ │ Spring│ │  Spring │
              └──────────┘ └────────┘ └───────┘ └─────────┘
                                │        │        │
                     Apache Kafka (tripsync.booking.events / .payment.events / .inventory.events)
                                │
                    PostgreSQL ─┼── Redis ── Vault ── ELK (logs)
```

| Component      | Tech                            | Port  |
| -------------- | ------------------------------- | ----- |
| api-gateway    | NestJS (JWT, Throttling, Swagger)| 4000 |
| tour-service   | NestJS + Prisma (Clean Arch)     | 3000  |
| property-service| Spring Boot + JPA/Hibernate     | 8081  |
| car-service    | Spring Boot + JPA/Hibernate     | 8082  |
| booking-service| Spring Boot (state machine)     | 8083  |
| frontend       | Next.js 16 + Tailwind CSS        | 3001  |
| mobile         | Flutter                          | —     |
| postgres / redis / kafka / vault / elasticsearch / kibana / logstash / nginx | Docker | — |

## Quick Start (Docker Compose)

```bash
# 1. Configure secrets (edit .env, then never commit it)
cp .env.example .env   # or edit the existing .env

# 2. Start everything
docker compose up -d --build

# 3. Open the app
#    Web:        http://localhost:3001   (Nginx front at http://localhost:80)
#    Swagger:    http://localhost:4000/api/v1/docs
#    Kibana:     http://localhost:5601
#    Vault:      http://localhost:8200
```

### Local (non-Docker) development

```bash
# API Gateway
cd api-gateway && npm i && npm run start:dev        # :4000

# Tour Service (requires PostgreSQL + Prisma migrations)
cd tour-service && npm i && npx prisma migrate deploy && npm run start:dev  # :3000

# Spring services (requires Maven + JDK 21)
cd property-service && ./mvnw spring-boot:run       # :8081
cd car-service      && ./mvnw spring-boot:run       # :8082
cd booking-service  && ./mvnw spring-boot:run       # :8083

# Frontend
cd frontend && npm i && npm run dev                 # :3001

# Mobile
cd mobile && flutter pub get && flutter run
```

## API Contract (via gateway, prefix `/api/v1`)

| Method | Route                          | Backend      |
| ------ | ------------------------------ | ------------ |
| GET    | `/tours` `/tours/:id`          | tour-service |
| POST   | `/tours`                       | tour-service |
| GET    | `/properties` `/properties/:id`| property-service |
| POST   | `/properties`                  | property-service |
| GET    | `/cars` `/cars/:id`            | car-service  |
| POST   | `/cars`                        | car-service  |
| POST   | `/bookings`                    | booking-service |
| GET    | `/bookings/:id` `/bookings/user/:userId` | booking-service |
| POST   | `/bookings/:id/cancel`         | booking-service |
| POST   | `/auth/login`                  | api-gateway (issues JWT) |
| GET    | `/health`                      | api-gateway  |

Booking lifecycle: `PENDING → CONFIRMED → COMPLETED`, with `CANCELLED` (and refund) allowed from
`PENDING`/`CONFIRMED`. Booking-service publishes `tripsync.booking.events` and `tripsync.payment.events`;
property/car/tour services consume booking events and publish `tripsync.inventory.events`.

## Repository Layout

```
.
├── api-gateway/          # NestJS gateway: auth, proxy, throttling, Swagger
├── tour-service/         # NestJS + Prisma, clean architecture (use-cases, domain, infra)
├── property-service/     # Spring Boot hotels & rentals
├── car-service/          # Spring Boot car rentals
├── booking-service/      # Spring Boot core reservations + payment state machine
├── frontend/             # Next.js 16 + Tailwind (Home, Search, Details, Checkout)
├── mobile/               # Flutter app (Discover, Search, Details, Checkout, Confirmation)
├── prisma/               # Shared Prisma schema + migrations (tour-service)
├── infra/                # nginx, logstash, filebeat configs, vault bootstrap
├── k8s/                  # Kubernetes manifests (config, secrets, datastores, microservices, ingress)
├── docker-compose.yml    # Full local stack
└── .env                  # Root environment / secrets (never commit)
```

## Security & Observability

- **JWT/OAuth2**: api-gateway issues/validates JWTs (see `JWT_SECRET`, `OAUTH2_*` envs); endpoints
  in Swagger accept bearer tokens.
- **Vault**: `infra/vault/bootstrap.sh` seeds `secret/tripsync/*` KV paths for DB, Redis, Kafka,
  JWT, OAuth and payments.
- **OWASP**: global validation pipes (class-validator), throttling at the gateway, parameterized
  queries via Prisma/Hibernate, no secrets in code (all via env/Vault).
- **ELK**: filebeat ships container logs → logstash → Elasticsearch; visualize in Kibana.
- **K8s**: `kubectl apply -f k8s/` provisions namespace, configmap/secrets, postgres/redis/kafka,
  the five services and an ingress.

## Notes

- All secrets in the repo are development placeholders — rotate before production.
- `tour-service` shares the root `prisma/` schema; regenerate the client with
  `npx prisma generate` inside `tour-service`.
