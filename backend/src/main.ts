import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import { join } from 'path';
import * as fs from 'fs';


async function bootstrap() {
  dotenv.config();

  // Load service account key from backend root
  try {
    const keyPath = join(__dirname, '../serviceAccountKey.json');
    if (fs.existsSync(keyPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf-8'));
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      }
    } else {
      console.warn('serviceAccountKey.json not found at', keyPath);
    }
  } catch (err) {
    console.error('Failed to initialize Firebase:', err);
  }

  const app = await NestFactory.create(AppModule);
  app.enableCors();
 // await app.listen(3000);
  await app.listen(3002);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
