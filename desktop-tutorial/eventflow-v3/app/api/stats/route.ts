import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Compter les événements
    const totalEvents = await prisma.event.count();

    // Compter les utilisateurs actifs
    const totalUsers = await prisma.user.count();

    // Calculer le total des paiements
    const payments = await prisma.payment.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        status: 'completed',
      },
    });

    const totalPayments = payments._sum.amount || 0;

    // Calculer la satisfaction (basée sur les paiements réussis vs total)
    const totalPaymentsAttempted = await prisma.payment.count();
    const completedPayments = await prisma.payment.count({
      where: { status: 'completed' },
    });

    const satisfactionRate =
      totalPaymentsAttempted > 0
        ? Math.round((completedPayments / totalPaymentsAttempted) * 100)
        : 0;

    return Response.json({
      events: totalEvents,
      users: totalUsers,
      payments: totalPayments,
      satisfaction: satisfactionRate,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return Response.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
