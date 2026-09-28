# Design Document: Participant Dashboard

## Overview

The Participant Dashboard is a specialized interface within EventFlow that provides participants with a personalized view of their event attendance, ticket purchases, and event history. Unlike the organizer dashboard which manages all events and comprehensive budget operations, the participant dashboard focuses on individual participant data with strict data isolation and privacy controls.

The dashboard consists of four main tabs:
- **News Feed**: Chronological updates from events the participant is attending
- **Events**: Upcoming confirmed events with details and status
- **Budget**: Ticket purchases and spending summary
- **Reports**: Past event history with downloadable PDF reports

The design prioritizes data isolation, performance, and a streamlined user experience tailored to participant needs.

## Architecture

### High-Level System Design

```
┌─────────────────────────────────────────────────────────────┐
│                    Participant Dashboard                     │
│  (Web: Next.js/React | Mobile: React Native/Expo)          │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
   ┌────▼────┐  ┌───▼────┐  ┌───▼────┐
   │ News    │  │ Events │  │ Budget │
   │ Feed    │  │ Tab    │  │ Tab    │
   │ Tab     │  │        │  │        │
   └────┬────┘  └───┬────┘  └───┬────┘
        │           │           │
        └───────────┼───────────┘
                    │
        ┌───────────▼────────────┐
        │  Participant API Layer │
        │  (Data Filtering &     │
        │   Authorization)       │
        └───────────┬────────────┘
                    │
        ┌───────────▼────────────────────┐
        │  Prisma ORM & Database Layer   │
        │  (SQLite with Participant,     │
        │   Event, Payment, Notification │
        │   models)                      │
        └────────────────────────────────┘
```

### Component Architecture

The participant dashboard is composed of:

1. **API Layer** (`/api/participant-dashboard/*`)
   - Participant-specific data endpoints
   - Strict authentication and authorization
   - Data filtering based on authenticated participant ID

2. **Frontend Components** (Next.js/React)
   - Tab navigation component
   - News Feed component
   - Events list component
   - Budget summary component
   - Reports component with PDF download

3. **Mobile Components** (React Native/Expo)
   - Parallel implementation of web components
   - Native UI patterns for mobile
   - Pull-to-refresh functionality

4. **Notification System**
   - Event-triggered notifications
   - Participant-specific filtering
   - Multi-channel delivery (Email, SMS, WhatsApp, Push)

5. **Report Generation Service**
   - PDF generation engine
   - Event data serialization
   - File download handling

## Components and Interfaces

### API Endpoints

#### 1. Participant Dashboard - News Feed
**Endpoint**: `GET /api/participant-dashboard/news-feed`

**Query Parameters**:
- `limit` (optional, default: 20): Number of feed items to return
- `offset` (optional, default: 0): Pagination offset

**Response**:
```typescript
{
  items: Array<{
    id: string;
    eventId: number;
    eventName: string;
    updateType: 'announcement' | 'status_change' | 'date_change' | 'location_change';
    message: string;
    timestamp: ISO8601;
    organizerName: string;
  }>;
  total: number;
  hasMore: boolean;
}
```

**Authorization**: Requires authenticated participant session
**Data Filtering**: Only returns updates for events where participant status is "Confirmé"

#### 2. Participant Dashboard - Events
**Endpoint**: `GET /api/participant-dashboard/events`

**Query Parameters**:
- `status` (optional): Filter by event status ('Planifié', 'En cours', 'Terminé')
- `sortBy` (optional, default: 'date'): Sort field ('date', 'name')

**Response**:
```typescript
{
  events: Array<{
    id: number;
    name: string;
    date: string;
    time: string;
    location: string;
    organizerName: string;
    participantStatus: 'Confirmé' | 'En attente' | 'Annulé';
    eventStatus: 'Planifié' | 'En cours' | 'Terminé';
    capacity: number;
    attendeeCount: number;
  }>;
  total: number;
}
```

**Authorization**: Requires authenticated participant session
**Data Filtering**: 
- Only events where participant status is "Confirmé"
- Excludes events with status "Brouillon" or "En cours"
- Excludes events where participant status is "Annulé"

#### 3. Participant Dashboard - Budget (Tickets)
**Endpoint**: `GET /api/participant-dashboard/budget`

**Response**:
```typescript
{
  tickets: Array<{
    id: number;
    eventId: number;
    eventName: string;
    amount: number;
    paymentStatus: 'Payé' | 'En attente' | 'Remboursé';
    paymentDate: ISO8601 | null;
    paymentMethod: string | null;
    reference: string;
  }>;
  summary: {
    totalSpent: number;
    totalPending: number;
    totalRefunded: number;
    ticketCount: number;
  };
}
```

