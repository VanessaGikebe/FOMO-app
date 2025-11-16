import { Body, Controller, Post, Get, Headers, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as admin from 'firebase-admin';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Normalize role to lowercase without spaces
   */
  private normalizeRole(role: string): string {
    if (!role) return '';
    return role.toLowerCase().replace(/\s+/g, '');
  }

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

  @Post('set-role')
  async setUserRole(
    @Body() body: { userId: string; role: 'attendee' | 'organizer' | 'moderator' }
  ) {
    const normalizedRole = this.normalizeRole(body.role);
    console.log('🔧 Setting role for user:', body.userId, 'to role:', normalizedRole, '(from:', body.role, ')');
    
    try {
      const db = admin.firestore();
      const userRef = db.collection('users').doc(body.userId);
      
      await userRef.update({
        role: normalizedRole,
        updatedAt: new Date()
      });
      console.log('✅ Updated Firestore for user:', body.userId);

      // Also set custom claim on Firebase Auth if possible
      try {
        await admin.auth().setCustomUserClaims(body.userId, { role: normalizedRole });
        console.log('✅ Set custom claims for user:', body.userId);
      } catch (err) {
        console.warn('⚠️ Could not set custom claims:', err.message);
      }

      console.log('✅ Role set successfully for user:', body.userId);
      return { success: true, userId: body.userId, role: normalizedRole };
    } catch (err) {
      console.error('❌ Error setting role:', err);
      throw err;
    }
  }
}
