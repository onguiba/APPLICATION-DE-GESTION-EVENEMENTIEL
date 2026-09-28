"use client";
import Modal from "@/components/ui/Modal";
import { AlertTriangle } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

export default function ConfirmDialog({ open, onClose, onConfirm, title, description }: Props) {
  return (
    <Modal open={open} onClose={onClose} title="Confirmation" width={400}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 16 }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(255,77,77,0.1)", border: "1px solid rgba(255,77,77,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <AlertTriangle size={24} color="var(--red)" />
        </div>
        <div>
          <h3 style={{ fontSize: 16, fontFamily: "Syne, sans-serif", fontWeight: 700, marginBottom: 8 }}>{title}</h3>
          <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.5 }}>{description}</p>
        </div>
        <div style={{ display: "flex", gap: 8, width: "100%" }}>
          <button onClick={onClose} style={{ flex: 1, background: "none", border: "1px solid var(--border)", borderRadius: 8, padding: "10px", color: "var(--text-muted)", fontSize: 14, cursor: "pointer" }}>
            Annuler
          </button>
          <button onClick={() => { onConfirm(); onClose(); }} style={{ flex: 1, background: "var(--red)", border: "none", borderRadius: 8, padding: "10px", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Syne, sans-serif" }}>
            Supprimer
          </button>
        </div>
      </div>
    </Modal>
  );
}
