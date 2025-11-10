import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { ModeratorModule } from './moderator/moderator.module';

import { testController } from './app.controller';


@Module({
  imports: [AuthModule, EventsModule, ModeratorModule],
  controllers: [testController],

})
export class AppModule {}
