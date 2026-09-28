import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const providerId = parseInt(session.user.id);
    const { name, paymentStatus, eventId, dateFrom, dateTo } = Object.fromEntries(
      req.nextUrl.searchParams
    );

    // Get provider's service offers to determine which events they work on
    const providerOffers = await prisma.serviceOffer.findMany({
      where: { providerId }
    });

    // For now, get all participants (TODO: Filter by provider's accepted offers)
    // In the future, we'll need an OfferAcceptance model to track which offers are accepted
    const participants = await prisma.participant.findMany({
      where: {
        name: name ? { contains: name, mode: 'insensitive' } : undefined,
        paymentStatus: paymentStatus || undefined,
        eventId: eventId ? parseInt(eventId) : undefined,
        event: {
          // Only show participants from non-private events or private events where provider has accepted offer
          visibility: 'public' // For now, only show public events
        }
      },
      include: {
        event: {
          include: { budget: { include: { categories: true } } }
        },
        payments: true
      },
      orderBy: { createdAt: 'desc' }
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
