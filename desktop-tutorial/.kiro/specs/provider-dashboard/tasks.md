# Implementation Tasks: Provider Dashboard & Lynkéné Rebranding

## PHASE 1: CRITICAL TASKS (This Week)

---

## Task 1.1: Update Prisma Schema - Add ServiceOffer & PaymentRequest Models

### Objective
Add new models to support provider dashboard features and automatic payment requests.

### Requirements
- Add `ServiceOffer` model for provider service offerings
- Add `PaymentRequest` model for automatic payment tracking
- Update `User` model to include provider relations
- Update `Event` model to include payment requests

### Implementation Steps

#### 1.1.1 Update Prisma Schema
**File**: `eventflow-v3/prisma/schema.prisma`

Add these models to the schema:

```prisma
model ServiceOffer {
  id          Int     @id @default(autoincrement())
  providerId  Int
  provider    User    @relation("ProviderOffers", fields: [providerId], references: [id], onDelete: Cascade)
  
  serviceType String  // Catering, Décoration, Photographie, etc.
  description String
  price       Float
  status      String  @default("Publiée") // Publiée, Brouillon, Archivée
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model PaymentRequest {
  id        Int     @id @default(autoincrement())
  eventId   Int
  event     Event   @relation("PaymentRequests", fields: [eventId], references: [id], onDelete: Cascade)
  
  amount    Float
  status    String  @default("En attente") // En attente, Payé, Annulé
  dueDate   DateTime
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Update User model:
```prisma
model User {
  // ... existing fields
  serviceOffers ServiceOffer[] @relation("ProviderOffers")
}
```

Update Event model:
```prisma
model Event {
  // ... existing fields
  paymentRequests PaymentRequest[] @relation("PaymentRequests")
}
```

#### 1.1.2 Create Database Migration
**File**: `eventflow-v3/prisma/migrations/[timestamp]_add_provider_models/migration.sql`

Run migration:
```bash
cd eventflow-v3
npx prisma migrate dev --name add_provider_models
npx prisma generate
```

### Validation Checklist
- [ ] Schema compiles without errors
- [ ] Migration runs successfully
- [ ] Prisma client regenerates
- [ ] No type errors in existing code

---

## Task 1.2: Create Provider Offers API

### Objective
Implement API endpoints for managing service offers (create, read, update, delete).

### Requirements
- Create endpoint to list provider's offers
- Create endpoint to create new offer
- Create endpoint to update offer
- Create endpoint to delete offer
- Verify provider ownership before modifications

### Implementation Steps

#### 1.2.1 Create Offers API Route
**File**: `eventflow-v3/app/api/providers/offers/route.ts` (NEW)

```typescript
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// GET: List provider's offers
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const providerId = parseInt(session.user.id);

    const offers = await prisma.serviceOffer.findMany({
      where: { providerId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(offers);
  } catch (error) {
    console.error('Error fetching offers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch offers' },
      { status: 500 }
    );
  }
}

