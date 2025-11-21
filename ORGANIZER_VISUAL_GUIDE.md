# Organizer Integration: Visual Guide

## 🎯 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FOMO EVENT PLATFORM                       │
└─────────────────────────────────────────────────────────────┘

┌──────────────────┐           ┌──────────────────┐           ┌──────────────┐
│   FRONTEND       │           │    BACKEND       │           │   DATABASE   │
│   (Next.js)      │   HTTP    │   (NestJS)       │  Firestore│ (Firestore)  │
│                  │◄──────────►│                  │◄─────────►│              │
│ Port: 3000       │   REST    │ Port: 3002       │  Admin SDK│              │
│                  │   APIs    │                  │           │              │
└──────────────────┘           └──────────────────┘           └──────────────┘
        │
        └── Firebase Auth
```

---

## 📊 Organizer Workflow

```
ORGANIZER LOGIN
      │
      ↓
DASHBOARD (eo-dashboard)
  ├─ Shows: Metrics (visits, sales, conversion)
  ├─ Shows: Upcoming events list
  └─ Quick Actions: Create, Edit, Delete, View
      │
      ├─→ Create Event → CREATE PAGE (eo-create_event_page)
      │       ├─ Fill form
      │       ├─ Submit to API
      │       └─ Store in Firestore
      │
      ├─→ Edit Event → EDIT PAGE (eo-edit_event_page)
      │       ├─ Load event from API
      │       ├─ Update form
      │       └─ Save changes
      │
      ├─→ Delete Event → MANAGE EVENTS (eo-manageEvents)
      │       ├─ Confirm deletion
      │       └─ Remove from Firestore
      │
      └─→ View Events → MANAGE EVENTS (eo-manageEvents)
              └─ Browse all organizer events
```

---

## 🔄 Data Flow: Creating an Event

```
FRONTEND (eo-create_event_page)
│
├─ User fills EventForm
│   ├─ Title: "Tech Summit 2025"
│   ├─ Date: "2025-12-01"
│   ├─ Location: "Nairobi"
│   └─ Price: 5000
│
└─ Clicks "Create Event"
      │
      ↓
API CALL: POST /events
│   Headers: {
│     "Content-Type": "application/json",
│     "Authorization": "Bearer {firebase_token}"
│   }
│   Body: { form data }
│
      ↓
BACKEND (EventsController)
│   ├─ RolesGuard checks: Is user "organizer"? ✓
│   └─ Pass to EventsService.createEvent()
│
      ↓
BACKEND (EventsService)
│   ├─ Validate input data ✓
│   ├─ Check capacity > 0 ✓
│   └─ Write to Firestore
│
      ↓
FIRESTORE (events collection)
│   ├─ Document created
│   ├─ ID: "evt_abc123"
│   └─ Data: { title, date, location, ... }
│
      ↓
API RESPONSE: { id: "evt_abc123", message: "Created" }
│
      ↓
FRONTEND
│   ├─ Show success notification
│   ├─ Clear form
│   └─ Redirect to /eo-manageEvents
│
      ↓
FIRESTORE LISTENER (EventsContext)
│   ├─ onSnapshot triggered
│   ├─ New event added to state
│   └─ Dashboard updates automatically
│
      ↓
USER SEES: New event in dashboard!
```

---

## 🔧 Implementation Phases

### Phase 1️⃣ : API Functions (10 min)
```
File: frontend/src/lib/api.js

ADD:
✓ createOrganizerEvent()
✓ updateOrganizerEvent()
✓ deleteOrganizerEvent()
✓ getEventDetails()
✓ getEventMetrics()

Each function:
- Takes event data + optional auth token
- Makes HTTP request to backend
- Returns response or error
```

### Phase 2️⃣ : Dashboard Update (15 min)
```
File: frontend/src/app/(eventOrganiser)/eo-dashboard/page.js

UPDATE:
✓ Fetch real metrics from API
✓ Load organizer's events from EventsContext
✓ Add loading states
✓ Handle errors gracefully

Result:
- Dashboard shows real data
- Metrics update when events change
- Loading spinner while fetching
```

### Phase 3️⃣ : Create Event Update (10 min)
```
File: frontend/src/app/(eventOrganiser)/eo-create_event_page/page.js

UPDATE:
✓ Use createOrganizerEvent() API
✓ Add error handling with fallback to Firestore
✓ Show loading state on button
✓ Better error messages

Result:
- Events created through backend
- Firestore sync happens automatically
- Better UX with loading/error states
```

### Phase 4️⃣ : Implement Edit Event (15 min)
```
File: frontend/src/app/(eventOrganiser)/eo-edit_event_page/page.js

CREATE (currently placeholder):
✓ Load event ID from URL
✓ Fetch event details from API
✓ Pre-fill form with event data
✓ On submit: call updateOrganizerEvent()
✓ Handle errors and redirects

