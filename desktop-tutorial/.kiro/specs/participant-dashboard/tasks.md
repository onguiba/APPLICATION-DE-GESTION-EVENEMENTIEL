# Implementation Tasks: Participant Dashboard

## Task 1: Participant-Specific Notifications System

### Objective
Implement notifications that are sent ONLY to participants for events they are associated with.

### Requirements
- Notifications must be filtered by participant's registered events
- Notification triggers: event updates, payment status changes, event cancellations
- Support multiple channels: Email, SMS, WhatsApp, Push
- Respect participant notification preferences

### Implementation Steps

#### 1.1 Update Notification Model
**File**: `eventflow-v3/prisma/schema.prisma`

Add `eventId` field to link notifications to specific events:
```prisma
model Notification {
  id        Int     @id @default(autoincrement())
  userId    Int
  user      User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  eventId   Int?    // NEW: Link to event
  event     Event?  @relation(fields: [eventId], references: [id], onDelete: SetNull)
  
  type      String
  message   String
  channel   String
  read      Boolean @default(false)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([userId, eventId]) // NEW: Index for queries
}

model Event {
  // ... existing fields
  notifications Notification[] // NEW: Add this relation
}
```

#### 1.2 Create Participant Notifications API
**File**: `eventflow-v3/app/api/participants/notifications/route.ts` (NEW)

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

    const userId = parseInt(session.user.id);

    // Get participant's registered events
    const participantEvents = await prisma.participant.findMany({
      where: { userId },
      select: { eventId: true }
    });

    const eventIds = participantEvents.map(p => p.eventId);

    // Fetch notifications for those events only
    const notifications = await prisma.notification.findMany({
      where: {
        userId,
        eventId: { in: eventIds }
      },
      include: { event: true },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Error fetching participant notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}
```

#### 1.3 Create Notification Trigger Service
**File**: `eventflow-v3/lib/participant-notifications.ts` (NEW)

```typescript
import { prisma } from '@/lib/db';

export async function notifyParticipantsOfEventUpdate(
  eventId: number,
  updateType: 'date_changed' | 'location_changed' | 'cancelled' | 'announcement',
  message: string,
  channel: 'Email' | 'SMS' | 'WhatsApp' | 'Push' = 'Push'
) {
  try {
    // Get all confirmed participants for this event
    const participants = await prisma.participant.findMany({
      where: {
        eventId,
        status: 'Confirmé'
      },
      include: { user: true }
    });

    // Create notification for each participant
    const notifications = await Promise.all(
      participants.map(p =>
        prisma.notification.create({
          data: {
            userId: p.userId,
            eventId,
            type: updateType === 'cancelled' ? 'alert' : 'info',
            message,
            channel,
            read: false
          }
        })
      )
    );

    return notifications;
  } catch (error) {
    console.error('Error notifying participants:', error);
    throw error;
  }
}

export async function notifyParticipantPaymentStatusChange(
  participantId: number,
  eventId: number,
  paymentStatus: string,
  amount: number
) {
  try {
    const participant = await prisma.participant.findUnique({
      where: { id: participantId },
      include: { user: true, event: true }
    });

    if (!participant) return;

    const message = `Paiement pour ${participant.event.name}: ${paymentStatus} - ${amount} FCFA`;

    await prisma.notification.create({
      data: {
        userId: participant.userId,
        eventId,
        type: paymentStatus === 'Payé' ? 'success' : 'alert',
        message,
        channel: 'Push',
        read: false
      }
    });
  } catch (error) {
    console.error('Error notifying payment status:', error);
    throw error;
  }
}
```

#### 1.4 Update Event API to Trigger Notifications
**File**: `eventflow-v3/app/api/events/[id]/route.ts`

When event is updated, call notification service:
```typescript
import { notifyParticipantsOfEventUpdate } from '@/lib/participant-notifications';

// In PUT handler, after updating event:
if (updatedEvent.status === 'Annulé') {
  await notifyParticipantsOfEventUpdate(
    eventId,
    'cancelled',
    `L'événement ${updatedEvent.name} a été annulé`
  );
}
```

---

## Task 2: Participant Budget Tab - Ticket Summary

### Objective
Display ONLY tickets purchased by the participant with total amounts per ticket and event grouping.

### Requirements
- Show only participant's purchased tickets
- Display: event name, ticket amount, payment status, purchase date
- Group tickets by event
- Calculate total spent
- Hide organizer budget information

### Implementation Steps

#### 2.1 Create Participant Tickets API
**File**: `eventflow-v3/app/api/participants/tickets/route.ts` (NEW)

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

    const userId = parseInt(session.user.id);

    // Get participant's tickets
    const tickets = await prisma.participant.findMany({
      where: { userId },
      include: {
        event: {
          select: {
            id: true,
            name: true,
            date: true,
            location: true
          }
        },
        payments: true
      }
    });

    // Group by event
    const groupedTickets = tickets.reduce((acc, ticket) => {
      const eventId = ticket.event.id;
      
      if (!acc[eventId]) {
        acc[eventId] = {
          eventId,
          eventName: ticket.event.name,
          eventDate: ticket.event.date,
          eventLocation: ticket.event.location,
          tickets: [],
          totalAmount: 0
        };
      }

      acc[eventId].tickets.push({
        ticketId: ticket.id,
        amount: ticket.amount,
        paymentStatus: ticket.paymentStatus,
        purchaseDate: ticket.createdAt,
        qrCode: ticket.qrCode
      });

      acc[eventId].totalAmount += ticket.amount;
      return acc;
    }, {} as Record<number, any>);

    const result = {
      tickets: Object.values(groupedTickets),
      totalSpent: tickets.reduce((sum, t) => sum + t.amount, 0),
      ticketCount: tickets.length
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching participant tickets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
}
```

#### 2.2 Create Participant Budget Page
**File**: `eventflow-v3/app/participant/budget/page.tsx` (NEW)

```typescript
"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import { Wallet, Receipt, AlertCircle } from "lucide-react";

interface Ticket {
  ticketId: number;
  amount: number;
  paymentStatus: string;
  purchaseDate: string;
  qrCode: string;
}

interface EventTickets {
  eventId: number;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  tickets: Ticket[];
  totalAmount: number;
}

interface TicketsData {
  tickets: EventTickets[];
  totalSpent: number;
  ticketCount: number;
}

export default function ParticipantBudgetPage() {
  const [data, setData] = useState<TicketsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch("/api/participants/tickets");
        if (response.ok) {
          const ticketsData = await response.json();
          setData(ticketsData);
        }
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <p style={{ color: "#94a3b8" }}>Chargement...</p>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#f8fafc", minHeight: "100vh" }}>
      <Header title="Mes Tickets" subtitle="Résumé de vos achats de tickets" />

      <div style={{ padding: "28px", display: "flex", flexDirection: "column", gap: 28 }}>
        {/* STATS CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 18 }}>
          <div style={{ background: "#fff", borderRadius: 24, padding: 24, border: "1px solid #f1f5f9" }}>
            <div style={{ width: 52, height: 52, borderRadius: 18, background: "#f9731615", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
              <Wallet size={22} color="#f97316" />
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>
              {data?.ticketCount || 0}
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>Tickets achetés</div>
          </div>

          <div style={{ background: "#fff", borderRadius: 24, padding: 24, border: "1px solid #f1f5f9" }}>
            <div style={{ width: 52, height: 52, borderRadius: 18, background: "#ea580c15", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
              <Receipt size={22} color="#ea580c" />
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>
              {((data?.totalSpent || 0) / 1000).toFixed(0)}k
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>Total dépensé</div>
          </div>
        </div>

        {/* TICKETS BY EVENT */}
        {data && data.tickets.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {data.tickets.map((eventTickets) => (
              <div key={eventTickets.eventId} style={{ background: "#fff", borderRadius: 28, border: "1px solid #f1f5f9", padding: 28 }}>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>
                  {eventTickets.eventName}
                </h3>
                <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 20 }}>
                  {eventTickets.eventDate} • {eventTickets.eventLocation}
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                  {eventTickets.tickets.map((ticket) => (
                    <div key={ticket.ticketId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16, background: "#f8fafc", borderRadius: 16 }}>
                      <div>
                        <div style={{ fontWeight: 600, color: "#111827", marginBottom: 4 }}>
                          Ticket #{ticket.ticketId}
                        </div>
                        <div style={{ fontSize: 13, color: "#94a3b8" }}>
                          {new Date(ticket.purchaseDate).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: "#f97316", marginBottom: 4 }}>
                          {(ticket.amount / 1000).toFixed(0)}k FCFA
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: ticket.paymentStatus === 'Payé' ? '#22c55e' : '#f59e0b' }}>
                          {ticket.paymentStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 600, color: "#111827" }}>Total pour cet événement</span>
                  <span style={{ fontSize: 20, fontWeight: 800, color: "#f97316" }}>
                    {(eventTickets.totalAmount / 1000).toFixed(0)}k FCFA
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ background: "#fff", borderRadius: 28, border: "1px solid #f1f5f9", padding: 40, textAlign: "center" }}>
            <AlertCircle size={48} color="#94a3b8" style={{ margin: "0 auto 16px" }} />
            <p style={{ color: "#94a3b8", fontSize: 16 }}>Aucun ticket acheté pour le moment</p>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## Task 3: Participant Reports Tab - Event History with PDF Download

### Objective
Display all past events attended by participant with ability to download PDF reports.

### Requirements
- Show only completed events where participant attended
- Display: event name, date, time, location, attendance status
- Provide PDF download for each event
- PDF includes: event details, date, time, location, organizer name, attendance confirmation
- Sort by date (most recent first)

### Implementation Steps

#### 3.1 Create Participant Reports API
**File**: `eventflow-v3/app/api/participants/reports/route.ts` (NEW)

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

    const userId = parseInt(session.user.id);

    // Get completed events where participant attended
    const reports = await prisma.participant.findMany({
      where: {
        userId,
        event: { status: 'Terminé' }
      },
      include: {
        event: {
          include: {
            user: {
              select: { name: true, email: true }
            }
          }
        }
      },
      orderBy: {
        event: { date: 'desc' }
      }
    });

    const formattedReports = reports.map(r => ({
      eventId: r.event.id,
      eventName: r.event.name,
      date: r.event.date,
      location: r.event.location,
      description: r.event.description,
      organizerName: r.event.user.name,
      organizerEmail: r.event.user.email,
      attendanceStatus: r.status,
      participantName: r.name,
      participantEmail: r.email
    }));

    return NextResponse.json(formattedReports);
  } catch (error) {
    console.error('Error fetching participant reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}
```

#### 3.2 Create PDF Download API
**File**: `eventflow-v3/app/api/participants/reports/[eventId]/download/route.ts` (NEW)

```typescript
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';

export async function GET(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const eventId = parseInt(params.eventId);

    // Verify participant attended this event
    const participation = await prisma.participant.findFirst({
      where: {
        userId,
        eventId,
        event: { status: 'Terminé' }
      },
      include: {
        event: {
          include: {
            user: { select: { name: true } }
          }
        }
      }
    });

    if (!participation) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Generate PDF
    const doc = new PDFDocument();
    const buffers: Buffer[] = [];

    doc.on('data', (chunk) => buffers.push(chunk));

    // Header
    doc.fontSize(24).font('Helvetica-Bold').text('EventFlow', 50, 50);
    doc.fontSize(12).font('Helvetica').text('Rapport d\'événement', 50, 80);

    // Event Details
    doc.fontSize(16).font('Helvetica-Bold').text(participation.event.name, 50, 120);
    doc.fontSize(11).font('Helvetica').text(`Date: ${participation.event.date}`, 50, 145);
    doc.text(`Lieu: ${participation.event.location}`, 50, 165);
    doc.text(`Organisateur: ${participation.event.user.name}`, 50, 185);

    // Attendance Confirmation
    doc.fontSize(14).font('Helvetica-Bold').text('Confirmation de participation', 50, 230);
    doc.fontSize(11).font('Helvetica').text(`Participant: ${participation.name}`, 50, 255);
    doc.text(`Email: ${participation.email}`, 50, 275);
    doc.text(`Statut: ${participation.status}`, 50, 295);

    // Description
    if (participation.event.description) {
      doc.fontSize(12).font('Helvetica-Bold').text('Description', 50, 330);
      doc.fontSize(10).font('Helvetica').text(participation.event.description, 50, 350, { width: 500 });
    }

    // Footer
    doc.fontSize(9).font('Helvetica').text(
      `Généré le ${new Date().toLocaleDateString('fr-FR')}`,
      50,
      750
    );

    doc.end();

    return new Promise((resolve) => {
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(
          new NextResponse(pdfBuffer, {
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': `attachment; filename="EventFlow_Report_${participation.event.name}_${participation.event.date}.pdf"`
            }
          })
        );
      });
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
```

#### 3.3 Create Participant Reports Page
**File**: `eventflow-v3/app/participant/reports/page.tsx` (NEW)

```typescript
"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import { Download, Calendar, MapPin, User, AlertCircle } from "lucide-react";

interface Report {
  eventId: number;
  eventName: string;
  date: string;
  location: string;
  description: string;
  organizerName: string;
  attendanceStatus: string;
}

export default function ParticipantReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<number | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch("/api/participants/reports");
        if (response.ok) {
          const reportsData = await response.json();
          setReports(reportsData);
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleDownload = async (eventId: number, eventName: string) => {
    setDownloading(eventId);
    try {
      const response = await fetch(`/api/participants/reports/${eventId}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `EventFlow_Report_${eventName}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Error downloading report:", error);
    } finally {
      setDownloading(null);
    }
  };

  if (loading) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <p style={{ color: "#94a3b8" }}>Chargement...</p>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#f8fafc", minHeight: "100vh" }}>
      <Header title="Mes Rapports" subtitle="Historique des événements auxquels vous avez participé" />

      <div style={{ padding: "28px", display: "flex", flexDirection: "column", gap: 20 }}>
        {reports.length > 0 ? (
          reports.map((report) => (
            <div key={report.eventId} style={{ background: "#fff", borderRadius: 28, border: "1px solid #f1f5f9", padding: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>
                    {report.eventName}
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#64748b" }}>
                      <Calendar size={16} />
                      <span>{report.date}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#64748b" }}>
                      <MapPin size={16} />
                      <span>{report.location}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#64748b" }}>
                      <User size={16} />
                      <span>Organisateur: {report.organizerName}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDownload(report.eventId, report.eventName)}
                  disabled={downloading === report.eventId}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "#f97316",
                    color: "#fff",
                    border: "none",
                    borderRadius: 12,
                    padding: "12px 20px",
                    fontWeight: 600,
                    cursor: downloading === report.eventId ? "not-allowed" : "pointer",
                    opacity: downloading === report.eventId ? 0.6 : 1
                  }}
                >
                  <Download size={18} />
                  {downloading === report.eventId ? "Téléchargement..." : "Télécharger"}
                </button>
              </div>

              {report.description && (
                <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 16 }}>
                  <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6 }}>
                    {report.description}
                  </p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div style={{ background: "#fff", borderRadius: 28, border: "1px solid #f1f5f9", padding: 40, textAlign: "center" }}>
            <AlertCircle size={48} color="#94a3b8" style={{ margin: "0 auto 16px" }} />
            <p style={{ color: "#94a3b8", fontSize: 16 }}>Aucun rapport disponible pour le moment</p>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## Task 4: Update Participant Dashboard Layout

### Objective
Update the participant dashboard to include all new tabs and remove organizer-specific tabs.

### Implementation Steps

#### 4.1 Update Participant Layout
**File**: `eventflow-v3/app/participant/_layout.tsx` (NEW or UPDATE)

Ensure tabs include:
- News Feed (Actualité)
- Events (Événements)
- Budget (Mes Tickets)
- Reports (Mes Rapports)

Remove:
- Participants tab
- Organizer-specific features

---

## Task 5: Database Migration

### Objective
Create migration for new Notification model changes.

### Implementation Steps

#### 5.1 Create Migration
**File**: `eventflow-v3/prisma/migrations/[timestamp]_add_participant_notifications/migration.sql`

```sql
-- Add eventId to Notification table
ALTER TABLE "Notification" ADD COLUMN "eventId" INTEGER;

-- Add foreign key constraint
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Create index for queries
CREATE INDEX "Notification_userId_eventId_idx" ON "Notification"("userId", "eventId");
```

#### 5.2 Run Migration
```bash
cd eventflow-v3
npx prisma migrate deploy
npx prisma generate
```

---

## Testing Checklist

### Notifications
- [ ] Participant receives notification when event is updated
- [ ] Participant receives notification when payment status changes
- [ ] Participant does NOT receive notifications for events they're not attending
- [ ] Notifications are filtered by participant ID

### Budget Tab
- [ ] Only participant's tickets are displayed
- [ ] Tickets are grouped by event
- [ ] Total amount per event is calculated correctly
- [ ] Total spent across all events is calculated correctly
- [ ] Payment status is displayed correctly

### Reports Tab
- [ ] Only completed events are shown
- [ ] Events are sorted by date (most recent first)
- [ ] PDF download works correctly
- [ ] PDF contains all required information
- [ ] PDF filename is formatted correctly

### Integration
- [ ] All three features work together seamlessly
- [ ] No data leakage between participants
- [ ] Performance is acceptable (< 2 seconds for dashboard load)

