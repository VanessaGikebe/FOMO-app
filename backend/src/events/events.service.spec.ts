// src/events/events.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import * as admin from 'firebase-admin';

// Mock Firestore
jest.mock('firebase-admin', () => ({
  firestore: jest.fn(() => mockFirestore),
}));

const mockFirestore = {
  collection: jest.fn(),
  batch: jest.fn(),
};

describe('EventsService - Event Discovery', () => {
  let service: EventsService;
  let mockCollection: any;
  let mockDoc: any;

  beforeEach(async () => {
    // Reset mocks
    jest.clearAllMocks();

    mockDoc = {
      get: jest.fn(),
      update: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
    };

    mockCollection = {
      add: jest.fn(),
      doc: jest.fn(() => mockDoc),
      where: jest.fn(() => mockCollection),
      get: jest.fn(),
    };

    mockFirestore.collection.mockReturnValue(mockCollection);

    const module: TestingModule = await Test.createTestingModule({
      providers: [EventsService],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  describe('searchEvents', () => {
    it('should return approved events only', async () => {
      const mockEvents = [
        { id: '1', title: 'Event 1', approved: true, category: 'academic' },
        { id: '2', title: 'Event 2', approved: true, category: 'social' },
      ];

      mockCollection.get.mockResolvedValue({
        docs: mockEvents.map(e => ({
          id: e.id,
          data: () => e,
        })),
      });

      const result = await service.searchEvents({});

      expect(mockCollection.where).toHaveBeenCalledWith('approved', '==', true);
      expect(result).toHaveLength(2);
    });

    it('should filter by category', async () => {
      const mockEvents = [
        { id: '1', title: 'Event 1', approved: true, category: 'academic' },
      ];

      mockCollection.get.mockResolvedValue({
        docs: mockEvents.map(e => ({
          id: e.id,
          data: () => e,
        })),
      });

      await service.searchEvents({ category: 'academic' as any });

      expect(mockCollection.where).toHaveBeenCalledWith('category', '==', 'academic');
    });

    it('should filter free events', async () => {
      const mockEvents = [
        { id: '1', title: 'Free Event', approved: true, isFree: true, price: 0 },
      ];

      mockCollection.get.mockResolvedValue({
        docs: mockEvents.map(e => ({
          id: e.id,
          data: () => e,
        })),
      });

      await service.searchEvents({ pricing: 'free' as any });

      expect(mockCollection.where).toHaveBeenCalledWith('isFree', '==', true);
    });

    it('should search by query text', async () => {
      const mockEvents = [
        { 
          id: '1', 
          title: 'Tech Workshop', 
          description: 'Learn coding',
          approved: true,
          attendeeCount: 10,
          capacity: 50
        },
        { 
          id: '2', 
          title: 'Music Concert', 
          description: 'Live performance',
          approved: true,
          attendeeCount: 20,
          capacity: 100
        },
      ];

      mockCollection.get.mockResolvedValue({
        docs: mockEvents.map(e => ({
          id: e.id,
          data: () => e,
        })),
      });

      const result = await service.searchEvents({ query: 'tech' });

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Tech Workshop');
    });

    it('should filter by location', async () => {
      const mockEvents = [
        { 
          id: '1', 
          title: 'Event 1', 
          location: 'Nairobi',
          approved: true,
          attendeeCount: 5,
          capacity: 50
        },
        { 
          id: '2', 
          title: 'Event 2', 
          location: 'Mombasa',
          approved: true,
          attendeeCount: 10,
          capacity: 100
        },
      ];

      mockCollection.get.mockResolvedValue({
        docs: mockEvents.map(e => ({
          id: e.id,
          data: () => e,
        })),
      });

      const result = await service.searchEvents({ location: 'nairobi' });

      expect(result).toHaveLength(1);
      expect(result[0].location).toBe('Nairobi');
    });

    it('should filter by price range', async () => {
      const mockEvents = [
        { id: '1', price: 100, approved: true, attendeeCount: 5, capacity: 50 },
        { id: '2', price: 500, approved: true, attendeeCount: 10, capacity: 100 },
        { id: '3', price: 1000, approved: true, attendeeCount: 15, capacity: 150 },
      ];

      mockCollection.get.mockResolvedValue({
        docs: mockEvents.map(e => ({
          id: e.id,
          data: () => e,
        })),
      });

      const result = await service.searchEvents({ minPrice: 200, maxPrice: 800 });

      expect(result).toHaveLength(1);
      expect(result[0].price).toBe(500);
    });

    it('should calculate sold out status', async () => {
      const mockEvents = [
        { id: '1', attendeeCount: 50, capacity: 50, approved: true },
        { id: '2', attendeeCount: 30, capacity: 100, approved: true },
      ];

      mockCollection.get.mockResolvedValue({
        docs: mockEvents.map(e => ({
          id: e.id,
          data: () => e,
        })),
      });

      const result = await service.searchEvents({});

      expect(result[0].isSoldOut).toBe(true);
      expect(result[1].isSoldOut).toBe(false);
    });

    it('should apply pagination', async () => {
      const mockEvents = Array.from({ length: 30 }, (_, i) => ({
        id: `${i + 1}`,
        title: `Event ${i + 1}`,
        approved: true,
        attendeeCount: 0,
        capacity: 50,
      }));

      mockCollection.get.mockResolvedValue({
        docs: mockEvents.map(e => ({
          id: e.id,
          data: () => e,
        })),
      });

      const result = await service.searchEvents({ limit: 10, offset: 0 });

      expect(result).toHaveLength(10);
      expect(result[0].id).toBe('1');
    });
  });

  describe('getEventById', () => {
    it('should return event by id', async () => {
      const mockEvent = {
        title: 'Test Event',
        approved: true,
        attendeeCount: 10,
        capacity: 50,
      };

      mockDoc.get.mockResolvedValue({
        exists: true,
        id: '123',
        data: () => mockEvent,
      });

      const result = await service.getEventById('123');

      expect(result.id).toBe('123');
      expect(result.title).toBe('Test Event');
      expect(result.isSoldOut).toBe(false);
    });

    it('should throw NotFoundException if event not found', async () => {
      mockDoc.get.mockResolvedValue({
        exists: false,
      });

      await expect(service.getEventById('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('Favourites', () => {
    describe('addToFavourites', () => {
      it('should add event to favourites', async () => {
        mockDoc.get.mockResolvedValue({
          exists: true,
          data: () => ({ title: 'Test Event' }),
        });

        mockCollection.get.mockResolvedValue({
          empty: true,
        });

        const result = await service.addToFavourites('user123', 'event456');

        expect(mockCollection.add).toHaveBeenCalled();
        expect(result.userId).toBe('user123');
        expect(result.eventId).toBe('event456');
      });

      it('should throw NotFoundException if event does not exist', async () => {
        mockDoc.get.mockResolvedValue({
          exists: false,
        });

        await expect(service.addToFavourites('user123', 'event999'))
          .rejects.toThrow(NotFoundException);
      });

      it('should throw BadRequestException if already favourited', async () => {
        mockDoc.get.mockResolvedValue({
          exists: true,
          data: () => ({ title: 'Test Event' }),
        });

        mockCollection.get.mockResolvedValue({
          empty: false,
        });

        await expect(service.addToFavourites('user123', 'event456'))
          .rejects.toThrow(BadRequestException);
      });
    });

    describe('removeFromFavourites', () => {
      it('should remove event from favourites', async () => {
        const mockBatch = {
          delete: jest.fn(),
          commit: jest.fn().mockResolvedValue(undefined),
        };

        mockFirestore.batch = jest.fn(() => mockBatch);

        mockCollection.get.mockResolvedValue({
          empty: false,
          docs: [
            { ref: 'mockRef1' },
          ],
        });

        const result = await service.removeFromFavourites('user123', 'event456');

        expect(result.message).toBe('Event removed from favourites');
      });

      it('should throw NotFoundException if favourite does not exist', async () => {
        mockCollection.get.mockResolvedValue({
          empty: true,
        });

        await expect(service.removeFromFavourites('user123', 'event999'))
          .rejects.toThrow(NotFoundException);
      });
    });

    describe('getUserFavourites', () => {
      it('should return empty array if no favourites', async () => {
        mockCollection.get.mockResolvedValue({
          empty: true,
        });

        const result = await service.getUserFavourites('user123');

        expect(result).toEqual([]);
      });

      it('should return user favourite events', async () => {
        mockCollection.get.mockResolvedValue({
          empty: false,
          docs: [
            { data: () => ({ eventId: 'event1' }) },
            { data: () => ({ eventId: 'event2' }) },
          ],
        });

        mockDoc.get.mockResolvedValue({
          exists: true,
          id: 'event1',
          data: () => ({
            title: 'Favourite Event',
            attendeeCount: 10,
            capacity: 50,
          }),
        });

        const result = await service.getUserFavourites('user123');

        expect(result.length).toBeGreaterThan(0);
      });
    });

    describe('isFavourite', () => {
      it('should return true if event is favourited', async () => {
        mockCollection.get.mockResolvedValue({
          empty: false,
        });

        const result = await service.isFavourite('user123', 'event456');

        expect(result).toBe(true);
      });

      it('should return false if event is not favourited', async () => {
        mockCollection.get.mockResolvedValue({
          empty: true,
        });

        const result = await service.isFavourite('user123', 'event456');

        expect(result).toBe(false);
      });
    });
  });

  describe('Moderation', () => {
    describe('approveEvent', () => {
      it('should approve an event', async () => {
        mockDoc.get.mockResolvedValue({
          exists: true,
          data: () => ({ title: 'Test Event', approved: false }),
        });

        const result = await service.approveEvent('event123');

        expect(mockDoc.update).toHaveBeenCalledWith(
          expect.objectContaining({ approved: true })
        );
        expect(result.message).toBe('Event approved successfully');
      });

      it('should throw NotFoundException if event does not exist', async () => {
        mockDoc.get.mockResolvedValue({
          exists: false,
        });

        await expect(service.approveEvent('event999'))
          .rejects.toThrow(NotFoundException);
      });
    });

    describe('rejectEvent', () => {
      it('should reject an event with reason', async () => {
        mockDoc.get.mockResolvedValue({
          exists: true,
          data: () => ({ title: 'Test Event' }),
        });

        const result = await service.rejectEvent('event123', 'Spam content');

        expect(mockDoc.update).toHaveBeenCalledWith(
          expect.objectContaining({ 
            approved: false,
            rejected: true,
            rejectionReason: 'Spam content'
          })
        );
        expect(result.reason).toBe('Spam content');
      });
    });
  });
});