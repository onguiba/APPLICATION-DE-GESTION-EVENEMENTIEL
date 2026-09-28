import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    const userId = parseInt(session.user.id);

    // Récupérer tous les événements avec budgets et dépenses
    const events = await prisma.event.findMany({
      where: { userId },
      include: {
        budget: { include: { categories: true } },
        expenses: true,
        participants: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true },
    });

    const now = new Date();
    const dateStr = now.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

    // Calculs globaux
    const totalBudget   = events.reduce((s, e) => s + (e.budget?.totalAmount || 0), 0);
    const totalDepenses = events.reduce((s, e) => s + e.expenses.reduce((x, ex) => x + ex.amount, 0), 0);
    const totalRestant  = totalBudget - totalDepenses;
    const pctGlobal     = totalBudget > 0 ? Math.round((totalDepenses / totalBudget) * 100) : 0;

    // Générer le HTML du PDF
    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Recapitulatif Budget — LYNKERE</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, sans-serif; color: #1a1a1a; background: #fff; font-size: 13px; }
  .header { background: #10B981; color: #fff; padding: 32px 40px; }
  .header h1 { font-size: 26px; font-weight: 800; margin-bottom: 4px; }
  .header p  { font-size: 13px; opacity: 0.85; }
  .meta { display: flex; gap: 40px; margin-top: 16px; }
  .meta span { font-size: 12px; opacity: 0.9; }
  .content { padding: 32px 40px; }
  .section-title { font-size: 16px; font-weight: 700; color: #0f172a; margin: 28px 0 14px; border-left: 4px solid #10B981; padding-left: 12px; }
  .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
  .kpi { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; text-align: center; }
  .kpi .val { font-size: 22px; font-weight: 800; color: #0f172a; }
  .kpi .lbl { font-size: 11px; color: #64748b; margin-top: 4px; }
  .kpi.green .val { color: #10B981; }
  .kpi.red   .val { color: #ef4444; }
  .kpi.orange .val { color: #f97316; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 28px; }
  th { background: #f1f5f9; color: #374151; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 10px 14px; text-align: left; }
  td { padding: 12px 14px; border-bottom: 1px solid #f1f5f9; font-size: 13px; color: #374151; }
  tr:hover td { background: #f8fafc; }
  .badge { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; }
  .badge-green  { background: #dcfce7; color: #16a34a; }
  .badge-orange { background: #fff7ed; color: #ea580c; }
  .badge-red    { background: #fef2f2; color: #dc2626; }
  .badge-blue   { background: #eff6ff; color: #2563eb; }
  .progress-bar { height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 4px; }
  .event-block { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
  .event-name { font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 12px; }
  .event-meta { display: flex; gap: 20px; font-size: 12px; color: #64748b; margin-bottom: 14px; }
  .cat-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
  .cat-row:last-child { border-bottom: none; }
  .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 40px; text-align: center; color: #94a3b8; font-size: 11px; margin-top: 40px; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>

<div class="header">
  <h1>Recapitulatif Budget Global</h1>
  <p>Rapport genere par LYNKERE — Plateforme de gestion evenementielle</p>
  <div class="meta">
    <span>Organisateur : ${user?.name || 'N/A'}</span>
    <span>Email : ${user?.email || 'N/A'}</span>
    <span>Date : ${dateStr}</span>
    <span>Evenements : ${events.length}</span>
  </div>
</div>

<div class="content">

  <div class="section-title">Vue d'ensemble financiere</div>
  <div class="kpi-grid">
    <div class="kpi green">
      <div class="val">${(totalBudget / 1000).toFixed(0)}k</div>
      <div class="lbl">Budget total prevu (FCFA)</div>
    </div>
    <div class="kpi red">
      <div class="val">${(totalDepenses / 1000).toFixed(0)}k</div>
      <div class="lbl">Total depense (FCFA)</div>
    </div>
    <div class="kpi ${totalRestant >= 0 ? 'green' : 'red'}">
      <div class="val">${(totalRestant / 1000).toFixed(0)}k</div>
      <div class="lbl">Solde restant (FCFA)</div>
    </div>
    <div class="kpi orange">
      <div class="val">${pctGlobal}%</div>
      <div class="lbl">Taux d'utilisation</div>
    </div>
  </div>

  <div class="section-title">Recapitulatif par evenement</div>
  <table>
    <thead>
      <tr>
        <th>Evenement</th>
        <th>Date</th>
        <th>Statut</th>
        <th>Budget prevu</th>
        <th>Depense</th>
        <th>Restant</th>
        <th>Utilisation</th>
        <th>Participants</th>
      </tr>
    </thead>
    <tbody>
      ${events.map(ev => {
        const budgetTotal = ev.budget?.totalAmount || 0;
        const depenses    = ev.expenses.reduce((s, e) => s + e.amount, 0);
        const restant     = budgetTotal - depenses;
        const pct         = budgetTotal > 0 ? Math.round((depenses / budgetTotal) * 100) : 0;
        const badgeClass  = ev.status === 'En cours' ? 'badge-orange' : ev.status === 'Termine' || ev.status === 'Terminé' ? 'badge-green' : 'badge-blue';
        return `
        <tr>
          <td><strong>${ev.name}</strong></td>
          <td>${ev.date}</td>
          <td><span class="badge ${badgeClass}">${ev.status}</span></td>
          <td>${(budgetTotal / 1000).toFixed(0)}k FCFA</td>
          <td>${(depenses / 1000).toFixed(0)}k FCFA</td>
          <td style="color:${restant >= 0 ? '#16a34a' : '#dc2626'};font-weight:700">${(restant / 1000).toFixed(0)}k FCFA</td>
          <td>
            <div style="display:flex;align-items:center;gap:8px">
              <div class="progress-bar" style="width:80px">
                <div class="progress-fill" style="width:${Math.min(pct,100)}%;background:${pct > 100 ? '#ef4444' : pct > 80 ? '#f97316' : '#10B981'}"></div>
              </div>
              <span style="font-weight:700;color:${pct > 100 ? '#ef4444' : pct > 80 ? '#f97316' : '#10B981'}">${pct}%</span>
            </div>
          </td>
          <td>${ev.participants.length} / ${ev.capacity}</td>
        </tr>`;
      }).join('')}
    </tbody>
  </table>

  <div class="section-title">Detail des budgets par categorie</div>
  ${events.filter(ev => ev.budget && ev.budget.categories.length > 0).map(ev => {
    const depenses = ev.expenses.reduce((s, e) => s + e.amount, 0);
    return `
    <div class="event-block">
      <div class="event-name">${ev.name}</div>
      <div class="event-meta">
        <span>Date : ${ev.date}</span>
        <span>Lieu : ${ev.location}</span>
        <span>Budget total : ${((ev.budget?.totalAmount || 0) / 1000).toFixed(0)}k FCFA</span>
        <span>Depense : ${(depenses / 1000).toFixed(0)}k FCFA</span>
      </div>
      ${ev.budget!.categories.map(cat => {
        const pct = cat.allocatedAmount > 0 ? Math.round((cat.spent / cat.allocatedAmount) * 100) : 0;
        const alert = pct > 85;
        return `
        <div class="cat-row">
          <div style="flex:1">
            <div style="font-weight:600;color:#0f172a;margin-bottom:4px">${cat.name}</div>
            <div class="progress-bar" style="width:200px">
              <div class="progress-fill" style="width:${Math.min(pct,100)}%;background:${alert ? '#ef4444' : '#10B981'}"></div>
            </div>
          </div>
          <div style="text-align:right;min-width:200px">
            <span style="font-size:12px;color:#64748b">${(cat.spent / 1000).toFixed(0)}k / ${(cat.allocatedAmount / 1000).toFixed(0)}k FCFA</span>
            <span style="margin-left:12px;font-weight:700;color:${alert ? '#ef4444' : '#10B981'}">${pct}%</span>
            ${alert ? '<span style="margin-left:8px;font-size:10px;background:#fef2f2;color:#dc2626;padding:2px 6px;border-radius:4px">ALERTE</span>' : ''}
          </div>
        </div>`;
      }).join('')}
    </div>`;
  }).join('')}

  <div class="section-title">Detail des depenses</div>
  <table>
    <thead>
      <tr>
        <th>Evenement</th>
        <th>Categorie</th>
        <th>Description</th>
        <th>Date</th>
        <th>Montant</th>
      </tr>
    </thead>
    <tbody>
      ${events.flatMap(ev =>
        ev.expenses.map(ex => `
        <tr>
          <td>${ev.name}</td>
          <td><span class="badge badge-blue">${ex.category}</span></td>
          <td>${ex.description || '—'}</td>
          <td>${ex.date}</td>
          <td style="font-weight:700">${(ex.amount / 1000).toFixed(0)}k FCFA</td>
        </tr>`)
      ).join('')}
      ${events.every(ev => ev.expenses.length === 0) ? '<tr><td colspan="5" style="text-align:center;color:#94a3b8;padding:20px">Aucune depense enregistree</td></tr>' : ''}
    </tbody>
  </table>

</div>

<div class="footer">
  LYNKERE — Rapport genere le ${dateStr} | ${user?.email || ''} | Confidentiel
</div>

</body>
</html>`;

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `attachment; filename="budget-lynkere-${now.toISOString().split('T')[0]}.html"`,
      },
    });
  } catch (error) {
    console.error('PDF budget error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