**Authorization**: Requires authenticated participant session
**Data Filtering**: Only returns payments/tickets for authenticated participant

#### 4. Participant Dashboard - Reports
**Endpoint**: `GET /api/participant-dashboard/reports`

**Query Parameters**:
- `limit` (optional, default: 20): Number of reports to return
- `offset` (optional, default: 0): Pagination offset

**Response**:
```typescript
{
  reports: Array<{
    id: number;
    eventId: number;
    eventName: string;
    date: string;
    time: string;
    location: string;
    organizerName: string;
    attendanceStatus: 'Confirmé' | 'En attente';
    reportUrl: string;
  }>;
  total: number;
  hasMore: boolean;
}
```

**Authorization**: Requires authenticated participant session
**Data Filtering**: Only returns completed events where participant attended

#### 5. Report Download
**Endpoint**: `GET /api/participant-dashboard/reports/[eventId]/download`

**Response**: PDF file with Content-Type: application/pdf

**Authorization**: Requires authenticated participant session
**Data Filtering**: Validates participant attended the event before generating

### Frontend Component Interfaces

#### News Feed Component
```typescript
interface NewsFeedProps {
  participantId: number;
  onRefresh: () => Promise<void>;
}

interface FeedItem {
  id: string;
  eventName: string;
  updateType: string;
  message: string;
  timestamp: Date;
  organizerName: string;
}
```

#### Events Tab Component
```typescript
interface EventsTabProps {
  participantId: number;
  onEventSelect: (eventId: number) => void;
  onRefresh: () => Promise<void>;
}

interface ParticipantEvent {
  id: number;
  name: string;
  date: string;
  time: string;
  location: string;
  organizerName: string;
  participantStatus: string;
  eventStatus: string;
}
```

#### Budget Tab Component
```typescript
interface BudgetTabProps {
  participantId: number;
  onRefresh: () => Promise<void>;
}

interface Ticket {
  id: number;
  eventName: string;
  amount: number;
  paymentStatus: string;
  paymentDate: Date | null;
}
```

#### Reports Tab Component
```typescript
interface ReportsTabProps {
  participantId: number;
  onRefresh: () => Promise<void>;
}

interface Report {
  id: number;
  eventName: string;
  date: string;
  location: string;
  organizerName: string;
  reportUrl: string;
}
```

## Data Models

### Database Schema Extensions

The existing Prisma schema requires the following considerations for the participant dashboard:

**Existing Models Used**:
- `User` (with accountType = "Participant")
- `Event` (with status filtering)
- `Participant` (with status and paymentStatus fields)
- `Payment` (for ticket tracking)
- `Notification` (for participant-specific notifications)

**New Fields Needed** (via migration):
```prisma
model Event {
  // Existing fields...
  
  // Add field to track event updates for news feed
  updates: EventUpdate[]
}

model EventUpdate {
  id        Int     @id @default(autoincrement())
  eventId   Int
  event     Event   @relation(fields: [eventId], references: [id], onDelete: Cascade)
  
  type      String  // 'announcement', 'status_change', 'date_change', 'location_change'
  message   String
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Participant {
  // Existing fields...
  
  // Ensure these fields exist for filtering
  status    String  @default("En attente") // Confirmé, En attente, Annulé
  paymentStatus String @default("En attente") // Payé, En attente, Remboursé
}
```

### Data Relationships

```
User (Participant)
  ├── Participant (many) - represents attendance at events
  │   ├── Event (one) - the event being attended
  │   ├── Payment (many) - ticket payments
  │   └── Notification (many) - participant-specific notifications
  └── Notification (many) - direct notifications to participant
```

### Query Patterns

**News Feed Query**:
```typescript
// Get all event updates for events where participant is confirmed
const updates = await prisma.eventUpdate.findMany({
  where: {
    event: {
      participants: {
        some: {
          id: participantId,
          status: "Confirmé"
        }
      }
    }
  },
  orderBy: { createdAt: 'desc' },
  take: limit,
  skip: offset
});
```

**Events Query**:
```typescript
// Get upcoming events for confirmed participant
const events = await prisma.event.findMany({
  where: {
    participants: {
      some: {
        id: participantId,
        status: "Confirmé"
      }
    },
    status: { in: ["Planifié", "En cours"] }
  },
  orderBy: { date: 'asc' }
});
```

**Budget Query**:
```typescript
// Get all payments for participant
const payments = await prisma.payment.findMany({
  where: {
    participantId: participantId
  },
  include: {
    event: { select: { name: true } }
  }
});
```

