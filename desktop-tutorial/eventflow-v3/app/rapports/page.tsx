"use client";
import Header from "@/components/layout/Header";
import { useStore } from "@/lib/store/useStore";
import { Download, TrendingUp, Users, Wallet, Calendar } from "lucide-react";

const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"];
const mockData = [12, 19, 15, 28, 32, 45, 38, 52, 40, 30, 22, 18];
const maxVal = Math.max(...mockData);

export default function RapportsPage() {
  const { events, participants, depenses } = useStore();

  const totalBudget = depenses.reduce((s, d) => s + d.montant, 0);
  const confirmedPct = participants.length > 0 ? Math.round((participants.filter(p => p.statut === "Confirmé").length / participants.length) * 100) : 0;

  const handleExport = () => {
    const data = {
      generated: new Date().toLocaleDateString("fr-FR"),
      events: events.length,
      participants: participants.length,
      budget: totalBudget,
    };
    const json = JSON.stringify(data, null, 2);
    const a = document.createElement("a");
    a.href = "data:application/json;charset=utf-8," + encodeURIComponent(json);
    a.download = "rapport-tchadevent.json";
    a.click();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "auto" }}>
      <Header
        title="Rapports & Analyses"
        subtitle="Vue globale de vos performances"
        action={{ label: "Exporter rapport", onClick: handleExport }}
      />

      <div style={{ padding: "20px 32px 32px", display: "flex", flexDirection: "column", gap: 24 }}>
        {/* KPI row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {[
            { label: "Total événements", value: events.length, icon: Calendar, color: "var(--accent)", suffix: "" },
            { label: "Total participants", value: participants.length, icon: Users, color: "var(--blue)", suffix: "" },
            { label: "Taux confirmation", value: confirmedPct, icon: TrendingUp, color: "var(--accent)", suffix: "%" },
            { label: "Budget total dépensé", value: `${(totalBudget / 1000).toFixed(0)}k`, icon: Wallet, color: "var(--orange)", suffix: " FCFA" },
          ].map(({ label, value, icon: Icon, color, suffix }) => (
            <div key={label} style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: `${color}15`, border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                <Icon size={16} color={color} strokeWidth={1.5} />
              </div>
              <div style={{ fontSize: 28, fontFamily: "Syne, sans-serif", fontWeight: 800, color: "var(--text)", letterSpacing: "-0.03em" }}>
                {value}{suffix}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Bar chart */}
        <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div>
              <h2 style={{ fontSize: 15, fontFamily: "Syne, sans-serif", fontWeight: 700 }}>Participants par mois</h2>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 3 }}>Année 2025</p>
            </div>
            <button onClick={handleExport} style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 7, padding: "7px 12px", fontSize: 12, color: "var(--text-muted)", cursor: "pointer" }}>
              <Download size={13} /> Export CSV
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 180 }}>
            {mockData.map((val, i) => {
              const h = Math.round((val / maxVal) * 160);
              const isCurrent = i === 5;
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 10, color: isCurrent ? "var(--accent)" : "var(--text-muted)" }}>{val}</span>
                  <div style={{ width: "100%", height: h, background: isCurrent ? "var(--accent)" : "var(--bg-3)", borderRadius: "4px 4px 0 0", border: `1px solid ${isCurrent ? "rgba(200,245,74,0.3)" : "var(--border)"}`, transition: "height 0.3s ease" }} />
                  <span style={{ fontSize: 10, color: isCurrent ? "var(--accent)" : "var(--text-muted)", fontWeight: isCurrent ? 600 : 400 }}>{months[i]}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Event breakdown */}
          <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "18px 20px", borderBottom: "1px solid var(--border)" }}>
              <h2 style={{ fontSize: 15, fontFamily: "Syne, sans-serif", fontWeight: 700 }}>Répartition par type</h2>
            </div>
            <div style={{ padding: "8px 20px" }}>
              {Object.entries(
                events.reduce((acc, e) => { acc[e.type] = (acc[e.type] || 0) + 1; return acc; }, {} as Record<string, number>)
              ).map(([type, count]) => {
                const pct = Math.round((count / events.length) * 100);
                const colors = ["var(--accent)", "var(--blue)", "var(--orange)", "var(--purple)", "var(--red)", "var(--text-muted)"];
                const ci = Object.keys(events.reduce((acc, e) => { acc[e.type] = true; return acc; }, {} as Record<string, boolean>)).indexOf(type);
                return (
                  <div key={type} style={{ padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 13, color: "var(--text)" }}>{type}</span>
                      <div style={{ display: "flex", gap: 8 }}>
                        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{count} évt</span>
                        <span style={{ fontSize: 12, color: colors[ci % colors.length], fontWeight: 600 }}>{pct}%</span>
                      </div>
                    </div>
                    <div style={{ height: 4, background: "var(--bg-3)", borderRadius: 2 }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: colors[ci % colors.length], borderRadius: 2 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Participant stats */}
          <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "18px 20px", borderBottom: "1px solid var(--border)" }}>
              <h2 style={{ fontSize: 15, fontFamily: "Syne, sans-serif", fontWeight: 700 }}>Statut des participants</h2>
            </div>
            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { label: "Confirmés", count: participants.filter(p => p.statut === "Confirmé").length, color: "var(--accent)" },
                { label: "En attente", count: participants.filter(p => p.statut === "En attente").length, color: "var(--orange)" },
                { label: "Annulés", count: participants.filter(p => p.statut === "Annulé").length, color: "var(--red)" },
              ].map(({ label, count, color }) => {
                const pct = participants.length > 0 ? Math.round((count / participants.length) * 100) : 0;
                return (
                  <div key={label}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: "var(--text)" }}>{label}</span>
                      <div style={{ display: "flex", gap: 8 }}>
                        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{count}</span>
                        <span style={{ fontSize: 12, color, fontWeight: 600 }}>{pct}%</span>
                      </div>
                    </div>
                    <div style={{ height: 8, background: "var(--bg-3)", borderRadius: 4 }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 4 }} />
                    </div>
                  </div>
                );
              })}

              {/* Payment breakdown */}
              <div style={{ marginTop: 8, padding: 14, background: "var(--bg-3)", borderRadius: 8, border: "1px solid var(--border)" }}>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10, fontWeight: 500 }}>MODES DE PAIEMENT</div>
                {["MoMo", "Orange Money", "Espèces"].map(pm => {
                  const cnt = participants.filter(p => p.paiement === pm).length;
                  return (
                    <div key={pm} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{pm}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>{cnt}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
