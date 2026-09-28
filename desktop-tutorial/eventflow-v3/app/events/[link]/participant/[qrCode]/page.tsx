"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Calendar, MapPin, Users, Ticket, CheckCircle, XCircle } from "lucide-react";

interface ParticipantData {
  participantId: number;
  participantName: string;
  participantEmail: string;
  eventId: number;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  eventCapacity: number;
  eventType: string;
  eventDescription: string;
  participantStatus: string;
  paymentStatus: string;
  amount: number;
  totalParticipants: number;
}

export default function ParticipantAccessPage() {
  const params = useParams();
  const link = params.link as string;
  const qrCode = params.qrCode as string;
  const [data, setData] = useState<ParticipantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParticipantData = async () => {
      try {
        const response = await fetch(`/api/participants/access/${qrCode}?eventLink=${link}`);
        if (response.ok) {
          const participantData = await response.json();
          setData(participantData);
        } else {
          setError("Accès refusé ou participant non trouvé");
        }
      } catch (err) {
        console.error("Error fetching participant data:", err);
        setError("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchParticipantData();
  }, [link, qrCode]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "#fff",
        }}
      >
        <p style={{ fontSize: 18 }}>Chargement...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "#fff",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <XCircle size={48} style={{ marginBottom: 16 }} />
          <p style={{ fontSize: 18 }}>{error || "Données non trouvées"}</p>
        </div>
      </div>
    );
  }

  const statusColor = {
    "Confirmé": "#10B981",
    "En attente": "#F59E0B",
    "Annulé": "#EF4444",
  };

  const paymentColor = {
    "Payé": "#10B981",
    "En attente": "#F59E0B",
    "Remboursé": "#3B82F6",
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        minHeight: "100vh",
        padding: "40px 24px",
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: 24,
            padding: 40,
            marginBottom: 24,
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          }}
        >
          <div style={{ marginBottom: 24 }}>
            <p
              style={{
                color: "#6B7280",
                fontSize: 14,
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              BIENVENUE
            </p>
            <h1
              style={{
                fontSize: 32,
                fontFamily: "Syne, sans-serif",
                fontWeight: 700,
                color: "#1F2937",
                marginBottom: 8,
              }}
            >
              {data.participantName}
            </h1>
            <p style={{ color: "#6B7280", fontSize: 16 }}>
              {data.participantEmail}
            </p>
          </div>

          {/* Status Badges */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div
              style={{
                background: `${statusColor[data.participantStatus as keyof typeof statusColor] || "#6B7280"}20`,
                border: `2px solid ${statusColor[data.participantStatus as keyof typeof statusColor] || "#6B7280"}`,
                borderRadius: 12,
                padding: "8px 16px",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <CheckCircle
                size={16}
                color={statusColor[data.participantStatus as keyof typeof statusColor] || "#6B7280"}
              />
              <span
                style={{
                  fontWeight: 600,
                  color: statusColor[data.participantStatus as keyof typeof statusColor] || "#6B7280",
                }}
              >
                {data.participantStatus}
              </span>
            </div>

            <div
              style={{
                background: `${paymentColor[data.paymentStatus as keyof typeof paymentColor] || "#6B7280"}20`,
                border: `2px solid ${paymentColor[data.paymentStatus as keyof typeof paymentColor] || "#6B7280"}`,
                borderRadius: 12,
                padding: "8px 16px",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Ticket
                size={16}
                color={paymentColor[data.paymentStatus as keyof typeof paymentColor] || "#6B7280"}
              />
              <span
                style={{
                  fontWeight: 600,
                  color: paymentColor[data.paymentStatus as keyof typeof paymentColor] || "#6B7280",
                }}
              >
                {data.paymentStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Event Information */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: 24,
            padding: 40,
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          }}
        >
          <h2
            style={{
              fontSize: 24,
              fontFamily: "Syne, sans-serif",
              fontWeight: 700,
              color: "#1F2937",
              marginBottom: 28,
            }}
          >
            Informations de l'événement
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: 24,
              marginBottom: 32,
            }}
          >
            <div
              style={{
                background: "#F3F4F6",
                borderRadius: 16,
                padding: 20,
              }}
            >
              <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: "#667eea",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Calendar size={20} color="#fff" />
                </div>
                <div>
                  <p style={{ fontSize: 12, color: "#6B7280", fontWeight: 600 }}>
                    DATE
                  </p>
                  <p style={{ fontSize: 16, fontWeight: 700, color: "#1F2937" }}>
                    {data.eventDate}
                  </p>
                </div>
              </div>
            </div>

            <div
              style={{
                background: "#F3F4F6",
                borderRadius: 16,
                padding: 20,
              }}
            >
              <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: "#667eea",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MapPin size={20} color="#fff" />
                </div>
                <div>
                  <p style={{ fontSize: 12, color: "#6B7280", fontWeight: 600 }}>
                    LIEU
                  </p>
                  <p style={{ fontSize: 16, fontWeight: 700, color: "#1F2937" }}>
                    {data.eventLocation}
                  </p>
                </div>
              </div>
            </div>

            <div
              style={{
                background: "#F3F4F6",
                borderRadius: 16,
                padding: 20,
              }}
            >
              <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: "#667eea",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Users size={20} color="#fff" />
                </div>
                <div>
                  <p style={{ fontSize: 12, color: "#6B7280", fontWeight: 600 }}>
                    PARTICIPANTS
                  </p>
                  <p style={{ fontSize: 16, fontWeight: 700, color: "#1F2937" }}>
                    {data.totalParticipants} / {data.eventCapacity}
                  </p>
                </div>
              </div>
            </div>

            <div
              style={{
                background: "#F3F4F6",
                borderRadius: 16,
                padding: 20,
              }}
            >
              <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: "#667eea",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ticket size={20} color="#fff" />
                </div>
                <div>
                  <p style={{ fontSize: 12, color: "#6B7280", fontWeight: 600 }}>
                    TYPE
                  </p>
                  <p style={{ fontSize: 16, fontWeight: 700, color: "#1F2937" }}>
                    {data.eventType}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {data.eventDescription && (
            <div
              style={{
                background: "#F9FAFB",
                borderRadius: 16,
                padding: 20,
                borderLeft: "4px solid #667eea",
              }}
            >
              <p style={{ fontSize: 12, color: "#6B7280", fontWeight: 600, marginBottom: 8 }}>
                DESCRIPTION
              </p>
              <p style={{ color: "#4B5563", lineHeight: 1.6 }}>
                {data.eventDescription}
              </p>
            </div>
          )}

          {/* Payment Info */}
          <div
            style={{
              marginTop: 32,
              padding: 20,
              background: "#F0F9FF",
              borderRadius: 16,
              borderLeft: "4px solid #3B82F6",
            }}
          >
            <p style={{ fontSize: 12, color: "#1E40AF", fontWeight: 600, marginBottom: 8 }}>
              MONTANT À PAYER
            </p>
            <p style={{ fontSize: 28, fontWeight: 700, color: "#1E40AF" }}>
              {data.amount.toLocaleString()} FCFA
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
