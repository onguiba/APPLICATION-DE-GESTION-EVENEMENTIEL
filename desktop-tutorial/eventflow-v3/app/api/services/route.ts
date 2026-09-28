import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// Validation helper
function validateServiceData(data: any) {
  const errors: string[] = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push('Le nom de l\'offre est requis');
  }

  if (!data.description || typeof data.description !== 'string' || data.description.trim().length === 0) {
    errors.push('La description est requise');
  }

  if (typeof data.price !== 'number' || data.price < 0) {
    errors.push('Le prix doit être un nombre positif');
  }

  if (!Array.isArray(data.servicesIncluded) || data.servicesIncluded.length === 0) {
    errors.push('Au moins un service inclus est requis');
  }

  if (data.servicesIncluded.some((s: any) => typeof s !== 'string' || s.trim().length === 0)) {
    errors.push('Tous les services inclus doivent être des textes non vides');
  }

  return errors;
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    const where: any = {};
    if (userId) {
      where.userId = parseInt(userId);
    } else {
      where.userId = parseInt(session.user.id);
    }

    const services = await prisma.service.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, price, servicesIncluded, category } = body;

    // Validation
    const validationErrors = validateServiceData({
      name,
      description,
      price,
      servicesIncluded,
    });

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validationErrors 
        },
        { status: 400 }
      );
    }

    // Create service
    const service = await prisma.service.create({
      data: {
        userId: parseInt(session.user.id),
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price),
        servicesIncluded: JSON.stringify(servicesIncluded),
        category: category || null,
        status: 'Actif',
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  }
}
