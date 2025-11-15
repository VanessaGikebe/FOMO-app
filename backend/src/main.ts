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
  app.enableCors();
 // await app.listen(3000);
  await app.listen(3002);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

void bootstrap();
