import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { ModeratorModule } from './moderator/moderator.module';

@Module({
  imports: [AuthModule, EventsModule, ModeratorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
