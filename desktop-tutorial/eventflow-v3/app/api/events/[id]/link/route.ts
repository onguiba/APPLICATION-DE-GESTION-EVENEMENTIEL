import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    if (event.userId !== parseInt(session.user.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const eventLink = `${baseUrl}/events/${event.uniqueLink}`;

    return NextResponse.json({
      eventId: event.id,
      eventName: event.name,
      uniqueLink: event.uniqueLink,
      fullLink: eventLink,
      qrCodeData: eventLink,
    });
  } catch (error) {
    console.error('Error fetching event link:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event link' },
      { status: 500 }
    );
  }
}
