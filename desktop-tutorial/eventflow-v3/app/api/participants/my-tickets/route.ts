import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

// Retourne tous les tickets (participations) de l'utilisateur connecté
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Trouver les participations liées à l'email de l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: parseInt(session.user.id) },
      select: { email: true },
    });

    if (!user) return NextResponse.json([], { status: 200 });

    const participants = await prisma.participant.findMany({
      where: { email: user.email },
      include: {
        event: {
          select: {
            id: true, name: true, date: true, location: true,
            status: true, type: true, capacity: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const tickets = participants.map(p => ({
      participantId: p.id,
      eventId:       p.event.id,
      eventName:     p.event.name,
      eventDate:     p.event.date,
      eventLocation: p.event.location,
      status:        p.status,
      paymentStatus: p.paymentStatus,
      amount:        p.amount,
      createdAt:     p.createdAt,
    }));

    return NextResponse.json(tickets);
  } catch (error) {
    console.error('my-tickets error:', error);
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 });
  }
}
