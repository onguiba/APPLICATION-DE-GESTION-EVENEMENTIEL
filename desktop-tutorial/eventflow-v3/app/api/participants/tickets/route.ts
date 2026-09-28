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
