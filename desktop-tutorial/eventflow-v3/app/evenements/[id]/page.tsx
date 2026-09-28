"use client";
import { useStore } from "@/lib/store/useStore";
import { useParams, useRouter } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import { ArrowLeft, Calendar, MapPin, Users, Wallet, Edit2, Trash2, UserPlus } from "lucide-react";
import { useState } from "react";
import EventModal from "@/components/modals/EventModal";
import ConfirmDialog from "@/components/modals/ConfirmDialog";
import ParticipantModal from "@/components/modals/ParticipantModal";

const statusColor: Record<string, { text: string; bg: string }> = {
  "En cours": { text: "var(--accent)", bg: "rgba(200,245,74,0.1)" },
  "Planifié": { text: "var(--blue)", bg: "rgba(77,159,255,0.1)" },
  "Brouillon": { text: "var(--text-muted)", bg: "var(--bg-3)" },
  "Terminé": { text: "var(--purple)", bg: "rgba(167,139,250,0.1)" },
};

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { events, deleteEvent, participants } = useStore();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [addParticipant, setAddParticipant] = useState(false);

  const ev = events.find(e => e.id === Number(params.id));
  if (!ev) return (
    <AppLayout>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", gap: 16 }}>
        <p style={{ color: "var(--text-muted)", fontSize: 15 }}>Événement introuvable.</p>
        <button onClick={() => router.push("/evenements")} style={{ background: "var(--accent)", border: "none", borderRadius: 8, padding: "9px 20px", color: "#0a0a0a", fontWeight: 700, cursor: "pointer", fontFamily: "Syne, sans-serif" }}>
          Retour aux événements
        </button>
      </div>
    </AppLayout>
  );

  const sc = statusColor[ev.status] || statusColor["Brouillon"];
  const fillPct = Math.round((ev.participants / ev.capacity) * 100);
  const evParticipants = participants.filter(p => p.event.includes(ev.name.split(" ")[0]));

  return (
    <AppLayout>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 32px", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, background: "var(--bg)", zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => router.back()} style={{ width: 34, height: 34, borderRadius: 8, background: "var(--bg-2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text-muted)" }}>
              <ArrowLeft size={15} />
            </button>
            <div>
              <h1 style={{ fontSize: 20, fontFamily: "Syne, sans-serif", fontWeight: 700, letterSpacing: "-0.02em" }}>{ev.name}</h1>
              <span style={{ fontSize: 11, fontWeight: 600, color: sc.text, background: sc.bg, borderRadius: 100, padding: "2px 10px" }}>{ev.status}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setAddParticipant(true)} style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 14px", fontSize: 13, color: "var(--text-muted)", cursor: "pointer" }}>
              <UserPlus size={14} /> Ajouter participant
            </button>
            <button onClick={() => setEditOpen(true)} style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 14px", fontSize: 13, color: "var(--text-muted)", cursor: "pointer" }}>
              <Edit2 size={14} /> Modifier
            </button>
            <button onClick={() => setDeleteOpen(true)} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,77,77,0.1)", border: "1px solid rgba(255,77,77,0.2)", borderRadius: 8, padding: "8px 14px", fontSize: 13, color: "var(--red)", cursor: "pointer" }}>
              <Trash2 size={14} /> Supprimer
            </button>
          </div>
        </div>

        <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Hero card */}
          <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ height: 120, background: "var(--bg-3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 60 }}>{ev.img}</span>
            </div>
            <div style={{ padding: 24 }}>
              {ev.description && <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7, marginBottom: 20 }}>{ev.description}</p>}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
                {[
                  { icon: Calendar, label: "Date", value: ev.date },
                  { icon: MapPin, label: "Lieu", value: ev.location },
                  { icon: Users, label: "Participants", value: `${ev.participants} / ${ev.capacity}` },
                  { icon: Wallet, label: "Budget", value: `${(ev.budget / 1000).toFixed(0)}k FCFA` },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--bg-3)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={14} color="var(--accent)" strokeWidth={1.5} />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 2 }}>{label}</div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Fill rate */}
          <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <h3 style={{ fontSize: 15, fontFamily: "Syne, sans-serif", fontWeight: 700 }}>Taux de remplissage</h3>
              <span style={{ fontSize: 20, fontFamily: "Syne, sans-serif", fontWeight: 800, color: fillPct > 80 ? "var(--accent)" : "var(--text)" }}>{fillPct}%</span>
            </div>
            <div style={{ height: 10, background: "var(--bg-3)", borderRadius: 5, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${fillPct}%`, background: fillPct > 80 ? "var(--accent)" : "var(--blue)", borderRadius: 5, transition: "width 0.8s ease" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 12, color: "var(--text-muted)" }}>
              <span>{ev.participants} inscrits</span><span>{ev.capacity - ev.participants} places restantes</span>
            </div>
          </div>

          {/* Participants list */}
          {evParticipants.length > 0 && (
            <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "18px 20px", borderBottom: "1px solid var(--border)" }}>
                <h3 style={{ fontSize: 15, fontFamily: "Syne, sans-serif", fontWeight: 700 }}>Participants ({evParticipants.length})</h3>
              </div>
              <div>
                {evParticipants.map((p, i) => (
                  <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 20px", borderBottom: i < evParticipants.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <div style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#0a0a0a", flexShrink: 0 }}>
                        {p.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{p.email}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: p.statut === "Confirmé" ? "var(--accent)" : p.statut === "En attente" ? "var(--orange)" : "var(--red)", background: p.statut === "Confirmé" ? "rgba(200,245,74,0.1)" : p.statut === "En attente" ? "rgba(255,156,77,0.1)" : "rgba(255,77,77,0.1)", borderRadius: 100, padding: "3px 10px" }}>
                        {p.statut}
                      </span>
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{p.type}</span>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{(p.montant / 1000).toFixed(0)}k FCFA</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <EventModal open={editOpen} onClose={() => setEditOpen(false)} event={ev} />
      <ConfirmDialog open={deleteOpen} onClose={() => setDeleteOpen(false)}
        onConfirm={() => { deleteEvent(ev.id); router.push("/evenements"); }}
        title="Supprimer cet événement ?" description="Cette action est irréversible." />
      <ParticipantModal open={addParticipant} onClose={() => setAddParticipant(false)} />
    </AppLayout>
  );
}