**Reports Query**:
```typescript
// Get completed events for participant
const completedEvents = await prisma.event.findMany({
  where: {
    participants: {
      some: {
        id: participantId,
        status: "Confirmé"
      }
    },
    status: "Terminé"
  },
  orderBy: { date: 'desc' }
});
```

## Data Flow

### News Feed Data Flow

```
1. Organizer posts announcement/update to event
   ↓
2. EventUpdate record created in database
   ↓
3. Notification triggered for all confirmed participants
   ↓
4. Participant accesses News Feed tab
   ↓
5. Frontend calls GET /api/participant-dashboard/news-feed
   ↓
6. API validates participant authentication
   ↓
7. API queries EventUpdate records filtered by:
   - Events where participant is confirmed
   - Ordered by timestamp (descending)
   ↓
8. API returns paginated results
   ↓
9. Frontend renders feed items chronologically
```

### Events Tab Data Flow

```
1. Participant accesses Events tab
   ↓
2. Frontend calls GET /api/participant-dashboard/events
   ↓
3. API validates participant authentication
   ↓
4. API queries Event records filtered by:
   - Participant has confirmed status
   - Event status is "Planifié" or "En cours"
   - Excludes "Brouillon" and "Terminé" events
   ↓
5. API sorts by date (ascending)
   ↓
6. API returns event list with participant details
   ↓
7. Frontend renders upcoming events
   ↓
8. When event transitions to "Terminé":
   - Event removed from Events tab
   - Event added to Reports tab
```

### Budget Tab Data Flow

```
1. Participant accesses Budget tab
   ↓
2. Frontend calls GET /api/participant-dashboard/budget
   ↓
3. API validates participant authentication
   ↓
4. API queries Payment records where:
   - participantId matches authenticated user
   ↓
5. API calculates summary statistics:
   - Total spent (all payments)
   - Total pending (status = "En attente")
   - Total refunded (status = "Remboursé")
   ↓
6. API groups payments by event
   ↓
7. Frontend renders ticket list and summary
   ↓
8. When payment status changes:
   - Notification sent to participant
   - Budget tab updates on refresh
```

### Reports Tab Data Flow

```
1. Participant accesses Reports tab
   ↓
2. Frontend calls GET /api/participant-dashboard/reports
   ↓
3. API validates participant authentication
   ↓
4. API queries Event records where:
   - Participant has confirmed status
   - Event status is "Terminé"
   ↓
5. API sorts by date (descending - most recent first)
   ↓
6. API returns completed events list
   ↓
7. Frontend renders past events with download buttons
   ↓
8. Participant clicks download button
   ↓
9. Frontend calls GET /api/participant-dashboard/reports/[eventId]/download
   ↓
10. API validates participant attended event
    ↓
11. PDF generation service creates report
    ↓
12. PDF returned to frontend for download
```

## Notification System

### Notification Triggers

**Event-Related Notifications**:
1. **Event Announcement**: When organizer posts announcement
   - Trigger: EventUpdate created with type = 'announcement'
   - Recipients: All confirmed participants
   - Channels: Email, SMS, WhatsApp, Push (based on preferences)

2. **Event Status Change**: When event date/location/status changes
   - Trigger: Event record updated
   - Recipients: All confirmed participants
   - Channels: Email, SMS, WhatsApp, Push (based on preferences)

3. **Event Cancellation**: When event is cancelled
   - Trigger: Event status changed to "Annulé"
   - Recipients: All confirmed participants
   - Channels: Email, SMS, WhatsApp, Push (based on preferences)

**Payment-Related Notifications**:
1. **Payment Confirmation**: When payment is completed
   - Trigger: Payment status changed to "completed"
   - Recipients: Participant who made payment
   - Channels: Email, SMS, WhatsApp, Push (based on preferences)

2. **Payment Failed**: When payment fails
   - Trigger: Payment status changed to "failed"
   - Recipients: Participant who attempted payment
   - Channels: Email, SMS, WhatsApp, Push (based on preferences)

3. **Refund Processed**: When refund is issued
   - Trigger: Payment status changed to "Remboursé"
   - Recipients: Participant receiving refund
   - Channels: Email, SMS, WhatsApp, Push (based on preferences)

### Notification Service Implementation

