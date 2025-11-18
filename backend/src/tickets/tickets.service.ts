import { Injectable, BadRequestException } from '@nestjs/common';
import { EventsService } from '../events/events.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { NotFoundException } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class TicketsService {
  private db = admin.firestore();

  constructor(private readonly eventsService: EventsService) {}

  async createOrder(dto: CreateOrderDto) {
    if (!dto || !Array.isArray(dto.cartItems) || dto.cartItems.length === 0) {
      throw new BadRequestException('cart_empty');
    }

    const insufficient: any[] = [];

    // Validate each cart item against event availability (EventsService methods are async)
    for (const item of dto.cartItems) {
      let ev: any = null;
      try {
        ev = await this.eventsService.getEventById(item.eventId);
      } catch (err) {
        // treat not found as invalid_event
        insufficient.push({ item, reason: 'invalid_event' });
        continue;
      }

      const available = Math.max((ev.capacity ?? 0) - (ev.attendeeCount ?? ev.attendees ?? 0), 0);
      if ((item.quantity || 0) > available) {
        insufficient.push({ item, reason: 'insufficient_stock', available });
      }
    }

    if (insufficient.length > 0) {
      return { status: 'insufficient_stock', details: insufficient };
    }
    // Generate order ID using auto-increment pattern from Firestore
    const ordersRef = this.db.collection('orders');
    const counterRef = this.db.collection('counters').doc('orderCounter');
    
    try {
      // Get and increment the counter
      const counterSnapshot = await counterRef.get();
      const currentCount = counterSnapshot.exists ? (counterSnapshot.data()?.value || 0) : 0;
      const nextCount = currentCount + 1;
      
      await counterRef.set({ value: nextCount }, { merge: true });
      
      const orderId = `ord${String(nextCount).padStart(6, '0')}`;
      
      // Create order object
      const order = {
        id: orderId,
        userId: dto.userId || 'guest',
        items: dto.cartItems,
        status: 'reserved',
        customerEmail: dto.customerEmail,
        customerName: dto.customerName,
        customerPhone: dto.customerPhone,
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
      };

      // Save order to Firestore
      await ordersRef.doc(orderId).set(order);

      // Update event attendee counts
      for (const item of dto.cartItems) {
        try {
          const ev = await this.eventsService.getEventById(item.eventId);
          if (ev) {
            const current = Number(ev.attendeeCount ?? ev.attendees ?? 0) || 0;
            // Update in Firestore
            await this.db.collection('events').doc(item.eventId).update({
              attendeeCount: current + (item.quantity || 0),
            });
          }
        } catch (err) {
          console.warn(`Failed to update attendee count for event ${item.eventId}:`, err);
          // Don't fail the order creation if attendee update fails
        }
      }

      return { status: 'ok', orderId, order: { ...order, createdAt: order.createdAt.toDate().toISOString() } };
    } catch (err) {
      console.error('Failed to create order:', err);
      throw new BadRequestException('order_creation_failed');
    }
  }

  async getOrder(orderId: string) {
    try {
      const orderDoc = await this.db.collection('orders').doc(orderId).get();
      if (!orderDoc.exists) {
        return null;
      }
      const orderData = orderDoc.data();
      return {
        ...orderData,
        createdAt: orderData.createdAt?.toDate?.()?.toISOString?.() || orderData.createdAt,
        updatedAt: orderData.updatedAt?.toDate?.()?.toISOString?.() || orderData.updatedAt,
      };
    } catch (err) {
      console.error('Failed to retrieve order:', err);
      return null;
    }
  }

  async getUserOrders(userId: string) {
    try {
      const ordersSnapshot = await this.db
        .collection('orders')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

      return ordersSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString?.() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() || data.updatedAt,
        };
      });
    } catch (err) {
      console.error('Failed to retrieve user orders:', err);
      return [];
    }
  }
}
