// Notification service for payments, budgets, and expenses

export async function createNotification(
  userId: number,
  type: 'alert' | 'success' | 'info' | 'warning',
  message: string,
  channel: 'Email' | 'SMS' | 'WhatsApp' | 'Push' = 'Push'
) {
  try {
    const response = await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        message,
        channel,
      }),
    });

    if (!response.ok) {
      console.error('Failed to create notification');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}

export async function notifyPaymentCreated(
  participantName: string,
  amount: number,
  eventName: string
) {
  return createNotification(
    1, // userId - should be passed from context
    'success',
    `Paiement reçu de ${participantName} pour ${amount} FCFA - Événement: ${eventName}`,
    'Push'
  );
}

export async function notifyPaymentFailed(
  participantName: string,
  amount: number,
  reason: string
) {
  return createNotification(
    1,
    'alert',
    `Paiement échoué de ${participantName} (${amount} FCFA) - Raison: ${reason}`,
    'Push'
  );
}

export async function notifyBudgetExceeded(
  eventName: string,
  budgetAmount: number,
  spentAmount: number
) {
  return createNotification(
    1,
    'alert',
    `⚠️ Budget dépassé pour ${eventName}: ${spentAmount} FCFA dépensés sur ${budgetAmount} FCFA`,
    'Push'
  );
}

export async function notifyBudgetApproved(eventName: string) {
  return createNotification(
    1,
    'success',
    `✅ Budget approuvé pour l'événement: ${eventName}`,
    'Push'
  );
}

export async function notifyExpenseAdded(
  eventName: string,
  category: string,
  amount: number
) {
  return createNotification(
    1,
    'info',
    `Dépense ajoutée: ${category} - ${amount} FCFA pour ${eventName}`,
    'Push'
  );
}

export async function notifyParticipantAdded(
  participantName: string,
  eventName: string
) {
  return createNotification(
    1,
    'info',
    `Nouveau participant: ${participantName} pour ${eventName}`,
    'Push'
  );
}

export async function notifyParticipantConfirmed(
  participantName: string,
  eventName: string
) {
  return createNotification(
    1,
    'success',
    `Participation confirmée: ${participantName} pour ${eventName}`,
    'Push'
  );
}
