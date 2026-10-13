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
  - Health check endpoint `/health` exposing live MongoDB Atlas connection status.

## 2. Technical Boundaries & Implementation Status
Per strict execution rules:
- **Persistence Active**: All durable state is now stored in MongoDB Atlas via Mongoose. In-memory maps have been fully transitioned to Atlas collections.
- **Git Push Policy**: Remote pushes remain paused per user instruction. All changes are held locally.

## 3. Decisions Awaiting Founder Approval
The following architectural decisions remain unapproved:
1. **UI Design System & Visual Identity**:
   - Primary, secondary, accent, and background colors.
   - Typography, border radii, component style preferences.
   - Any preferred UI primitive library (e.g. Radix/shadcn vs pure Tailwind).
2. **Authentication Strategy**:
   - JWT vs Session tokens; Role-based access control (Customer, Provider, Admin).
3. **Real-time Dispatch Engine**:
   - WebSocket (Socket.IO via NestJS Gateways) vs SSE; Redis for hot coordination.
4. **Third-Party Services**:
   - Geolocation & maps (Google Maps vs Mapbox).
   - Payment provider (Stripe, Razorpay, etc.).
   - SMS / Push notifications.

## 4. Next Planned Milestone
- **Milestone 2**: Receive Founder authorization for Mongoose schema configuration and approved domain feature milestones.

