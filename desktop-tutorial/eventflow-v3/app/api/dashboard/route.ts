import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // For now, get data for all events (in production, filter by user)
    const events = await prisma.event.findMany({
      include: {
        budget: {
          include: {
            categories: true,
          },
        },
        participants: true,
        expenses: true,
        payments: true,
      },
    });

    // Calculate budget statistics
    const budgetStats = events.map((event) => {
      const budget = event.budget;
      if (!budget) return null;

      const totalSpent = event.expenses.reduce((sum, exp) => sum + exp.amount, 0);
      const totalBudget = budget.totalAmount;
      const percentageUsed = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
      const percentageRemaining = 100 - percentageUsed;

      return {
        eventId: event.id,
        eventName: event.name,
        totalBudget,
        totalSpent,
        percentageUsed,
        percentageRemaining,
        categories: budget.categories.map((cat) => ({
          name: cat.name,
          allocated: cat.allocatedAmount,
          spent: cat.spent,
          percentage: cat.allocatedAmount > 0 ? Math.round((cat.spent / cat.allocatedAmount) * 100) : 0,
        })),
      };
    }).filter(Boolean);

    // Calculate overall statistics
    const totalEvents = events.length;
    const totalParticipants = events.reduce((sum, e) => sum + e.participants.length, 0);
    const totalExpenses = events.reduce((sum, e) => sum + e.expenses.reduce((s, ex) => s + ex.amount, 0), 0);
    const totalBudget = events.reduce((sum, e) => sum + (e.budget?.totalAmount || 0), 0);
    const totalPayments = events.reduce((sum, e) => sum + e.payments.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0), 0);

    return NextResponse.json({
      events: totalEvents,
      participants: totalParticipants,
      totalBudget,
      totalExpenses,
      totalPayments,
      budgetStats,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
