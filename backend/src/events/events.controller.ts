import { Controller, Post, Get, Patch, Param, UseGuards, Body, Req, Delete } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';
import { EventsService } from './events.service';
import { SearchEventsDto } from './dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  getEvents() {
    return this.eventsService.getEvents();
  }

  @Get(':id')
  getEventById(@Param('id') id: string) {
    return this.eventsService.getEventById(id);
  }

  // search endpoint - tests call method directly
  searchEvents(filters: SearchEventsDto) {
    return this.eventsService.searchEvents(filters);
  }

  async addToFavourites(eventId: string, req: any) {
    if (!req || !req.user || !req.user.id) {
      throw new Error('User not authenticated');
    }
    return this.eventsService.addToFavourites(req.user.id, eventId);
  }

  async removeFromFavourites(eventId: string, req: any) {
    if (!req || !req.user || !req.user.id) {
      throw new Error('User not authenticated');
    }
    return this.eventsService.removeFromFavourites(req.user.id, eventId);
  }

  async getUserFavourites(req: any) {
    if (!req || !req.user || !req.user.id) {
      throw new Error('User not authenticated');
    }
    return this.eventsService.getUserFavourites(req.user.id);
  }

  async checkFavourite(eventId: string, req: any) {
    if (!req || !req.user || !req.user.id) {
      throw new Error('User not authenticated');
    }
    const isFav = await this.eventsService.isFavourite(req.user.id, eventId);
    return { isFavourite: isFav };
  }

  @Patch('approve/:id')
  @UseGuards(new RolesGuard(['moderator']))
  approveEvent(@Param('id') id: string) {
    return this.eventsService.approveEvent(id);
  }

  @Patch('reject/:id')
  @UseGuards(new RolesGuard(['moderator']))
  rejectEvent(@Param('id') id: string, @Body('reason') reason?: string) {
    return this.eventsService.rejectEvent(id, reason);
  }
}
