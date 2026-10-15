# OWASP ASVS 5.0.0 Security Audit Findings — WePair

This document records the specific security vulnerabilities identified during the code-level audit of the WePair application.

---

### Summary of Findings
| Finding ID | Title | Severity | ASVS 5.0.0 Ref | Status |
| :--- | :--- | :---: | :---: | :---: |
| **SEC-01** | Missing Access Control & BOLA/IDOR on Core Domain Endpoints | **CRITICAL** | V4.1.1, V4.1.2, V4.1.3 | OPEN |
| **SEC-02** | Unrestricted Privilege Escalation in User Registration | **CRITICAL** | V1.4.1, V4.1.1 | OPEN |
| **SEC-03** | Missing Authentication & Role Guards on Administrative Endpoints | **CRITICAL** | V4.1.1, V4.1.5 | OPEN |
| **SEC-04** | Client-Controlled Identity / Impersonation in Job State Lifecycle | **HIGH** | V4.1.2, V4.1.3 | OPEN |
| **SEC-05** | Financial Price Manipulation in Razorpay Order Creation | **HIGH** | V10.2.1, V10.2.2 | OPEN |
| **SEC-06** | OTP Brute-Forcing Without Attempt Throttling / Lockout | **HIGH** | V2.2.1, V2.2.2, V11.1.4 | OPEN |
| **SEC-07** | Unauthenticated & Unrestricted File Upload to Cloudinary | **HIGH** | V12.1.1, V12.1.2 | OPEN |
| **SEC-08** | Timing Attack in Webhook & Signature Verification | **MEDIUM** | V6.2.1 | OPEN |
| **SEC-09** | Missing HTTP Security Headers & Overly Permissive CORS | **MEDIUM** | V14.4.1, V14.4.4 | OPEN |
| **SEC-10** | Mass Assignment Allowed via Non-Strict Validation Pipe | **MEDIUM** | V5.1.1, V5.1.2 | OPEN |
| **SEC-11** | Lack of Rate Limiting on Authentication & Sensitive Endpoints | **MEDIUM** | V2.2.1, V11.1.4 | OPEN |

---

### Detailed Finding Descriptions

#### SEC-01 [CRITICAL]: Missing Access Control & BOLA/IDOR on Core Domain Endpoints
- **Affected Components**: `JobsController`, `CasesController`, `VehiclesController`, `UsersController`, `ProvidersController`
- **ASVS Reference**: V4.1.1, V4.1.2, V4.1.3 (General Access Control Design, Ownership Verification)
- **Evidence**:
  - `GET /v1/users` returns all registered users with phone numbers and roles to unauthenticated callers.
  - `GET /v1/cases` returns all customer breakdown incidents across the platform if no query parameter is provided.
  - `GET /v1/vehicles` returns all registered vehicles.
  - `POST /v1/cases/:id/cancel` and `POST /v1/jobs/:id/cancel` do not verify that the requesting user owns the case or job.
- **Impact**: Severe breach of consumer privacy, data harvesting, and unauthorized tampering with roadside assistance calls.
- **Remediation**:
  - Enforce `JwtAuthGuard` across all private domain controllers.
  - Enforce server-side ownership checks: customers may only view and modify their own cases/vehicles/jobs; providers may only access assigned jobs; admins have full operational view.

---

#### SEC-02 [CRITICAL]: Unrestricted Privilege Escalation in User Registration
- **Affected Components**: `RegisterDto`, `AuthService.register()`
- **ASVS Reference**: V1.4.1, V4.1.1 (Access Control Architecture, Least Privilege)
- **Evidence**:
  - `RegisterDto` declares `role?: UserRole = UserRole.CUSTOMER`.
  - `AuthService.register` persists `dto.role` without restriction.
  - Any caller sending `{"phone": "+91...", "password": "...", "name": "...", "role": "ADMIN"}` is immediately granted `ADMIN` privileges.
- **Impact**: Immediate compromise of platform administrative control.
- **Remediation**: Restrict registration role to `CUSTOMER` and `PROVIDER` only. Forbid self-registration with `ADMIN` role.

---

#### SEC-03 [CRITICAL]: Missing Authentication & Role Guards on Administrative Endpoints
- **Affected Components**: `AdminController`
- **ASVS Reference**: V4.1.1, V4.1.5 (Administrative Access Control)
- **Evidence**:
  - `JwtAuthGuard` and `RolesGuard` were imported in `admin.controller.ts` but never placed on the controller or its routes with `@UseGuards()`.
  - Anyone can access `GET /v1/admin/dashboard`, `PATCH /v1/admin/verifications/:providerId/approve`, and `POST /v1/admin/jobs/:jobId/override-assign`.
- **Impact**: Complete unauthorized administrative oversight and manipulation.
- **Remediation**: Apply `@UseGuards(JwtAuthGuard, RolesGuard)` and `@Roles(UserRole.ADMIN)` globally to `AdminController`.

---

