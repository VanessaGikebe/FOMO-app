import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { ModeratorModule } from './moderator/moderator.module';
import { TicketsModule } from './tickets/tickets.module';
import { MpesaModule } from './mpesa/mpesa.module';

import { testController } from './app.controller';


@Module({
  imports: [AuthModule, EventsModule, ModeratorModule, TicketsModule, MpesaModule],
  controllers: [testController],

})
export class AppModule {}
