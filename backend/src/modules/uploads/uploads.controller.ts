import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service.js';

export interface UploadedFilePayload {
  buffer: Buffer;
  originalname?: string;
  mimetype?: string;
  size?: number;
}

@Controller('v1/uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: UploadedFilePayload,
    @Query('folder') folder?: string,
  ) {
    if (!file || !file.buffer) {
      throw new BadRequestException('No file provided for upload');
    }

    return this.uploadsService.uploadImage(file.buffer, folder || 'wepair');
  }
}
