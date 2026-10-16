import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module.js';
import * as dns from 'dns';

// Use reliable DNS servers for SRV record resolution (fixes ECONNREFUSED on some networks)
dns.setServers(['8.8.8.8', '1.1.1.1']);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Security Headers via Helmet (ASVS V14.4.1, V14.4.2, V14.4.3)
  app.use(
    helmet({
      contentSecurityPolicy: false, // API endpoints return JSON; CSP configured on frontend CDN/server
      crossOriginEmbedderPolicy: false,
    }),
  );

  // 2. Controlled CORS policy (ASVS V14.4.1)
  const rawOrigins = process.env.CORS_ORIGINS;
  const allowedOrigins = rawOrigins
    ? rawOrigins.split(',').map((s) => s.trim())
    : ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'];

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // Allow requests with no origin (e.g. mobile apps, curl, automated testing)
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        callback(null, true);
      } else {
        callback(new Error(`Origin '${origin}' blocked by WePair CORS security policy.`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'x-razorpay-signature',
      'x-idempotency-key',
    ],
  });

  // 3. Strict Input Validation & Parameter Pollution Defense (ASVS V5.1.1, V5.1.2)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
