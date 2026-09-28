import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(session.user.id);

    // Get completed events where participant attended
    const reports = await prisma.participant.findMany({
      where: {
        userId,
        event: { status: 'Terminé' }
      },
      include: {
        event: {
          include: {
            user: {
              select: { name: true, email: true }
            }
          }
        }
      },
      orderBy: {
        event: { date: 'desc' }
      }
    });

    const formattedReports = reports.map(r => ({
      eventId: r.event.id,
      eventName: r.event.name,
      date: r.event.date,
      location: r.event.location,
      description: r.event.description,
      organizerName: r.event.user.name,
      organizerEmail: r.event.user.email,
      attendanceStatus: r.status,
      participantName: r.name,
      participantEmail: r.email
    }));

    return NextResponse.json(formattedReports);
  } catch (error) {
    console.error('Error fetching participant reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}
