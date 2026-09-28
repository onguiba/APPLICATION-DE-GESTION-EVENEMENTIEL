import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: parseInt(session.user.id) },
      select: { email: true },
    });

    if (!user) return NextResponse.json([], { status: 200 });

    const participants = await prisma.participant.findMany({
      where: { email: user.email },
      include: {
        event: {
          include: {
            user:         { select: { name: true } },
            participants: { select: { id: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const reports = participants.map(p => ({
      participantId:     p.id,
      eventId:           p.event.id,
      eventName:         p.event.name,
      eventDate:         p.event.date,
      eventLocation:     p.event.location,
      eventType:         p.event.type,
      eventDescription:  p.event.description,
      eventCapacity:     p.event.capacity,
      organizerName:     p.event.user.name,
      participantStatus: p.status,
      paymentStatus:     p.paymentStatus,
      amount:            p.amount,
      participantCount:  p.event.participants.length,
      joinedAt:          p.createdAt,
    }));

    return NextResponse.json(reports);
  } catch (error) {
    console.error('my-reports error:', error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}
