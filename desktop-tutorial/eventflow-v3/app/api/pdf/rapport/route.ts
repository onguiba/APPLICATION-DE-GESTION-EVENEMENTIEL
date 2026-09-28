import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const now    = new Date();
    const year   = now.getFullYear();
    const months = ['Jan','Fev','Mar','Avr','Mai','Jun','Juil','Aou','Sep','Oct','Nov','Dec'];

    const [user, events, participants, expenses, payments] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true, accountType: true } }),
      prisma.event.findMany({ where: { userId }, include: { participants: true, expenses: true, budget: true }, orderBy: { createdAt: 'desc' } }),
      prisma.participant.findMany({ where: { event: { userId } }, orderBy: { createdAt: 'desc' } }),
      prisma.expense.findMany({ where: { event: { userId } } }),
      prisma.payment.findMany({ where: { event: { userId } } }),
    ]);

    // KPIs
    const totalBudget    = events.reduce((s, e) => s + (e.budget?.totalAmount || 0), 0);
    const totalDepenses  = expenses.reduce((s, e) => s + e.amount, 0);
    const totalPaiements = payments.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0);
    const confirmed      = participants.filter(p => p.status === 'Confirme' || p.status === 'Confirmé').length;
    const confirmedPct   = participants.length > 0 ? Math.round((confirmed / participants.length) * 100) : 0;

    // Participants par mois
    const byMonth = new Array(12).fill(0);
    participants.forEach(p => { byMonth[new Date(p.createdAt).getMonth()]++; });

    // Répartition par type
    const byType: Record<string, number> = {};
    events.forEach(e => { byType[e.type] = (byType[e.type] || 0) + 1; });

    // Dépenses par catégorie
    const byCat: Record<string, number> = {};
    expenses.forEach(e => { byCat[e.category] = (byCat[e.category] || 0) + e.amount; });

    const dateStr = now.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
    const maxMonth = Math.max(...byMonth, 1);

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Rapport & Bilan — LYNKERE</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, sans-serif; color: #1a1a1a; background: #fff; font-size: 13px; }
  .header { background: linear-gradient(135deg, #0f172a, #1e293b); color: #fff; padding: 36px 40px; }
  .header h1 { font-size: 28px; font-weight: 800; margin-bottom: 6px; }
  .header .sub { font-size: 14px; color: rgba(255,255,255,0.7); margin-bottom: 20px; }
  .header-meta { display: flex; gap: 32px; flex-wrap: wrap; }
  .header-meta span { font-size: 12px; color: rgba(255,255,255,0.8); background: rgba(255,255,255,0.1); padding: 6px 14px; border-radius: 8px; }
  .content { padding: 32px 40px; }
  .section-title { font-size: 16px; font-weight: 700; color: #0f172a; margin: 32px 0 16px; padding-left: 14px; border-left: 4px solid #10B981; }
  .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
  .kpi { border-radius: 14px; padding: 20px; text-align: center; border: 1px solid #e2e8f0; }
  .kpi .val { font-size: 26px; font-weight: 800; margin-bottom: 6px; }
  .kpi .lbl { font-size: 11px; color: #64748b; }
  .kpi-green  { background: #f0fdf4; } .kpi-green  .val { color: #10B981; }
  .kpi-blue   { background: #eff6ff; } .kpi-blue   .val { color: #2563eb; }
  .kpi-orange { background: #fff7ed; } .kpi-orange .val { color: #f97316; }
  .kpi-red    { background: #fef2f2; } .kpi-red    .val { color: #ef4444; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 28px; }
  th { background: #f1f5f9; color: #374151; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 10px 14px; text-align: left; }
  td { padding: 12px 14px; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
  .badge { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; }
  .badge-green  { background: #dcfce7; color: #16a34a; }
  .badge-orange { background: #fff7ed; color: #ea580c; }
  .badge-red    { background: #fef2f2; color: #dc2626; }
  .badge-blue   { background: #eff6ff; color: #2563eb; }
  .chart { display: flex; align-items: flex-end; gap: 6px; height: 120px; padding: 0 0 8px; }
  .bar-wrap { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .bar { width: 100%; border-radius: 4px 4px 0 0; }
  .bar-lbl { font-size: 9px; color: #94a3b8; }
  .bar-val { font-size: 9px; font-weight: 700; }
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; }
  .card h3 { font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 14px; }
  .row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
  .row:last-child { border-bottom: none; }
  .progress-bar { height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden; margin-top: 4px; }
  .progress-fill { height: 100%; border-radius: 3px; }
  .footer { background: #0f172a; color: rgba(255,255,255,0.7); padding: 20px 40px; text-align: center; font-size: 11px; margin-top: 40px; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>

<div class="header">
  <h1>Rapport & Bilan Annuel ${year}</h1>
  <div class="sub">Analyse complete des performances evenementielles</div>
  <div class="header-meta">
    <span>Organisateur : ${user?.name || 'N/A'}</span>
    <span>Email : ${user?.email || 'N/A'}</span>
    <span>Profil : ${user?.accountType || 'N/A'}</span>
    <span>Genere le : ${dateStr}</span>
  </div>
</div>

<div class="content">

  <div class="section-title">Indicateurs cles de performance</div>
  <div class="kpi-grid">
    <div class="kpi kpi-green">
      <div class="val">${events.length}</div>
      <div class="lbl">Evenements organises</div>
    </div>
    <div class="kpi kpi-blue">
      <div class="val">${participants.length}</div>
      <div class="lbl">Total participants</div>
    </div>
    <div class="kpi kpi-orange">
      <div class="val">${confirmedPct}%</div>
      <div class="lbl">Taux de confirmation</div>
    </div>
    <div class="kpi kpi-red">
      <div class="val">${(totalDepenses / 1000).toFixed(0)}k</div>
      <div class="lbl">Budget total depense (FCFA)</div>
    </div>
  </div>

  <div class="kpi-grid">
    <div class="kpi kpi-green">
      <div class="val">${(totalBudget / 1000).toFixed(0)}k</div>
      <div class="lbl">Budget total prevu (FCFA)</div>
    </div>
    <div class="kpi kpi-blue">
      <div class="val">${(totalPaiements / 1000).toFixed(0)}k</div>
      <div class="lbl">Paiements recus (FCFA)</div>
    </div>
    <div class="kpi kpi-orange">
      <div class="val">${confirmed}</div>
      <div class="lbl">Participants confirmes</div>
    </div>
    <div class="kpi kpi-red">
      <div class="val">${totalBudget > 0 ? Math.round((totalDepenses / totalBudget) * 100) : 0}%</div>
      <div class="lbl">Taux utilisation budget</div>
    </div>
  </div>

  <div class="section-title">Evolution des participants par mois (${year})</div>
  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:28px">
    <div class="chart">
      ${byMonth.map((val, i) => {
        const h = Math.max(Math.round((val / maxMonth) * 100), 4);
        const isCurrent = i === now.getMonth();
        return `<div class="bar-wrap">
          <div class="bar-val" style="color:${isCurrent ? '#10B981' : '#94a3b8'}">${val}</div>
          <div class="bar" style="height:${h}px;background:${isCurrent ? '#10B981' : '#e2e8f0'}"></div>
          <div class="bar-lbl" style="color:${isCurrent ? '#10B981' : '#94a3b8'};font-weight:${isCurrent ? 700 : 400}">${months[i]}</div>
        </div>`;
      }).join('')}
    </div>
  </div>

  <div class="two-col">
    <div class="card">
      <h3>Repartition par type d'evenement</h3>
      ${Object.entries(byType).map(([type, count], ci) => {
        const pct = events.length > 0 ? Math.round((count / events.length) * 100) : 0;
        const colors = ['#10B981','#2563eb','#f97316','#8b5cf6','#ef4444','#94a3b8'];
        return `<div class="row">
          <span style="font-size:13px;color:#374151">${type}</span>
          <div style="text-align:right">
            <span style="font-size:12px;color:#94a3b8">${count} evt</span>
            <span style="margin-left:8px;font-weight:700;color:${colors[ci % colors.length]}">${pct}%</span>
            <div class="progress-bar" style="width:80px;margin-left:auto;margin-top:4px">
              <div class="progress-fill" style="width:${pct}%;background:${colors[ci % colors.length]}"></div>
            </div>
          </div>
        </div>`;
      }).join('') || '<p style="color:#94a3b8;font-size:13px">Aucun evenement</p>'}
    </div>

    <div class="card">
      <h3>Statut des participants</h3>
      ${[
        { label: 'Confirmes',  count: confirmed, color: '#10B981' },
        { label: 'En attente', count: participants.filter(p => p.status === 'En attente').length, color: '#f97316' },
        { label: 'Annules',    count: participants.filter(p => p.status === 'Annule' || p.status === 'Annulé').length, color: '#ef4444' },
      ].map(({ label, count, color }) => {
        const pct = participants.length > 0 ? Math.round((count / participants.length) * 100) : 0;
        return `<div class="row">
          <span style="font-size:13px;color:#374151">${label}</span>
          <div style="text-align:right">
            <span style="font-size:12px;color:#94a3b8">${count}</span>
            <span style="margin-left:8px;font-weight:700;color:${color}">${pct}%</span>
            <div class="progress-bar" style="width:80px;margin-left:auto;margin-top:4px">
              <div class="progress-fill" style="width:${pct}%;background:${color}"></div>
            </div>
          </div>
        </div>`;
      }).join('')}
    </div>
  </div>

  <div class="section-title">Depenses par categorie</div>
  <div class="card" style="margin-bottom:28px">
    ${Object.entries(byCat).sort((a, b) => b[1] - a[1]).map(([cat, total]) => {
      const pct = totalDepenses > 0 ? Math.round((total / totalDepenses) * 100) : 0;
      return `<div class="row">
        <span style="font-size:13px;color:#374151;font-weight:600">${cat}</span>
        <div style="display:flex;align-items:center;gap:12px">
          <div class="progress-bar" style="width:120px">
            <div class="progress-fill" style="width:${pct}%;background:#10B981"></div>
          </div>
          <span style="font-size:13px;font-weight:700;color:#0f172a;min-width:80px;text-align:right">${(total / 1000).toFixed(0)}k FCFA</span>
          <span style="font-size:12px;color:#10B981;font-weight:700;min-width:40px">${pct}%</span>
        </div>
      </div>`;
    }).join('') || '<p style="color:#94a3b8;font-size:13px">Aucune depense</p>'}
  </div>

  <div class="section-title">Liste des evenements</div>
  <table>
    <thead>
      <tr>
        <th>Evenement</th>
        <th>Date</th>
        <th>Lieu</th>
        <th>Statut</th>
        <th>Participants</th>
        <th>Budget prevu</th>
        <th>Depense</th>
        <th>Solde</th>
      </tr>
    </thead>
    <tbody>
      ${events.map(ev => {
        const dep = ev.expenses.reduce((s, e) => s + e.amount, 0);
        const bud = ev.budget?.totalAmount || 0;
        const sol = bud - dep;
        const badgeClass = ev.status === 'En cours' ? 'badge-orange' : ev.status === 'Termine' || ev.status === 'Terminé' ? 'badge-green' : 'badge-blue';
        return `<tr>
          <td><strong>${ev.name}</strong></td>
          <td>${ev.date}</td>
          <td>${ev.location}</td>
          <td><span class="badge ${badgeClass}">${ev.status}</span></td>
          <td>${ev.participants.length} / ${ev.capacity}</td>
          <td>${(bud / 1000).toFixed(0)}k FCFA</td>
          <td>${(dep / 1000).toFixed(0)}k FCFA</td>
          <td style="font-weight:700;color:${sol >= 0 ? '#16a34a' : '#dc2626'}">${(sol / 1000).toFixed(0)}k FCFA</td>
        </tr>`;
      }).join('')}
    </tbody>
  </table>

</div>

<div class="footer">
  LYNKERE — Rapport genere le ${dateStr} | ${user?.email || ''} | Document confidentiel
</div>

</body>
</html>`;

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `attachment; filename="rapport-lynkere-${year}.html"`,
      },
    });
  } catch (error) {
    console.error('PDF rapport error:', error);
    return NextResponse.json({ error: 'Failed to generate rapport' }, { status: 500 });
  }
}
