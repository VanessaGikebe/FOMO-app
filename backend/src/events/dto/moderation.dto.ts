import { IsString, IsOptional, MinLength } from 'class-validator';

export class FlagEventDto {
  @IsString()
  @MinLength(10, { message: 'Flag reason must be at least 10 characters' })
  reason: string;
}

export class RejectEventDto {
  @IsOptional()
  @IsString()
  reason?: string;
}

export class ModerationResponseDto {
  id: string;
  message: string;
  reason?: string;
  flaggedAt?: Date;
  rejectedAt?: Date;
  approvedAt?: Date;
}