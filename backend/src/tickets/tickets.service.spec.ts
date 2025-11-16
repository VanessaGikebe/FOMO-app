import { Test, TestingModule } from '@nestjs/testing';
import { TicketsService } from './tickets.service';
import { EventsService } from '../events/events.service';

describe('TicketsService', () => {
  let service: TicketsService;
  let eventsService: Partial<EventsService>;

  beforeEach(async () => {
    eventsService = {
      getEventById: jest.fn()
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsService,
        { provide: EventsService, useValue: eventsService }
      ],
    }).compile();

    service = module.get<TicketsService>(TicketsService);
  });

  it('creates an order when stock is sufficient', async () => {
    (eventsService.getEventById as any).mockResolvedValue({ id: 'evt1', capacity: 100, attendeeCount: 0 });

    const res = await service.createOrder({ userId: 'u1', cartItems: [{ eventId: 'evt1', quantity: 2 }] });
    expect(res.status).toBe('ok');
    expect(res.orderId).toBeDefined();
  });

  it('returns insufficient_stock when not enough tickets', async () => {
    (eventsService.getEventById as any).mockResolvedValue({ id: 'evt1', capacity: 5, attendeeCount: 5 });

    const res = await service.createOrder({ userId: 'u1', cartItems: [{ eventId: 'evt1', quantity: 2 }] });
    expect(res.status).toBe('insufficient_stock');
    expect(res.details).toBeDefined();
  });
});
