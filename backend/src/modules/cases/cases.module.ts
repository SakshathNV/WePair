import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CasesController } from './cases.controller.js';
import { CasesService } from './cases.service.js';
import { ServiceCase, ServiceCaseSchema } from './schemas/case.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ServiceCase.name, schema: ServiceCaseSchema }]),
  ],
  controllers: [CasesController],
  providers: [CasesService],
  exports: [CasesService],
})
export class CasesModule {}
