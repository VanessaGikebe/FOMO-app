import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class EventsService {
  private db = admin.firestore();

  async createEvent(data: any) {
    const eventRef = await this.db.collection('events').add({
      ...data,
      createdAt: new Date(),
      approved: false,
    });
    return { id: eventRef.id };
  }

  async getEvents() {
    const snapshot = await this.db.collection('events').get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  async approveEvent(id: string) {
    await this.db.collection('events').doc(id).update({ approved: true });
    return { message: 'Event approved' };
  }
}