```typescript
// Participant-specific notification creation
async function notifyParticipantEventUpdate(
  participantId: number,
  eventId: number,
  updateType: string,
  message: string
) {
  // Verify participant is confirmed for event
  const participant = await prisma.participant.findFirst({
    where: {
      id: participantId,
      eventId: eventId,
      status: "Confirmé"
    }
  });

  if (!participant) return; // Don't notify if not confirmed

  // Get participant's user record for notification preferences
  const user = await prisma.user.findUnique({
    where: { id: participant.userId }
  });

  // Create notification record
  const notification = await prisma.notification.create({
    data: {
      userId: user.id,
      type: 'info',
      message: `${eventName}: ${message}`,
      channel: user.preferredChannel || 'Push'
    }
  });

  // Send via appropriate channel
  await sendNotificationByChannel(notification);
}
```

### Data Isolation in Notifications

- Notifications are created with specific `userId` (participant's user ID)
- Notification queries filtered by authenticated user ID
- Participant can only see notifications created for their user ID
- No cross-participant notification visibility

## PDF Report Generation

### Report Content Structure

Each PDF report includes:
1. **Header Section**
   - EventFlow logo/branding
   - Report title: "Event Attendance Report"
   - Generation date

2. **Event Details Section**
   - Event name
   - Event date and time
   - Event location
   - Organizer name
   - Event description (if available)

3. **Attendance Section**
   - Participant name
   - Attendance status (Confirmé/En attente)
   - Ticket reference/QR code
   - Payment status

4. **Footer Section**
   - EventFlow contact information
   - Report generation timestamp
   - Participant ID (for reference)

### PDF Generation Implementation

**Library**: PDFKit (Node.js) or similar
**Approach**: Server-side generation with streaming response

```typescript
// Endpoint: GET /api/participant-dashboard/reports/[eventId]/download
async function generateEventReport(eventId: number, participantId: number) {
  // 1. Validate participant attended event
  const participant = await prisma.participant.findFirst({
    where: {
      id: participantId,
      eventId: eventId,
      status: "Confirmé"
    },
    include: {
      event: {
        include: { user: true }
      }
    }
  });

  if (!participant) {
    throw new Error('Unauthorized: Participant did not attend event');
  }

  // 2. Get payment information
  const payment = await prisma.payment.findFirst({
    where: {
      participantId: participantId,
      eventId: eventId
    }
  });

  // 3. Generate PDF
  const doc = new PDFDocument();
  
  // Add header
  doc.fontSize(24).text('Event Attendance Report', { align: 'center' });
  doc.fontSize(10).text(`Generated: ${new Date().toISOString()}`, { align: 'center' });
  
  // Add event details
  doc.fontSize(14).text('Event Details', { underline: true });
  doc.fontSize(11).text(`Event: ${participant.event.name}`);
  doc.text(`Date: ${participant.event.date}`);
  doc.text(`Location: ${participant.event.location}`);
  doc.text(`Organizer: ${participant.event.user.name}`);
  
  // Add attendance details
  doc.fontSize(14).text('Attendance Information', { underline: true });
  doc.fontSize(11).text(`Participant: ${participant.name}`);
  doc.text(`Status: ${participant.status}`);
  doc.text(`Payment Status: ${payment?.status || 'N/A'}`);
  
  // 4. Return PDF stream
  return doc;
}
```

### Performance Considerations

- PDF generation should complete within 5 seconds
- Use streaming response to avoid memory issues
- Cache generated PDFs for 24 hours to reduce regeneration
- Implement queue system for high-volume report requests

## Authentication & Authorization

### Authentication Flow

1. **Session Validation**
   - All participant dashboard endpoints require authenticated session
   - Session contains user ID and account type
   - Middleware validates session before route handler execution

2. **Account Type Verification**
   - Verify user.accountType === "Participant"
   - Reject requests from organizers or service providers
   - Return 403 Forbidden for invalid account types

### Authorization Rules

**Data Access Control**:
- Participant can only access their own data
- All queries filtered by authenticated participant ID
- No cross-participant data visibility
- Organizer data completely hidden from participants

**Endpoint-Level Authorization**:
```typescript
// Middleware for participant dashboard routes
async function requireParticipantAuth(req: NextRequest) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: parseInt(session.user.id) }
  });

  if (user?.accountType !== 'Participant') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return null; // Authorization passed
}
```

**Resource-Level Authorization**:
- Before returning any data, verify participant owns/has access to resource
- Example: Before returning event report, verify participant attended event
- Example: Before returning payment, verify payment belongs to participant

### Data Isolation Implementation

**Query Filtering Pattern**:
```typescript
// All queries follow this pattern
const data = await prisma.model.findMany({
  where: {
    // Always include participant ID filter
    participantId: authenticatedParticipantId,
    // Additional filters as needed
    ...otherFilters
  }
});
```

**Response Filtering Pattern**:
```typescript
// Before returning response, verify data ownership
if (data.participantId !== authenticatedParticipantId) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
```

## Performance Considerations

### Caching Strategy

**Frontend Caching**:
- Cache news feed items for 5 minutes
- Cache events list for 5 minutes
- Cache budget summary for 10 minutes
- Cache reports list for 30 minutes
- Implement pull-to-refresh to bypass cache

**Backend Caching**:
- Cache participant's event list (5 minutes)
- Cache payment summary (10 minutes)
- Cache completed events list (30 minutes)
- Invalidate cache on data mutations

**PDF Report Caching**:
- Cache generated PDFs for 24 hours
- Use event ID + participant ID as cache key
- Regenerate if event details change

### Pagination Strategy

**News Feed**:
- Default limit: 20 items
- Maximum limit: 100 items
- Offset-based pagination
- Total count included in response

**Events List**:
- Default limit: 50 items
- Maximum limit: 200 items
- Offset-based pagination

**Reports List**:
- Default limit: 20 items
- Maximum limit: 100 items
- Offset-based pagination

### Query Optimization

**Database Indexes**:
```sql
-- Participant queries
CREATE INDEX idx_participant_event_status ON Participant(eventId, status);
CREATE INDEX idx_participant_user_id ON Participant(userId);

-- Event queries
CREATE INDEX idx_event_status_date ON Event(status, date);
CREATE INDEX idx_event_user_id ON Event(userId);

-- Payment queries
CREATE INDEX idx_payment_participant_id ON Payment(participantId);
CREATE INDEX idx_payment_status ON Payment(status);

-- Notification queries
CREATE INDEX idx_notification_user_id ON Notification(userId);
CREATE INDEX idx_notification_created_at ON Notification(createdAt);
```

**Query Optimization Techniques**:
- Use `include` selectively to avoid N+1 queries
- Batch queries where possible
- Use database-level filtering before application filtering
- Implement connection pooling for database connections

### Load Time Targets

- Dashboard initial load: < 2 seconds
- Tab switching: < 1 second
- News feed pagination: < 500ms
- Report download initiation: < 1 second
- PDF generation: < 5 seconds

### Mobile Performance

- Implement lazy loading for long lists
- Use virtual scrolling for large lists
- Minimize bundle size for mobile app
- Implement efficient image loading
- Support offline mode with local caching

## Error Handling

### API Error Responses

**Authentication Errors**:
```json
{
  "error": "Unauthorized",
  "code": "AUTH_001",
  "message": "Session expired. Please log in again.",
  "status": 401
}
```

**Authorization Errors**:
```json
{
  "error": "Forbidden",
  "code": "AUTH_002",
  "message": "You do not have access to this resource.",
  "status": 403
}
```

**Validation Errors**:
```json
{
  "error": "Bad Request",
  "code": "VAL_001",
  "message": "Invalid query parameters.",
  "details": {
    "limit": "Must be between 1 and 100"
  },
  "status": 400
}
```

**Not Found Errors**:
```json
{
  "error": "Not Found",
  "code": "NOT_FOUND_001",
  "message": "Event report not found.",
  "status": 404
}
```

**Server Errors**:
```json
{
  "error": "Internal Server Error",
  "code": "SERVER_001",
  "message": "An unexpected error occurred. Please try again later.",
  "status": 500
}
```

### Frontend Error Handling

- Display user-friendly error messages
- Provide retry options for failed requests
- Log errors for debugging
- Show loading states during operations
- Implement timeout handling for long-running operations

### Graceful Degradation

- If news feed fails to load, show cached data or empty state
- If PDF generation fails, show error message with retry button
- If pagination fails, show current page with error notification
- Implement fallback UI for missing data

## Testing Strategy

### Unit Testing

**API Route Tests**:
- Test authentication validation
- Test authorization checks
- Test data filtering logic
- Test error responses
- Test pagination logic

**Component Tests**:
- Test component rendering
- Test user interactions
- Test data display
- Test error states
- Test loading states

**Service Tests**:
- Test notification creation
- Test PDF generation
- Test data transformation
- Test caching logic

### Property-Based Testing

Property-based tests will verify universal correctness properties across all valid inputs and scenarios. These tests use randomized input generation to ensure properties hold across diverse data states.

### Integration Tests

- Test end-to-end dashboard flows
- Test data consistency across tabs
- Test notification delivery
- Test PDF download functionality
- Test cache invalidation

### Performance Tests

- Load test dashboard endpoints
- Test pagination with large datasets
- Test PDF generation performance
- Test concurrent user access
- Measure response times

### Security Tests

- Test authorization bypass attempts
- Test SQL injection prevention
- Test XSS prevention
- Test CSRF protection
- Test data isolation between participants

