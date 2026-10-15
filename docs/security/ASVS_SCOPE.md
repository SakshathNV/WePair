# OWASP ASVS 5.0.0 Security Scope — WePair Platform

## 1. Project & Technology Overview
- **Project Name**: WePair (Automobile Public Service Platform)
- **Architecture**: Modular Monolith on NestJS (using Express HTTP adapter) + React 19 / Vite / Tailwind CSS
- **Database & Persistence**: MongoDB Atlas, Mongoose (`@nestjs/mongoose`)
- **Runtime Environment**: Node.js v24 ESM
- **External Services**:
  - Razorpay Payment Gateway (Test Mode / Production)
  - Cloudinary Media Storage (Images / Evidence)
  - MongoDB Atlas Cloud Database

## 2. Confirmed Application Boundaries
The boundary includes:
- **Backend API (`/v1/*`)**: RESTful HTTP endpoints handling Authentication, Catalog, Vehicles, Providers, Cases, Jobs, Dispatching, Payments, Uploads, Notifications, and Administration.
- **WebSocket Gateway (`/events`)**: Socket.IO bi-directional namespace for real-time provider location updates, job state broadcasts, and technician dispatch notifications.
- **Durable Business Data**: MongoDB collections (`users`, `vehicles`, `serviceitems`, `providers`, `servicecases`, `jobs`, `dispatchsessions`, `payments`, `notifications`).

## 3. Security-Relevant Assets
1. **User Identity & Credentials**: Password hashes (bcrypt), JWT signing secrets, user contact info (phone numbers, emails, addresses).
2. **Payment & Financial Records**: Razorpay order IDs, payment transaction signatures, refund audit trails, quote and pricing amounts.
3. **Physical & Real-Time Location Data**: Precise GPS latitude/longitude coordinates of customers in breakdown situations and en-route service providers.
4. **Physical Vehicle & Verification Evidence**: Vehicle registration numbers, ownership links, driver/provider certificates, inspection evidence photos.
5. **Business Logic & Concurrency Integrity**: Incident dispatch state, atomic claim locks, arrival verification OTPs.

## 4. User Roles & Trust Boundaries
- **Anonymous / Unauthenticated**: Can browse public service catalog (`GET /v1/catalog`), submit registration, submit login, receive Razorpay webhooks.
- **Customer (`CUSTOMER`)**: Can manage own profile, own vehicles, create breakdown service cases, view own jobs, receive verification OTP, pay for assigned services. Must NOT access or alter other customers' cases, vehicles, or administrative functions.
- **Provider / Technician (`PROVIDER`)**: Can manage own online availability, stream live GPS location, accept dispatched jobs, advance job travel states (`EN_ROUTE`, `ARRIVED`), verify customer OTP to start service, mark service completed. Must NOT view other providers' earnings or perform admin overrides.
- **Administrator (`ADMIN`)**: Can access operational dashboard metrics, review and approve provider verification documents, perform emergency dispatch assignment overrides, inspect platform audit logs.

## 5. Sensitive Data Categories
- **Authentication Secrets**: JWT signing secret, API keys (Razorpay, Cloudinary), MongoDB Atlas credentials.
- **Personally Identifiable Information (PII)**: User phone numbers, names, emails, real-time breakdown locations.
- **Operational Secrets**: 4-digit arrival handshake OTPs (must remain confidential between customer and system until verified).

## 6. Proposed Verification Target: ASVS Level 2
- **Target**: OWASP ASVS 5.0.0 Level 2.
- **Rationale**: WePair processes real-time consumer emergency roadside assistance requests, financial payments, and geolocation tracking. ASVS Level 2 covers applications that handle sensitive transactions and confidential consumer data, ensuring robust controls against unauthorized access, injection, session hijacking, BOLA/IDOR, and business logic flaws.

## 7. Scope Limitations & Assumptions
- **Third-Party Infrastructure**: Physical hosting security of MongoDB Atlas and Razorpay servers is outside the application code scope.
- **SMS Gateway**: OTP is currently delivered in-app / generated server-side. Production SMS channel integration is an external dependency.
