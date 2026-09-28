"use client";
import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { Field, inputStyle, selectStyle } from "@/components/ui/Field";
import { useStore, Depense } from "@/lib/store/useStore";

interface Props {
  open: boolean;
  onClose: () => void;
  depense?: Depense | null;
  eventId?: number;
}

const cats = ["Lieu", "Équipement", "Restauration", "Communication", "Transport", "Animation", "Logistique", "Autre"];

export default function DepenseModal({ open, onClose, depense, eventId = 1 }: Props) {
  const { addDepense, updateDepense } = useStore();
  const isEdit = !!depense;

  const [form, setForm] = useState({ description: "", category: "Lieu", date: "", montant: "" });

  useEffect(() => {
    if (depense) setForm({ description: depense.description, category: depense.category, date: depense.date, montant: String(depense.montant) });
    else setForm({ description: "", category: "Lieu", date: "", montant: "" });
  }, [depense, open]);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.description || !form.montant) return;
    const data = { eventId, description: form.description, category: form.category, date: form.date || new Date().toISOString().split('T')[0], montant: Number(form.montant) };
    if (isEdit && depense) updateDepense(depense.id, data);
    else addDepense(data);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Modifier la dépense" : "Ajouter une dépense"}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Field label="Libellé *">
          <input style={inputStyle} value={form.description} onChange={e => set("description", e.target.value)} placeholder="Ex: Location salle Hilton" />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Catégorie">
            <select style={selectStyle} value={form.category} onChange={e => set("category", e.target.value)}>
              {cats.map(c => <option key={c}>{c}</option>)}
            </select>
          </Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Montant (FCFA) *">
            <input style={inputStyle} type="number" value={form.montant} onChange={e => set("montant", e.target.value)} placeholder="50000" />
          </Field>
          <Field label="Date">
            <input style={inputStyle} value={form.date} onChange={e => set("date", e.target.value)} placeholder="Ex: 14 Juin" />
          </Field>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 4 }}>
          <button onClick={onClose} style={{ background: "none", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 20px", color: "var(--text-muted)", fontSize: 14, cursor: "pointer" }}>Annuler</button>
          <button onClick={handleSubmit} style={{ background: "var(--accent)", border: "none", borderRadius: 8, padding: "10px 24px", color: "#0a0a0a", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Syne, sans-serif" }}>
            {isEdit ? "Enregistrer" : "Ajouter"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