Result:
- Fully functional edit page
- Loads existing event data
- Updates through backend
```

### Phase 5️⃣ : Backend Metrics (5 min)
```
Files: backend/src/events/

ADD METHOD in EventsService:
✓ getEventMetrics(eventId)
  - Query orders for this event
  - Calculate total sales
  - Count total revenue
  - Calculate conversion rate

ADD ENDPOINT in EventsController:
✓ GET /events/:id/metrics
  - Calls service method
  - Returns metrics object

Result:
- Dashboard shows real metrics
- Metrics calculated from actual data
```

---

## 🗂️ File Map

```
┌─ FRONTEND (Next.js)
│
├─ src/lib/api.js
│  └─ API functions (createOrganizerEvent, etc.)
│
├─ src/contexts/EventsContext.js
│  ├─ Real-time Firestore listener
│  ├─ Event CRUD operations
│  └─ Organizer event filtering
│
└─ src/app/(eventOrganiser)/
   ├─ eo-dashboard/page.js
   │  ├─ Metrics display
   │  ├─ Event cards
   │  └─ Quick action buttons
   │
   ├─ eo-create_event_page/page.js
   │  ├─ EventForm component
   │  ├─ Submit handler
   │  └─ Validation
   │
   ├─ eo-edit_event_page/page.js
   │  ├─ Load event by ID
   │  ├─ Edit form
   │  └─ Update handler
   │
   └─ eo-manageEvents/page.js
      └─ EventsPage component (shared)

┌─ BACKEND (NestJS)
│
└─ src/events/
   ├─ events.controller.ts
   │  ├─ POST /events (create)
   │  ├─ PATCH /events/:id (update)
   │  ├─ DELETE /events/:id (delete)
   │  ├─ GET /events/:id (get by id)
   │  └─ GET /events/:id/metrics (metrics)
   │
   ├─ events.service.ts
   │  ├─ createEvent()
   │  ├─ updateEvent()
   │  ├─ deleteEvent()
   │  ├─ getEventById()
   │  ├─ getEventsByOrganizer()
   │  └─ getEventMetrics()
   │
   └─ dto/
      ├─ event-filters.dto.ts
      ├─ moderation.dto.ts
      └─ search_events.dto.ts

┌─ DATABASE (Firestore)
│
└─ Collections:
   ├─ events/
   │  └─ Documents: { title, date, location, price, organizerId, ... }
   │
   ├─ orders/
   │  └─ Documents: { items: [...], userId, status, ... }
   │
   ├─ users/
   │  └─ Documents: { email, role, displayName, ... }
   │
   └─ favourites/
      └─ Documents: { userId, eventId, ... }
```

---

## 🔐 Authentication Flow

```
1. USER LOGS IN (Firebase Auth)
   │
   └─ Firebase returns: auth token (JWT)

2. TOKEN STORED IN FRONTEND
   │
   └─ Available via: UserContext.getAuthToken()

3. FRONTEND MAKES API CALL
   │
   ├─ Headers: {
   │   "Authorization": "Bearer {token}"
   │ }
   │
   └─ POST /events with token

4. BACKEND RECEIVES REQUEST
   │
   ├─ Extract token from header
   ├─ Verify with Firebase Admin SDK
   ├─ Extract user ID and role from token
   └─ Check if user is "organizer" role

5. AUTHORIZATION CHECK
   │
   ├─ RolesGuard validates role
   ├─ User must have "organizer" role
   └─ Proceed or return 403 Forbidden

6. EVENT OWNERSHIP CHECK
   │
   ├─ For PATCH/DELETE: Check organizerId == userId
   ├─ Only event owner can edit/delete
   └─ Return 403 if not owner

7. OPERATION SUCCEEDS
   │
   └─ Event created/updated/deleted in Firestore
```

---

## ✅ Success Indicators

After implementation, you should see:

### ✓ Dashboard
```
"My Upcoming Events"
├─ Event 1: "Tech Summit 2025"
│  ├─ Date: 2025-12-01
│  ├─ Location: Nairobi
│  └─ Buttons: View | Edit | Delete
│
└─ Event 2: "Web Dev Workshop"
   ├─ Date: 2025-11-30
   └─ Buttons: View | Edit | Delete

"Digital Event Metrics"
├─ Total Visits: 1,234
├─ Tickets Sold: 456
└─ Conversion Rate: 37%
```

### ✓ Create Event
```
Button: "Create Event"
  ↓
Form appears with fields:
  - Title: _______________
  - Date: _______________
  - Location: _______________
  - Price: _______________
  - ...
  
Button: "Create Event" → Shows loading → Success → Redirect
```

### ✓ Edit Event
```
Button: "Edit" on event card
  ↓
