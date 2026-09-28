import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET — tous les événements publics (y compris les siens) pour le fil d'actualité
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const currentUserId = parseInt(session.user.id);

    const events = await prisma.event.findMany({
      where: {
        visibility: 'public',
        // Inclure TOUS les événements publics, y compris les siens
      },
      include: {
        user:         { select: { id: true, name: true, email: true, accountType: true } },
        participants: { select: { id: true, email: true } },
        invitations:  {
          where: {
            fromUserId: currentUserId,
          },
          select: { id: true, status: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Enrichir chaque événement avec le statut de participation de l'utilisateur courant
    const user = await prisma.user.findUnique({
      where: { id: currentUserId },
      select: { email: true },
    });

    const enriched = events.map(ev => {
      const isOwner = ev.userId === currentUserId;
      const myParticipation = user
        ? ev.participants.find((p: { id: number; email: string }) => p.email === user.email)
        : null;

      return {
        ...ev,
        isOwner,
        myParticipation: myParticipation ? { id: myParticipation.id } : null,
        participants: ev.participants.map((p: { id: number; email: string }) => ({ id: p.id })),
      };
    });

    return NextResponse.json(enriched);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch public events' }, { status: 500 });
  }
}
