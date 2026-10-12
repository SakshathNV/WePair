# WePair — Automobile Public Service Platform

## 1. Project Overview
**WePair** is an Automobile Public Service Platform designed to connect vehicle owners in need of emergency assistance, maintenance, and vehicle care with verified, nearby automotive service providers.

## 2. Long-Term Product Vision
The long-term vision encompasses an integrated ecosystem for automotive assistance:
- **Breakdown & Roadside Assistance**: Emergency response for flat tires, battery jumpstarts, minor mechanical faults, and towing.
- **Service & Workshop Discovery**: Discovery and booking for nearby certified mechanics and garages.
- **Intelligent Dispatch Engine**: Batch-notifying nearby eligible providers (e.g. 5 providers per wave) with atomic first-valid acceptance, fallback escalation, and cancellation handling.
- **Provider Verification & Onboarding**: Multi-tier vetting of technicians, garages, and partner fleets.
- **Vehicle & Service Classification**: Configurable taxonomy across two-wheelers, four-wheelers, commercial vehicles, and repair types.
- **Lifecycle & Operational Resilience**: Real-time status tracking, robust payments/refunds/disputes, fuel assistance via authorized partners, and administrative oversight.

*(Note: These capabilities represent the future strategic roadmap and will be implemented incrementally per approved milestones.)*

## 3. Approved Technology Foundation
- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: NestJS + TypeScript (using NestJS's Express HTTP adapter)
- **Database**: MongoDB Atlas
- **ODM**: Mongoose, integrated with NestJS using `@nestjs/mongoose`

### Technology Stack Invariants & Mandatory Rules:
- **ODM**: Mongoose is the mandatory and exclusive tool for all MongoDB data modeling and database interactions. Prisma or any other ORM/ODM is strictly prohibited.
- **Backend Architecture**: Built strictly on NestJS using its standard Express adapter. A separate Express backend is prohibited.
- **Stack Immutability**: The confirmed technology stack shall not be altered without explicit founder approval.
- **Dependency Control**: No additional libraries, frameworks, infrastructure, or services shall be introduced without evaluating necessity and obtaining prior founder approval.

## 4. Current Development Phase
- **Current Milestone**: Project Setup & Foundation Only (Milestone 1).
- **Scope**: Workspace initialization, environment verification, git repository setup, and baseline project documentation. Application feature code and UI designs are strictly deferred to upcoming founder-approved milestones.

## 5. Repository Structure
```text
WePair/
├── frontend/             # React + Vite + TypeScript + Tailwind CSS
├── backend/              # NestJS + TypeScript (Express adapter)
├── .gitignore            # Git exclusion rules for node, dist, and environment files
├── package.json          # Root orchestration & workspace scripts
├── README.md             # Project overview, vision, and technology foundation
└── PROJECT_STATUS.md     # Granular status tracking, decisions, and roadmap
```

## 6. Development Scripts
From the repository root:
- `npm run build` — Builds both backend and frontend.
- `npm run dev:frontend` — Starts the Vite frontend dev server.
- `npm run dev:backend` — Starts the NestJS backend dev server.

