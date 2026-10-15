# OWASP ASVS 5.0.0 Requirements Matrix — WePair

Target: **ASVS 5.0.0 Level 2**
Stack: **React 19 / NestJS (Express) / MongoDB Atlas (Mongoose)**

| Requirement ID | Standard Description | Component | Applicability | Current Status | Remediation / Verification Method |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **V1.4.1** | Verify that access control architecture enforces least privilege. | `AuthModule`, `UsersModule` | Applicable | FAIL | Block `ADMIN` self-registration; enforce RBAC guards. |
| **V2.1.1** | Verify password length requirements (min 8 chars, max 128 chars to prevent DoS). | `RegisterDto` | Applicable | FAIL | Add `@MinLength(8)` and `@MaxLength(128)` validators. |
| **V2.2.1** | Verify protections against automated brute-force attacks on credentials and tokens. | `AuthModule`, `JobsModule` | Applicable | FAIL | Implement rate limiting and OTP attempt lockout. |
| **V2.8.1** | Verify password storage uses an approved work-factor salted algorithm. | `AuthService` | Applicable | PASS | Uses `bcrypt` with 10 salt rounds. |
| **V3.2.1** | Verify session/JWT tokens are signed with cryptographically secure key. | `AuthModule` | Applicable | PASS | Uses HMAC-SHA256 via `@nestjs/jwt` with secret from `.env`. |
| **V3.5.1** | Verify tokens have short-to-medium lifespan with explicit expiration. | `AuthModule` | Applicable | PASS | JWT configured with `7d` expiration via `.env`. |
| **V4.1.1** | Verify that all access control decisions are made securely on the server side. | All Controllers | Applicable | FAIL | Apply `JwtAuthGuard` and `RolesGuard` to private endpoints. |
| **V4.1.2** | Verify that users can only access their own data (BOLA/IDOR protection). | `CasesController`, `JobsController`, `VehiclesController` | Applicable | FAIL | Enforce server-side ownership checks matching `req.user.id`. |
| **V4.1.3** | Verify that identity cannot be spoofed through request parameters. | `JobsController`, `ProvidersController` | Applicable | FAIL | Extract provider/customer IDs strictly from verified JWT token. |
| **V4.1.5** | Verify that administrative functions are restricted to authorized administrators. | `AdminController` | Applicable | FAIL | Apply `@UseGuards(JwtAuthGuard, RolesGuard)` & `@Roles(ADMIN)`. |
| **V5.1.1** | Verify that all input data is validated against a strict schema. | Global `ValidationPipe` | Applicable | PARTIAL | Set `forbidNonWhitelisted: true` to prevent mass assignment. |
| **V5.3.1** | Verify output encoding and protection against injection attacks. | Mongoose Models | Applicable | PASS | Mongoose parameterized queries prevent NoSQL injection. |
| **V6.2.1** | Verify that cryptographic comparisons are timing-attack resistant. | `PaymentsService` | Applicable | FAIL | Use `crypto.timingSafeEqual()` for HMAC verification. |
| **V10.2.1** | Verify that transaction amounts and items cannot be tampered with by clients. | `PaymentsService` | Applicable | FAIL | Enforce payment amount strictly equal to `job.quoteAmount`. |
| **V11.1.4** | Verify rate limiting on anti-automation sensitive transactions (OTP, login). | `JobsService`, `AuthService` | Applicable | FAIL | Implement 5-attempt lockout on OTP verification. |
| **V12.1.1** | Verify file upload validation (file size, MIME types, authentication). | `UploadsController` | Applicable | FAIL | Require authentication, 5MB limit, whitelist image MIME types. |
| **V14.4.1** | Verify that security headers (HSTS, CSP, X-Content-Type-Options) are present. | `main.ts` | Applicable | FAIL | Integrate `helmet` middleware. |
| **V14.4.4** | Verify that Cross-Origin Resource Sharing (CORS) is strictly restricted. | `main.ts` | Applicable | FAIL | Configure CORS with explicit allowed origins. |

---

### Status Definitions
- **PASS**: Control is implemented and verified by automated tests.
- **FAIL**: Control is missing, incomplete, or bypassed.
- **PARTIAL**: Basic framework exists but lacks enforcement or validation.
