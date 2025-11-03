import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class AuthService {
  async registerUser(
    email: string,
    password: string,
    role: 'attendee' | 'organizer' | 'moderator' = 'attendee',
  ): Promise<{ uid: string; email: string | undefined; role: string }> {
    const user = await admin.auth().createUser({ email, password });
    await admin.auth().setCustomUserClaims(user.uid, { role });
    return { uid: user.uid, email: user.email, role };
  }

  async verifyToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  }

  async getUser(uid: string): Promise<admin.auth.UserRecord> {
    return await admin.auth().getUser(uid);
  }
}
