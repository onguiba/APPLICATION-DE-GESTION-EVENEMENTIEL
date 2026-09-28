"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import { Search, Filter, AlertCircle } from "lucide-react";

interface Participant {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  paymentStatus: string;
  amount: number;
  createdAt: string;
  event: {
    id: number;
    name: string;
    budget?: {
      totalAmount: number;
      categories: any[];
    };
  };
}

export default function ProviderParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: "",
    paymentStatus: "",
    eventId: "",
    dateFrom: "",
    dateTo: ""
  });

  useEffect(() => {
    fetchParticipants();
  }, [filters]);

  const fetchParticipants = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.name) params.append("name", filters.name);
      if (filters.paymentStatus) params.append("paymentStatus", filters.paymentStatus);
      if (filters.eventId) params.append("eventId", filters.eventId);
      if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
      if (filters.dateTo) params.append("dateTo", filters.dateTo);

      const response = await fetch(`/api/providers/participants?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setParticipants(data);
      }
    } catch (error) {
      console.error("Error fetching participants:", error);
    } finally {
      setLoading(false);
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
      <Header title="Participants" subtitle="Gérez les participants de vos événements" />

      <div style={{ padding: "28px", display: "flex", flexDirection: "column", gap: 28 }}>
        {/* FILTERS */}
        <div style={{ background: "#fff", borderRadius: 28, border: "1px solid #f1f5f9", padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom: 16 }}>
            Filtres
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6 }}>
                Nom
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f8fafc", borderRadius: 8, padding: "8px 12px", border: "1px solid #e2e8f0" }}>
                <Search size={16} color="#94a3b8" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={filters.name}
                  onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                  style={{
                    flex: 1,
                    border: "none",
                    background: "transparent",
                    fontSize: 14,
                    outline: "none"
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6 }}>
                Statut de paiement
              </label>
              <select
                value={filters.paymentStatus}
                onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value })}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "1px solid #e2e8f0",
                  fontSize: 14
                }}
              >
                <option value="">Tous</option>
                <option value="Payé">Payé</option>
                <option value="En attente">En attente</option>
                <option value="Remboursé">Remboursé</option>
              </select>
            </div>
          </div>
        </div>

        {/* PARTICIPANTS LIST */}
        {participants.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {participants.map((participant) => (
              <div key={participant.id} style={{ background: "#fff", borderRadius: 28, border: "1px solid #f1f5f9", padding: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 16 }}>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>
                      {participant.name}
                    </h3>
                    <p style={{ color: "#64748b", fontSize: 14, marginBottom: 12 }}>
                      {participant.email} • {participant.phone}
                    </p>
                    <p style={{ color: "#64748b", fontSize: 14, marginBottom: 12 }}>
                      Événement: <strong>{participant.event.name}</strong>
                    </p>
                    <div style={{ display: "flex", gap: 12 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#fff", background: "#10B981", padding: "4px 12px", borderRadius: 6 }}>
                        {participant.status}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: participant.paymentStatus === "Payé" ? "#22c55e" : "#059669", background: participant.paymentStatus === "Payé" ? "#dcfce7" : "#d1fae5", padding: "4px 12px", borderRadius: 6 }}>
                        {participant.paymentStatus}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: 20, fontWeight: 800, color: "#10B981", marginBottom: 8 }}>
                      {(participant.amount / 1000).toFixed(0)}k FCFA
                    </p>
                    <p style={{ fontSize: 12, color: "#94a3b8" }}>
                      Inscrit le {new Date(participant.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>

                {participant.event.budget && (
                  <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 16 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 12 }}>
                      Répartition du budget: {(participant.event.budget.totalAmount / 1000).toFixed(0)}k FCFA
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
                      {participant.event.budget.categories.map((cat: any, idx: number) => (
                        <div key={idx} style={{ background: "#f8fafc", borderRadius: 12, padding: 12 }}>
                          <p style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>
                            {cat.name}
                          </p>
                          <p style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>
                            {(cat.allocatedAmount / 1000).toFixed(0)}k FCFA
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ background: "#fff", borderRadius: 28, border: "1px solid #f1f5f9", padding: 40, textAlign: "center" }}>
            <AlertCircle size={48} color="#94a3b8" style={{ margin: "0 auto 16px" }} />
            <p style={{ color: "#94a3b8", fontSize: 16 }}>Aucun participant pour le moment</p>
          </div>
        )}
      </div>
    </div>
  );
}
