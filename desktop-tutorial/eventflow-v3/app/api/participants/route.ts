import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('eventId');

    const where: any = {};
    if (eventId) {
      where.eventId = parseInt(eventId);
    }

    const participants = await prisma.participant.findMany({
      where,
      include: {
        event: true,
        payments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(participants);
  } catch (error) {
    console.error('Error fetching participants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch participants' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { eventId, name, email, phone, status, paymentStatus, amount, qrCode } =
      body;

    if (!eventId || !name || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify event ownership
    const event = await prisma.event.findUnique({
      where: { id: parseInt(eventId) },
    });

    if (!event || event.userId !== parseInt(session.user.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const participant = await prisma.participant.create({
      data: {
        eventId: parseInt(eventId),
        name,
        email,
        phone: phone || '',
        status: status || 'En attente',
        paymentStatus: paymentStatus || 'En attente',
        amount: amount || 0,
        ...(qrCode && { qrCode }), // Only include qrCode if provided
      },
    });

    return NextResponse.json(participant, { status: 201 });
  } catch (error) {
    console.error('Error creating participant:', error);
    return NextResponse.json(
      { error: 'Failed to create participant' },
      { status: 500 }
    );
  }
}
