"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import { Calendar, MapPin, Users, AlertCircle } from "lucide-react";

interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  status: string;
  type: string;
  participants: any[];
  budget?: {
    totalAmount: number;
    categories: any[];
  };
  user: {
    name: string;
    email: string;
  };
}

export default function ProviderEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    serviceType: "",
    dateFrom: "",
    dateTo: ""
  });

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const fetchEvents = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.serviceType) params.append("serviceType", filters.serviceType);
      if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
      if (filters.dateTo) params.append("dateTo", filters.dateTo);

      const response = await fetch(`/api/providers/events?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
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
      <Header title="Événements" subtitle="Événements auxquels vous devez prester" />

      <div style={{ padding: "28px", display: "flex", flexDirection: "column", gap: 28 }}>
        {/* FILTERS */}
        <div style={{ background: "#fff", borderRadius: 28, border: "1px solid #f1f5f9", padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom: 16 }}>
            Filtres
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6 }}>
                Statut
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "1px solid #e2e8f0",
                  fontSize: 14
                }}
              >
                <option value="">Tous</option>
                <option value="Planifié">Planifié</option>
                <option value="En cours">En cours</option>
                <option value="Terminé">Terminé</option>
              </select>
            </div>
          </div>
        </div>

        {/* EVENTS LIST */}
        {events.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {events.map((event) => (
              <div key={event.id} style={{ background: "#fff", borderRadius: 28, border: "1px solid #f1f5f9", padding: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 16 }}>
                  <div>
                    <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>
                      {event.name}
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#64748b" }}>
                        <Calendar size={16} />
                        <span>{event.date}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#64748b" }}>
                        <MapPin size={16} />
                        <span>{event.location}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#64748b" }}>
                        <Users size={16} />
                        <span>{event.participants.length} participants</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#fff", background: "#10B981", padding: "6px 12px", borderRadius: 6, display: "inline-block" }}>
                      {event.status}
                    </span>
                  </div>
                </div>

                {event.budget && (
                  <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 16 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 8 }}>
                      Budget: {(event.budget.totalAmount / 1000).toFixed(0)}k FCFA
                    </p>
                    {event.budget.categories.length > 0 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {event.budget.categories.map((cat: any, idx: number) => (
                          <div key={idx} style={{ fontSize: 12, color: "#64748b", display: "flex", justifyContent: "space-between" }}>
                            <span>{cat.name}</span>
                            <span>{(cat.allocatedAmount / 1000).toFixed(0)}k FCFA</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ background: "#fff", borderRadius: 28, border: "1px solid #f1f5f9", padding: 40, textAlign: "center" }}>
            <AlertCircle size={48} color="#94a3b8" style={{ margin: "0 auto 16px" }} />
            <p style={{ color: "#94a3b8", fontSize: 16 }}>Aucun événement pour le moment</p>
          </div>
        )}
      </div>
    </div>
  );
}