// POST: Create new offer
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const providerId = parseInt(session.user.id);
    const { serviceType, description, price, status } = await req.json();

    if (!serviceType || !description || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const offer = await prisma.serviceOffer.create({
      data: {
        providerId,
        serviceType,
        description,
        price: parseFloat(price),
        status: status || 'Publiée'
      }
    });

    return NextResponse.json(offer, { status: 201 });
  } catch (error) {
    console.error('Error creating offer:', error);
    return NextResponse.json(
      { error: 'Failed to create offer' },
      { status: 500 }
    );
  }
}
```

#### 1.2.2 Create Offer Detail API Route
**File**: `eventflow-v3/app/api/providers/offers/[id]/route.ts` (NEW)

```typescript
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// PUT: Update offer
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const providerId = parseInt(session.user.id);
    const offerId = parseInt(params.id);

    // Verify ownership
    const offer = await prisma.serviceOffer.findUnique({
      where: { id: offerId }
    });

    if (!offer || offer.providerId !== providerId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { serviceType, description, price, status } = await req.json();

    const updated = await prisma.serviceOffer.update({
      where: { id: offerId },
      data: {
        serviceType: serviceType || offer.serviceType,
        description: description || offer.description,
        price: price ? parseFloat(price) : offer.price,
        status: status || offer.status
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating offer:', error);
    return NextResponse.json(
      { error: 'Failed to update offer' },
      { status: 500 }
    );
  }
}

// DELETE: Delete offer
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const providerId = parseInt(session.user.id);
    const offerId = parseInt(params.id);

    // Verify ownership
    const offer = await prisma.serviceOffer.findUnique({
      where: { id: offerId }
    });

    if (!offer || offer.providerId !== providerId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.serviceOffer.delete({
      where: { id: offerId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting offer:', error);
    return NextResponse.json(
      { error: 'Failed to delete offer' },
      { status: 500 }
    );
  }
}
```

### Validation Checklist
- [ ] GET endpoint returns provider's offers
- [ ] POST endpoint creates new offer
- [ ] PUT endpoint updates offer
- [ ] DELETE endpoint removes offer
- [ ] Ownership verification works
- [ ] Error handling is correct

---

## Task 1.3: Create Provider Actualité (News Feed) Page

### Objective
Create page for providers to publish and manage service offers.

### Requirements
- Display form to create new offer
- Show list of published offers
- Allow edit/delete of own offers
- Display offer status

### Implementation Steps

#### 1.3.1 Create Provider Layout
**File**: `eventflow-v3/app/provider/layout.tsx` (NEW)

Create sidebar navigation similar to participant layout with tabs:
- Actualité (News Feed)
- Événements (Events)
- Participants (Participants)

#### 1.3.2 Create Provider Actualité Page
**File**: `eventflow-v3/app/provider/page.tsx` (NEW)

Display form and list of offers with create/edit/delete functionality.

### Validation Checklist
- [ ] Page loads without errors
- [ ] Form submits and creates offer
- [ ] Offers list displays correctly
- [ ] Edit functionality works
- [ ] Delete functionality works

---

## Task 1.4: Create Provider Events API

### Objective
Implement API to fetch only events where provider has accepted offers.

### Requirements
- Return only events with accepted provider offers
- Support filtering by status, service type, date
- Include event details and budget information

### Implementation Steps

#### 1.4.1 Create Provider Events API
**File**: `eventflow-v3/app/api/providers/events/route.ts` (NEW)

```typescript
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const providerId = parseInt(session.user.id);
    const { status, serviceType, dateFrom, dateTo } = Object.fromEntries(
      req.nextUrl.searchParams
    );

    // Get events where provider has accepted offers
    const events = await prisma.event.findMany({
      where: {
        status: status || undefined,
        // Add logic to filter by provider's accepted offers
      },
      include: {
        budget: { include: { categories: true } },
        participants: true,
        user: { select: { name: true, email: true } }
      },
      orderBy: { date: 'asc' }
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching provider events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
```

### Validation Checklist
- [ ] API returns correct events
- [ ] Filtering works correctly
- [ ] Budget information included
- [ ] Participant count accurate

---

## Task 1.5: Create Provider Participants API

### Objective
Implement API to fetch participants for provider's events with filtering and budget breakdown.

### Requirements
- Return participants for provider's events
- Support filtering by name, payment status, date, event
- Include budget breakdown per event
- Show payment status

### Implementation Steps

#### 1.5.1 Create Provider Participants API
**File**: `eventflow-v3/app/api/providers/participants/route.ts` (NEW)

```typescript
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const providerId = parseInt(session.user.id);
    const { name, paymentStatus, eventId, dateFrom, dateTo } = Object.fromEntries(
      req.nextUrl.searchParams
    );

    // Get participants for provider's events
    const participants = await prisma.participant.findMany({
      where: {
        name: name ? { contains: name, mode: 'insensitive' } : undefined,
        paymentStatus: paymentStatus || undefined,
        eventId: eventId ? parseInt(eventId) : undefined,
        event: {
          // Filter by provider's events
        }
      },
      include: {
        event: {
          include: { budget: { include: { categories: true } } }
        },
        payments: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(participants);
  } catch (error) {
    console.error('Error fetching participants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch participants' },
      { status: 500 }
    );
  }
}
```

### Validation Checklist
- [ ] API returns correct participants
- [ ] Filtering works for all fields
- [ ] Budget breakdown included
- [ ] Payment status accurate

---

## Task 1.6: Create Provider Participants Page

### Objective
Display participants with filters and budget breakdown.

### Requirements
- Show list of participants
- Display filters (name, payment status, date, event)
- Show budget breakdown per event
- Remove QR scanner

### Implementation Steps

#### 1.6.1 Create Provider Participants Page
**File**: `eventflow-v3/app/provider/participants/page.tsx` (NEW)

Display participants list with:
- Filter controls
- Participant details
- Budget breakdown
- Payment status

### Validation Checklist
- [ ] Page loads without errors
- [ ] Filters work correctly
- [ ] Budget breakdown displays
- [ ] No QR scanner present

---

## Task 1.7: Implement Automatic Payment Request on Event Creation

### Objective
Create automatic payment request when event is created.

### Requirements
- On event creation, create PaymentRequest with budget total
- Send notification to organizer
- Set due date (e.g., 7 days from creation)

### Implementation Steps

#### 1.7.1 Update Event Creation API
**File**: `eventflow-v3/app/api/events/route.ts` (MODIFY)

Add logic to create PaymentRequest after event creation:

```typescript
// After event is created:
const paymentRequest = await prisma.paymentRequest.create({
  data: {
    eventId: event.id,
    amount: event.budget?.totalAmount || 0,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    status: 'En attente'
  }
});

// Send notification
await prisma.notification.create({
  data: {
    userId: event.userId,
    eventId: event.id,
    type: 'info',
    message: `Demande de paiement créée pour ${event.name}: ${paymentRequest.amount} FCFA`,
    channel: 'Push',
    read: false
  }
});
```

### Validation Checklist
- [ ] PaymentRequest created on event creation
- [ ] Amount equals budget total
- [ ] Due date set correctly
- [ ] Notification sent to organizer

---

## Task 1.8: Implement Email + Push Notifications

### Objective
Implement working Email and Push notification channels.

### Requirements
- Email notifications via SendGrid or nodemailer
- Push notifications via Firebase Cloud Messaging
- Test notification sending
- Proper error handling

### Implementation Steps

#### 1.8.1 Create Notification Service
**File**: `eventflow-v3/lib/notifications.ts` (MODIFY/CREATE)

Implement email and push sending functions.

#### 1.8.2 Update Notification API
**File**: `eventflow-v3/app/api/notifications/route.ts` (MODIFY)

Add logic to send emails and push notifications when creating notifications.

### Validation Checklist
- [ ] Email notifications send successfully
- [ ] Push notifications send successfully
- [ ] Error handling works
- [ ] Notifications appear in UI

---

## Task 1.9: Create Provider Events Page

### Objective
Display events where provider has accepted offers.

### Requirements
- Show only provider's events
- Display event details
- Include filters (status, service type, date)
- Show budget information

### Implementation Steps

#### 1.9.1 Create Provider Events Page
**File**: `eventflow-v3/app/provider/events/page.tsx` (NEW)

Display events list with filters and details.

### Validation Checklist
- [ ] Page loads without errors
- [ ] Only provider's events shown
- [ ] Filters work correctly
- [ ] Budget information displayed

---

## Task 1.10: Update Provider Dashboard Layout

### Objective
Create complete provider dashboard layout with all tabs.

### Requirements
- Sidebar navigation with tabs
- Actualité (News Feed)
- Événements (Events)
- Participants (Participants)
- Consistent styling with participant dashboard

### Implementation Steps

#### 1.10.1 Update Provider Layout
**File**: `eventflow-v3/app/provider/layout.tsx` (CREATE/UPDATE)

Create layout similar to participant layout with provider-specific tabs.

### Validation Checklist
- [ ] Layout displays correctly
- [ ] All tabs accessible
- [ ] Navigation works
- [ ] Styling consistent

---

## PHASE 2: SHORT TERM TASKS (Week 2)

---

## Task 2.1: Rebranding - Update Colors to Green

### Objective
Change application colors from orange to green gradient (Lynkéné branding).

### Requirements
- Primary color: #10B981 (Green)
- Dark color: #059669 (Dark Green)
- Light color: #D1FAE5 (Light Green)
- Update all components
- Update CSS variables

### Implementation Steps

#### 2.1.1 Update Global CSS
**File**: `eventflow-v3/app/globals.css` (MODIFY)

Replace orange (#f97316) with green (#10B981) throughout.

#### 2.1.2 Update Component Colors
Update all components to use new color scheme.

### Validation Checklist
- [ ] All orange colors replaced with green
- [ ] Gradient applied correctly
- [ ] UI looks cohesive
- [ ] No orange remaining

---

## Task 2.2: Add Logo and Images

### Objective
Add Lynkéné logo and illustrations to the application.

### Requirements
- Add logo to header
- Add illustrations to pages
- Update favicon
- Consistent branding

### Implementation Steps

#### 2.2.1 Add Logo
Place logo in `eventflow-v3/assets/` and update layout files.

#### 2.2.2 Add Illustrations
Add illustrations for empty states and sections.

### Validation Checklist
- [ ] Logo displays correctly
- [ ] Illustrations added
- [ ] Favicon updated
- [ ] Branding consistent

---

## Task 2.3: Implement Unique QR Codes

### Objective
Generate unique QR codes per participant per event.

### Requirements
- QR code unique per participant per event
- Format: {eventId}-{participantId}-{timestamp}
- Scannable and functional
- Display in participant dashboard

### Implementation Steps

#### 2.3.1 Update QR Generation
**File**: `eventflow-v3/app/api/participants/[id]/qr/route.ts` (MODIFY)

Generate unique QR codes with proper format.

### Validation Checklist
- [ ] QR codes generated correctly
- [ ] Unique per participant per event
- [ ] Scannable
- [ ] Displayed in UI

---

## Task 2.4: Create Individual Participant Links

### Objective
Create unique links for each participant to access private events.

### Requirements
- Unique link per participant
- Format: `/events/[eventId]/participant/[participantId]`
- Access control verification
- Display event information

### Implementation Steps

#### 2.4.1 Create Participant Access Page
**File**: `eventflow-v3/app/events/[link]/participant/[participantId]/page.tsx` (NEW)

Display event information for specific participant.

### Validation Checklist
- [ ] Links generated correctly
- [ ] Access control works
- [ ] Event information displayed
- [ ] QR code shown

---

## PHASE 3: MEDIUM TERM TASKS (Week 3)

---

## Task 3.1: Update Homepage

### Objective
Update homepage to remove subscriptions and add Lynkéné branding.

### Requirements
- Remove subscription proposals
- Add images and illustrations
- Update colors to green
- Remove "Participant" terminology
- Add Lynkéné branding

### Implementation Steps

#### 3.1.1 Update Homepage
**File**: `eventflow-v3/app/page.tsx` (MODIFY)

Update homepage content and styling.

### Validation Checklist
- [ ] Subscriptions removed
- [ ] Images added
- [ ] Colors updated
- [ ] Branding consistent

---

## Task 3.2: Remove Payment Methods

### Objective
Remove payment method selection from the application.

### Requirements
- Remove payment method dropdowns
- Remove payment method selection UI
- Update payment APIs
- Clean up related code

### Implementation Steps

#### 3.2.1 Remove Payment Methods
Update all files that reference payment methods.

### Validation Checklist
- [ ] Payment methods removed
- [ ] No UI for selection
- [ ] APIs updated
- [ ] No errors

---

## Task 3.3: Remove Percentage Symbols

### Objective
Remove "%" symbols from budget breakdown displays.

### Requirements
- Show absolute values only
- Remove percentage calculations where not needed
- Update all budget displays
- Maintain clarity

### Implementation Steps

#### 3.3.1 Update Budget Displays
Update all files showing budget percentages.

### Validation Checklist
- [ ] "%" symbols removed
- [ ] Absolute values displayed
- [ ] UI clear and readable
- [ ] No confusion

---

## Task 3.4: Replace "Participant" Terminology

### Objective
Replace "Participant" with "Invité" throughout the application.

### Requirements
- Update all text references
- Update variable names where appropriate
- Update UI labels
- Maintain consistency

### Implementation Steps

#### 3.4.1 Replace Terminology
Search and replace "Participant" with "Invité" throughout codebase.

### Validation Checklist
- [ ] All references updated
- [ ] Consistency maintained
- [ ] No "Participant" remaining
- [ ] UI looks correct

---

## Testing & Validation

### Phase 1 Testing
- [ ] All APIs working correctly
- [ ] Provider dashboard functional
- [ ] Notifications sending
- [ ] Automatic payments created
- [ ] No errors in console

### Phase 2 Testing
- [ ] Colors updated correctly
- [ ] Logo and images display
- [ ] QR codes functional
- [ ] Individual links work
- [ ] Branding consistent

### Phase 3 Testing
- [ ] Homepage updated
- [ ] Payment methods removed
- [ ] Percentages removed
- [ ] Terminology updated
- [ ] Full app functional

---

## Deployment Checklist

- [ ] All code compiles without errors
- [ ] Database migrations run successfully
- [ ] All tests pass
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Security verified
- [ ] Ready for production

