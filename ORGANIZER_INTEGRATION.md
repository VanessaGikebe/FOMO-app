# Organizer Pages Database Integration Guide

## 📋 Overview

The organizer pages need to be fully integrated with the backend database to handle:
- Creating events
- Managing (editing/deleting) existing events
- Viewing event metrics and statistics
- Listing organizer's events on dashboard

Currently, the frontend uses **Firestore directly** while the backend has **NestJS endpoints** for event operations. This guide outlines how to connect them.

---

## 🏗️ Current Architecture

### Frontend (Next.js)
- **EventsContext** (`src/contexts/EventsContext.js`) - Direct Firestore connection
  - `createEvent()` - Adds event to Firestore
  - `updateEvent()` - Updates event in Firestore
  - `deleteEvent()` - Deletes event from Firestore
  - `getEventsByOrganizer()` - Retrieves organizer's events

### Backend (NestJS on port 3002)
- **Events Module** (`src/events/`)
  - `EventsController` - REST endpoints for event operations
  - `EventsService` - Business logic and Firestore integration
  - Key endpoints:
    - `POST /events` - Create event (requires 'organizer' role)
    - `PATCH /events/:id` - Update event
    - `DELETE /events/:id` - Delete event
    - `GET /events` - Get all approved events
    - `GET /events/:id` - Get event by ID
    - `GET /events/search/filter` - Search events

### Frontend Pages to Connect
1. **Dashboard** (`src/app/(eventOrganiser)/eo-dashboard/page.js`)
   - Shows organizer's upcoming events with metrics
   - Quick action buttons

2. **Create Event** (`src/app/(eventOrganiser)/eo-create_event_page/page.js`)
   - Form for creating new events
   - Currently writes to Firestore directly

3. **Manage Events** (`src/app/(eventOrganiser)/eo-manageEvents/page.js`)
   - Lists all organizer's events
   - Edit and delete functionality

4. **Edit Event** (`src/app/(eventOrganiser)/eo-edit_event_page/page.js`)
   - Currently placeholder - needs implementation

---

## 🔄 Integration Strategy

### Option 1: Keep Using Firestore (Current Approach)
**Pros:**
- Real-time updates with `onSnapshot`
- No latency from API calls
- Works without backend

**Cons:**
- Doesn't use backend infrastructure
- Security rules must be correctly configured
- No backend validation

### Option 2: Switch to Backend API (Recommended)
**Pros:**
- Centralized validation and business logic
- Better security control
- Consistent with ticketing system
- Role-based access control

**Cons:**
- Requires API calls (slight latency)
- Backend must be running

---

## 📝 Required API Functions

Add these to `src/lib/api.js`:

### Events Management
```javascript
// Create a new event
async function createEvent(eventData, authToken)

// Update an existing event
async function updateEvent(eventId, eventData, authToken)

// Delete an event
async function deleteEvent(eventId, authToken)

// Get event by ID
async function getEventById(eventId)

// Get all events by organizer
async function getOrganizerEvents(organizerId, authToken)

// Search/filter events
async function searchEvents(filters)
```

---

## 🛠️ Implementation Checklist

### Phase 1: API Functions
- [ ] Create `createOrganizerEvent()` in `api.js`
- [ ] Create `updateOrganizerEvent()` in `api.js`
- [ ] Create `deleteOrganizerEvent()` in `api.js`
- [ ] Create `getOrganizerEvents()` in `api.js`
- [ ] Add authentication token handling

### Phase 2: Dashboard Page
- [ ] Fetch organizer's events on component mount
- [ ] Display real metrics (visits, tickets sold, conversion)
- [ ] Add loading and error states
- [ ] Implement quick action buttons

### Phase 3: Create Event Page
- [ ] Integrate EventForm with backend API
- [ ] Add proper error handling and validation
- [ ] Show success/error notifications
- [ ] Redirect to manage events after creation

### Phase 4: Manage Events Page
- [ ] Show organizer's events from backend
- [ ] Implement edit functionality
- [ ] Implement delete functionality with confirmation
- [ ] Add loading states and error handling

### Phase 5: Edit Event Page
- [ ] Implement full edit form
- [ ] Load existing event data
- [ ] Handle image uploads
- [ ] Add validation

### Phase 6: Backend Enhancements
- [ ] Add authentication guards to event endpoints
- [ ] Implement metrics/analytics endpoints
- [ ] Add event statistics endpoint

---

## 🔐 Authentication

### Current Setup
- Firebase Auth via UserContext
- Guards in backend: `RolesGuard`

### Required Changes
- Add Firebase token to API requests
- Backend should verify organizer owns the event
- Implement proper authorization checks

---

## 📊 Metrics Needed

Currently showing hardcoded values:
- **Total Visits**: 1278
- **Tickets Sold**: 742
- **Conversion Rate**: 58%

### Should Pull From:
- Event view analytics
- Order/ticket sales data
- User engagement metrics

### Backend Endpoint Needed:
```typescript
GET /events/:id/metrics
Response: {
  visits: number,
  ticketsSold: number,
  conversionRate: number,
  attendees: number,
  revenue: number
}
```

---

## 🗂️ File Structure

```
frontend/
├── src/
│   ├── lib/
│   │   ├── api.js (ADD: organizer event functions)
│   │   └── firebaseClient.js
│   ├── app/(eventOrganiser)/
│   │   ├── eo-dashboard/
│   │   ├── eo-create_event_page/
│   │   ├── eo-edit_event_page/  (Implement this)
│   │   └── eo-manageEvents/
│   └── contexts/
│       └── EventsContext.js (Update with API calls)

backend/
├── src/
│   ├── events/
│   │   ├── events.controller.ts (Already has endpoints)
│   │   ├── events.service.ts (Already has logic)
│   │   └── dto/
│   └── auth/
│       └── roles.guard.ts (Already has role checking)
```

---

## 🚀 Quick Start: Backend

### 1. Verify Backend Endpoints
```bash
cd backend
npm run start:dev
```

Test endpoints:
```powershell
# Create event
POST http://localhost:3002/events
{
  "title": "Test Event",
  "description": "Test",
  "date": "2025-12-01",
  "category": "Technology"
}

# Get events
GET http://localhost:3002/events

# Update event
PATCH http://localhost:3002/events/:id
{
  "title": "Updated Title"
}
```

### 2. Add API Functions to Frontend

See `IMPLEMENTATION_STEPS.md` for detailed code

---

## 📚 Related Documentation

- [Ticketing Integration](./TICKETING_INTEGRATION.md)
- [Firebase Setup](./backend/README-FIREBASE.md)

---

## 🎯 Success Criteria

✅ Organizer can create events from frontend
✅ Events are stored in Firestore via backend
✅ Organizer can view their events on dashboard
✅ Organizer can edit events
✅ Organizer can delete events with confirmation
✅ Dashboard shows accurate metrics
✅ All operations have proper error handling
✅ Loading states are displayed during API calls

---

## 🐛 Known Issues

- Edit event page is not implemented
- Metrics are hardcoded
- No image upload functionality yet
- No ticket inventory management

---

## 📞 Next Steps

1. Choose integration strategy (API vs Direct Firestore)
2. Implement API functions in frontend
3. Update EventsContext to use new API functions
4. Update each organizer page to use new functions
5. Add authentication to all API calls
6. Test entire flow end-to-end
7. Add metrics endpoints to backend

