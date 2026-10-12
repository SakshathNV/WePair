import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { CasesService } from './cases.service.js';
import { CreateCaseDto } from './dto/create-case.dto.js';
import { CancelCaseDto } from './dto/cancel-case.dto.js';

@Controller('v1/cases')
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Post()
  create(@Body() createCaseDto: CreateCaseDto) {
    return this.casesService.create(createCaseDto);
  }

  @Get()
  findAll(@Query('customerId') customerId?: string) {
    if (customerId) {
      return this.casesService.findByCustomerId(customerId);
    }
    return this.casesService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.casesService.findById(id);
  }

  @Post(':id/cancel')
  cancel(@Param('id') id: string, @Body() cancelCaseDto: CancelCaseDto) {
    return this.casesService.cancelCase(id, cancelCaseDto.reason);
  }
}
