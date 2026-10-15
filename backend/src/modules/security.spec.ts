import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ForbiddenException, BadRequestException, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth/auth.service.js';
import { UserRole } from '../common/enums/index.js';
import { JobsService } from './jobs/jobs.service.js';
import { PaymentsService } from './payments/payments.service.js';
import { JobStatus } from '../common/enums/index.js';

describe('OWASP ASVS 5.0.0 Level 2 Security Controls Verification', () => {
  describe('SEC-02: Privilege Escalation Prevention (ASVS V1.1.1, V4.1.1)', () => {
    let authService: AuthService;
    const mockUsersService = {
      findByPhone: vi.fn(),
      create: vi.fn(),
    };
    const mockJwtService = {
      sign: vi.fn(),
    };

    beforeEach(() => {
      vi.clearAllMocks();
      authService = new AuthService(
        mockUsersService as any,
        mockJwtService as any,
      );
    });

    it('rejects registration requests attempting to claim ADMIN role', async () => {
      const maliciousPayload: any = {
        phone: '+919999988888',
        name: 'Attacker Admin',
        password: 'Password123!',
        role: UserRole.ADMIN,
      };

      await expect(authService.register(maliciousPayload)).rejects.toThrow(
        ForbiddenException,
      );
      expect(mockUsersService.create).not.toHaveBeenCalled();
    });
  });

  describe('SEC-06: OTP Brute-Force Lockout Defense (ASVS V2.2.1, V11.1.4)', () => {
    let jobsService: JobsService;
    let mockJobModel: any;
    let mockJobDoc: any;

    beforeEach(() => {
      mockJobDoc = {
        id: 'job_test_1',
        providerId: 'prov_test_1',
        caseId: 'case_test_1',
        otp: '4821',
        status: JobStatus.ARRIVED,
        failedOtpAttempts: 0,
        isOtpLocked: false,
        timeline: [],
        save: vi.fn().mockImplementation(async () => mockJobDoc),
      };

      mockJobModel = {
        findById: vi.fn().mockReturnValue({
          exec: vi.fn().mockResolvedValue(mockJobDoc),
        }),
      };

      const mockCasesService = {
        findById: vi.fn().mockResolvedValue({ customerId: 'cust_test_1' }),
      };

      jobsService = new JobsService(
        mockJobModel as any,
        mockCasesService as any,
        {} as any,
        {} as any,
        {} as any,
        {} as any,
      );
    });

    it('rejects invalid OTP attempts with BadRequestException and tracks attempts', async () => {
      await expect(
        jobsService.startService('job_test_1', 'prov_test_1', { otp: '0000' }),
      ).rejects.toThrow(BadRequestException);

      expect(mockJobDoc.failedOtpAttempts).toBe(1);
      expect(mockJobDoc.isOtpLocked).toBe(false);
      expect(mockJobDoc.save).toHaveBeenCalled();
    });

    it('locks verification after 5 consecutive failed attempts (ASVS V11.1.4)', async () => {
      mockJobDoc.failedOtpAttempts = 4;

      await expect(
        jobsService.startService('job_test_1', 'prov_test_1', { otp: '0000' }),
      ).rejects.toThrow(ForbiddenException);

      expect(mockJobDoc.failedOtpAttempts).toBe(5);
      expect(mockJobDoc.isOtpLocked).toBe(true);
      expect(mockJobDoc.timeline).toContainEqual(
        expect.objectContaining({
          note: expect.stringContaining('Verification locked after 5 consecutive failed OTP attempts'),
        }),
      );
    });

    it('immediately rejects attempts on an already locked job', async () => {
      mockJobDoc.isOtpLocked = true;

      await expect(
        jobsService.startService('job_test_1', 'prov_test_1', { otp: '4821' }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('resets failed attempt counter upon successful OTP verification', async () => {
      mockJobDoc.failedOtpAttempts = 3;

      const result = await jobsService.startService('job_test_1', 'prov_test_1', {
        otp: '4821',
      });

      expect(result.failedOtpAttempts).toBe(0);
      expect(result.status).toBe(JobStatus.SERVICE_STARTED);
    });
  });

  describe('SEC-05: Authoritative Pricing & Anti-Tampering (ASVS V5.1.1, V5.3.3)', () => {
    let paymentsService: PaymentsService;
    let mockJobsService: any;
    let mockCasesService: any;
    let mockPaymentModel: any;
    let mockConfigService: any;

    beforeEach(() => {
      mockJobsService = {
        findById: vi.fn().mockResolvedValue({
          id: 'job_123',
          caseId: 'case_123',
          serviceName: 'Flatbed Towing',
          quoteAmount: 1499,
          providerId: 'prov_123',
        }),
      };

      mockCasesService = {
        findById: vi.fn().mockResolvedValue({
          id: 'case_123',
          customerId: 'cust_real',
        }),
      };

      mockPaymentModel = {
        findOne: vi.fn().mockReturnValue({ exec: vi.fn().mockResolvedValue(null) }),
      };

      mockConfigService = {
        get: vi.fn((key: string) => {
          if (key === 'RAZORPAY_KEY_ID') return 'rzp_test_mock';
          if (key === 'RAZORPAY_KEY_SECRET') return 'test_secret_12345';
          return null;
        }),
      };

      paymentsService = new PaymentsService(
        mockPaymentModel as any,
        mockConfigService as any,
        mockJobsService as any,
        mockCasesService as any,
      );
    });

    it('rejects client attempting to pay less than the official quote amount (e.g. ₹1 instead of ₹1499)', async () => {
      const tamperingPayload: any = {
        jobId: 'job_123',
        customerId: 'cust_real',
        amount: 1, // Tampered price
      };

      await expect(
        paymentsService.createOrder(tamperingPayload, { id: 'cust_real', role: UserRole.CUSTOMER }),
      ).rejects.toThrow(BadRequestException);
    });

    it('rejects payment order creation if caller is not the owner of the incident', async () => {
      const payload: any = {
        jobId: 'job_123',
        customerId: 'cust_attacker',
        amount: 1499,
      };

      await expect(
        paymentsService.createOrder(payload, { id: 'cust_attacker', role: UserRole.CUSTOMER }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('SEC-08: Cryptographic Signature Timing-Attack Resistance (ASVS V2.10.1, V6.2.1)', () => {
    let paymentsService: PaymentsService;
    let mockPaymentDoc: any;
    let mockPaymentModel: any;

    beforeEach(() => {
      mockPaymentDoc = {
        razorpayOrderId: 'order_test_123',
        status: 'PENDING',
        save: vi.fn().mockResolvedValue(true),
      };

      mockPaymentModel = {
        findOne: vi.fn().mockReturnValue({
          exec: vi.fn().mockResolvedValue(mockPaymentDoc),
        }),
      };

      const mockConfigService = {
        get: vi.fn((key: string) => {
          if (key === 'RAZORPAY_KEY_SECRET') return 'supersecretkey1234567890';
          return 'mock';
        }),
      };

      paymentsService = new PaymentsService(
        mockPaymentModel as any,
        mockConfigService as any,
        {} as any,
        {} as any,
      );
    });

    it('rejects forged payment signatures using constant-time evaluation', async () => {
      const forgedDto = {
        razorpayOrderId: 'order_test_123',
        razorpayPaymentId: 'pay_test_456',
        razorpaySignature: 'bad_forged_signature_hex_0000000000000000000000000000000000000000',
      };

      await expect(paymentsService.verifyPayment(forgedDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockPaymentDoc.status).toBe('FAILED');
      expect(mockPaymentDoc.failureReason).toBe('Cryptographic signature mismatch');
    });
  });

  describe('SEC-07: File Upload Validation & Path Traversal (ASVS V12.1.1, V5.5.2)', () => {
    let uploadsController: any;
    let mockUploadsService: any;

    beforeEach(async () => {
      const { UploadsController } = await import('./uploads/uploads.controller.js');
      mockUploadsService = {
        uploadImage: vi.fn().mockResolvedValue({
          url: 'https://cloudinary.com/wepair/test.png',
          publicId: 'test_id',
          format: 'png',
          bytes: 12,
        }),
      };
      uploadsController = new UploadsController(mockUploadsService as any);
    });

    it('rejects upload without file buffer', async () => {
      await expect(uploadsController.uploadImage({} as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('rejects spoofed file with fake mimetype but invalid magic bytes', async () => {
      const maliciousPayload = {
        buffer: Buffer.from('<script>alert("xss")</script>'),
        mimetype: 'image/png',
      };

      await expect(
        uploadsController.uploadImage(maliciousPayload),
      ).rejects.toThrow(BadRequestException);
    });

    it('rejects path traversal attempts in folder query parameter', async () => {
      const validPngBuffer = Buffer.from([
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
      ]);
      const filePayload = {
        buffer: validPngBuffer,
        mimetype: 'image/png',
      };

      await expect(
        uploadsController.uploadImage(filePayload, '../../etc/passwd'),
      ).rejects.toThrow(BadRequestException);
    });

    it('accepts legitimate image with valid magic bytes and safe folder', async () => {
      const validPngBuffer = Buffer.from([
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
      ]);
      const filePayload = {
        buffer: validPngBuffer,
        mimetype: 'image/png',
      };

      const result = await uploadsController.uploadImage(filePayload, 'vehicles');
      expect(result.url).toBeDefined();
      expect(mockUploadsService.uploadImage).toHaveBeenCalledWith(
        validPngBuffer,
        'wepair/vehicles',
      );
    });
  });
});
