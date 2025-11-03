import { Controller, Post, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';

@Controller('events')
export class EventsController {
  @Patch('approve/:id')
  @UseGuards(new RolesGuard(['moderator']))
  approveEvent(@Param('id') id: string) {
    return { message: `Event ${id} approved successfully.` };
  }

  @Get()
  getEvents() {
    return [{ name: 'Test Event', approved: false }];
  }
}
