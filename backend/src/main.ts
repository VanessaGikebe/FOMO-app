import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import { join } from 'path';

async function bootstrap() {
  dotenv.config();

  // Initialize Firebase
  admin.initializeApp({
    credential: admin.credential.cert(
      require(join(__dirname, '../serviceAccountKey.json')),
    ),
  });

  const app = await NestFactory.create(AppModule);
  app.enableCors(); // allow frontend requests from localhost:3000
  await app.listen(4000);
  console.log(`🚀 Backend is running on http://localhost:4000`);
}
bootstrap();
