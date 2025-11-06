// src/events/events.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { SearchEventsDto, FlagEventDto, RejectEventDto } from './dto';
describe('EventsController - Event Discovery', () => {
  let controller: EventsController;
  let service: EventsService;

  const mockEventsService = {
    getEvents: jest.fn(),
    getEventById: jest.fn(),
    createEvent: jest.fn(),
    searchEvents: jest.fn(),
    addToFavourites: jest.fn(),
    removeFromFavourites: jest.fn(),
    getUserFavourites: jest.fn(),
    isFavourite: jest.fn(),
    approveEvent: jest.fn(),
    rejectEvent: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        {
          provide: EventsService,
          useValue: mockEventsService,
        },
      ],
    }).compile();

    controller = module.get<EventsController>(EventsController);
    service = module.get<EventsService>(EventsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getEvents', () => {
    it('should return all approved events', async () => {
      const mockEvents = [
        { id: '1', title: 'Event 1', approved: true },
        { id: '2', title: 'Event 2', approved: true },
      ];

      mockEventsService.getEvents.mockResolvedValue(mockEvents);

      const result = await controller.getEvents();

      expect(result).toEqual(mockEvents);
      expect(service.getEvents).toHaveBeenCalledTimes(1);
    });
  });

  describe('getEventById', () => {
    it('should return a single event by id', async () => {
      const mockEvent = { 
        id: '123', 
        title: 'Test Event', 
        approved: true,
        isSoldOut: false
      };

      mockEventsService.getEventById.mockResolvedValue(mockEvent);

      const result = await controller.getEventById('123');

      expect(result).toEqual(mockEvent);
      expect(service.getEventById).toHaveBeenCalledWith('123');
    });
  });

  describe('searchEvents', () => {
    it('should search events with filters', async () => {
      const filters: SearchEventsDto = {
        query: 'tech',
        category: 'academic' as any,
        location: 'Nairobi',
      };

      const mockResults = [
        { id: '1', title: 'Tech Workshop', location: 'Nairobi' },
      ];

      mockEventsService.searchEvents.mockResolvedValue(mockResults);

      const result = await controller.searchEvents(filters);

      expect(result).toEqual(mockResults);
      expect(service.searchEvents).toHaveBeenCalledWith(filters);
    });

    it('should search with empty filters', async () => {
      const filters: SearchEventsDto = {};
      const mockResults = [
        { id: '1', title: 'Event 1' },
        { id: '2', title: 'Event 2' },
      ];

      mockEventsService.searchEvents.mockResolvedValue(mockResults);

      const result = await controller.searchEvents(filters);

      expect(result).toEqual(mockResults);
      expect(service.searchEvents).toHaveBeenCalledWith(filters);
    });

    it('should filter by pricing', async () => {
      const filters: SearchEventsDto = {
        pricing: 'free' as any,
      };

      const mockResults = [
        { id: '1', title: 'Free Event', isFree: true, price: 0 },
      ];

      mockEventsService.searchEvents.mockResolvedValue(mockResults);

      const result = await controller.searchEvents(filters);

      expect(result).toEqual(mockResults);
      expect(service.searchEvents).toHaveBeenCalledWith(filters);
    });

    it('should filter by price range', async () => {
      const filters: SearchEventsDto = {
        minPrice: 100,
        maxPrice: 500,
      };

      const mockResults = [
        { id: '1', title: 'Paid Event', price: 300 },
      ];

      mockEventsService.searchEvents.mockResolvedValue(mockResults);

      const result = await controller.searchEvents(filters);

      expect(result).toEqual(mockResults);
    });
  });

  describe('Favourites', () => {
    describe('addToFavourites', () => {
      it('should add event to user favourites', async () => {
        const mockRequest = {
          user: { id: 'user123' },
        };

        const mockResponse = {
          userId: 'user123',
          eventId: 'event456',
          addedAt: new Date(),
        };

        mockEventsService.addToFavourites.mockResolvedValue(mockResponse);

        const result = await controller.addToFavourites('event456', mockRequest);

        expect(result).toEqual(mockResponse);
        expect(service.addToFavourites).toHaveBeenCalledWith('user123', 'event456');
      });

      it('should throw error if user not authenticated', async () => {
        const mockRequest = { user: null, body: {} };

        await expect(controller.addToFavourites('event456', mockRequest))
          .rejects.toThrow('User not authenticated');
      });
    });

    describe('removeFromFavourites', () => {
      it('should remove event from user favourites', async () => {
        const mockRequest = {
          user: { id: 'user123' },
        };

        const mockResponse = {
          message: 'Event removed from favourites',
        };

        mockEventsService.removeFromFavourites.mockResolvedValue(mockResponse);

        const result = await controller.removeFromFavourites('event456', mockRequest);

        expect(result).toEqual(mockResponse);
        expect(service.removeFromFavourites).toHaveBeenCalledWith('user123', 'event456');
      });
    });

    describe('getUserFavourites', () => {
      it('should return user favourite events', async () => {
        const mockRequest = {
          user: { id: 'user123' },
        };

        const mockFavourites = [
          { id: 'event1', title: 'Favourite Event 1' },
          { id: 'event2', title: 'Favourite Event 2' },
        ];

        mockEventsService.getUserFavourites.mockResolvedValue(mockFavourites);

        const result = await controller.getUserFavourites(mockRequest);

        expect(result).toEqual(mockFavourites);
        expect(service.getUserFavourites).toHaveBeenCalledWith('user123');
      });

      it('should return empty array if no favourites', async () => {
        const mockRequest = {
          user: { id: 'user123' },
        };

        mockEventsService.getUserFavourites.mockResolvedValue([]);

        const result = await controller.getUserFavourites(mockRequest);

        expect(result).toEqual([]);
      });
    });

    describe('checkFavourite', () => {
      it('should return true if event is favourited', async () => {
        const mockRequest = {
          user: { id: 'user123' },
        };

        mockEventsService.isFavourite.mockResolvedValue(true);

        const result = await controller.checkFavourite('event456', mockRequest);

        expect(result).toEqual({ isFavourite: true });
        expect(service.isFavourite).toHaveBeenCalledWith('user123', 'event456');
      });

      it('should return false if event is not favourited', async () => {
        const mockRequest = {
          user: { id: 'user123' },
        };

        mockEventsService.isFavourite.mockResolvedValue(false);

        const result = await controller.checkFavourite('event456', mockRequest);

        expect(result).toEqual({ isFavourite: false });
      });
    });
  });

  describe('Moderation', () => {
    describe('approveEvent', () => {
      it('should approve an event', async () => {
        const mockResponse = {
          message: 'Event approved successfully',
          id: 'event123',
        };

        mockEventsService.approveEvent.mockResolvedValue(mockResponse);

        const result = await controller.approveEvent('event123');

        expect(result).toEqual(mockResponse);
        expect(service.approveEvent).toHaveBeenCalledWith('event123');
      });
    });

    describe('rejectEvent', () => {
      it('should reject an event with reason', async () => {
        const mockResponse = {
          message: 'Event rejected',
          id: 'event123',
          reason: 'Spam content',
        };

        mockEventsService.rejectEvent.mockResolvedValue(mockResponse);

        const result = await controller.rejectEvent('event123', { reason: 'Spam content' });

        expect(result).toEqual(mockResponse);
        expect(service.rejectEvent).toHaveBeenCalledWith('event123', 'Spam content');
      });

      it('should reject with default reason if none provided', async () => {
        const mockResponse = {
          message: 'Event rejected',
          id: 'event123',
          reason: 'Does not meet platform guidelines',
        };

        mockEventsService.rejectEvent.mockResolvedValue(mockResponse);

        const result = await controller.rejectEvent('event123', undefined);

        expect(result).toEqual(mockResponse);
        expect(service.rejectEvent).toHaveBeenCalledWith('event123', undefined);
      });
    });
  });
});