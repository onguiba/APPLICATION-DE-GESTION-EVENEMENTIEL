import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { prisma } = await import('@/lib/db');
    const { id } = await params;
    
    const budget = await prisma.budget.findUnique({
      where: { id: parseInt(id) },
      include: {
        event: true,
        categories: true,
      },
    });
    
    if (!budget) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }
    
    return NextResponse.json(budget);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch budget' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { prisma } = await import('@/lib/db');
    const { id } = await params;
    const body = await req.json();
    
    const budget = await prisma.budget.update({
      where: { id: parseInt(id) },
      data: {
        totalAmount: body.totalAmount,
        status: body.status,
      },
      include: {
        event: true,
        categories: true,
      },
    });
    
    return NextResponse.json(budget);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update budget' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { prisma } = await import('@/lib/db');
    const { id } = await params;
    
    await prisma.budget.delete({
      where: { id: parseInt(id) },
    });
    
    return NextResponse.json({ message: 'Budget deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete budget' }, { status: 500 });
  }
}
