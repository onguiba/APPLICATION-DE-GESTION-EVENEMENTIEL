"use client";
import { useState, useEffect, useRef } from "react";
import Modal from "@/components/ui/Modal";
import { Field, inputStyle, selectStyle } from "@/components/ui/Field";
import { useStore, AppEvent } from "@/lib/store/useStore";
import { Copy, Check, Download } from "lucide-react";
import QRCode from "qrcode";

const types = ["Conférence", "Gala", "Séminaire", "Festival", "Réunion", "Corporate", "Concert", "Atelier", "Autre"];

interface Props {
  open: boolean;
  onClose: () => void;
  event?: AppEvent | null;
}

export default function EventModal({ open, onClose, event }: Props) {
  const { addEvent, updateEvent } = useStore();
  const isEdit = !!event;
  const [copied, setCopied] = useState(false);
  const [eventLink, setEventLink] = useState("");
  const [showQR, setShowQR] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [form, setForm] = useState<{
    name: string; date: string; location: string; capacity: string; budget: string;
    status: string; type: string; description: string; visibility: "private" | "public";
  }>({
    name: "", date: "", location: "", capacity: "", budget: "",
    status: "Planifié", type: "Conférence", description: "", visibility: "private",
  });

  useEffect(() => {
    if (event) {
      setForm({
        name: event.name, date: event.date, location: event.location,
        capacity: String(event.capacity), budget: String(event.budget),
        status: event.status, type: event.type,
        description: event.description || "", visibility: event.visibility,
      });
    } else {
      setForm({ name: "", date: "", location: "", capacity: "", budget: "", status: "Planifié", type: "Conférence", description: "", visibility: "private" });
    }
  }, [event, open]);

  useEffect(() => {
    if (showQR && canvasRef.current && eventLink) {
      QRCode.toCanvas(canvasRef.current, eventLink, {
        width: 250,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      }).catch((err: Error) => console.error("QR Code error:", err));
    }
  }, [showQR, eventLink]);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.name || !form.date || !form.location) return;
    const data = {
      name: form.name, date: form.date, location: form.location,
      capacity: Number(form.capacity) || 100,
      budget: Number(form.budget) || 0,
      status: form.status as AppEvent["status"],
      type: form.type as AppEvent["type"], img: "🎤",
      description: form.description,
      participants: event?.participants || 0,
      visibility: form.visibility as "public" | "private",
    };
    if (isEdit && event) updateEvent(event.id, data);
    else {
      addEvent(data);
      // Generate unique link for new event
      const uniqueLink = `${window.location.origin}/events/${Math.random().toString(36).substr(2, 9)}`;
      setEventLink(uniqueLink);
      setShowQR(true);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(eventLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    if (canvasRef.current) {
      const link = document.createElement("a");
      link.href = canvasRef.current.toDataURL("image/png");
      link.download = `event-qr-${Date.now()}.png`;
      link.click();
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Modifier l'événement" : "Créer un événement"} width={600}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {!showQR ? (
          <>
            <Field label="Nom de l'événement *">
              <input style={inputStyle} value={form.name} onChange={e => set("name", e.target.value)} placeholder="Ex: Conférence Tech Yaoundé 2025" />
            </Field>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Type">
                <select style={selectStyle} value={form.type} onChange={e => set("type", e.target.value)}>
                  {types.map(t => <option key={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Statut">
                <select style={selectStyle} value={form.status} onChange={e => set("status", e.target.value)}>
                  {["Planifié", "En cours", "Brouillon", "Terminé"].map(s => <option key={s}>{s}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Visibilité">
              <select style={selectStyle} value={form.visibility} onChange={e => set("visibility", e.target.value)}>
                <option value="private">Privé</option>
                <option value="public">Public</option>
              </select>
            </Field>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Date *">
                <input style={inputStyle} value={form.date} onChange={e => set("date", e.target.value)} placeholder="Ex: 14 Juin 2025" />
              </Field>
              <Field label="Lieu *">
                <input style={inputStyle} value={form.location} onChange={e => set("location", e.target.value)} placeholder="Ex: Hilton Yaoundé" />
              </Field>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Capacité">
                <input style={inputStyle} type="number" value={form.capacity} onChange={e => set("capacity", e.target.value)} placeholder="100" />
              </Field>
              <Field label="Budget (FCFA)">
                <input style={inputStyle} type="number" value={form.budget} onChange={e => set("budget", e.target.value)} placeholder="500000" />
              </Field>
            </div>

            <Field label="Description">
              <textarea style={{ ...inputStyle, resize: "vertical" }} rows={3} value={form.description} onChange={e => set("description", e.target.value)} placeholder="Décrivez l'événement..." />
            </Field>

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 4 }}>
              <button onClick={onClose} style={{ background: "none", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 20px", color: "var(--text-muted)", fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                Annuler
              </button>
              <button onClick={handleSubmit} style={{ background: "var(--accent-quaternary)", border: "none", borderRadius: 8, padding: "10px 24px", color: "#0a0a0a", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Syne, sans-serif" }}>
                {isEdit ? "Enregistrer" : "Créer l'événement"}
              </button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center" }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "var(--text-primary)" }}>
              Code QR de l'événement
            </h3>

            <div style={{
              background: "#fff",
              padding: 20,
              borderRadius: 12,
              marginBottom: 20,
              display: "flex",
              justifyContent: "center",
            }}>
              <canvas ref={canvasRef} />
            </div>

            <p style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 16 }}>
              Partagez ce code QR pour permettre aux participants d'accéder à l'événement
            </p>

            <div style={{
              background: "var(--bg-tertiary)",
              border: "1px solid var(--glass-border)",
              borderRadius: 12,
              padding: 12,
              marginBottom: 20,
              display: "flex",
              gap: 8,
              alignItems: "center",
            }}>
              <input
                type="text"
                value={eventLink}
                readOnly
                style={{
                  ...inputStyle,
                  background: "var(--bg-secondary)",
                  fontSize: 11,
                  flex: 1,
                }}
              />
              <button
                onClick={copyToClipboard}
                style={{
                  background: "var(--accent-quaternary)",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 12px",
                  color: "#0a0a0a",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontWeight: 600,
                  fontSize: 12,
                  whiteSpace: "nowrap",
                }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Copié" : "Copier"}
              </button>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setShowQR(false)}
                style={{
                  flex: 1,
                  background: "none",
                  border: "1px solid var(--glass-border)",
                  borderRadius: 8,
                  padding: "12px 16px",
                  color: "var(--text-secondary)",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Retour
              </button>
              <button
                onClick={downloadQR}
                style={{
                  flex: 1,
                  background: "var(--accent-quaternary)",
                  border: "none",
                  borderRadius: 8,
                  padding: "12px 16px",
                  color: "#0a0a0a",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <Download size={16} />
                Télécharger
              </button>
            </div>

            <button
              onClick={onClose}
              style={{
                width: "100%",
                marginTop: 12,
                background: "var(--accent-quaternary)",
                border: "none",
                borderRadius: 8,
                padding: "12px 16px",
                color: "#0a0a0a",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Fermer
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
