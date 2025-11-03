import { Body, Controller, Post, Get, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as admin from 'firebase-admin';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body()
    body: {
      email: string;
      password: string;
      role?: 'attendee' | 'organizer' | 'moderator';
    },
  ): Promise<{ uid: string; email: string | undefined; role: string }> {
    const { email, password, role } = body;
    return this.authService.registerUser(email, password, role);
  }

  @Get('user')
  async getUser(
    @Headers('authorization') authHeader: string,
  ): Promise<admin.auth.DecodedIdToken> {
    const token = authHeader?.split(' ')[1];
    return this.authService.verifyToken(token);
  }
}
