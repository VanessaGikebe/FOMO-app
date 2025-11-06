// backend/src/events/events.service.ts
import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class EventsService {
  private db = admin.firestore();

  // ============ BASIC EVENT OPERATIONS ============

  async createEvent(data: any) {
    const eventRef = await this.db.collection('events').add({
      ...data,
      createdAt: new Date(),
      approved: false,
      isFlagged: false,
      rejected: false,
      attendeeCount: 0,
    });
    return { id: eventRef.id };
  }

  async getEvents() {
    const snapshot = await this.db.collection('events')
      .where('approved', '==', true)
      .where('isFlagged', '==', false)
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
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

  async updateEvent(id: string, updateData: any) {
    const eventRef = this.db.collection('events').doc(id);
    const doc = await eventRef.get();
    
    if (!doc.exists) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    await eventRef.update({
      ...updateData,
      updatedAt: new Date()
    });

    return { message: 'Event updated successfully', id };
  }

  async deleteEvent(id: string, isModerator: boolean = false) {
    const eventRef = this.db.collection('events').doc(id);
    const doc = await eventRef.get();
    
    if (!doc.exists) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    const eventData = doc.data();

    // Moderators can only delete flagged events
    if (isModerator && !eventData.isFlagged) {
      throw new ForbiddenException('Moderators can only delete flagged events');
    }

    await eventRef.delete();
    return { message: 'Event deleted successfully', id };
  }

  // ============ MODERATION OPERATIONS ============

  async approveEvent(id: string) {
    const docRef = this.db.collection('events').doc(id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      throw new NotFoundException('Event not found');
    }

    await docRef.update({ 
      approved: true,
      rejected: false,
      isFlagged: false,
      flagReason: null,
      approvedAt: new Date(),
      approvedBy: 'moderator'
    });
    
    return { message: 'Event approved successfully', id };
  }

  async rejectEvent(id: string, reason?: string) {
    const docRef = this.db.collection('events').doc(id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      throw new NotFoundException('Event not found');
    }

    const rejectionReason = reason ?? 'Does not meet platform guidelines';
    await docRef.update({ 
      approved: false, 
      rejected: true, 
      rejectionReason,
      rejectedAt: new Date(),
      rejectedBy: 'moderator'
    });
    
    return { message: 'Event rejected', id, reason: rejectionReason };
  }

  async flagEvent(id: string, reason: string) {
    const eventRef = this.db.collection('events').doc(id);
    const doc = await eventRef.get();
    
    if (!doc.exists) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    const eventData = doc.data();
    
    if (eventData.isFlagged) {
      throw new BadRequestException('Event is already flagged');
    }

    await eventRef.update({ 
      isFlagged: true,
      flagReason: reason,
      flaggedAt: new Date(),
      flaggedBy: 'moderator'
    });
    
    return { 
      message: 'Event flagged successfully', 
      id, 
      reason,
      flaggedAt: new Date()
    };
  }

  async unflagEvent(id: string) {
    const eventRef = this.db.collection('events').doc(id);
    const doc = await eventRef.get();
    
    if (!doc.exists) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    const eventData = doc.data();
    
    if (!eventData.isFlagged) {
      throw new BadRequestException('Event is not flagged');
    }

    await eventRef.update({ 
      isFlagged: false,
      flagReason: null,
      flaggedAt: null,
      flaggedBy: null,
      unflaggedAt: new Date()
    });
    
    return { message: 'Event unflagged successfully', id };
  }

  async getPendingEvents() {
    const snapshot = await this.db.collection('events')
      .where('approved', '==', false)
      .where('rejected', '==', false)
      .get();
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        isSoldOut: (data.attendeeCount ?? 0) >= (data.capacity ?? 0)
      };
    });
  }

  async getFlaggedEvents() {
    const snapshot = await this.db.collection('events')
      .where('isFlagged', '==', true)
      .get();
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        isSoldOut: (data.attendeeCount ?? 0) >= (data.capacity ?? 0)
      };
    });
  }

  async getRejectedEvents() {
    const snapshot = await this.db.collection('events')
      .where('rejected', '==', true)
      .get();
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        isSoldOut: (data.attendeeCount ?? 0) >= (data.capacity ?? 0)
      };
    });
  }

  async getAllEventsForModerator() {
    const snapshot = await this.db.collection('events').get();
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        isSoldOut: (data.attendeeCount ?? 0) >= (data.capacity ?? 0)
      };
    });
  }

  async getModerationStats() {
    const allEvents = await this.db.collection('events').get();
    
    let pending = 0;
    let approved = 0;
    let rejected = 0;
    let flagged = 0;

    allEvents.docs.forEach(doc => {
      const data = doc.data();
      if (data.isFlagged) flagged++;
      if (data.rejected) rejected++;
      else if (data.approved) approved++;
      else pending++;
    });

    return {
      total: allEvents.size,
      pending,
      approved,
      rejected,
      flagged
    };
  }

  async validateEvent(id: string) {
    const doc = await this.db.collection('events').doc(id).get();
    
    if (!doc.exists) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    const event = doc.data();
    const issues = [];

    // Check required fields
    if (!event.title || event.title.length < 5) {
      issues.push('Title is too short (minimum 5 characters)');
    }

    if (!event.description || event.description.length < 20) {
      issues.push('Description is too short (minimum 20 characters)');
    }

    if (!event.date) {
      issues.push('Event date is missing');
    }

    if (!event.location) {
      issues.push('Event location is missing');
    }

    if (!event.category) {
      issues.push('Event category is missing');
    }

    // Check if date is in the past
    if (event.date) {
      const eventDate = new Date(event.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (eventDate < today) {
        issues.push('Event date is in the past');
      }
    }

    // Check capacity
    if (event.capacity && event.capacity < 1) {
      issues.push('Event capacity must be at least 1');
    }

    // Check for spam keywords
    const spamKeywords = ['buy now', 'click here', 'limited time', 'act now', 'free money'];
    const textToCheck = `${event.title} ${event.description}`.toLowerCase();
    const foundSpam = spamKeywords.filter(keyword => textToCheck.includes(keyword));
    
    if (foundSpam.length > 0) {
      issues.push(`Potential spam detected: ${foundSpam.join(', ')}`);
    }

    // Check for duplicate events
    const duplicateCheck = await this.db.collection('events')
      .where('title', '==', event.title)
      .where('date', '==', event.date)
      .get();
    
    if (duplicateCheck.size > 1) {
      issues.push('Potential duplicate event found');
    }

    return {
      eventId: id,
      isValid: issues.length === 0,
      issues,
      checkedAt: new Date()
    };
  }

  // ============ EVENT DISCOVERY METHODS ============

  async searchEvents(filters: any) {
    let query: any = this.db.collection('events');

    // always filter approved and non-flagged
    query = query.where('approved', '==', true);

    if (filters?.category) {
      query = query.where('category', '==', filters.category);
    }

    if (filters?.pricing === 'free') {
      query = query.where('isFree', '==', true);
    } else if (filters?.pricing === 'paid') {
      query = query.where('isFree', '==', false);
    }

    // fetch results
    const snapshot = await query.get();
    let events = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

    // in-memory filters for query, location and price ranges
    if (filters?.query) {
      const q = filters.query.toLowerCase();
      events = events.filter((e: any) => {
        return (
          (e.title && e.title.toLowerCase().includes(q)) ||
          (e.description && e.description.toLowerCase().includes(q)) ||
          (e.location && e.location.toLowerCase().includes(q))
        );
      });
    }

    if (filters?.location) {
      const loc = filters.location.toLowerCase();
      events = events.filter((e: any) => e.location && e.location.toLowerCase().includes(loc));
    }

    if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
      events = events.filter((e: any) => {
        const price = e.price ?? 0;
        if (filters.minPrice !== undefined && price < filters.minPrice) return false;
        if (filters.maxPrice !== undefined && price > filters.maxPrice) return false;
        return true;
      });
    }

    // Date filtering
    if (filters?.startDate) {
      const startDate = new Date(filters.startDate);
      events = events.filter((e: any) => new Date(e.startDate || e.date) >= startDate);
    }

    if (filters?.endDate) {
      const endDate = new Date(filters.endDate);
      events = events.filter((e: any) => new Date(e.endDate || e.date) <= endDate);
    }

    // calculate sold out
    events = events.map((e: any) => ({ 
      ...e, 
      isSoldOut: (e.attendeeCount ?? 0) >= (e.capacity ?? 0) 
    }));

    // pagination
    const limit = filters?.limit ?? 20;
    const offset = filters?.offset ?? 0;
    events = events.slice(offset, offset + limit);

    return events;
  }

  // ============ FAVOURITES ============

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
}