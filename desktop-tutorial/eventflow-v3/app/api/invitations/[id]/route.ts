import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { notifyUser } from '@/lib/notifications';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { status } = await req.json();
    if (!['accepted', 'declined'].includes(status)) {
      return NextResponse.json({ error: 'Status invalide' }, { status: 400 });
    }

    const invitation = await prisma.invitation.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        event:    { select: { name: true } },
        toUser:   { select: { name: true, email: true, phone: true } },
        fromUser: { select: { name: true, email: true, phone: true } },
      },
    });

    if (!invitation || invitation.toUserId !== parseInt(session.user.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updated = await prisma.invitation.update({
      where: { id: parseInt(params.id) },
      data:  { status },
    });

    const notifMessage = status === 'accepted'
      ? `${invitation.toUser.name} a accepte votre invitation pour "${invitation.event.name}"`
      : `${invitation.toUser.name} a decline votre invitation pour "${invitation.event.name}"`;

    // Notification en base pour l'expéditeur
    await prisma.notification.create({
      data: {
        userId:  invitation.fromUserId,
        type:    status === 'accepted' ? 'success' : 'alert',
        message: notifMessage,
        channel: 'Push',
        read:    false,
      },
    });

    // Notifications multicanal pour l'expéditeur
    await notifyUser({
      email:   invitation.fromUser.email,
      phone:   invitation.fromUser.phone,
      message: notifMessage,
      subject: `Reponse a votre invitation — ${invitation.event.name}`,
      channels: ['Email', 'SMS', 'WhatsApp', 'Push'],
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Invitation response error:', error);
    return NextResponse.json({ error: 'Failed to update invitation' }, { status: 500 });
  }
}
