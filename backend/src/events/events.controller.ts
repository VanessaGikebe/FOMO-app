// backend/src/events/events.controller.ts
import { 
  Controller, 
  Post, 
  Get, 
  Patch, 
  Delete,
  Param, 
  Query,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';
import { EventsService } from './events.service';
import { SearchEventsDto, FlagEventDto, RejectEventDto } from './dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // ============ GENERAL EVENT ENDPOINTS ============

  @Get()
  getEvents() {
    return this.eventsService.getEvents();
  }

  @Get(':id')
  getEventById(@Param('id') id: string) {
    return this.eventsService.getEventById(id);
  }

  @Post()
  @UseGuards(new RolesGuard(['organizer']))
  async createEvent(@Body() data: any) {
    return this.eventsService.createEvent(data);
  }

  @Patch(':id')
  @UseGuards(new RolesGuard(['organizer']))
  async updateEvent(
    @Param('id') id: string,
    @Body() updateData: any
  ) {
    return this.eventsService.updateEvent(id, updateData);
  }

  @Delete(':id')
  @UseGuards(new RolesGuard(['organizer', 'moderator']))
  async deleteEvent(
    @Param('id') id: string,
    @Req() req: any
  ) {
    const isModerator = req.user?.role === 'moderator';
    return this.eventsService.deleteEvent(id, isModerator);
  }

  // ============ EVENT DISCOVERY ENDPOINTS ============

  @Get('search/filter')
  searchEvents(@Query() filters: SearchEventsDto) {
    return this.eventsService.searchEvents(filters);
  }

  // ============ FAVOURITES ENDPOINTS ============

  @Post('favourites/:id')
  @HttpCode(HttpStatus.CREATED)
  async addToFavourites(
    @Param('id') eventId: string,
    @Req() req: any
  ) {
    if (!req || !req.user || !req.user.id) {
      throw new Error('User not authenticated');
    }
    return this.eventsService.addToFavourites(req.user.id, eventId);
  }

  @Delete('favourites/:id')
  @HttpCode(HttpStatus.OK)
  async removeFromFavourites(
    @Param('id') eventId: string,
    @Req() req: any
  ) {
    if (!req || !req.user || !req.user.id) {
      throw new Error('User not authenticated');
    }
    return this.eventsService.removeFromFavourites(req.user.id, eventId);
  }

  @Get('favourites/my/list')
  async getUserFavourites(@Req() req: any) {
    if (!req || !req.user || !req.user.id) {
      throw new Error('User not authenticated');
    }
    return this.eventsService.getUserFavourites(req.user.id);
  }

  @Get('favourites/:id/check')
  async checkFavourite(
    @Param('id') eventId: string,
    @Req() req: any
  ) {
    if (!req || !req.user || !req.user.id) {
      throw new Error('User not authenticated');
    }
    const isFav = await this.eventsService.isFavourite(req.user.id, eventId);
    return { isFavourite: isFav };
  }

  // ============ MODERATOR ENDPOINTS ============

  @Get('moderation/pending')
  @UseGuards(new RolesGuard(['moderator']))
  async getPendingEvents() {
    return this.eventsService.getPendingEvents();
  }

  @Get('moderation/flagged')
  @UseGuards(new RolesGuard(['moderator']))
  async getFlaggedEvents() {
    return this.eventsService.getFlaggedEvents();
  }

  @Get('moderation/rejected')
  @UseGuards(new RolesGuard(['moderator']))
  async getRejectedEvents() {
    return this.eventsService.getRejectedEvents();
  }

  @Get('moderation/all')
  @UseGuards(new RolesGuard(['moderator']))
  async getAllEventsForModerator() {
    return this.eventsService.getAllEventsForModerator();
  }

  @Get('moderation/stats')
  @UseGuards(new RolesGuard(['moderator']))
  async getModerationStats() {
    return this.eventsService.getModerationStats();
  }

  @Patch('moderation/approve/:id')
  @UseGuards(new RolesGuard(['moderator']))
  approveEvent(@Param('id') id: string) {
    return this.eventsService.approveEvent(id);
  }

  @Patch('moderation/reject/:id')
  @UseGuards(new RolesGuard(['moderator']))
  rejectEvent(
    @Param('id') id: string,
    @Body() body?: RejectEventDto
  ) {
    return this.eventsService.rejectEvent(id, body?.reason);
  }

  @Patch('moderation/flag/:id')
  @UseGuards(new RolesGuard(['moderator']))
  flagEvent(
    @Param('id') id: string,
    @Body() body: FlagEventDto
  ) {
    return this.eventsService.flagEvent(id, body.reason);
  }

  @Patch('moderation/unflag/:id')
  @UseGuards(new RolesGuard(['moderator']))
  unflagEvent(@Param('id') id: string) {
    return this.eventsService.unflagEvent(id);
  }

  @Get('moderation/validate/:id')
  @UseGuards(new RolesGuard(['moderator']))
  validateEvent(@Param('id') id: string) {
    return this.eventsService.validateEvent(id);
  }

  @Post('moderation/bulk-approve')
  @UseGuards(new RolesGuard(['moderator']))
  async bulkApproveEvents(@Body('eventIds') eventIds: string[]) {
    const results = await Promise.allSettled(
      eventIds.map(id => this.eventsService.approveEvent(id))
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    return {
      message: `Bulk approval complete`,
      successful,
      failed,
      total: eventIds.length
    };
  }

  @Post('moderation/bulk-reject')
  @UseGuards(new RolesGuard(['moderator']))
  async bulkRejectEvents(
    @Body('eventIds') eventIds: string[],
    @Body('reason') reason?: string
  ) {
    const results = await Promise.allSettled(
      eventIds.map(id => this.eventsService.rejectEvent(id, reason))
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    return {
      message: `Bulk rejection complete`,
      successful,
      failed,
      total: eventIds.length
    };
  }

  // Legacy endpoints for backward compatibility with tests
  @Patch('approve/:id')
  @UseGuards(new RolesGuard(['moderator']))
  legacyApproveEvent(@Param('id') id: string) {
    return this.approveEvent(id);
  }

  @Patch('reject/:id')
  @UseGuards(new RolesGuard(['moderator']))
  legacyRejectEvent(@Param('id') id: string, @Body('reason') reason?: string) {
    return this.rejectEvent(id, { reason });
  }
}