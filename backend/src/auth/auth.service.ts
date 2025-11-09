import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class AuthService {
  private db = admin.firestore();

  async registerUser(
    email: string,
    password: string,
    role: 'attendee' | 'organizer' | 'moderator' = 'attendee',
    fullName?: string,
  ): Promise<{ uid: string; email: string | undefined; role: string }> {
    try {
      const user = await admin.auth().createUser({ email, password });
      await admin.auth().setCustomUserClaims(user.uid, { role });

      // 👇 Store extra data in Firestore
      await this.db.collection('users').doc(user.uid).set({
        uid: user.uid,
        email: user.email,
        role,
        fullName,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return { uid: user.uid, email: user.email, role };
    } catch (error) {
      console.error('🔥 Firebase signup error:', error);
      throw error;
    }
  }

  async verifyToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
    return await admin.auth().verifyIdToken(idToken);
  }

  async getUser(uid: string): Promise<admin.auth.UserRecord> {
    return await admin.auth().getUser(uid);
  }
}
