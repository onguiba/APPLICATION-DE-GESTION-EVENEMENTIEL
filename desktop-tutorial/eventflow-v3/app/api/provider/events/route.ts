import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// GET — événements auxquels le prestataire est associé
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const providerEvents = await prisma.providerEvent.findMany({
      where: { userId: parseInt(session.user.id) },
      include: {
        event: {
          include: {
            user:         { select: { id: true, name: true, email: true } },
            participants: { select: { id: true } },
            expenses:     { select: { id: true, amount: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(providerEvents);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch provider events' }, { status: 500 });
  }
}

// POST — associer le prestataire à un événement
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { eventId, role } = await req.json();
    if (!eventId) return NextResponse.json({ error: 'eventId requis' }, { status: 400 });

    const pe = await prisma.providerEvent.upsert({
      where: { userId_eventId: { userId: parseInt(session.user.id), eventId: parseInt(eventId) } },
      update: { role: role || 'Prestataire', status: 'confirme' },
      create: { userId: parseInt(session.user.id), eventId: parseInt(eventId), role: role || 'Prestataire', status: 'confirme' },
      include: { event: { select: { name: true } } },
    });

    return NextResponse.json(pe, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to associate event' }, { status: 500 });
  }
}
