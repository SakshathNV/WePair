import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import Razorpay from 'razorpay';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { Payment, PaymentDocument } from './schemas/payment.schema.js';
import { CreatePaymentOrderDto } from './dto/create-order.dto.js';
import { VerifyPaymentDto } from './dto/verify-payment.dto.js';
import { RefundDto } from './dto/refund.dto.js';
import { PaymentStatus, UserRole } from '../../common/enums/index.js';
import { JobsService } from '../jobs/jobs.service.js';
import { CasesService } from '../cases/cases.service.js';

@Injectable()
export class PaymentsService {
  private readonly razorpay: any;
  private readonly keySecret: string;

  constructor(
    @InjectModel(Payment.name) private readonly paymentModel: Model<PaymentDocument>,
    private readonly configService: ConfigService,
    private readonly jobsService: JobsService,
    private readonly casesService: CasesService,
  ) {
    const keyId = this.configService.get<string>('RAZORPAY_KEY_ID');
    this.keySecret = this.configService.get<string>('RAZORPAY_KEY_SECRET') || '';

    this.razorpay = new Razorpay({
      key_id: keyId,
      key_secret: this.keySecret,
    });
  }

  /**
   * Constant-time string comparison to prevent timing attacks on cryptographic signatures
   * (ASVS V2.10.1, V6.2.1)
   */
  private timingSafeStringEqual(a: string, b: string): boolean {
    if (!a || !b) return false;
    const bufA = Buffer.from(a, 'utf8');
    const bufB = Buffer.from(b, 'utf8');
    if (bufA.length !== bufB.length) return false;
    return timingSafeEqual(bufA, bufB);
  }

