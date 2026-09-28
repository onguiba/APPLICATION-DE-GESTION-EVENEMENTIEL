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
    const { status, serviceType, dateFrom, dateTo } = Object.fromEntries(
      req.nextUrl.searchParams
    );

    // Get provider's service offers
    const offers = await prisma.serviceOffer.findMany({
      where: { providerId }
    });

    // For now, show all events (TODO: Add logic to filter by provider's accepted offers)
    // In the future, we'll need an OfferAcceptance model to track which offers are accepted
    const events = await prisma.event.findMany({
      where: {
        status: status || undefined,
        // Only show events that are not private, or private events where provider has accepted offer
        // For now, we'll show all events - this needs to be refined when offer acceptance is implemented
      },
      include: {
        budget: { include: { categories: true } },
        participants: true,
        user: { select: { name: true, email: true } }
      },
      orderBy: { date: 'asc' }
    });

    // Filter out private events that provider is not associated with
    const filteredEvents = events.filter(event => {
      if (event.visibility === 'private') {
        // Check if provider has an accepted offer for this event
        // TODO: Implement when OfferAcceptance model is added
        return false; // For now, hide all private events
      }
      return true;
    });

    return NextResponse.json(filteredEvents);
  } catch (error) {
    console.error('Error fetching provider events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
