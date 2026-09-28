import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const existing = await prisma.serviceOffer.findUnique({ where: { id: parseInt(params.id) } });
    if (!existing || existing.userId !== parseInt(session.user.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const offer = await prisma.serviceOffer.update({
      where: { id: parseInt(params.id) },
      data: {
        ...(body.title       && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.category    && { category: body.category }),
        ...(body.price       !== undefined && { price: parseFloat(body.price) }),
        ...(body.priceUnit   && { priceUnit: body.priceUnit }),
        ...(body.available   !== undefined && { available: body.available }),
      },
      include: { prestations: true },
    });

    return NextResponse.json(offer);
  } catch {
    return NextResponse.json({ error: 'Failed to update offer' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const existing = await prisma.serviceOffer.findUnique({ where: { id: parseInt(params.id) } });
    if (!existing || existing.userId !== parseInt(session.user.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.serviceOffer.delete({ where: { id: parseInt(params.id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete offer' }, { status: 500 });
  }
}
