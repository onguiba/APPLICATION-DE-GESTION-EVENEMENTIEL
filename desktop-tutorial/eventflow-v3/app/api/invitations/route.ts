import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { notifyUser } from '@/lib/notifications';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const invitations = await prisma.invitation.findMany({
      where: { toUserId: parseInt(session.user.id) },
      include: {
        fromUser: { select: { id: true, name: true, email: true, accountType: true } },
        event:    { select: { id: true, name: true, date: true, location: true, type: true, capacity: true, budgetAmount: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(invitations);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch invitations' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { toUserId, eventId, message } = body;

    if (!toUserId || !eventId) {
      return NextResponse.json({ error: 'toUserId et eventId requis' }, { status: 400 });
    }

    // Vérifier que l'événement appartient à l'expéditeur
    const event = await prisma.event.findUnique({ where: { id: parseInt(eventId) } });
    if (!event || event.userId !== parseInt(session.user.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Vérifier que le destinataire existe
    const toUser = await prisma.user.findUnique({ where: { id: parseInt(toUserId) } });
    if (!toUser) return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });

    // Récupérer l'expéditeur
    const sender = await prisma.user.findUnique({ where: { id: parseInt(session.user.id) } });

    // Créer l'invitation
    const invitation = await prisma.invitation.create({
      data: {
        fromUserId: parseInt(session.user.id),
        toUserId:   parseInt(toUserId),
        eventId:    parseInt(eventId),
        message:    message || '',
        status:     'pending',
      },
      include: {
        fromUser: { select: { id: true, name: true, email: true } },
        event:    { select: { id: true, name: true, date: true, location: true } },
      },
    });

    const notifMessage = `${sender?.name} vous invite a collaborer sur "${event.name}"${message ? ` — "${message}"` : ''}`;

    // Créer la notification en base
    await prisma.notification.create({
      data: {
        userId:       parseInt(toUserId),
        type:         'info',
        message:      notifMessage,
        channel:      'Push',
        read:         false,
        invitationId: invitation.id,
      },
    });

    // Envoyer notifications multicanal (Email + WhatsApp + SMS)
    await notifyUser({
      email:   toUser.email,
      phone:   toUser.phone,
      message: notifMessage,
      subject: `Invitation de collaboration — ${event.name}`,
      channels: ['Email', 'SMS', 'WhatsApp', 'Push'],
    });

    return NextResponse.json(invitation, { status: 201 });
  } catch (error) {
    console.error('Invitation error:', error);
    return NextResponse.json({ error: 'Failed to send invitation' }, { status: 500 });
  }
}
