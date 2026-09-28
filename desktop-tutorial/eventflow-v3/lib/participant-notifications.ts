import { prisma } from '@/lib/db';

export async function notifyParticipantsOfEventUpdate(
  eventId: number,
  updateType: 'date_changed' | 'location_changed' | 'cancelled' | 'announcement',
  message: string,
  channel: 'Email' | 'SMS' | 'WhatsApp' | 'Push' = 'Push'
) {
  try {
    // Get all confirmed participants for this event
    const participants = await prisma.participant.findMany({
      where: {
        eventId,
        status: 'Confirmé'
      },
      include: { user: true }
    });

    // Create notification for each participant
    const notifications = await Promise.all(
      participants.map(p =>
        prisma.notification.create({
          data: {
            userId: p.userId || p.id,
            eventId,
            type: updateType === 'cancelled' ? 'alert' : 'info',
            message,
            channel,
            read: false
          }
        })
      )
    );

    return notifications;
  } catch (error) {
    console.error('Error notifying participants:', error);
    throw error;
  }
}

export async function notifyParticipantPaymentStatusChange(
  participantId: number,
  eventId: number,
  paymentStatus: string,
  amount: number
) {
  try {
    const participant = await prisma.participant.findUnique({
      where: { id: participantId },
      include: { user: true, event: true }
    });

    if (!participant) return;

    const message = `Paiement pour ${participant.event.name}: ${paymentStatus} - ${amount} FCFA`;

    await prisma.notification.create({
      data: {
        userId: participant.userId || participant.id,
        eventId,
        type: paymentStatus === 'Payé' ? 'success' : 'alert',
        message,
        channel: 'Push',
        read: false
      }
    });
  } catch (error) {
    console.error('Error notifying payment status:', error);
    throw error;
  }
}
