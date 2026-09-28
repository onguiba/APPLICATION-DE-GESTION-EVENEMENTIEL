import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ qrCode: string }> }
) {
  try {
    const { qrCode } = await params;
    const { searchParams } = new URL(req.url);
    const eventLink = searchParams.get('eventLink');

    if (!qrCode || !eventLink) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Find all events and filter by uniqueLink
    const events = await prisma.event.findMany({
      where: {},
    });
    
    const event = events.find((e: any) => e.uniqueLink === eventLink);

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Find participant by QR code and event ID
    const participants = await prisma.participant.findMany({
      where: {
        eventId: event.id,
      },
    });
    
    const participant = participants.find((p: any) => p.qrCode === qrCode);

    if (!participant) {
      return NextResponse.json(
        { error: 'Participant not found' },
        { status: 404 }
      );
    }

    // Get total participants for this event
    const totalParticipants = participants.length;

    return NextResponse.json({
      participantId: participant.id,
      participantName: participant.name,
      participantEmail: participant.email,
      eventId: event.id,
      eventName: event.name,
      eventDate: event.date,
      eventLocation: event.location,
      eventCapacity: event.capacity,
      eventType: event.type,
      eventDescription: event.description,
      participantStatus: participant.status,
      paymentStatus: participant.paymentStatus,
      amount: participant.amount,
      totalParticipants,
    });
  } catch (error) {
    console.error('Error fetching participant access:', error);
    return NextResponse.json(
      { error: 'Failed to fetch participant data' },
      { status: 500 }
    );
  }
}
