import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

export interface UploadedFilePayload {
  buffer: Buffer;
  originalname?: string;
  mimetype?: string;
  size?: number;
}

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

function validateImageMagicNumbers(buffer: Buffer, mimetype?: string): boolean {
  if (!buffer || buffer.length < 12) return false;

  // JPEG: FF D8 FF
  const isJpeg =
    buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  const isPng =
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a;

  // WebP: 'RIFF' ... 'WEBP'
  const isWebp =
    buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buffer.subarray(8, 12).toString('ascii') === 'WEBP';

  return isJpeg || isPng || isWebp;
}

@Controller('v1/uploads')
@UseGuards(JwtAuthGuard)
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: MAX_FILE_SIZE,
      },
      fileFilter: (_req, file, callback) => {
        if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
          return callback(
            new BadRequestException(
              `Unsupported file type: ${file.mimetype}. Allowed types: image/jpeg, image/png, image/webp`,
            ),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async uploadImage(
    @UploadedFile() file: UploadedFilePayload,
    @Query('folder') folder?: string,
  ) {
    if (!file || !file.buffer) {
      throw new BadRequestException('No file provided for upload');
    }

    if (file.buffer.length > MAX_FILE_SIZE) {
      throw new BadRequestException('File exceeds maximum allowed size of 5 MB');
    }

    // Deep content inspection: verify magic bytes to prevent MIME spoofing (ASVS V12.1.1, V12.1.2)
    if (!validateImageMagicNumbers(file.buffer, file.mimetype)) {
      throw new BadRequestException(
        'File payload does not match valid image binary signature. Upload rejected.',
      );
    }

    // Path traversal defense on target folder (ASVS V5.5.2)
    let sanitizedFolder = 'wepair';
    if (folder) {
      if (!/^[a-zA-Z0-9_-]{1,32}$/.test(folder)) {
        throw new BadRequestException(
          'Invalid folder name. Only alphanumeric characters, dashes, and underscores (max 32 chars) are permitted.',
        );
      }
      sanitizedFolder = `wepair/${folder}`;
    }

    return this.uploadsService.uploadImage(file.buffer, sanitizedFolder);
  }
}
