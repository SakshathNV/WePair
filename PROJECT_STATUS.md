# WePair — Project Status & Roadmap

## 1. What Has Been Created & Configured
- **Cloned Repository**: Connected to `git@github.com:SakshathNV/WePair.git` / `https://github.com/SakshathNV/WePair.git` on branch `main`.
- **Exclusion Rules**: Root `.gitignore` configured to cover dependencies, build artifacts (`dist/`), environment secrets, and IDE metadata.
- **Project Documentation**:
  - `README.md` defining project vision, approved technology foundation, and project commands.
  - `PROJECT_STATUS.md` recording live progress, technical boundaries, and pending decisions.
- **Frontend Codebase (`/frontend`)**:
  - React 19 + TypeScript + Vite initialized.
  - Tailwind CSS installed and integrated via `@tailwindcss/vite` in `vite.config.ts` and `src/index.css`.
  - Type-check and production build verified (`tsc -b && vite build`).
- **Backend Codebase (`/backend`)**:
  - NestJS initialized with standard Express HTTP adapter and TypeScript.
  - Architecture organized according to standard NestJS module conventions.
  - Production compilation verified (`nest build`).
- **Confirmed & Approved Technology Stack**:
  - **Frontend**: React + TypeScript + Vite
  - **Styling**: Tailwind CSS
  - **Backend**: NestJS + TypeScript (using NestJS's Express HTTP adapter; no separate Express backend)
  - **Database**: MongoDB Atlas
  - **ODM**: Mongoose integrated via `@nestjs/mongoose` (Exclusive ODM; Prisma or other ORMs are strictly prohibited)
  - **Technology Invariants**: The confirmed stack is locked. No additional libraries, frameworks, infrastructure, or services may be introduced without prior necessity evaluation and explicit founder approval.
- **Database & Persistence Layer**:
  - MongoDB Atlas successfully connected using `@nestjs/mongoose` and `mongoose`.
  - Credentials securely loaded via environment variables (`backend/.env`, git-ignored).
  - Mongoose schemas implemented with timestamps, virtual ID transforms, and indexing:
    - `UserSchema` (unique phone index, role enum)
    - `VehicleSchema` (registration uppercase index, category & fuelType enums)
    - `ServiceItemSchema` (unique code index, service category enum)
    - `ProviderSchema` (status & user indexes, geospatial coordinates with 2dsphere index)
    - `ServiceCaseSchema` (sparse unique idempotencyKey index, customer & vehicle references)
    - `JobSchema` (strict state machine enum, OTP verification, timeline audit events)
    - `DispatchSessionSchema` (unique jobId index, 5-by-5 candidate batches, attempts audit log)
  - Auto-seeding for service catalog and verified demonstration providers on startup.
- **Completed Backend Architecture & Modules**:
  - **Authentication & RBAC (`/v1/auth`)**: JWT tokens, bcrypt password hashing, `JwtAuthGuard`, `@Roles()` decorator with `RolesGuard` for `CUSTOMER`, `PROVIDER`, and `ADMIN`.
  - **Payments & Billing (`/v1/payments`)**: Razorpay API integration using credentials from `.env`, HMAC SHA256 signature verification, refund processing, idempotency guards, and webhook listener.
  - **Media & Evidence Storage (`/v1/uploads`)**: Cloudinary streaming integration using credentials from `.env` for vehicle photos, inspection evidence, and provider verification documents.
  - **Real-Time Communication (`EventsGateway`)**: Socket.IO WebSocket gateway (`/events`) for live GPS breadcrumb broadcasts (`location-update`), real-time job state transitions, and provider push events.
  - **In-App Notifications (`/v1/notifications`)**: Audited notification feed, read tracking, and unread counts for customers and technicians.
  - **Admin Operations (`/v1/admin`)**: Operational dashboard stats (active cases, revenue in INR, online technicians), provider approval queue, and manual assignment overrides.
  - **No Hardcoded Secrets**: All credentials (MongoDB, JWT, Razorpay, Cloudinary) are loaded strictly via `@nestjs/config` and `.env`.

## 2. Technical Boundaries & Implementation Status
- **Backend Complete**: All core blueprint phases (MVC domain models, MongoDB Atlas persistence, Auth, Payments, Uploads, WebSockets, Notifications, and Admin) are fully built and verified.
- **Git Policy**: As instructed, no commits or pushes have been performed. All changes reside locally in the working directory.

## 3. Next Planned Milestone
- **Frontend Integration**: Build the React 19 + Tailwind CSS user interfaces connecting to the completed backend endpoints (customer booking flow, live provider tracking map, provider response dashboard, and admin console).

