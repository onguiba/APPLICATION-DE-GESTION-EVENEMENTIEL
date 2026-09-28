import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/admin/users — Liste tous les utilisateurs (admin seulement)
export async function GET(req: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        accountType: true,
        createdAt: true,
        _count: {
          select: { events: true, participations: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Admin users error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// DELETE /api/admin/users — Supprimer un utilisateur
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'ID requis' }, { status: 400 });

    await prisma.user.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin delete user error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// PATCH /api/admin/users — Modifier le rôle d'un utilisateur
export async function PATCH(req: NextRequest) {
  try {
    const { id, role } = await req.json();
    if (!id || !role) return NextResponse.json({ error: 'ID et rôle requis' }, { status: 400 });

    const updated = await prisma.user.update({
      where: { id: Number(id) },
      data: { role },
    });

    return NextResponse.json({ id: updated.id, role: updated.role });
  } catch (error) {
    console.error('Admin patch user error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
