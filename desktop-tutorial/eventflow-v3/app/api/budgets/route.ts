import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { prisma } = await import('@/lib/db');
    const budgets = await prisma.budget.findMany({
      include: {
        event: true,
        categories: true,
      },
    });
    return NextResponse.json(budgets);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { prisma } = await import('@/lib/db');
    const body = await req.json();
    
    const budget = await prisma.budget.create({
      data: {
        eventId: body.eventId,
        totalAmount: body.totalAmount,
        status: body.status || 'Approuvé',
        categories: {
          create: body.categories || [],
        },
      },
      include: {
        event: true,
        categories: true,
      },
    });
    
    return NextResponse.json(budget, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create budget' }, { status: 500 });
  }
}
