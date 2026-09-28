"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import { Bell, Calendar, AlertCircle, CheckCircle } from "lucide-react";

interface Notification {
  id: number;
  message: string;
  type: string;
  eventId: number;
  event: {
    name: string;
    date: string;
  };
  createdAt: string;
  read: boolean;
}

export default function ParticipantDashboard() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/participants/notifications");
        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertCircle size={20} color="#ef4444" />;
      case "success":
        return <CheckCircle size={20} color="#22c55e" />;
      default:
        return <Bell size={20} color="#f97316" />;
    }
  };

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case "alert":
        return "#fef2f2";
      case "success":
        return "#f0fdf4";
      default:
        return "#f9f5f015";
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
      <Header title="Actualité" subtitle="Mises à jour de vos événements" />

      <div style={{ padding: "28px", display: "flex", flexDirection: "column", gap: 20 }}>
        {notifications.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {notifications.map((notification) => (
              <div
                key={notification.id}
                style={{
                  background: getBackgroundColor(notification.type),
                  borderRadius: 16,
                  padding: 20,
                  border: "1px solid #e2e8f0",
                  display: "flex",
                  gap: 16,
                  alignItems: "flex-start",
                }}
              >
                <div style={{ marginTop: 2 }}>
                  {getIcon(notification.type)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 8 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: 0 }}>
                      {notification.event?.name || "Notification"}
                    </h3>
                    <span style={{ fontSize: 12, color: "#94a3b8" }}>
                      {new Date(notification.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <p style={{ fontSize: 14, color: "#64748b", margin: 0, lineHeight: 1.5 }}>
                    {notification.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ background: "#fff", borderRadius: 28, border: "1px solid #f1f5f9", padding: 40, textAlign: "center" }}>
            <Bell size={48} color="#94a3b8" style={{ margin: "0 auto 16px" }} />
            <p style={{ color: "#94a3b8", fontSize: 16, marginBottom: 8 }}>
              Aucune notification pour le moment
            </p>
            <p style={{ color: "#cbd5e1", fontSize: 14, margin: 0 }}>
              Vous recevrez des notifications pour les événements auxquels vous participez
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
