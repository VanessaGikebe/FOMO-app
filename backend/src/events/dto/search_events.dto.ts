// src/events/dto/search-events.dto.ts
import { IsOptional, IsString, IsNumber, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum EventCategory {
  ACADEMIC = 'academic',
  SOCIAL = 'social',
  SPORTS = 'sports',
  CULTURAL = 'cultural',
  WORKSHOP = 'workshop',
  CAREER = 'career',
  OTHER = 'other',
}

export enum PricingFilter {
  FREE = 'free',
  PAID = 'paid',
  ALL = 'all',
}

export class SearchEventsDto {
  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsEnum(EventCategory)
  category?: EventCategory;

  @IsOptional()
  @IsEnum(PricingFilter)
  pricing?: PricingFilter;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 20;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset?: number = 0;
}

// src/events/dto/event-response.dto.ts
export class EventResponseDto {
  id: string;
  title: string;
  description: string;
  location: string;
  category: EventCategory;
  price: number;
  isFree: boolean;
  capacity: number;
  attendeeCount: number;
  isSoldOut: boolean;
  startDate: Date;
  endDate: Date;
  organizerWebsite?: string;
  organizerId: string;
  organizerName: string;
  imageUrl?: string;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
  averageRating?: number;
  totalReviews?: number;
}

// src/events/dto/favourite-event.dto.ts
export class FavouriteEventResponseDto {
  userId: string;
  eventId: string;
  addedAt: Date;
  event?: EventResponseDto;
}