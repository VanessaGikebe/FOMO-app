import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Logger,
  HttpStatus,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { ModeratorService } from './moderator.service';

@Controller('moderator')
export class ModeratorController {
  private readonly logger = new Logger(ModeratorController.name);

  constructor(private readonly moderatorService: ModeratorService) {}

  @Get('organisers')
  async getOrganisers(@Res() res: Response) {
    try {
      const organizers = await this.moderatorService.getOrganizers();
      return res.status(HttpStatus.OK).json(organizers);
    } catch (err) {
      this.logger.error('Failed to fetch organizers', err as any);
      const message = err && (err as any).message ? (err as any).message : 'Unknown server error';
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: message });
    }
  }

  @Get('flagged-events')
  async getFlaggedEvents(@Res() res: Response) {
    try {
      const flaggedEvents = await this.moderatorService.getFlaggedEvents();
      return res.status(HttpStatus.OK).json(flaggedEvents);
    } catch (err) {
      this.logger.error('Failed to fetch flagged events', err as any);
      const message = err && (err as any).message ? (err as any).message : 'Unknown server error';
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: message });
    }
  }

  @Get('logs')
  async getModerationLogs(@Res() res: Response) {
    try {
      const logs = await this.moderatorService.getModerationLogs(100);
      return res.status(HttpStatus.OK).json(logs);
    } catch (err) {
      this.logger.error('Failed to fetch moderation logs', err as any);
      const message = err && (err as any).message ? (err as any).message : 'Unknown server error';
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: message });
    }
  }

  @Post('flag')
  async flagEvent(
    @Body() body: { eventId: string; reason: string; moderatorId: string },
    @Res() res: Response,
  ) {
    try {
      if (!body.eventId || !body.reason || !body.moderatorId) {
        throw new BadRequestException('eventId, reason, and moderatorId are required');
      }

      const result = await this.moderatorService.flagEvent(body.eventId, body.reason, body.moderatorId);
      return res.status(HttpStatus.OK).json(result);
    } catch (err) {
      this.logger.error('Failed to flag event', err as any);
      const statusCode = (err as any).status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = (err as any).message || 'Failed to flag event';
      return res.status(statusCode).json({ error: message });
    }
  }

  @Post('unflag')
  async unflagEvent(
    @Body() body: { eventId: string; moderatorId: string },
    @Res() res: Response,
  ) {
    try {
      if (!body.eventId || !body.moderatorId) {
        throw new BadRequestException('eventId and moderatorId are required');
      }

      const result = await this.moderatorService.unflagEvent(body.eventId, body.moderatorId);
      return res.status(HttpStatus.OK).json(result);
    } catch (err) {
      this.logger.error('Failed to unflag event', err as any);
      const statusCode = (err as any).status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = (err as any).message || 'Failed to unflag event';
      return res.status(statusCode).json({ error: message });
    }
  }

  @Delete('events/:id')
  async deleteEvent(
    @Param('id') eventId: string,
    @Body() body: { moderatorId: string },
    @Res() res: Response,
  ) {
    try {
      if (!eventId || !body.moderatorId) {
        throw new BadRequestException('eventId and moderatorId are required');
      }

      const result = await this.moderatorService.deleteEvent(eventId, body.moderatorId);
      return res.status(HttpStatus.OK).json(result);
    } catch (err) {
      this.logger.error('Failed to delete event', err as any);
      const statusCode = (err as any).status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = (err as any).message || 'Failed to delete event';
      return res.status(statusCode).json({ error: message });
    }
  }

  @Post('flag-user')
  async flagUser(
    @Body() body: { userId: string; reason: string; moderatorId: string },
    @Res() res: Response,
  ) {
    try {
      this.logger.log(`flagUser called with body: ${JSON.stringify(body)}`);
      if (!body.userId || !body.reason || !body.moderatorId) {
        throw new BadRequestException('userId, reason, and moderatorId are required');
      }

      const result = await this.moderatorService.flagUser(body.userId, body.reason, body.moderatorId);
      return res.status(HttpStatus.OK).json(result);
    } catch (err) {
      this.logger.error('Failed to flag user', err as any);
      const statusCode = (err as any).status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = (err as any).message || 'Failed to flag user';
      return res.status(statusCode).json({ error: message });
    }
  }

  @Post('unflag-user')
  async unflagUser(
    @Body() body: { userId: string; moderatorId: string },
    @Res() res: Response,
  ) {
    try {
      this.logger.log(`unflagUser called with body: ${JSON.stringify(body)}`);
      if (!body.userId || !body.moderatorId) {
        throw new BadRequestException('userId and moderatorId are required');
      }

      const result = await this.moderatorService.unflagUser(body.userId, body.moderatorId);
      return res.status(HttpStatus.OK).json(result);
    } catch (err) {
      this.logger.error('Failed to unflag user', err as any);
      const statusCode = (err as any).status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = (err as any).message || 'Failed to unflag user';
      return res.status(statusCode).json({ error: message });
    }
  }

  @Post('remove-user')
  async removeUser(
    @Body() body: { userId: string; reason?: string; moderatorId: string },
    @Res() res: Response,
  ) {
    try {
      this.logger.log(`removeUser called with body: ${JSON.stringify(body)}`);
      if (!body.userId || !body.moderatorId) {
        throw new BadRequestException('userId and moderatorId are required');
      }

      const result = await this.moderatorService.removeUser(body.userId, body.reason || '', body.moderatorId);
      return res.status(HttpStatus.OK).json(result);
    } catch (err) {
      this.logger.error('Failed to remove user', err as any);
      const statusCode = (err as any).status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = (err as any).message || 'Failed to remove user';
      return res.status(statusCode).json({ error: message });
    }
  }
}

