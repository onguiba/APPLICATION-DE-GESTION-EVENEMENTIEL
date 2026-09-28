import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(session.user.id);

    // Create test notifications
    const notifications = await Promise.all([
      prisma.notification.create({
        data: {
          userId,
          type: 'info',
          message: 'Nouvelle offre de service reçue pour votre événement',
          channel: 'Push',
          read: false,
        },
      }),
      prisma.notification.create({
        data: {
          userId,
          type: 'success',
          message: 'Paiement reçu de 50 participants',
          channel: 'Push',
          read: false,
        },
      }),
      prisma.notification.create({
        data: {
          userId,
          type: 'alert',
          message: 'Budget dépassé pour la catégorie Catering',
          channel: 'Push',
          read: false,
        },
      }),
    ]);

    return NextResponse.json(notifications, { status: 201 });
  } catch (error) {
    console.error('Error creating test notifications:', error);
    return NextResponse.json(
      { error: 'Failed to create test notifications' },
      { status: 500 }
    );
  }
}
