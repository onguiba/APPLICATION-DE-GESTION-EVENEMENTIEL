"use client";
import { useState, useEffect, useRef } from "react";
import Modal from "@/components/ui/Modal";
import { Field, inputStyle, selectStyle } from "@/components/ui/Field";
import { useStore, Participant } from "@/lib/store/useStore";
import { Download, Copy, Check, AlertCircle } from "lucide-react";
import QRCode from "qrcode";

interface Props {
  open: boolean;
  onClose: () => void;
  participant?: Participant | null;
  eventId?: number;
  eventLink?: string;
}

export default function ParticipantModal({ open, onClose, participant, eventId = 1, eventLink = "" }: Props) {
  const { addParticipant, updateParticipant, events } = useStore();
  const isEdit = !!participant;
  const [showQR, setShowQR] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [participantName, setParticipantName] = useState("");
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [form, setForm] = useState({
    name: "", email: "", phone: "", event: "", type: "Standard", statut: "En attente", paiement: "En attente", montant: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (participant) {
      setForm({ name: participant.name, email: participant.email, phone: participant.phone, event: participant.event, type: participant.type, statut: participant.statut, paiement: participant.paiement, montant: String(participant.montant) });
    } else {
      setForm({ name: "", email: "", phone: "", event: events[0]?.name || "", type: "Standard", statut: "En attente", paiement: "En attente", montant: "" });
    }
    setError(null);
  }, [participant, open, events]);

  useEffect(() => {
    if (showQR && canvasRef.current && qrCode) {
      QRCode.toCanvas(canvasRef.current, qrCode, {
        width: 250,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      }).catch((err: Error) => console.error("QR Code error:", err));
    }
  }, [showQR, qrCode]);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.name || !form.email) return;
    
    setError(null);
    setLoading(true);
    
    // Generate unique QR code
    const uniqueQRCode = `${Math.random().toString(36).substr(2, 12)}`;
    const accessLink = `${window.location.origin}/events/${eventLink}/participant/${uniqueQRCode}`;
    
    const data = {
      eventId, 
      name: form.name, 
      email: form.email, 
      phone: form.phone,
      status: form.statut,
      paymentStatus: form.paiement, 
      amount: Number(form.montant) || 0,
      qrCode: uniqueQRCode, // Include QR code in request
    };
    
    if (isEdit && participant) {
      updateParticipant(participant.id, data);
      onClose();
    } else {
      // Create participant via API to save QR code to database
      try {
        const response = await fetch('/api/participants', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        
        const responseData = await response.json();
        
        if (response.ok) {
          // Add to local store
          addParticipant({
            eventId,
            name: form.name,
            email: form.email,
            phone: form.phone,
            event: form.event,
            type: form.type as Participant["type"],
            statut: form.statut as Participant["statut"],
            paiement: form.paiement as Participant["paiement"],
            montant: Number(form.montant) || 0,
          });
          
          // Show QR code
          setQrCode(accessLink);
          setParticipantName(form.name);
          setShowQR(true);
        } else {
          setError(responseData.error || 'Erreur lors de la création du participant');
          console.error('Failed to create participant:', responseData);
        }
      } catch (error) {
        setError('Erreur de connexion au serveur');
        console.error('Error creating participant:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(qrCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    if (canvasRef.current) {
      const link = document.createElement("a");
      link.href = canvasRef.current.toDataURL("image/png");
      link.download = `participant-qr-${participantName}.png`;
      link.click();
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Modifier le participant" : "Ajouter un participant"} width={600}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {!showQR ? (
          <>
            {error && (
              <div
                style={{
                  background: "#fee2e2",
                  border: "1px solid #fca5a5",
                  borderRadius: 12,
                  padding: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <AlertCircle size={18} color="#ef4444" />
                <span style={{ fontSize: 13, color: "#991b1b", fontWeight: 600 }}>
                  {error}
                </span>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Nom complet *">
                <input style={inputStyle} value={form.name} onChange={e => set("name", e.target.value)} placeholder="Nom complet" />
              </Field>
              <Field label="Email *">
                <input style={inputStyle} type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="email@exemple.com" />
              </Field>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Téléphone">
                <input style={inputStyle} value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+237 6XX XXX XXX" />
              </Field>
              <Field label="Événement">
                <select style={selectStyle} value={form.event} onChange={e => set("event", e.target.value)}>
                  {events.map(ev => <option key={ev.id} value={ev.name}>{ev.name.substring(0, 30)}</option>)}
                </select>
              </Field>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <Field label="Type billet">
                <select style={selectStyle} value={form.type} onChange={e => set("type", e.target.value)}>
                  {["Standard", "VIP", "Table"].map(t => <option key={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Statut">
                <select style={selectStyle} value={form.statut} onChange={e => set("statut", e.target.value)}>
                  {["Confirmé", "En attente", "Annulé"].map(s => <option key={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Paiement">
                <select style={selectStyle} value={form.paiement} onChange={e => set("paiement", e.target.value)}>
                  {["Payé", "En attente", "Remboursé"].map(p => <option key={p}>{p}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Montant (FCFA)">
              <input style={inputStyle} type="number" value={form.montant} onChange={e => set("montant", e.target.value)} placeholder="8000" />
            </Field>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 4 }}>
              <button onClick={onClose} disabled={loading} style={{ background: "none", border: "1px solid #d1d5db", borderRadius: 8, padding: "10px 20px", color: "#6b7280", fontSize: 14, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}>Annuler</button>
              <button onClick={handleSubmit} disabled={loading} style={{ background: loading ? "#d1d5db" : "#10B981", border: "none", borderRadius: 8, padding: "10px 24px", color: "#fff", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "Syne, sans-serif", opacity: loading ? 0.6 : 1 }}>
                {loading ? "Création en cours..." : isEdit ? "Enregistrer" : "Ajouter"}
              </button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center" }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#1f2937" }}>
              Code QR - {participantName}
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

            <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 16 }}>
              Partagez ce code QR avec le participant pour qu'il accède aux informations de l'événement
            </p>

            <div style={{
              background: "#f3f4f6",
              border: "1px solid #d1d5db",
              borderRadius: 12,
              padding: 12,
              marginBottom: 20,
              display: "flex",
              gap: 8,
              alignItems: "center",
            }}>
              <input
                type="text"
                value={qrCode}
                readOnly
                style={{
                  ...inputStyle,
                  background: "#fff",
                  fontSize: 11,
                  flex: 1,
                }}
              />
              <button
                onClick={copyToClipboard}
                style={{
                  background: "#10B981",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 12px",
                  color: "#fff",
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
                  border: "1px solid #d1d5db",
                  borderRadius: 8,
                  padding: "12px 16px",
                  color: "#6b7280",
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
                  background: "#10B981",
                  border: "none",
                  borderRadius: 8,
                  padding: "12px 16px",
                  color: "#fff",
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
                background: "#10B981",
                border: "none",
                borderRadius: 8,
                padding: "12px 16px",
                color: "#fff",
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
