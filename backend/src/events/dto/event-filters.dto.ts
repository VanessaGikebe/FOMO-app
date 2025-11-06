import { IsOptional, IsEnum } from 'class-validator';

export enum EventStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  FLAGGED = 'flagged',
  ALL = 'all'
}

export class EventFiltersDto {
  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;
}