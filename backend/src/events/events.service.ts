import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
    const docRef = this.db.collection('events').doc(id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      throw new NotFoundException('Event not found');
    }

    await docRef.update({ approved: true });
    return { message: 'Event approved successfully' };
  }

  async searchEvents(filters: any) {
    let query: any = this.db.collection('events');

    // always filter approved
    query = query.where('approved', '==', true);

    if (filters?.category) {
      query = query.where('category', '==', filters.category);
    }

    if (filters?.pricing === 'free') {
      query = query.where('isFree', '==', true);
    }

    // fetch results (tests mock .get())
    const snapshot = await query.get();
    let events = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

    // in-memory filters for query, location and price ranges
    if (filters?.query) {
      const q = filters.query.toLowerCase();
      events = events.filter((e: any) => {
        return (
          (e.title && e.title.toLowerCase().includes(q)) ||
          (e.description && e.description.toLowerCase().includes(q))
        );
      });
    }

    if (filters?.location) {
      const loc = filters.location.toLowerCase();
      events = events.filter((e: any) => e.location && e.location.toLowerCase() === loc);
    }

    if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
      events = events.filter((e: any) => {
        const price = e.price ?? 0;
        if (filters.minPrice !== undefined && price < filters.minPrice) return false;
        if (filters.maxPrice !== undefined && price > filters.maxPrice) return false;
        return true;
      });
    }

    // calculate sold out
    events = events.map((e: any) => ({ ...e, isSoldOut: (e.attendeeCount ?? 0) >= (e.capacity ?? 0) }));

    // pagination
    const limit = filters?.limit ?? 20;
    const offset = filters?.offset ?? 0;
    events = events.slice(offset, offset + limit);

    return events;
  }

  async getEventById(id: string) {
    const docRef = this.db.collection('events').doc(id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      throw new NotFoundException('Event not found');
    }

    const data = docSnap.data();
    const event = { id: docSnap.id, ...data } as any;
    event.isSoldOut = (event.attendeeCount ?? 0) >= (event.capacity ?? 0);
    return event;
  }

  // Favourites
  async addToFavourites(userId: string, eventId: string) {
    const eventDoc = await this.db.collection('events').doc(eventId).get();
    if (!eventDoc.exists) {
      throw new NotFoundException('Event not found');
    }

    const favQuery = await this.db
      .collection('favourites')
      .where('userId', '==', userId)
      .where('eventId', '==', eventId)
      .get();

    if (!favQuery.empty) {
      throw new BadRequestException('Already favourited');
    }

    await this.db.collection('favourites').add({ userId, eventId, addedAt: new Date() });
    return { userId, eventId, addedAt: new Date() };
  }

  async removeFromFavourites(userId: string, eventId: string) {
    const favQuery = await this.db
      .collection('favourites')
      .where('userId', '==', userId)
      .where('eventId', '==', eventId)
      .get();

    if (favQuery.empty) {
      throw new NotFoundException('Favourite not found');
    }

    const batch = this.db.batch();
    favQuery.docs.forEach((d: any) => batch.delete(d.ref));
    await batch.commit();

    return { message: 'Event removed from favourites' };
  }

  async getUserFavourites(userId: string) {
    const favQuery = await this.db.collection('favourites').where('userId', '==', userId).get();
    if (favQuery.empty) return [];

    const results: any[] = [];
    for (const doc of favQuery.docs) {
      const fav = doc.data();
      const eventSnap = await this.db.collection('events').doc(fav.eventId).get();
      if (eventSnap.exists) {
        const event = { id: eventSnap.id, ...eventSnap.data() } as any;
        event.isSoldOut = (event.attendeeCount ?? 0) >= (event.capacity ?? 0);
        results.push(event);
      }
    }

    return results;
  }

  async isFavourite(userId: string, eventId: string) {
    const favQuery = await this.db
      .collection('favourites')
      .where('userId', '==', userId)
      .where('eventId', '==', eventId)
      .get();

    return !favQuery.empty;
  }

  async rejectEvent(id: string, reason?: string) {
    const docRef = this.db.collection('events').doc(id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      throw new NotFoundException('Event not found');
    }

    const rejectionReason = reason ?? 'Does not meet platform guidelines';
    await docRef.update({ approved: false, rejected: true, rejectionReason });
    return { message: 'Event rejected', id, reason: rejectionReason };
  }
}
