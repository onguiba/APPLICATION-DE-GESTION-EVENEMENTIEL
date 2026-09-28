import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ link: string }> }
) {
  try {
    const { link } = await params;

    const event = await prisma.event.findUnique({
      where: { uniqueLink: link },
      include: {
        participants: true,
        budget: true,
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: event.id,
      name: event.name,
      date: event.date,
      location: event.location,
      capacity: event.capacity,
      type: event.type,
      description: event.description,
      participants: event.participants.length,
      img: event.img,
      uniqueLink: event.uniqueLink,
    });
  } catch (error) {
    console.error('Error fetching event by link:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}
