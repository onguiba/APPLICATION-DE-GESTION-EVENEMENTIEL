import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) return new Response('Unauthorized', { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: parseInt(session.user.id) },
      select: { name: true, email: true, phone: true },
    });

    if (!user) return new Response('User not found', { status: 404 });

    // Récupérer toutes les participations
    const participants = await prisma.participant.findMany({
      where: { email: user.email },
      include: {
        event: {
          include: {
            user:         { select: { name: true, email: true } },
            participants: { select: { id: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const now     = new Date();
    const dateStr = now.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

    const totalAmount  = participants.reduce((s, p) => s + p.amount, 0);
    const totalPaid    = participants.filter(p => p.paymentStatus === 'Payé' || p.paymentStatus === 'Paye').reduce((s, p) => s + p.amount, 0);
    const confirmed    = participants.filter(p => p.status === 'Confirme' || p.status === 'Confirmé').length;

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Mon Bilan Evenements — LYNKERE</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:Arial,sans-serif; color:#1a1a1a; background:#fff; font-size:13px; }
  .header { background:linear-gradient(135deg,#0f172a,#1e293b); color:#fff; padding:36px 40px; }
  .header h1 { font-size:26px; font-weight:800; margin-bottom:6px; }
  .header .sub { font-size:13px; color:rgba(255,255,255,0.7); margin-bottom:20px; }
  .header-meta { display:flex; gap:20px; flex-wrap:wrap; }
  .header-meta span { font-size:12px; color:rgba(255,255,255,0.85); background:rgba(255,255,255,0.1); padding:6px 14px; border-radius:8px; }
  .content { padding:32px 40px; }
  .section-title { font-size:15px; font-weight:700; color:#0f172a; margin:28px 0 14px; padding-left:12px; border-left:4px solid #10B981; }
  .kpi-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:28px; }
  .kpi { border-radius:14px; padding:18px; text-align:center; border:1px solid #e2e8f0; }
  .kpi .val { font-size:24px; font-weight:800; margin-bottom:4px; }
  .kpi .lbl { font-size:11px; color:#64748b; }
  .kpi-green  { background:#f0fdf4; } .kpi-green  .val { color:#10B981; }
  .kpi-blue   { background:#eff6ff; } .kpi-blue   .val { color:#2563eb; }
  .kpi-orange { background:#fff7ed; } .kpi-orange .val { color:#f97316; }
  .kpi-red    { background:#fef2f2; } .kpi-red    .val { color:#ef4444; }
  .event-card { background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; margin-bottom:18px; overflow:hidden; }
  .event-header { background:linear-gradient(135deg,#f0fdf4,#dcfce7); padding:16px 20px; border-bottom:1px solid #bbf7d0; }
  .event-header h3 { font-size:16px; font-weight:700; color:#0f172a; margin-bottom:6px; }
  .event-type { font-size:11px; background:#fff; color:#10B981; border:1px solid #a7f3d0; border-radius:999px; padding:2px 10px; font-weight:700; }
  .event-body { padding:16px 20px; }
  .info-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:14px; }
  .info-item { background:#fff; border:1px solid #e2e8f0; border-radius:10px; padding:10px 14px; }
  .info-item .lbl { font-size:10px; color:#94a3b8; margin-bottom:3px; text-transform:uppercase; letter-spacing:0.05em; }
  .info-item .val { font-size:13px; font-weight:600; color:#0f172a; }
  .desc { font-size:13px; color:#64748b; line-height:1.6; padding:10px 14px; background:#fff; border-radius:10px; border:1px solid #e2e8f0; margin-bottom:14px; }
  .ticket-row { display:flex; justify-content:space-between; align-items:center; padding:12px 16px; background:#fff; border-radius:10px; border:1px solid #e2e8f0; }
  .badge { display:inline-block; padding:3px 10px; border-radius:999px; font-size:11px; font-weight:700; }
  .badge-green  { background:#dcfce7; color:#16a34a; }
  .badge-orange { background:#fff7ed; color:#ea580c; }
  .badge-blue   { background:#eff6ff; color:#2563eb; }
  .badge-red    { background:#fef2f2; color:#dc2626; }
  table { width:100%; border-collapse:collapse; margin-bottom:24px; }
  th { background:#f1f5f9; color:#374151; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; padding:10px 14px; text-align:left; }
  td { padding:12px 14px; border-bottom:1px solid #f1f5f9; font-size:13px; }
  .footer { background:#0f172a; color:rgba(255,255,255,0.7); padding:20px 40px; text-align:center; font-size:11px; margin-top:40px; }
  @media print { body { -webkit-print-color-adjust:exact; print-color-adjust:exact; } }
</style>
</head>
<body>

<div class="header">
  <h1>Mon Bilan de Participation</h1>
  <div class="sub">Historique complet de mes evenements — LYNKERE</div>
  <div class="header-meta">
    <span>Participant : ${user.name}</span>
    <span>Email : ${user.email}</span>
    ${user.phone ? `<span>Tel : ${user.phone}</span>` : ''}
    <span>Genere le : ${dateStr}</span>
    <span>Total evenements : ${participants.length}</span>
  </div>
</div>

<div class="content">

  <div class="section-title">Resume de ma participation</div>
  <div class="kpi-grid">
    <div class="kpi kpi-green">
      <div class="val">${participants.length}</div>
      <div class="lbl">Evenements</div>
    </div>
    <div class="kpi kpi-blue">
      <div class="val">${confirmed}</div>
      <div class="lbl">Confirmes</div>
    </div>
    <div class="kpi kpi-orange">
      <div class="val">${(totalAmount / 1000).toFixed(0)}k FCFA</div>
      <div class="lbl">Total tickets</div>
    </div>
    <div class="kpi kpi-green">
      <div class="val">${(totalPaid / 1000).toFixed(0)}k FCFA</div>
      <div class="lbl">Total paye</div>
    </div>
  </div>

  <div class="section-title">Tableau recapitulatif</div>
  <table>
    <thead>
      <tr>
        <th>Evenement</th>
        <th>Date</th>
        <th>Lieu</th>
        <th>Type</th>
        <th>Organisateur</th>
        <th>Mon statut</th>
        <th>Paiement</th>
        <th>Montant</th>
      </tr>
    </thead>
    <tbody>
      ${participants.map(p => {
        const statusClass = p.status === 'Confirme' || p.status === 'Confirmé' ? 'badge-green' : p.status === 'En attente' ? 'badge-orange' : 'badge-red';
        const payClass    = p.paymentStatus === 'Payé' || p.paymentStatus === 'Paye' ? 'badge-green' : 'badge-orange';
        return `<tr>
          <td><strong>${p.event.name}</strong></td>
          <td>${p.event.date}</td>
          <td>${p.event.location}</td>
          <td><span class="badge badge-blue">${p.event.type}</span></td>
          <td>${p.event.user.name}</td>
          <td><span class="badge ${statusClass}">${p.status}</span></td>
          <td><span class="badge ${payClass}">${p.paymentStatus}</span></td>
          <td style="font-weight:700;color:#10B981">${(p.amount / 1000).toFixed(0)}k FCFA</td>
        </tr>`;
      }).join('')}
    </tbody>
  </table>

  <div class="section-title">Detail par evenement</div>
  ${participants.map(p => `
  <div class="event-card">
    <div class="event-header">
      <h3>${p.event.name}</h3>
      <span class="event-type">${p.event.type}</span>
    </div>
    <div class="event-body">
      <div class="info-grid">
        <div class="info-item">
          <div class="lbl">Date</div>
          <div class="val">${p.event.date}</div>
        </div>
        <div class="info-item">
          <div class="lbl">Lieu</div>
          <div class="val">${p.event.location}</div>
        </div>
        <div class="info-item">
          <div class="lbl">Organisateur</div>
          <div class="val">${p.event.user.name}</div>
        </div>
        <div class="info-item">
          <div class="lbl">Participants inscrits</div>
          <div class="val">${p.event.participants.length} / ${p.event.capacity}</div>
        </div>
      </div>
      ${p.event.description ? `<div class="desc">${p.event.description}</div>` : ''}
      <div class="ticket-row">
        <div>
          <div style="font-weight:700;color:#0f172a;margin-bottom:4px">Mon ticket #${p.id}</div>
          <div style="font-size:12px;color:#94a3b8">Inscrit le ${new Date(p.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
        </div>
        <div style="display:flex;gap:10px;align-items:center">
          <span class="badge ${p.status === 'Confirme' || p.status === 'Confirmé' ? 'badge-green' : p.status === 'En attente' ? 'badge-orange' : 'badge-red'}">${p.status}</span>
          <span class="badge ${p.paymentStatus === 'Payé' || p.paymentStatus === 'Paye' ? 'badge-green' : 'badge-orange'}">${p.paymentStatus}</span>
          <span style="font-size:18px;font-weight:800;color:#10B981">${(p.amount / 1000).toFixed(0)}k FCFA</span>
        </div>
      </div>
    </div>
  </div>`).join('')}

</div>

<div class="footer">
  LYNKERE — Bilan genere le ${dateStr} | ${user.email} | Document personnel et confidentiel
</div>

</body>
</html>`;

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `attachment; filename="mon-bilan-${now.toISOString().split('T')[0]}.html"`,
      },
    });
  } catch (error) {
    console.error('participant report PDF error:', error);
    return new Response('Error generating report', { status: 500 });
  }
}
