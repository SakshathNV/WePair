import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PaymentsService } from './payments.service.js';
import { CreatePaymentOrderDto } from './dto/create-order.dto.js';
import { VerifyPaymentDto } from './dto/verify-payment.dto.js';
import { RefundDto } from './dto/refund.dto.js';

@Controller('v1/payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-order')
  createOrder(@Body() createOrderDto: CreatePaymentOrderDto) {
    return this.paymentsService.createOrder(createOrderDto);
  }

  @Post('verify')
  verifyPayment(@Body() verifyDto: VerifyPaymentDto) {
    return this.paymentsService.verifyPayment(verifyDto);
  }

  @Post('refund')
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
  findByJobId(@Param('jobId') jobId: string) {
    return this.paymentsService.findByJobId(jobId);
  }

  @Get('customer/:customerId')
  findByCustomerId(@Param('customerId') customerId: string) {
    return this.paymentsService.findByCustomerId(customerId);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.paymentsService.findById(id);
  }
}
