import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

// Registre des clients SSE connectés
const clients = new Map<string, ReadableStreamDefaultController>();

export function notifyClient(userId: string, data: object) {
  const controller = clients.get(userId);
  if (controller) {
    try {
      controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
    } catch {
      clients.delete(userId);
    }
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      // Enregistrer ce client
      clients.set(userId, {
        enqueue: (data: string) => controller.enqueue(encoder.encode(data)),
        close:   () => controller.close(),
        error:   (e: any) => controller.error(e),
      } as any);

      // Message de connexion
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'connected', userId })}\n\n`));

      // Polling toutes les 5 secondes pour les nouvelles données
      const interval = setInterval(async () => {
        try {
          const [notifications, invitations, events] = await Promise.all([
            prisma.notification.findMany({
              where: { userId: parseInt(userId), read: false },
              orderBy: { createdAt: 'desc' },
              take: 10,
            }),
            prisma.invitation.findMany({
              where: { toUserId: parseInt(userId), status: 'pending' },
              include: {
                fromUser: { select: { id: true, name: true } },
                event:    { select: { id: true, name: true, date: true } },
              },
              orderBy: { createdAt: 'desc' },
              take: 5,
            }),
            prisma.event.findMany({
              where: {
                visibility: 'public',
                // Inclure TOUS les événements publics, y compris les siens
              },
              include: {
                user:         { select: { id: true, name: true } },
                participants: { select: { id: true } },
              },
              orderBy: { createdAt: 'desc' },
              take: 20,
            }),
          ]);

          const payload = JSON.stringify({
            type:          'update',
            unreadCount:   notifications.length,
            invitations:   invitations.length,
            notifications,
            pendingInvitations: invitations,
            publicEvents:  events,
            timestamp:     new Date().toISOString(),
          });

          controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
        } catch {
          // Connexion fermée
          clearInterval(interval);
          clients.delete(userId);
        }
      }, 5000);

      // Nettoyage à la déconnexion
      return () => {
        clearInterval(interval);
        clients.delete(userId);
      };
    },
    cancel() {
      clients.delete(userId);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type':  'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection':    'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
