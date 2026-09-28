import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const eventId = parseInt(params.eventId);

    // Verify participant attended this event
    const participation = await prisma.participant.findFirst({
      where: {
        userId,
        eventId,
        event: { status: 'Terminé' }
      },
      include: {
        event: {
          include: {
            user: { select: { name: true } }
          }
        }
      }
    });

    if (!participation) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Generate HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 40px;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              border-bottom: 2px solid #f97316;
              padding-bottom: 20px;
            }
            .logo {
              font-size: 32px;
              font-weight: bold;
              color: #f97316;
              margin-bottom: 10px;
            }
            .title {
              font-size: 24px;
              font-weight: bold;
              color: #0f172a;
              margin-bottom: 30px;
            }
            .section {
              margin-bottom: 30px;
            }
            .section-title {
              font-size: 16px;
              font-weight: bold;
              color: #0f172a;
              margin-bottom: 15px;
              border-left: 4px solid #f97316;
              padding-left: 10px;
            }
            .info-row {
              display: flex;
              margin-bottom: 10px;
              font-size: 14px;
            }
            .info-label {
              font-weight: bold;
              width: 150px;
              color: #64748b;
            }
            .info-value {
              flex: 1;
              color: #111827;
            }
            .confirmation {
              background-color: #f0fdf4;
              border: 2px solid #22c55e;
              border-radius: 8px;
              padding: 20px;
              margin-top: 30px;
              text-align: center;
            }
            .confirmation-text {
              font-size: 16px;
              font-weight: bold;
              color: #16a34a;
            }
            .footer {
              margin-top: 50px;
              text-align: center;
              font-size: 12px;
              color: #94a3b8;
              border-top: 1px solid #e2e8f0;
              padding-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">TchadEvent</div>
            <div>Rapport d'événement</div>
          </div>

          <div class="title">${participation.event.name}</div>

          <div class="section">
            <div class="section-title">Détails de l'événement</div>
            <div class="info-row">
              <div class="info-label">Date:</div>
              <div class="info-value">${participation.event.date}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Lieu:</div>
              <div class="info-value">${participation.event.location}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Organisateur:</div>
              <div class="info-value">${participation.event.user.name}</div>
            </div>
            ${participation.event.description ? `
            <div class="info-row">
              <div class="info-label">Description:</div>
              <div class="info-value">${participation.event.description}</div>
            </div>
            ` : ''}
          </div>

          <div class="section">
            <div class="section-title">Informations du participant</div>
            <div class="info-row">
              <div class="info-label">Nom:</div>
              <div class="info-value">${participation.name}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Email:</div>
              <div class="info-value">${participation.email}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Téléphone:</div>
              <div class="info-value">${participation.phone}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Statut:</div>
              <div class="info-value">${participation.status}</div>
            </div>
          </div>

          <div class="confirmation">
            <div class="confirmation-text">✓ Participation confirmée</div>
            <p style="margin: 10px 0 0 0; font-size: 12px; color: #16a34a;">
              Ce document certifie que ${participation.name} a participé à l'événement ${participation.event.name}
            </p>
          </div>

          <div class="footer">
            <p>Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
            <p>TchadEvent - Gestion d'événements</p>
          </div>
        </body>
      </html>
    `;

    // For now, return HTML that can be printed to PDF
    // In production, you would use a library like puppeteer or pdfkit
    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `attachment; filename="TchadEvent_Report_${participation.event.name}_${participation.event.date}.html"`
      }
    });
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}
