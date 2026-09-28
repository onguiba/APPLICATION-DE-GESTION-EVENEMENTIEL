"use client";

import Header from "@/components/layout/Header";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ChevronRight,
  Wallet,
  Calendar,
  MapPin,
  Users,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  capacity: number;
  status: string;
  type: string;
  description?: string;
}

interface Budget {
  id: number;
  eventId: number;
  totalAmount: number;
  status: string;
  categories: Array<{
    id: number;
    name: string;
    allocatedAmount: number;
    spent: number;
  }>;
  event: Event;
}

export default function BudgetPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, budgetsRes] = await Promise.all([
          fetch("/api/events"),
          fetch("/api/budgets"),
        ]);

        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          setEvents(eventsData);
        }

        if (budgetsRes.ok) {
          const budgetsData = await budgetsRes.json();
          setBudgets(budgetsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getEventBudget = (eventId: number) => {
    return budgets.find((b) => b.eventId === eventId);
  };

  const calculateBudgetStats = (budget: Budget) => {
    const totalAllocated = budget.categories.reduce(
      (sum, cat) => sum + cat.allocatedAmount,
      0
    );
    const totalSpent = budget.categories.reduce(
      (sum, cat) => sum + cat.spent,
      0
    );
    const percentUsed = totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;
    const hasAlerts = budget.categories.some(
      (cat) => cat.allocatedAmount > 0 && (cat.spent / cat.allocatedAmount) * 100 > 85
    );

    return { totalAllocated, totalSpent, percentUsed, hasAlerts };
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <Header
        title="Budget & finances"
        subtitle="Suivi des budgets par événement"
        action={{
          label: "Voir les alertes",
          onClick: () => router.push("/budget/alerts"),
        }}
      />

      <div
        style={{
          padding: "28px",
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        {/* STATS CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: 18,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 24,
              padding: 24,
              border: "1px solid #f1f5f9",
              boxShadow: "0 10px 30px rgba(15,23,42,0.04)",
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 18,
                background: "#f9731615",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 18,
              }}
            >
              <Wallet size={22} color="#f97316" />
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: "#0f172a",
                marginBottom: 6,
              }}
            >
              {events.length}
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "#111827",
                marginBottom: 4,
              }}
            >
              Événements
            </div>
            <span style={{ fontSize: 13, color: "#94a3b8" }}>
              Organisés
            </span>
          </div>

          <div
            style={{
              background: "#fff",
              borderRadius: 24,
              padding: 24,
              border: "1px solid #f1f5f9",
              boxShadow: "0 10px 30px rgba(15,23,42,0.04)",
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 18,
                background: "#ea580c15",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 18,
              }}
            >
              <TrendingUp size={22} color="#ea580c" />
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: "#0f172a",
                marginBottom: 6,
              }}
            >
              {budgets.length}
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "#111827",
                marginBottom: 4,
              }}
            >
              Budgets
            </div>
            <span style={{ fontSize: 13, color: "#94a3b8" }}>
              Créés
            </span>
          </div>

          <div
            style={{
              background: "#fff",
              borderRadius: 24,
              padding: 24,
              border: "1px solid #f1f5f9",
              boxShadow: "0 10px 30px rgba(15,23,42,0.04)",
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 18,
                background: "#ef444415",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 18,
              }}
            >
              <AlertTriangle size={22} color="#ef4444" />
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: "#0f172a",
                marginBottom: 6,
              }}
            >
              {budgets.filter((b) => calculateBudgetStats(b).hasAlerts).length}
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "#111827",
                marginBottom: 4,
              }}
            >
              Alertes
            </div>
            <span style={{ fontSize: 13, color: "#94a3b8" }}>
              Budgets critiques
            </span>
          </div>
        </div>

        {/* EVENTS LIST */}
        <div
          style={{
            background: "#fff",
            borderRadius: 28,
            border: "1px solid #f1f5f9",
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(15,23,42,0.04)",
          }}
        >
          <div
            style={{
              padding: 24,
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            <h2
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "#0f172a",
                marginBottom: 6,
              }}
            >
              Événements organisés
            </h2>
            <p style={{ fontSize: 14, color: "#94a3b8" }}>
              {events.length} événement{events.length !== 1 ? "s" : ""} créé{events.length !== 1 ? "s" : ""}
            </p>
          </div>

          {loading ? (
            <div
              style={{
                padding: 40,
                textAlign: "center",
                color: "#94a3b8",
              }}
            >
              Chargement...
            </div>
          ) : events.length === 0 ? (
            <div
              style={{
                padding: 40,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 24,
                  background: "#fff7ed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <Wallet size={32} color="#f97316" />
              </div>
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#111827",
                  marginBottom: 8,
                }}
              >
                Aucun événement
              </h3>
              <p style={{ color: "#94a3b8" }}>
                Créez un événement pour commencer à gérer les budgets
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {events.map((event) => {
                const budget = getEventBudget(event.id);
                const stats = budget ? calculateBudgetStats(budget) : null;

                return (
                  <Link
                    key={event.id}
                    href={`/budget/${event.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      style={{
                        padding: "20px 24px",
                        borderBottom: "1px solid #f8fafc",
                        display: "grid",
                        gridTemplateColumns: "2fr 1fr 1fr 1fr auto",
                        alignItems: "center",
                        gap: 16,
                        cursor: "pointer",
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "#f8fafc";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "transparent";
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontWeight: 700,
                            color: "#111827",
                            marginBottom: 8,
                            fontSize: 15,
                          }}
                        >
                          {event.name}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: 16,
                            fontSize: 13,
                            color: "#94a3b8",
                          }}
                        >
                          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <Calendar size={14} />
                            {event.date}
                          </span>
                          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <MapPin size={14} />
                            {event.location}
                          </span>
                        </div>
                      </div>

                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "#0f172a",
                          }}
                        >
                          {budget ? `${(stats!.totalAllocated / 1000).toFixed(0)}k` : "0k"}
                        </div>
                        <div style={{ fontSize: 12, color: "#94a3b8" }}>
                          Budget
                        </div>
                      </div>

                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "#0f172a",
                          }}
                        >
                          {budget ? `${(stats!.totalSpent / 1000).toFixed(0)}k` : "0k"}
                        </div>
                        <div style={{ fontSize: 12, color: "#94a3b8" }}>
                          Dépensé
                        </div>
                      </div>

                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: stats?.hasAlerts ? "#ef4444" : "#0f172a",
                          }}
                        >
                          {budget ? `${Math.round(stats!.percentUsed)}%` : "0%"}
                        </div>
                        <div style={{ fontSize: 12, color: "#94a3b8" }}>
                          Utilisé
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 38,
                          height: 38,
                          borderRadius: 12,
                          background: stats?.hasAlerts ? "#fef2f2" : "#f8fafc",
                          border: stats?.hasAlerts ? "1px solid #fee2e2" : "1px solid #e2e8f0",
                        }}
                      >
                        {stats?.hasAlerts ? (
                          <AlertTriangle size={18} color="#ef4444" />
                        ) : (
                          <ChevronRight size={18} color="#94a3b8" />
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
