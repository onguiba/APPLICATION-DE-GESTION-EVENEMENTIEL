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

    const participant = await prisma.participant.findUnique({
      where: { id: parseInt(id) },
      include: {
        event: true,
      },
    });

    if (!participant) {
      return NextResponse.json({ error: 'Participant not found' }, { status: 404 });
    }

    if (participant.event.userId !== parseInt(session.user.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const participantLink = `${baseUrl}/events/${participant.event.uniqueLink}/participant/${participant.qrCode}`;

    return NextResponse.json({
      participantId: participant.id,
      participantName: participant.name,
      participantEmail: participant.email,
      eventId: participant.eventId,
      eventName: participant.event.name,
      qrCode: participant.qrCode,
      accessLink: participantLink,
      qrCodeData: participantLink,
    });
  } catch (error) {
    console.error('Error fetching participant QR:', error);
    return NextResponse.json(
      { error: 'Failed to fetch participant QR' },
      { status: 500 }
    );
  }
}
