"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import { Plus, Edit2, Trash2, AlertCircle } from "lucide-react";

interface ServiceOffer {
  id: number;
  serviceType: string;
  description: string;
  price: number;
  status: string;
  createdAt: string;
}

export default function ProviderActualitePage() {
  const [offers, setOffers] = useState<ServiceOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    serviceType: "",
    description: "",
    price: "",
    status: "Publiée"
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await fetch("/api/providers/offers");
      if (response.ok) {
        const data = await response.json();
        setOffers(data);
      }
    } catch (error) {
      console.error("Error fetching offers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingId 
        ? `/api/providers/offers/${editingId}`
        : "/api/providers/offers";
      
      const method = editingId ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setFormData({ serviceType: "", description: "", price: "", status: "Publiée" });
        setEditingId(null);
        setShowForm(false);
        fetchOffers();
      }
    } catch (error) {
      console.error("Error saving offer:", error);
    }
  };

  const handleEdit = (offer: ServiceOffer) => {
    setFormData({
      serviceType: offer.serviceType,
      description: offer.description,
      price: offer.price.toString(),
      status: offer.status
    });
    setEditingId(offer.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette offre?")) return;
    
    try {
      const response = await fetch(`/api/providers/offers/${id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        fetchOffers();
      }
    } catch (error) {
      console.error("Error deleting offer:", error);
    }
  };

  if (loading) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <p style={{ color: "#94a3b8" }}>Chargement...</p>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#f8fafc", minHeight: "100vh" }}>
      <Header title="Actualité" subtitle="Publiez et gérez vos offres de services" />

      <div style={{ padding: "28px", display: "flex", flexDirection: "column", gap: 28 }}>
        {/* FORM SECTION */}
        {showForm && (
          <div style={{ background: "#fff", borderRadius: 28, border: "1px solid #f1f5f9", padding: 28 }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 20 }}>
              {editingId ? "Modifier l'offre" : "Créer une nouvelle offre"}
            </h3>
            
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 8 }}>
                  Type de service
                </label>
                <input
                  type="text"
                  placeholder="ex: Catering, Décoration, Photographie"
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  required
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    fontSize: 14,
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 8 }}>
                  Description
                </label>
                <textarea
                  placeholder="Décrivez votre offre en détail"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    fontSize: 14,
                    minHeight: 100,
                    boxSizing: "border-box",
                    fontFamily: "inherit"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 8 }}>
                  Prix (FCFA)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    fontSize: 14,
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    background: "#10B981",
                    color: "#fff",
                    border: "none",
                    borderRadius: 12,
                    padding: "12px 20px",
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  {editingId ? "Mettre à jour" : "Publier l'offre"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({ serviceType: "", description: "", price: "", status: "Publiée" });
                  }}
                  style={{
                    flex: 1,
                    background: "#e2e8f0",
                    color: "#111827",
                    border: "none",
                    borderRadius: 12,
                    padding: "12px 20px",
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* OFFERS LIST */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "#10B981",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "12px 20px",
              fontWeight: 600,
              cursor: "pointer",
              width: "fit-content"
            }}
          >
            <Plus size={20} />
            Créer une offre
          </button>
        )}

        {offers.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {offers.map((offer) => (
              <div key={offer.id} style={{ background: "#fff", borderRadius: 28, border: "1px solid #f1f5f9", padding: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 16 }}>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>
                      {offer.serviceType}
                    </h3>
                    <p style={{ color: "#64748b", fontSize: 14, marginBottom: 12, lineHeight: 1.6 }}>
                      {offer.description}
                    </p>
                    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                      <span style={{ fontSize: 20, fontWeight: 800, color: "#10B981" }}>
                        {(offer.price / 1000).toFixed(0)}k FCFA
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#22c55e", background: "#dcfce7", padding: "4px 12px", borderRadius: 6 }}>
                        {offer.status}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => handleEdit(offer)}
                      style={{
                        background: "#f1f5f9",
                        border: "none",
                        borderRadius: 8,
                        padding: "8px 12px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 6
                      }}
                    >
                      <Edit2 size={16} color="#64748b" />
                    </button>
                    <button
                      onClick={() => handleDelete(offer.id)}
                      style={{
                        background: "#fee2e2",
                        border: "none",
                        borderRadius: 8,
                        padding: "8px 12px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 6
                      }}
                    >
                      <Trash2 size={16} color="#ef4444" />
                    </button>
                  </div>
                </div>
                <p style={{ fontSize: 12, color: "#94a3b8" }}>
                  Créée le {new Date(offer.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
            ))}
          </div>
        ) : !showForm ? (
          <div style={{ background: "#fff", borderRadius: 28, border: "1px solid #f1f5f9", padding: 40, textAlign: "center" }}>
            <AlertCircle size={48} color="#94a3b8" style={{ margin: "0 auto 16px" }} />
            <p style={{ color: "#94a3b8", fontSize: 16 }}>Aucune offre publiée pour le moment</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
