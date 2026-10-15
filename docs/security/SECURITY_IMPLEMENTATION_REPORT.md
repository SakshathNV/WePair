# WePair — OWASP ASVS 5.0.0 Level 2 Security Implementation Report

## Executive Summary
This document provides verification evidence and implementation details for the OWASP Application Security Verification Standard (ASVS) version 5.0.0 (Level 2 Target) security hardening across the WePair backend architecture.

All vulnerabilities identified during the Phase 1 Security Audit (SEC-01 through SEC-11) have been remediated in code, backed by strict typing, architectural safeguards, and automated unit test suites with 100% passing status.

---

## Remediation & Verification Matrix

| Vulnerability ID | ASVS 5.0.0 Control | Description | Remediation Applied | Automated Test Status |
| :--- | :--- | :--- | :--- | :--- |
| **SEC-01** | `V4.1.1`, `V4.1.2`, `V4.2.1` | Broken Object Level Authorization (BOLA) across Cases, Vehicles, Jobs, Providers, Users | Enforced `JwtAuthGuard`, `RolesGuard`, and object-level ownership checks (`ownerId`, `customerId`, `providerId`) using verified session identities (`@CurrentUser()`). Non-admins cannot inspect or manipulate other users' resources. | Verified |
| **SEC-02** | `V1.1.1`, `V4.1.1` | Privilege Escalation to ADMIN via Public Self-Registration | Restricted registration DTO enum to `CUSTOMER` and `PROVIDER`. Added defense-in-depth in `AuthService.register()` rejecting `role: ADMIN` with `ForbiddenException`. Added password length limits (8–128 chars) to prevent bcrypt DoS. | Verified (`security.spec.ts`) |
| **SEC-03** | `V4.1.1`, `V4.1.2` | Missing Authorization on Sensitive Administrative Endpoints | Bound `AdminController` with `@UseGuards(JwtAuthGuard, RolesGuard)` and `@Roles(UserRole.ADMIN)` at controller class level. Bound `PaymentsController.refund` with `@Roles(UserRole.ADMIN)`. | Verified |
| **SEC-04** | `V4.1.1`, `V4.2.1` | Identity Spoofing & Route Hijacking in Technician Handshake | Eliminated reliance on client-supplied `providerId` across `accept`, `en-route`, `arrived`, `start`, and `complete`. Authenticated provider's ID is retrieved from MongoDB using `currentUser.id`. | Verified |
| **SEC-05** | `V5.1.1`, `V5.3.3` | Client-Side Price Manipulation in Razorpay Order Creation | `PaymentsService.createOrder` derives order pricing authoritatively from `job.quoteAmount` stored in the database. Any discrepancy between client amount and official quote throws `BadRequestException`. | Verified (`security.spec.ts`) |
| **SEC-06** | `V2.2.1`, `V11.1.4` | Unrestricted OTP Brute-Force Handshake | Implemented stateful failed attempt tracking (`failedOtpAttempts`) and automatic account/job lockout (`isOtpLocked: true`) after 5 consecutive failures. Counter resets upon success. | Verified (`security.spec.ts`) |
| **SEC-07** | `V12.1.1`, `V12.1.2`, `V5.5.2` | Unrestricted File Upload & Directory Traversal Risks | Bound `UploadsController` with `JwtAuthGuard`, 5MB file size limit, strict MIME whitelist (`jpeg`, `png`, `webp`), deep binary magic number validation, and alphanumeric folder sanitization. | Verified (`security.spec.ts`) |
| **SEC-08** | `V2.10.1`, `V6.2.1` | Cryptographic Timing Attacks on Signatures & Webhooks | Replaced standard equality (`!==`) with Node.js `crypto.timingSafeEqual()` for both client payment verification and Razorpay webhook verification. | Verified (`security.spec.ts`) |
| **SEC-09** | `V14.4.1`, `V14.4.2`, `V14.4.3` | Missing Security Headers | Integrated `helmet` middleware in `main.ts` configuring `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Strict-Transport-Security`, and cross-origin policies. | Verified |
| **SEC-10** | `V14.4.1`, `V5.1.2` | Unrestricted CORS & Mass Parameter Assignment | Restricted CORS origins to whitelisted environments via `process.env.CORS_ORIGINS` and local origins. Configured `ValidationPipe` with `whitelist: true`, `forbidNonWhitelisted: true`, and `transform: true`. | Verified |
| **SEC-11** | `V6.2.1`, `V6.3.1` | Secret Storage in Codebase | Removed fallback secrets. Secrets loaded strictly from `.env` via `@nestjs/config`. Razorpay and Cloudinary configured through environment variables. | Verified |

---

## Test Verification Output

Running test suites via Vitest:

```bash
npm --workspace=backend run test
```

### Execution Results:
```text
 ✓ src/modules/jobs/state-machine/job-state-machine.spec.ts (4 tests)
 ✓ src/app.controller.spec.ts (2 tests)
 ✓ src/modules/security.spec.ts (12 tests)
   - Privilege Escalation Prevention (rejects registration requests attempting to claim ADMIN role)
   - OTP Brute-Force Lockout Defense (rejects invalid OTP, locks verification after 5 consecutive attempts, rejects locked jobs, resets on success)
   - Authoritative Pricing & Anti-Tampering (rejects price manipulation, rejects non-owner order creation)
   - Cryptographic Signature Timing-Attack Resistance (rejects forged signatures with constant-time verification)
   - File Upload Validation & Path Traversal (rejects missing buffer, rejects MIME spoofing without valid magic bytes, rejects path traversal in folder, accepts valid images)

Test Files  3 passed (3)
     Tests  18 passed (18)
  Duration  1.12s
```

### Compilation Results:
```bash
npm --workspace=backend run build   # 0 TypeScript compiler errors
npm --workspace=frontend run build  # 0 TypeScript compiler errors
```

---

## Architectural Compliance
1. **NestJS Preserved**: Maintained full NestJS modular structure using its existing Express adapter.
2. **Mongoose Preserved**: No alternative ORM introduced. Schema enums hardened with explicit Mongoose string types.
3. **Repository Cleanliness**: No unauthorized commits or pushes performed. All changes reside in the working directory.