#### SEC-04 [HIGH]: Client-Controlled Identity in Job State Lifecycle
- **Affected Components**: `JobsController`, `JobsService`
- **ASVS Reference**: V4.1.2, V4.1.3 (Operation Level Access Control)
- **Evidence**:
  - Endpoints `updateEnRoute`, `updateArrived`, `startService`, `completeService` accept `providerId` as a request body parameter from the client instead of extracting the authenticated provider identity from `req.user`.
- **Impact**: Rogue clients or malicious actors can spoof any technician ID and trigger lifecycle transitions.
- **Remediation**: Extract the provider identity strictly from the verified JWT payload (`req.user.id`).

---

#### SEC-05 [HIGH]: Financial Price Manipulation in Razorpay Order Creation
- **Affected Components**: `PaymentsController`, `PaymentsService.createOrder`
- **ASVS Reference**: V10.2.1, V10.2.2 (Transaction & Financial Integrity)
- **Evidence**:
  - `CreatePaymentOrderDto` allows the client to submit `amount: number`.
  - `PaymentsService.createOrder` creates the Razorpay order using the client-supplied `dto.amount` rather than the immutable server-calculated `job.quoteAmount`.
- **Impact**: Attackers can pay ₹1 for a ₹1500 towing service.
- **Remediation**: Derive the payment amount strictly from `job.quoteAmount` on the server and reject any mismatched client amount.

---

#### SEC-06 [HIGH]: Arrival OTP Brute-Forcing Without Attempt Throttling
- **Affected Components**: `JobsService.startService()`, `Job` schema
- **ASVS Reference**: V2.2.1, V2.2.2, V11.1.4 (Anti-Automation, Brute-Force Defense)
- **Evidence**:
  - OTP is a 4-digit code (1000–9999).
  - Failed verification attempts are not counted; the OTP is never locked out.
  - An automated script can cycle through all 9000 combinations in seconds.
- **Impact**: Bypasses the customer arrival handshake, enabling fraudulent job claims.
- **Remediation**: Add `failedOtpAttempts` to `Job` schema. Lock the OTP after 5 consecutive failed attempts and require escalation.

---

#### SEC-07 [HIGH]: Unauthenticated & Unrestricted File Upload to Cloudinary
- **Affected Components**: `UploadsController`, `UploadsService`
- **ASVS Reference**: V12.1.1, V12.1.2 (File Upload Verification)
- **Evidence**:
  - `POST /v1/uploads/image` is unauthenticated.
  - No file size limit is configured on `FileInterceptor`.
  - No MIME-type validation is performed (allows arbitrary file types).
- **Impact**: Storage exhaustion, potential XSS via malicious file types, and Cloudinary quota draining.
- **Remediation**:
  - Protect endpoint with `JwtAuthGuard`.
  - Restrict file size to 5MB max.
  - Whitelist allowed MIME types: `image/jpeg`, `image/png`, `image/webp`.

---

#### SEC-08 [MEDIUM]: Timing Attack in Webhook & Signature Verification
- **Affected Components**: `PaymentsService.verifyPayment()`, `PaymentsService.webhookHandler()`
- **ASVS Reference**: V6.2.1 (Cryptographic Verification)
- **Evidence**:
  - Razorpay signatures are compared using standard string equality `!==`.
- **Impact**: Potential side-channel timing attack allowing signature forgery.
- **Remediation**: Use `crypto.timingSafeEqual()` with equal-length buffers.

---

#### SEC-09 [MEDIUM]: Missing HTTP Security Headers & Overly Permissive CORS
- **Affected Components**: `main.ts`
- **ASVS Reference**: V14.4.1, V14.4.4 (HTTP Security Headers, CORS)
- **Evidence**:
  - `helmet` is not used. Standard browser protection headers are absent.
  - `app.enableCors()` allows all origins without restrictions.
- **Impact**: Vulnerability to clickjacking, MIME-sniffing, and cross-origin resource access.
- **Remediation**: Install and configure `helmet` middleware and configure CORS origin validation.

---

#### SEC-10 [MEDIUM]: Mass Assignment Permitted in ValidationPipe
- **Affected Components**: `main.ts`
- **ASVS Reference**: V5.1.1, V5.1.2 (Input Validation & Data Sanitization)
- **Evidence**:
  - `forbidNonWhitelisted: false` allows clients to inject undeclared properties.
- **Impact**: Potential unexpected property injection.
- **Remediation**: Set `forbidNonWhitelisted: true` in global `ValidationPipe`.

---

#### SEC-11 [MEDIUM]: Lack of Rate Limiting on Sensitive Endpoints
- **Affected Components**: `main.ts`, `AppModule`, `AuthController`
- **ASVS Reference**: V2.2.1, V11.1.4 (Rate Limiting & Anti-Automation)
- **Evidence**:
  - No throttler configured. Endpoints `/v1/auth/login`, `/v1/auth/register`, and `/v1/jobs/:id/start` can be spammed without restriction.
- **Impact**: Credential stuffing, denial-of-service, and brute-force attacks.
- **Remediation**: Implement `@nestjs/throttler` with sensible rate limits.
