import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { ModeratorModule } from './moderator/moderator.module';

@Module({
  imports: [AuthModule, EventsModule, ModeratorModule],

})
export class AppModule {}
