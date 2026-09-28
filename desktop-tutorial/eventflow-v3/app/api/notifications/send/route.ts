import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { sendNotification } from '@/lib/notifications';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { to, message, subject, channels } = body;

    if (!to || !message || !channels || channels.length === 0) {
      return NextResponse.json({ error: 'Destinataire, message et canaux requis' }, { status: 400 });
    }

    // Valider les canaux
    const validChannels = ['Email', 'SMS', 'WhatsApp', 'Message', 'Push'];
    const invalidChannels = channels.filter((c: string) => !validChannels.includes(c));
    if (invalidChannels.length > 0) {
      return NextResponse.json({ error: `Canaux invalides: ${invalidChannels.join(', ')}` }, { status: 400 });
    }

    // Mapper "Message" vers "SMS" pour l'envoi
    const mappedChannels = channels.map((c: string) => c === 'Message' ? 'SMS' : c);

    await sendNotification({
      to,
      message,
      subject: subject || 'Notification LYNKERE',
      channels: mappedChannels,
    });

    return NextResponse.json({
      success: true,
      message: `Notification envoyee via ${channels.join(', ')}`,
      channels,
    });
  } catch (error) {
    console.error('Send notification error:', error);
    return NextResponse.json({ error: 'Erreur lors de l\'envoi' }, { status: 500 });
  }
}