Form pre-filled with event data
  ↓
Edit fields
  ↓
Button: "Save Changes" → Shows loading → Success → Redirect
```

### ✓ Delete Event
```
Button: "Delete" on event card
  ↓
Confirmation dialog: "Are you sure?"
  ↓
Buttons: "Cancel" | "Delete"
  ↓
If Delete: Loading → Success → Event removed from list
```

---

## 🧪 Manual Testing Script

```powershell
# 1. Start backend
cd backend
npm run start:dev

# 2. Start frontend
cd frontend
npm run dev

# 3. Login as organizer at http://localhost:3000
# - Use Firebase test account or create new

# 4. Test Create Event
# - Go to eo-create_event_page
# - Fill form: Title "Test Event", Date "2025-12-01", Location "Nairobi"
# - Click Create
# - Should see success message

# 5. Test Dashboard
# - Go to eo-dashboard
# - Should see "Test Event" in "My Upcoming Events"
# - Should see metrics (may be 0 until orders exist)

# 6. Test Edit Event
# - Click Edit on event card
# - Change title to "Updated Test Event"
# - Click Save
# - Should see success and return to manage events

# 7. Test Delete Event
# - Click Delete on event card
# - Confirm deletion
# - Event should disappear from list

# 8. Check Backend Logs
# - Should see log messages like:
#   [Nest] ... LOG [EventsController] Creating event...
#   [Nest] ... LOG [EventsService] Event created successfully
```

---

## 🎓 Key Concepts

### Real-time Sync
```
Firestore → onSnapshot listener → EventsContext → Component re-renders
        ↑
        └── API updates Firestore automatically
```

### Error Handling Pattern
```
try {
  // Try API call first (more reliable)
  const result = await apiFunction(data);
} catch (apiError) {
  // Fallback to direct Firestore (works offline)
  const result = await firestoreFunction(data);
}
```

### Loading States
```
Button: "Create Event"
  ├─ Normal state: blue, clickable
  ├─ Loading state: gray, disabled, shows spinner
  └─ Done: return to normal, show success/error
```

### Authorization Pattern
```
Frontend: Sends token
  ↓
Backend Guard: Validates token, checks role
  ↓
Backend Service: Performs operation
  ↓
Backend: Writes to Firestore
  ↓
Frontend Listener: Detects change
  ↓
UI Updates
```

---

## 💡 Pro Tips

1. **Always pass auth token** - Backend needs to know who's making the request
2. **Handle API failures gracefully** - Use Firestore fallback
3. **Show loading states** - Users should know something is happening
4. **Validate on frontend** - Catch errors before sending to API
5. **Log errors** - Check browser console and backend logs
6. **Test incrementally** - Test one page at a time
7. **Use browser DevTools** - Check Network tab to see API calls
8. **Monitor Firestore** - Firebase Console shows data being written

---

## 🚨 Common Mistakes

❌ Not passing auth token to API
❌ Forgetting to handle API errors
❌ Hardcoding user IDs instead of using context
❌ Not checking role before creating events
❌ Assuming events sync instantly (they don't)
❌ Not showing loading states (confusing UX)
❌ Not validating form data before submit

✅ Always pass token
✅ Always wrap API calls in try/catch
✅ Get user ID from context
✅ Let RolesGuard handle authorization
✅ Use onSnapshot for real-time updates
✅ Show spinners and disable buttons
✅ Validate forms on submit

---

## 📈 Performance Tips

1. **Debounce searches** - Don't search on every keystroke
2. **Paginate events** - Don't load all events at once
3. **Cache API responses** - Don't refetch same data repeatedly
4. **Optimize images** - Compress event images
5. **Lazy load components** - Load edit form only when needed

---

## 🔍 Debugging Checklist

When something doesn't work:

- [ ] Is backend running? `npm run start:dev`
- [ ] Is frontend running? `npm run dev`
- [ ] Check browser console for errors
- [ ] Check backend terminal for logs
- [ ] Check Firestore console for data
- [ ] Is user authenticated? (Check Firebase Auth)
- [ ] Is user an organizer? (Check user role)
- [ ] Are API URLs correct? (Check api.js)
- [ ] Are tokens being sent? (Check Network tab)
- [ ] Is event data valid? (Check form values)

---

## 📞 Support Resources

- **Backend Logs**: Check terminal where `npm run start:dev` is running
- **Frontend Logs**: Browser DevTools → Console
- **API Calls**: Browser DevTools → Network tab
- **Firestore**: Firebase Console → Firestore
- **User Data**: Firebase Console → Authentication

---

**Status:** Ready to Implement  
**Effort:** 1-2 hours  
**Complexity:** Medium  
**Dependencies:** Backend running, Firestore configured, Firebase Auth working

