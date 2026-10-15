import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Headers,
  HttpCode,
  HttpStatus,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { PaymentsService } from './payments.service.js';
import { JobsService } from '../jobs/jobs.service.js';
import { CasesService } from '../cases/cases.service.js';
import { CreatePaymentOrderDto } from './dto/create-order.dto.js';
import { VerifyPaymentDto } from './dto/verify-payment.dto.js';
import { RefundDto } from './dto/refund.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { UserRole } from '../../common/enums/index.js';

@Controller('v1/payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly jobsService: JobsService,
    private readonly casesService: CasesService,
  ) {}

  @Post('create-order')
  @UseGuards(JwtAuthGuard, RolesGuard)
  createOrder(
    @Body() createOrderDto: CreatePaymentOrderDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.paymentsService.createOrder(createOrderDto, currentUser);
  }

  @Post('verify')
  @UseGuards(JwtAuthGuard, RolesGuard)
  verifyPayment(@Body() verifyDto: VerifyPaymentDto) {
    return this.paymentsService.verifyPayment(verifyDto);
  }

  @Post('refund')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  initiateRefund(@Body() refundDto: RefundDto) {
    return this.paymentsService.initiateRefund(refundDto);
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  handleWebhook(
    @Body() body: any,
    @Headers('x-razorpay-signature') signature: string,
  ) {
    return this.paymentsService.webhookHandler(body, signature);
  }

  @Get('job/:jobId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findByJobId(
    @Param('jobId') jobId: string,
    @CurrentUser() currentUser: any,
  ) {
    const job = await this.jobsService.findById(jobId);
    if (currentUser.role !== UserRole.ADMIN) {
      const serviceCase = await this.casesService.findById(job.caseId);
      if (
        serviceCase.customerId !== currentUser.id &&
        job.providerId !== currentUser.id
      ) {
        throw new ForbiddenException(
          'Access denied. You do not have permission to view payment records for this job.',
        );
      }
    }
    return this.paymentsService.findByJobId(jobId);
  }

  @Get('customer/:customerId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  findByCustomerId(
    @Param('customerId') customerId: string,
    @CurrentUser() currentUser: any,
  ) {
    if (
      currentUser.role !== UserRole.ADMIN &&
      currentUser.id !== customerId
    ) {
      throw new ForbiddenException(
        'Access denied. You cannot view another customer’s billing history.',
      );
    }
    return this.paymentsService.findByCustomerId(customerId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findById(@Param('id') id: string, @CurrentUser() currentUser: any) {
    const payment = await this.paymentsService.findById(id);
    if (
      currentUser.role !== UserRole.ADMIN &&
      payment.customerId !== currentUser.id
    ) {
      throw new ForbiddenException(
        'Access denied. You do not have permission to inspect this payment receipt.',
      );
    }
    return payment;
  }
}
