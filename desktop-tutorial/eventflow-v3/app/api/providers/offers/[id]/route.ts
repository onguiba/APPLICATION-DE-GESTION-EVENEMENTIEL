import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// PUT: Update offer
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const providerId = parseInt(session.user.id);
    const offerId = parseInt(params.id);

    // Verify ownership
    const offer = await prisma.serviceOffer.findUnique({
      where: { id: offerId }
    });

    if (!offer || offer.providerId !== providerId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { serviceType, description, price, status } = await req.json();

    const updated = await prisma.serviceOffer.update({
      where: { id: offerId },
      data: {
        serviceType: serviceType || offer.serviceType,
        description: description || offer.description,
        price: price ? parseFloat(price) : offer.price,
        status: status || offer.status
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating offer:', error);
    return NextResponse.json(
      { error: 'Failed to update offer' },
      { status: 500 }
    );
  }
}

// DELETE: Delete offer
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const providerId = parseInt(session.user.id);
    const offerId = parseInt(params.id);

    // Verify ownership
    const offer = await prisma.serviceOffer.findUnique({
      where: { id: offerId }
    });

    if (!offer || offer.providerId !== providerId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.serviceOffer.delete({
      where: { id: offerId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting offer:', error);
    return NextResponse.json(
      { error: 'Failed to delete offer' },
      { status: 500 }
    );
  }
}
