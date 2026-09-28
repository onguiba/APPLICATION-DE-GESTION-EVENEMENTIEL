import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// GET — mes offres + toutes les offres publiques
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const mine = searchParams.get('mine') === 'true';

    const offers = await prisma.serviceOffer.findMany({
      where: mine ? { userId: parseInt(session.user.id) } : { available: true },
      include: {
        user:        { select: { id: true, name: true, email: true, phone: true } },
        prestations: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(offers);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch offers' }, { status: 500 });
  }
}

// POST — créer une offre
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { title, description, category, price, priceUnit, prestations } = body;

    if (!title || !category || price === undefined) {
      return NextResponse.json({ error: 'Titre, categorie et prix requis' }, { status: 400 });
    }

    const offer = await prisma.serviceOffer.create({
      data: {
        userId:      parseInt(session.user.id),
        title,
        description: description || '',
        category,
        price:       parseFloat(price),
        priceUnit:   priceUnit || 'forfait',
        available:   true,
        prestations: {
          create: (prestations || []).map((p: any) => ({
            name:        p.name,
            description: p.description || '',
            price:       parseFloat(p.price) || 0,
          })),
        },
      },
      include: { user: { select: { id: true, name: true } }, prestations: true },
    });

    // Notification
    await prisma.notification.create({
      data: {
        userId:  parseInt(session.user.id),
        type:    'success',
        message: `Votre offre "${title}" a ete publiee avec succes`,
        channel: 'Push',
        read:    false,
      },
    });

    return NextResponse.json(offer, { status: 201 });
  } catch (error) {
    console.error('Create offer error:', error);
    return NextResponse.json({ error: 'Failed to create offer' }, { status: 500 });
  }
}
