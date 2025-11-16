# Frontend-Backend Integration: Ticketing System

## ✅ What's Been Implemented

### Backend (NestJS on Port 3002)
- **Ticketing Module** (`src/tickets/`)
  - `TicketsService`: Creates orders, validates inventory, stores orders
  - `TicketsController`: Exposes REST endpoints
  - DTOs: CartItemDto, CreateOrderDto, OrderResponseDto
  
- **Endpoints**:
  - `POST /orders` - Create a new ticket order
  - `GET /orders/:id` - Retrieve order by ID
  - `GET /orders/user/:userId` - Get user's orders
  
- **Features**:
  - ✅ Order creation with inventory validation
  - ✅ Returns order ID on success
  - ✅ Handles insufficient stock errors
  - ✅ Firebase/Firestore integration ready

### Frontend (Next.js on Port 3000)
- **API Utility** (`src/lib/api.js`)
  - `submitTicketOrder()` - Submit cart to backend
  - `getOrder()` - Fetch order details
  - `getUserOrders()` - Get user's order history
  
- **Checkout Flow** (`src/app/(eventGoer)/eg-checkout/page.js`)
  - Form validation (personal info, payment details)
  - Calls backend `/orders` endpoint
  - Handles order success/failure
  - Clears cart after successful order
  - Shows order confirmation with order ID

## 🧪 Testing the Flow

### Prerequisites
- Backend running: `cd backend && npm run start:dev` (port 3002)
- Frontend running: `cd frontend && npm run dev` (port 3000)

### Manual Test Steps

1. **Add Items to Cart**
   - Navigate to Events page: http://localhost:3000/eg-events
   - Add 2 tickets to cart for "Tech Summit 2025" (or any event)
   - Verify cart shows items with pricing

2. **Go to Checkout**
   - Click "Proceed to Checkout"
   - Fill in form:
     - First Name: `John`
     - Last Name: `Doe`
     - Phone: `0712345678`
     - Email: `john@example.com`
     - Payment Method: `MPESA`
     - MPESA Number: `0712345678`

3. **Submit Order**
   - Click "Complete Payment"
   - Backend should receive POST request to `/orders`
   - Should see success message: "Payment successful! Your order #ord000001..."
   - Cart should clear
   - Redirects to events page

### Monitoring Backend Logs
When order is submitted, you should see in backend terminal:
```
[Nest] ... LOG [TicketsController] Creating order...
[Nest] ... LOG [TicketsService] Order created successfully
```

## 📊 Response Examples

### Successful Order Response
```json
{
  "status": "ok",
  "orderId": "ord000001",
  "order": {
    "id": "ord000001",
    "userId": "guest",
    "items": [
      {
        "eventId": "evt001",
        "ticketType": "Standard",
        "quantity": 2,
        "pricePerTicket": 2500
      }
    ],
    "status": "reserved",
    "createdAt": "2025-11-15T14:45:00.000Z"
  }
}
```

### Insufficient Stock Response
```json
{
  "status": "insufficient_stock",
  "details": [
    {
      "item": { "eventId": "evt001", ... },
      "reason": "insufficient_stock",
      "available": 5
    }
  ]
}
```

## 🚀 Next Steps

### Option 1: Firestore Persistence (Recommended)
- Migrate order storage from in-memory to Firestore
- Add order retrieval endpoints that fetch from database
- Track all orders permanently

### Option 2: Order Confirmation Flow
- Add `POST /orders/:id/confirm` endpoint
- Implement multi-step workflow (reserved → confirmed)
- Add cancellation support

### Option 3: User Authentication
- Wire user ID from authentication context
- Add order history page showing user's past orders
- Display tickets/receipts per order

## 📁 File Structure

```
backend/src/
├── tickets/
│   ├── dto/
│   │   ├── cart-item.dto.ts
│   │   ├── create-order.dto.ts
│   │   └── order-response.dto.ts
│   ├── tickets.controller.ts
│   ├── tickets.controller.spec.ts
│   ├── tickets.service.ts
│   ├── tickets.service.spec.ts
│   └── tickets.module.ts

frontend/src/
├── lib/
│   └── api.js (NEW - API utilities)
├── app/(eventGoer)/
│   └── eg-checkout/
│       └── page.js (UPDATED - integrated order submission)
└── contexts/
    └── EventsContext.js (cart management)
```

## 🔧 Configuration

### Backend (.env)
- `NODE_ENV=development`
- `FIREBASE_PROJECT_ID=...` (from Firebase Console)
- Requires `serviceAccountKey.json` at backend root

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL=http://localhost:3002` (optional, defaults to localhost:3002)

## ✨ Current Status

- ✅ Backend ticketing API implemented and tested
- ✅ Frontend checkout integrated with backend
- ✅ Order creation working end-to-end
- ✅ Error handling for insufficient stock
- ✅ All tests passing (8 suites, 50+ tests)
- ⏳ Firestore persistence (next iteration)
- ⏳ User authentication integration (next iteration)
