"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Calendar, MapPin, Users, Ticket } from "lucide-react";

interface EventData {
  id: number;
  name: string;
  date: string;
  location: string;
  capacity: number;
  type: string;
  description: string;
  participants: number;
  img: string;
}

export default function EventPage() {
  const params = useParams();
  const link = params.link as string;
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/by-link/${link}`);
        if (response.ok) {
          const data = await response.json();
          setEvent(data);
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [link]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "var(--bg-primary)",
          color: "var(--text-primary)",
        }}
      >
        <p>Chargement...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "var(--bg-primary)",
          color: "var(--text-primary)",
        }}
      >
        <p>Événement non trouvé</p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
        minHeight: "100vh",
        padding: "40px 24px",
      }}
    >
      <div
        style={{
          maxWidth: 800,
          margin: "0 auto",
          background: "var(--bg-secondary)",
          borderRadius: 24,
          padding: 40,
          border: "1px solid var(--glass-border)",
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 16 }}>{event.img}</div>

        <h1
          style={{
            fontSize: 32,
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          {event.name}
        </h1>

        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: 16,
            marginBottom: 32,
          }}
        >
          {event.description}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 20,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              background: "var(--bg-tertiary)",
              borderRadius: 12,
              padding: 16,
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
            }}
          >
            <Calendar size={20} color="var(--accent-quaternary)" />
            <div>
              <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                DATE
              </p>
              <p style={{ fontWeight: 600 }}>{event.date}</p>
            </div>
          </div>

          <div
            style={{
              background: "var(--bg-tertiary)",
              borderRadius: 12,
              padding: 16,
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
            }}
          >
            <MapPin size={20} color="var(--accent-quaternary)" />
            <div>
              <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                LIEU
              </p>
              <p style={{ fontWeight: 600 }}>{event.location}</p>
            </div>
          </div>

          <div
            style={{
              background: "var(--bg-tertiary)",
              borderRadius: 12,
              padding: 16,
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
            }}
          >
            <Users size={20} color="var(--accent-quaternary)" />
            <div>
              <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                PARTICIPANTS
              </p>
              <p style={{ fontWeight: 600 }}>
                {event.participants} / {event.capacity}
              </p>
            </div>
          </div>

          <div
            style={{
              background: "var(--bg-tertiary)",
              borderRadius: 12,
              padding: 16,
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
            }}
          >
            <Ticket size={20} color="var(--accent-quaternary)" />
            <div>
              <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                TYPE
              </p>
              <p style={{ fontWeight: 600 }}>{event.type}</p>
            </div>
          </div>
        </div>

        <button
          style={{
            width: "100%",
            background: "var(--accent-quaternary)",
            border: "none",
            borderRadius: 12,
            padding: "16px 24px",
            color: "#0a0a0a",
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          S'inscrire à l'événement
        </button>
      </div>
    </div>
  );
}
