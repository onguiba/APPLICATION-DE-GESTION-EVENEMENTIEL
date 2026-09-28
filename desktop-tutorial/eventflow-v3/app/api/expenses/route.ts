import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('eventId');

    const where: any = {};
    if (eventId) {
      where.eventId = parseInt(eventId);
    }

    const expenses = await prisma.expense.findMany({
      where,
      include: {
        event: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch expenses' },
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
    const { eventId, category, description, amount, date } = body;

    if (!eventId || !category || !amount || !date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const expense = await prisma.expense.create({
      data: {
        eventId: parseInt(eventId),
        category,
        description: description || '',
        amount,
        date,
      },
      include: {
        event: true,
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId: parseInt(session.user.id),
        type: 'info',
        message: `Dépense ajoutée: ${category} - ${amount} FCFA pour ${expense.event.name}`,
        channel: 'Push',
        read: false,
      },
    });

    // Check if budget is exceeded
    const budget = await prisma.budget.findUnique({
      where: { eventId: parseInt(eventId) },
    });

    if (budget) {
      const totalExpenses = await prisma.expense.aggregate({
        where: { eventId: parseInt(eventId) },
        _sum: { amount: true },
      });

      const spent = totalExpenses._sum.amount || 0;

      if (spent > budget.totalAmount) {
        await prisma.notification.create({
          data: {
            userId: parseInt(session.user.id),
            type: 'alert',
            message: `⚠️ Budget dépassé pour ${expense.event.name}: ${spent} FCFA dépensés sur ${budget.totalAmount} FCFA`,
            channel: 'Push',
            read: false,
          },
        });
      }
    }

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json(
      { error: 'Failed to create expense' },
      { status: 500 }
    );
  }
}
