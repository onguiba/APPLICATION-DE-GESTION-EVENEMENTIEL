"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { Field, inputStyle, selectStyle } from "@/components/ui/Field";
import { X, Plus, AlertCircle, CheckCircle } from "lucide-react";

interface ServiceOfferModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ServiceOfferModal({
  open,
  onClose,
  onSuccess,
}: ServiceOfferModalProps) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "Catering",
    servicesIncluded: [""],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    if (!open) {
      setForm({
        name: "",
        description: "",
        price: "",
        category: "Catering",
        servicesIncluded: [""],
      });
      setError(null);
      setSuccess(false);
      setValidationErrors([]);
    }
  }, [open]);

  const set = (k: string, v: any) => {
    setForm((f) => ({ ...f, [k]: v }));
    setError(null);
    setValidationErrors([]);
  };

  const addService = () => {
    setForm((f) => ({
      ...f,
      servicesIncluded: [...f.servicesIncluded, ""],
    }));
  };

  const removeService = (index: number) => {
    setForm((f) => ({
      ...f,
      servicesIncluded: f.servicesIncluded.filter((_, i) => i !== index),
    }));
  };

  const updateService = (index: number, value: string) => {
    setForm((f) => ({
      ...f,
      servicesIncluded: f.servicesIncluded.map((s, i) =>
        i === index ? value : s
      ),
    }));
  };

  const handleSubmit = async () => {
    setError(null);
    setValidationErrors([]);
    setLoading(true);

    try {
      const response = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: parseFloat(form.price),
          category: form.category,
          servicesIncluded: form.servicesIncluded.filter((s) => s.trim() !== ""),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.details && Array.isArray(data.details)) {
          setValidationErrors(data.details);
        } else {
          setError(data.error || "Une erreur est survenue");
        }
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
        onSuccess?.();
      }, 2000);
    } catch (err) {
      setError("Erreur de connexion au serveur");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Ajouter une offre de service"
      width={700}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* SUCCESS MESSAGE */}
        {success && (
          <div
            style={{
              background: "#dcfce7",
              border: "1px solid #86efac",
              borderRadius: 12,
              padding: 16,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <CheckCircle size={20} color="#22c55e" />
            <div>
              <div style={{ fontWeight: 700, color: "#166534" }}>
                Offre créée avec succès!
              </div>
              <div style={{ fontSize: 13, color: "#15803d" }}>
                Votre offre de service a été enregistrée dans la base de données
              </div>
            </div>
          </div>
        )}

        {/* ERROR MESSAGES */}
        {error && (
          <div
            style={{
              background: "#fee2e2",
              border: "1px solid #fca5a5",
              borderRadius: 12,
              padding: 16,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <AlertCircle size={20} color="#ef4444" />
            <div>
              <div style={{ fontWeight: 700, color: "#991b1b" }}>
                Erreur
              </div>
              <div style={{ fontSize: 13, color: "#7f1d1d" }}>
                {error}
              </div>
            </div>
          </div>
        )}

        {validationErrors.length > 0 && (
          <div
            style={{
              background: "#d1fae5",
              border: "1px solid #a7f3d0",
              borderRadius: 12,
              padding: 16,
            }}
          >
            <div style={{ fontWeight: 700, color: "#92400e", marginBottom: 8 }}>
              Erreurs de validation:
            </div>
            <ul
              style={{
                margin: 0,
                paddingLeft: 20,
                color: "#78350f",
                fontSize: 13,
              }}
            >
              {validationErrors.map((err, idx) => (
                <li key={idx} style={{ marginBottom: 4 }}>
                  {err}
                </li>
              ))}
            </ul>
          </div>
        )}

        {!success && (
          <>
            {/* FORM FIELDS */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Nom de l'offre *">
                <input
                  style={inputStyle}
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Ex: Catering Premium"
                  disabled={loading}
                />
              </Field>

              <Field label="Catégorie">
                <select
                  style={selectStyle}
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  disabled={loading}
                >
                  <option>Catering</option>
                  <option>Décoration</option>
                  <option>Photographie</option>
                  <option>Sonorisation</option>
                  <option>Transport</option>
                  <option>Animation</option>
                  <option>Autre</option>
                </select>
              </Field>
            </div>

            <Field label="Description *">
              <textarea
                style={{
                  ...inputStyle,
                  minHeight: 100,
                  fontFamily: "inherit",
                  resize: "vertical",
                }}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Décrivez votre offre en détail..."
                disabled={loading}
              />
            </Field>

            <Field label="Prix (FCFA) *">
              <input
                style={inputStyle}
                type="number"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="50000"
                min="0"
                disabled={loading}
              />
            </Field>

            {/* SERVICES INCLUDED */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <label
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#6b7280",
                  }}
                >
                  Services inclus *
                </label>
                <button
                  onClick={addService}
                  disabled={loading}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#10B981",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: 13,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <Plus size={16} />
                  Ajouter
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {form.servicesIncluded.map((service, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                    }}
                  >
                    <input
                      style={{
                        ...inputStyle,
                        flex: 1,
                      }}
                      value={service}
                      onChange={(e) => updateService(idx, e.target.value)}
                      placeholder={`Service ${idx + 1}`}
                      disabled={loading}
                    />
                    {form.servicesIncluded.length > 1 && (
                      <button
                        onClick={() => removeService(idx)}
                        disabled={loading}
                        style={{
                          background: "#fee2e2",
                          border: "1px solid #fca5a5",
                          borderRadius: 8,
                          width: 36,
                          height: 36,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          color: "#ef4444",
                        }}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* BUTTONS */}
            <div
              style={{
                display: "flex",
                gap: 8,
                justifyContent: "flex-end",
                marginTop: 12,
              }}
            >
              <button
                onClick={onClose}
                disabled={loading}
                style={{
                  background: "none",
                  border: "1px solid #d1d5db",
                  borderRadius: 8,
                  padding: "10px 20px",
                  color: "#6b7280",
                  fontSize: 14,
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  background: loading
                    ? "#d1d5db"
                    : "linear-gradient(135deg,#10B981,#6EE7B7)",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 24px",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "Syne, sans-serif",
                }}
              >
                {loading ? "Création en cours..." : "Créer l'offre"}
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
