"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import { Calendar, MapPin, AlertCircle } from "lucide-react";

interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  status: string;
  participantStatus: string;
}

export default function ParticipantEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/participants/events");
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

    fetchEvents();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Planifié":
        return { bg: "#f0fdf4", text: "#16a34a", label: "Planifié" };
      case "En cours":
        return { bg: "#d1fae5", text: "#059669", label: "En cours" };
      case "Terminé":
        return { bg: "#f3f4f6", text: "#6b7280", label: "Terminé" };
      default:
        return { bg: "#f9f5f0", text: "#f97316", label: status };
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
      <Header title="Mes Événements" subtitle="Événements auxquels vous participez" />

      <div style={{ padding: "28px", display: "flex", flexDirection: "column", gap: 20 }}>
        {events.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {events.map((event) => {
              const statusInfo = getStatusColor(event.status);
              return (
                <div
                  key={event.id}
                  style={{
                    background: "#fff",
                    borderRadius: 16,
                    padding: 24,
                    border: "1px solid #f1f5f9",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", margin: "0 0 12px 0" }}>
                      {event.name}
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#64748b", fontSize: 14 }}>
                        <Calendar size={16} />
                        <span>{event.date}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#64748b", fontSize: 14 }}>
                        <MapPin size={16} />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      background: statusInfo.bg,
                      color: statusInfo.text,
                      padding: "8px 16px",
                      borderRadius: 999,
                      fontWeight: 600,
                      fontSize: 13,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {statusInfo.label}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ background: "#fff", borderRadius: 28, border: "1px solid #f1f5f9", padding: 40, textAlign: "center" }}>
            <AlertCircle size={48} color="#94a3b8" style={{ margin: "0 auto 16px" }} />
            <p style={{ color: "#94a3b8", fontSize: 16, marginBottom: 8 }}>
              Aucun événement pour le moment
            </p>
            <p style={{ color: "#cbd5e1", fontSize: 14, margin: 0 }}>
              Vous verrez ici les événements auxquels vous êtes inscrit
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
