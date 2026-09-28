import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// GET: List provider's offers
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const providerId = parseInt(session.user.id);

    const offers = await prisma.serviceOffer.findMany({
      where: { providerId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(offers);
  } catch (error) {
    console.error('Error fetching offers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch offers' },
      { status: 500 }
    );
  }
}

// POST: Create new offer
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const providerId = parseInt(session.user.id);
    const { serviceType, description, price, status } = await req.json();

    if (!serviceType || !description || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const offer = await prisma.serviceOffer.create({
      data: {
        providerId,
        serviceType,
        description,
        price: parseFloat(price),
        status: status || 'Publiée'
      }
    });

    return NextResponse.json(offer, { status: 201 });
  } catch (error) {
    console.error('Error creating offer:', error);
    return NextResponse.json(
      { error: 'Failed to create offer' },
      { status: 500 }
    );
  }
}