  async createOrder(dto: CreatePaymentOrderDto, callerUser?: any) {
    // 1. Idempotency guard per Section 12 of Blueprint
    if (dto.idempotencyKey) {
      const existing = await this.paymentModel
        .findOne({ idempotencyKey: dto.idempotencyKey })
        .exec();
      if (existing) {
        return existing;
      }
    }

    // 2. Validate job existence
    const job = await this.jobsService.findById(dto.jobId);

    // 3. Prevent client-side price tampering (ASVS V5.1.1, V5.3.3)
    // Server enforces authoritative job quote amount
    if (dto.amount !== undefined && Math.abs(dto.amount - job.quoteAmount) > 0.01) {
      throw new BadRequestException(
        `Price tampering detected: client amount (₹${dto.amount}) does not match official job quote amount (₹${job.quoteAmount}).`,
      );
    }
    const authoritativeAmount = job.quoteAmount;

    // 4. Validate ownership of incident
    const serviceCase = await this.casesService.findById(job.caseId);
    if (
      callerUser &&
      callerUser.role !== UserRole.ADMIN &&
      serviceCase.customerId !== callerUser.id
    ) {
      throw new ForbiddenException(
        'Access denied. You can only initiate payment for your own service incident.',
      );
    }

    const customerId =
      callerUser && callerUser.role !== UserRole.ADMIN
        ? callerUser.id
        : dto.customerId || serviceCase.customerId;

    const amountInPaise = Math.round(authoritativeAmount * 100);
    const receipt = `rcpt_${dto.jobId.slice(-8)}_${Date.now().toString().slice(-4)}`;

    // 5. Create order on Razorpay
    const order = await this.razorpay.orders.create({
      amount: amountInPaise,
      currency: dto.currency || 'INR',
      receipt,
      notes: {
        jobId: dto.jobId,
        customerId,
        serviceName: job.serviceName,
      },
    });

    // 6. Save Payment record in MongoDB Atlas
    const payment = new this.paymentModel({
      jobId: dto.jobId,
      caseId: job.caseId,
      customerId,
      providerId: job.providerId,
      amount: authoritativeAmount,
      currency: dto.currency || 'INR',
      status: PaymentStatus.PENDING,
      razorpayOrderId: order.id,
      receipt,
      idempotencyKey: dto.idempotencyKey,
    });

    const savedPayment = await payment.save();

    return {
      payment: savedPayment,
      razorpayOrder: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: this.configService.get<string>('RAZORPAY_KEY_ID'),
      },
    };
  }

  async verifyPayment(dto: VerifyPaymentDto) {
    const payment = await this.paymentModel
      .findOne({ razorpayOrderId: dto.razorpayOrderId })
      .exec();
    if (!payment) {
      throw new NotFoundException(
        `Payment with orderId '${dto.razorpayOrderId}' not found`,
      );
    }

    // Server-side cryptographic signature verification with constant-time equality
    const generatedSignature = createHmac('sha256', this.keySecret)
      .update(`${dto.razorpayOrderId}|${dto.razorpayPaymentId}`)
      .digest('hex');

    if (!this.timingSafeStringEqual(generatedSignature, dto.razorpaySignature)) {
      payment.status = PaymentStatus.FAILED;
      payment.failureReason = 'Cryptographic signature mismatch';
      await payment.save();
      throw new BadRequestException(
        'Invalid payment signature. Cryptographic verification failed.',
      );
    }

    payment.status = PaymentStatus.CAPTURED;
    payment.razorpayPaymentId = dto.razorpayPaymentId;
    payment.razorpaySignature = dto.razorpaySignature;
    const saved = await payment.save();

    return {
      message: 'Payment verified and captured successfully',
      payment: saved,
    };
  }

  async initiateRefund(dto: RefundDto) {
    const payment = await this.paymentModel.findById(dto.paymentId).exec();
    if (!payment) {
      throw new NotFoundException(`Payment with id '${dto.paymentId}' not found`);
    }

    if (payment.status !== PaymentStatus.CAPTURED) {
      throw new BadRequestException(`Cannot refund payment in '${payment.status}' state`);
    }

    if (!payment.razorpayPaymentId) {
      throw new BadRequestException('Payment has no valid Razorpay transaction ID');
    }

    const refundAmount = dto.amount ?? payment.amount;
    const refund = await this.razorpay.payments.refund(payment.razorpayPaymentId, {
      amount: Math.round(refundAmount * 100),
      notes: { reason: dto.reason || 'Customer requested refund' },
    });

    const isPartial = refundAmount < payment.amount;
    payment.status = isPartial ? PaymentStatus.PARTIAL_REFUND : PaymentStatus.REFUNDED;
    payment.refundId = refund.id;
    payment.refundAmount = refundAmount;

    return payment.save();
  }

  async findById(id: string): Promise<Payment> {
    const payment = await this.paymentModel.findById(id).exec();
    if (!payment) {
      throw new NotFoundException(`Payment with id '${id}' not found`);
    }
    return payment;
  }

  async findByJobId(jobId: string): Promise<Payment | null> {
    return this.paymentModel.findOne({ jobId }).exec();
  }

  async findByCustomerId(customerId: string): Promise<Payment[]> {
    return this.paymentModel.find({ customerId }).sort({ createdAt: -1 }).exec();
  }

  async webhookHandler(body: any, signature: string) {
    // Webhook verification using constant-time comparison
    const webhookSecret =
      this.configService.get<string>('RAZORPAY_WEBHOOK_SECRET') || this.keySecret;
    const payload = typeof body === 'string' ? body : JSON.stringify(body);
    const expectedSignature = createHmac('sha256', webhookSecret)
      .update(payload)
      .digest('hex');

    if (!this.timingSafeStringEqual(expectedSignature, signature)) {
      throw new BadRequestException('Invalid webhook signature');
    }

    const event = body.event;
    const paymentEntity = body.payload?.payment?.entity;

    if (event === 'payment.captured' && paymentEntity?.order_id) {
      await this.paymentModel.updateOne(
        { razorpayOrderId: paymentEntity.order_id },
        {
          $set: {
            status: PaymentStatus.CAPTURED,
            razorpayPaymentId: paymentEntity.id,
          },
        },
      );
    } else if (event === 'payment.failed' && paymentEntity?.order_id) {
      await this.paymentModel.updateOne(
        { razorpayOrderId: paymentEntity.order_id },
        {
          $set: {
            status: PaymentStatus.FAILED,
            failureReason: paymentEntity.error_description || 'Payment failed',
          },
        },
      );
    }

    return { status: 'ok' };
  }
}
