"use client";

import Header from "@/components/layout/Header";
import {
  RefreshCw, Calendar, MapPin, Users,
  CheckCircle, XCircle, Clock, Globe, UserCheck,
  Wifi, WifiOff, UserPlus,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useStore } from "@/lib/store/useStore";
import { useRealtime } from "@/lib/useRealtime";

interface PublicEvent {
  id: number;
  name: string;
  date: string;
  location: string;
  type: string;
  capacity: number;
  budgetAmount: number;
  status: string;
  description?: string;
  isOwner: boolean;
  user: { id: number; name: string; email: string; accountType: string };
  participants: { id: number }[];
  myParticipation: { id: number } | null;
}

const statusColor: Record<string, { text: string; bg: string; border: string }> = {
  "En cours": { text: "#f97316", bg: "#fff7ed", border: "#fed7aa" },
  "Planifie":  { text: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
  "Planifié":  { text: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
  "Termine":   { text: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  "Terminé":   { text: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
};

export default function ActualitesPage() {
  const { showToast } = useStore();
  const { data: rt, connected } = useRealtime();

  const [events, setEvents]           = useState<PublicEvent[]>([]);
  const [loading, setLoading]         = useState(true);
  const [refreshing, setRefreshing]   = useState(false);
  const [sendingParticipation, setSendingParticipation] = useState<number | null>(null);
  const [lastUpdate, setLastUpdate]   = useState<string>("");

  // ── Chargement initial ──────────────────────────────────────
  const fetchAll = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const evRes = await fetch("/api/events/public");
      if (evRes.ok) setEvents(await evRes.json());
    } catch {}
    finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Mise à jour temps réel via SSE ─────────────────────────
  useEffect(() => {
    if (!rt.timestamp || rt.timestamp === lastUpdate) return;
    setLastUpdate(rt.timestamp);

    if (rt.publicEvents && rt.publicEvents.length > 0) {
      // Recharger depuis l'API pour avoir les données enrichies (isOwner, myParticipation)
      fetch("/api/events/public")
        .then(r => r.ok ? r.json() : null)
        .then(data => { if (data) setEvents(data); })
        .catch(() => {});
    }
  }, [rt.timestamp]);

  // ── Demander à participer ───────────────────────────────────
  const requestParticipation = async (eventId: number) => {
    setSendingParticipation(eventId);
    try {
      const res = await fetch("/api/participants/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });

      if (res.ok) {
        showToast("Demande de participation envoyee — L'organisateur a ete notifie", "success");
        // Mettre à jour localement
        setEvents(prev => prev.map(ev =>
          ev.id === eventId
            ? { ...ev, myParticipation: { id: -1 } }
            : ev
        ));
      } else {
        const err = await res.json();
        if (res.status === 409) {
          showToast("Vous etes deja inscrit a cet evenement", "info");
          // Rafraîchir pour avoir le bon état
          fetchAll();
        } else {
          showToast(err.error || "Erreur lors de l'envoi", "error");
        }
      }
    } catch {
      showToast("Erreur de connexion", "error");
    } finally {
      setSendingParticipation(null);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: "#f8fafc", minHeight: "100vh" }}>
      <Header
        title="Actualites"
        subtitle="Evenements publics en temps reel"
        action={{ label: "Actualiser", onClick: () => fetchAll(true) }}
      />

      <div style={{ padding: "28px", display: "flex", flexDirection: "column", gap: 24 }}>

        {/* ── Barre de statut temps réel ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px", borderRadius: 12, background: connected ? "#f0fdf4" : "#fef2f2", border: `1px solid ${connected ? "#bbf7d0" : "#fecaca"}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {connected
              ? <Wifi size={16} color="#16a34a" />
              : <WifiOff size={16} color="#dc2626" />
            }
            <span style={{ fontSize: 13, fontWeight: 600, color: connected ? "#16a34a" : "#dc2626" }}>
              {connected ? "Connecte en temps reel — mise a jour automatique toutes les 5s" : "Reconnexion en cours..."}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {rt.timestamp && (
              <span style={{ fontSize: 12, color: "#94a3b8" }}>
                Derniere mise a jour : {new Date(rt.timestamp).toLocaleTimeString("fr-FR")}
              </span>
            )}
            <button
              onClick={() => fetchAll(true)}
              disabled={refreshing}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 10, border: "1px solid #e5e7eb", background: "#fff", color: "#52525b", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
            >
              <RefreshCw size={14} style={{ animation: refreshing ? "spin 1s linear infinite" : "none" }} />
              {refreshing ? "Actualisation..." : "Actualiser"}
            </button>
          </div>
        </div>

        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

        {/* ── Titre section ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Globe size={18} color="#10B981" />
          <span style={{ fontSize: 16, fontWeight: 700, color: "#18181b" }}>
            Evenements publics
          </span>
          <span style={{ background: "#f1f5f9", borderRadius: 999, padding: "2px 10px", fontSize: 13, color: "#52525b", fontWeight: 600 }}>
            {events.length}
          </span>
        </div>

        {/* ── Liste des événements ── */}
        {loading && <div style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>Chargement...</div>}

        {!loading && events.length === 0 && (
          <div style={{ background: "#fff", borderRadius: 24, border: "1px solid #e5e7eb", padding: 60, textAlign: "center" }}>
            <Globe size={48} color="#94a3b8" style={{ margin: "0 auto 16px", display: "block" }} />
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#18181b", marginBottom: 8 }}>Aucun evenement public</h3>
            <p style={{ color: "#94a3b8", fontSize: 14 }}>
              Les evenements publics apparaitront ici automatiquement. Creez un evenement et passez-le en visibilite "Public" pour qu'il apparaisse dans ce fil.
            </p>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 20 }}>
          {events.map(ev => {
            const sc = statusColor[ev.status] || { text: "#737373", bg: "#fafafa", border: "#e5e5e5" };
            const count = ev.participants?.length ?? 0;
            const fillPct = ev.capacity > 0 ? Math.round((count / ev.capacity) * 100) : 0;
            const alreadyParticipating = !!ev.myParticipation;
            const isSending = sendingParticipation === ev.id;

            return (
              <div key={ev.id} style={{ background: "#fff", borderRadius: 20, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", transition: "box-shadow 0.2s" }}>

                {/* Header carte */}
                <div style={{ background: "linear-gradient(135deg,#f0fdf4,#dcfce7)", padding: "20px 20px 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: sc.text, background: sc.bg, border: `1px solid ${sc.border}`, borderRadius: 999, padding: "3px 10px" }}>
                      {ev.status}
                    </span>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "#18181b", marginTop: 10, marginBottom: 4 }}>{ev.name}</h3>
                    <span style={{ fontSize: 12, color: "#94a3b8", background: "#f1f5f9", borderRadius: 6, padding: "2px 8px" }}>{ev.type}</span>
                  </div>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "#10B981", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Calendar size={22} color="#fff" />
                  </div>
                </div>

                {/* Infos */}
                <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#52525b" }}>
                    <Calendar size={14} color="#10B981" /> {ev.date}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#52525b" }}>
                    <MapPin size={14} color="#10B981" /> {ev.location}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#52525b" }}>
                    <Users size={14} color="#10B981" /> {count} / {ev.capacity} participants
                  </div>

                  {/* Barre de remplissage */}
                  <div style={{ height: 6, background: "#f1f5f9", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${fillPct}%`, background: fillPct >= 90 ? "#ef4444" : "#10B981", borderRadius: 3 }} />
                  </div>

                  {ev.description && (
                    <p style={{ fontSize: 13, color: "#71717a", lineHeight: 1.6, margin: 0 }}>{ev.description}</p>
                  )}

                  {/* Organisateur */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "#f8fafc", borderRadius: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#d1fae5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#059669" }}>
                      {ev.user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#18181b" }}>{ev.user.name}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>{ev.user.accountType}</div>
                    </div>
                    <UserCheck size={14} color="#10B981" style={{ marginLeft: "auto" }} />
                    {ev.isOwner && (
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#059669", background: "#d1fae5", borderRadius: 6, padding: "2px 8px" }}>
                        Mon evenement
                      </span>
                    )}
                  </div>

                  {/* Bouton Participer */}
                  {ev.isOwner ? (
                    // Événement de l'utilisateur courant — pas de bouton participer
                    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 10, background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                      <CheckCircle size={15} color="#16a34a" />
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#16a34a" }}>Vous etes l'organisateur</span>
                    </div>
                  ) : alreadyParticipating ? (
                    // Déjà inscrit
                    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 10, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
                      <Clock size={15} color="#2563eb" />
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#2563eb" }}>Demande de participation envoyee</span>
                    </div>
                  ) : (
                    // Bouton Participer
                    <button
                      onClick={() => requestParticipation(ev.id)}
                      disabled={isSending}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        padding: "11px 16px",
                        borderRadius: 10,
                        border: "none",
                        background: isSending ? "#d1d5db" : "#10B981",
                        color: "#fff",
                        fontSize: 14,
                        fontWeight: 700,
                        cursor: isSending ? "not-allowed" : "pointer",
                        transition: "background 0.2s",
                      }}
                    >
                      <UserPlus size={16} />
                      {isSending ? "Envoi en cours..." : "Participer"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
