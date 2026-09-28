import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { notifyUser } from '@/lib/notifications';

/**
 * POST /api/participants/request
 * Permet à un utilisateur connecté de demander à participer à un événement public.
 * Crée un participant "En attente" et notifie l'organisateur.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { eventId } = body;

    if (!eventId) {
      return NextResponse.json({ error: 'eventId requis' }, { status: 400 });
    }

    // Récupérer l'événement et l'organisateur
    const event = await prisma.event.findUnique({
      where: { id: parseInt(eventId) },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
    });

    if (!event) {
      return NextResponse.json({ error: 'Evenement introuvable' }, { status: 404 });
    }

    // Récupérer les infos du demandeur
    const requester = await prisma.user.findUnique({
      where: { id: parseInt(session.user.id) },
      select: { id: true, name: true, email: true, phone: true },
    });

    if (!requester) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
    }

    // Vérifier si déjà inscrit
    const existing = await prisma.participant.findFirst({
      where: {
        eventId: parseInt(eventId),
        email: requester.email,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Vous etes deja inscrit a cet evenement', existing },
        { status: 409 }
      );
    }

    // Créer le participant "En attente"
    const participant = await prisma.participant.create({
      data: {
        eventId: parseInt(eventId),
        name: requester.name,
        email: requester.email,
        phone: requester.phone || '',
        status: 'En attente',
        paymentStatus: 'En attente',
        amount: 0,
      },
    });

    const notifMessage = `${requester.name} souhaite participer a votre evenement "${event.name}"`;

    // Notification en base pour l'organisateur
    await prisma.notification.create({
      data: {
        userId: event.userId,
        type: 'info',
        message: notifMessage,
        channel: 'Push',
        read: false,
      },
    });

    // Notification multicanal pour l'organisateur (Email + Push)
    await notifyUser({
      email: event.user.email,
      phone: event.user.phone,
      message: notifMessage,
      subject: `Nouvelle demande de participation — ${event.name}`,
      channels: ['Email', 'Push'],
    });

    return NextResponse.json(participant, { status: 201 });
  } catch (error) {
    console.error('Participation request error:', error);
    return NextResponse.json({ error: 'Failed to send participation request' }, { status: 500 });
  }
}

/**
 * GET /api/participants/request?eventId=X
 * Vérifie si l'utilisateur courant est déjà inscrit à un événement.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('eventId');

    if (!eventId) {
      return NextResponse.json({ error: 'eventId requis' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(session.user.id) },
      select: { email: true },
    });

    if (!user) return NextResponse.json(null);

    const participant = await prisma.participant.findFirst({
      where: {
        eventId: parseInt(eventId),
        email: user.email,
      },
    });

    return NextResponse.json(participant);
  } catch {
    return NextResponse.json({ error: 'Failed to check participation' }, { status: 500 });
  }
}
