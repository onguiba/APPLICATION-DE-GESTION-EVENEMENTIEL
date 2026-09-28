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

    const payments = await prisma.payment.findMany({
      where,
      include: {
        participant: true,
        event: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
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
    const { participantId, eventId, amount, method, reference, status } = body;

    if (!participantId || !eventId || !amount || !method || !reference) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const payment = await prisma.payment.create({
      data: {
        participantId: parseInt(participantId),
        eventId: parseInt(eventId),
        amount,
        method,
        reference,
        status: status || 'pending',
      },
      include: {
        participant: true,
        event: true,
      },
    });

    // Create notification
    if (status === 'completed') {
      await prisma.notification.create({
        data: {
          userId: parseInt(session.user.id),
          type: 'success',
          message: `Paiement reçu de ${payment.participant.name} pour ${amount} FCFA - Événement: ${payment.event.name}`,
          channel: 'Push',
          read: false,
        },
      });
    }

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}
