"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import { Bell, AlertCircle, CheckCircle, Info, Trash2, Check } from "lucide-react";

interface Notification {
  id: number;
  message: string;
  type: string;
  channel: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications");
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

  const createTestNotifications = async () => {
    try {
      const response = await fetch("/api/notifications/test", {
        method: "POST",
      });
      if (response.ok) {
        fetchNotifications();
      }
    } catch (error) {
      console.error("Error creating test notifications:", error);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await fetch(`/api/notifications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
      fetchNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
      });
      fetchNotifications();
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications?action=mark-all-read", {
        method: "PUT",
      });
      fetchNotifications();
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertCircle size={20} color="#ef4444" />;
      case "success":
        return <CheckCircle size={20} color="#22c55e" />;
      case "info":
        return <Info size={20} color="#3b82f6" />;
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
      case "info":
        return "#eff6ff";
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
      <Header title="Notifications" subtitle="Toutes vos notifications" />

      <div style={{ padding: "28px", display: "flex", flexDirection: "column", gap: 20 }}>
        {/* ACTION BUTTONS */}
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={createTestNotifications}
            style={{
              background: "#10B981",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "10px 20px",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            Creer des notifications de test
          </button>
          {notifications.some(n => !n.read) && (
            <button
              onClick={markAllAsRead}
              style={{
                background: "#e2e8f0",
                color: "#0f172a",
                border: "none",
                borderRadius: 12,
                padding: "10px 20px",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              Marquer tout comme lu
            </button>
          )}
        </div>

        {/* NOTIFICATIONS LIST */}
        {notifications.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
                  opacity: notification.read ? 0.6 : 1,
                }}
              >
                <div style={{ marginTop: 2 }}>
                  {getIcon(notification.type)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 8 }}>
                    <p style={{ fontSize: 14, color: "#0f172a", margin: 0, fontWeight: 600 }}>
                      {notification.message}
                    </p>
                    <span style={{ fontSize: 12, color: "#94a3b8", whiteSpace: "nowrap", marginLeft: 16 }}>
                      {new Date(notification.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: "#94a3b8" }}>
                      Canal: {notification.channel}
                    </span>
                    {notification.read && (
                      <span style={{ fontSize: 12, color: "#22c55e", fontWeight: 600 }}>
                        ✓ Lu
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      title="Marquer comme lu"
                    >
                      <Check size={18} color="#22c55e" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    title="Supprimer"
                  >
                    <Trash2 size={18} color="#ef4444" />
                  </button>
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
              Vous recevrez des notifications pour vos événements et offres
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
