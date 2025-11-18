import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from "dotenv";
// Ensure firebase-admin is initialized early using our runtime loader.
// This module performs credential resolution (env, path, local file, ADC)
import "./firebase/firebase.config";


async function bootstrap() {
  dotenv.config();

  // Early initialization is handled by imported module `./firebase/firebase.config`.
  // Keep this area clean; that module already tries env/path/local/ADC fallbacks.

  const app = await NestFactory.create(AppModule);
  
  // CORS Configuration: Use specific origins in production, permissive in development
  const corsOrigins = process.env.CORS_ORIGINS 
    ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
    : true; // reflect request origin in development

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  const port = process.env.PORT || 3002;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`CORS Origins: ${Array.isArray(corsOrigins) ? corsOrigins.join(', ') : 'all (development mode)'}`);
}

void bootstrap();
