import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(session.user.id);

    // Get participant's confirmed events (excluding draft and in progress)
    // Only show events where participant is registered (respects private event visibility)
    const participants = await prisma.participant.findMany({
      where: {
        user: {
          id: userId
        },
        status: 'Confirmé',
        event: {
          status: { notIn: ['Brouillon', 'En cours'] }
        }
      },
      include: { 
        event: {
          include: {
            budget: { include: { categories: true } },
            user: { select: { name: true, email: true } }
          }
        }
      },
      orderBy: { event: { date: 'asc' } }
    });

    const formattedEvents = participants.map(p => ({
      id: p.event.id,
      name: p.event.name,
      date: p.event.date,
      location: p.event.location,
      status: p.event.status,
      visibility: p.event.visibility,
      participantStatus: p.status,
      budget: p.event.budget,
      organizer: p.event.user
    }));

    return NextResponse.json(formattedEvents);
  } catch (error) {
    console.error('Error fetching participant events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
