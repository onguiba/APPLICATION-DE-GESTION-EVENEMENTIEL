import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 });
    }

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({ where: { email } });

    // On retourne toujours succès pour ne pas révéler si l'email existe
    if (!user) {
      return NextResponse.json({ success: true });
    }

    // TODO: envoyer un vrai email de réinitialisation (SendGrid, etc.)
    // Pour l'instant on simule juste le succès
    console.log(`[Forgot Password] Reset requested for: ${email}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in forgot password:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
