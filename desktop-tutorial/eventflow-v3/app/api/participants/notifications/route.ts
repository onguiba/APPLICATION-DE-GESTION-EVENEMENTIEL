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
