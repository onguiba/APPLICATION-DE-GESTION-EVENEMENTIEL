"use client";

import Header from "@/components/layout/Header";
import { useStore, AppEvent } from "@/lib/store/useStore";
import {
  Calendar,
  Users,
  Wallet,
  Bell,
  ArrowRight,
  Eye,
  Edit2,
  Trash2,
  MoreHorizontal,
  MessageSquare,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import EventModal from "@/components/modals/EventModal";
import ConfirmDialog from "@/components/modals/ConfirmDialog";
import Dropdown from "@/components/ui/Dropdown";

const statusStyles: Record<
  string,
  {
    bg: string;
    color: string;
  }
> = {
  "En cours": {
    bg: "rgba(249, 115, 22, 0.1)",
    color: "#F97316",
  },
  Planifié: {
    bg: "rgba(37, 99, 235, 0.1)",
    color: "#2563EB",
  },
  Brouillon: {
    bg: "rgba(107, 114, 128, 0.1)",
    color: "#6B7280",
  },
  Terminé: {
    bg: "rgba(16, 185, 129, 0.1)",
    color: "#10B981",
  },
};

export default function DashboardPage() {
  const router = useRouter();

  const {
    events,
    deleteEvent,
    participants,
    depenses,
    notifications,
  } = useStore();

  const [eventModal, setEventModal] = useState(false);
  const [editEvent, setEditEvent] = useState<AppEvent | null>(
    null
  );

  const [confirmDelete, setConfirmDelete] = useState<number | null>(
    null
  );

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard');
        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const activeEvents = events.filter(
    (e) => e.status === "En cours"
  ).length;

  const totalParticipants = participants.length;

  const totalDepenses = depenses.reduce(
    (s, d) => s + d.montant,
    0
  );

  const unreadNotifs = notifications.filter(
    (n) => !n.lu
  ).length;

  const stats = [
    {
      label: "Événements actifs",
      value: String(activeEvents),
      icon: Calendar,
      color: "#F97316",
      bg: "rgba(249, 115, 22, 0.1)",
    },
    {
      label: "Participants",
      value: totalParticipants.toLocaleString(),
      icon: Users,
      color: "#2563EB",
      bg: "rgba(37, 99, 235, 0.1)",
    },
    {
      label: "Budget utilisé",
      value: `${(totalDepenses / 1000).toFixed(0)}k`,
      icon: Wallet,
      color: "#10B981",
      bg: "rgba(16, 185, 129, 0.1)",
    },
    {
      label: "Notifications",
      value: String(unreadNotifs),
      icon: Bell,
      color: "#EF4444",
      bg: "rgba(239, 68, 68, 0.1)",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header
        title="Dashboard"
        subtitle="Bienvenue sur Lynkéné"
        action={{
          label: "Créer un événement",
          onClick: () => {
            setEditEvent(null);
            setEventModal(true);
          },
        }}
      />

      <div
        style={{
          padding: 32,
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        {/* HERO */}

        <div
          className="glass-lg"
          style={{
            background: "linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(249, 115, 22, 0.05) 100%)",
            border: "1px solid rgba(249, 115, 22, 0.2)",
            padding: 36,
            color: "var(--text-primary)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 20,
            boxShadow: "0 20px 50px rgba(249,115,22,0.1)",
          }}
        >
          <div>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(249, 115, 22, 0.2)",
                color: "#F97316",
                padding: "8px 14px",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 18,
              }}
            >
              <Wallet size={14} />
              Plateforme événementielle
            </span>

            <h1
              style={{
                fontSize: 38,
                fontWeight: 800,
                lineHeight: 1.1,
                marginBottom: 14,
                letterSpacing: "-0.04em",
              }}
            >
              Gérez tous vos événements
              <br />
              depuis un seul endroit.
            </h1>

            <p
              style={{
                maxWidth: 600,
                color: "var(--text-secondary)",
                lineHeight: 1.8,
                fontSize: 15,
              }}
            >
              Suivez vos participants, budgets et performances
              avec une expérience moderne, claire et intuitive.
            </p>
          </div>

          <button
            onClick={() => {
              setEditEvent(null);
              setEventModal(true);
            }}
            className="btn btn-primary"
          >
            Nouvel événement
            <ArrowRight size={16} />
          </button>
        </div>

        {/* STATS */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))",
            gap: 18,
          }}
        >
          {stats.map(
            ({ label, value, icon: Icon, color, bg }) => (
              <div
                key={label}
                className="card"
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 22,
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 18,
                      background: bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={24} color={color} />
                  </div>
                </div>

                <div
                  style={{
                    fontSize: 34,
                    fontWeight: 800,
                    color: "var(--text-primary)",
                    marginBottom: 6,
                    letterSpacing: "-0.04em",
                  }}
                >
                  {value}
                </div>

                <div
                  style={{
                    fontSize: 14,
                    color: "var(--text-secondary)",
                  }}
                >
                  {label}
                </div>
              </div>
            )
          )}
        </div>

        {/* CONTENT */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 0.8fr",
            gap: 22,
          }}
        >
          {/* OFFERS SECTION */}

          <div className="card-lg">
            <div
              style={{
                padding: "0 0 24px 0",
                borderBottom: "1px solid var(--glass-border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    marginBottom: 6,
                  }}
                >
                  Offres de services
                </h2>

                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: 14,
                  }}
                >
                  Répondez aux offres de services pour vos événements.
                </p>
              </div>

              <button
                onClick={() => router.push("/services")}
                className="btn btn-secondary"
              >
                Voir tout
              </button>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                padding: "24px 0",
              }}
            >
              <div
                style={{
                  background: "var(--bg-tertiary)",
                  borderRadius: 16,
                  padding: 20,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      marginBottom: 6,
                      fontSize: 15,
                    }}
                  >
                    Vous avez 3 offres en attente
                  </div>

                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--text-secondary)",
                    }}
                  >
                    Consultez et répondez aux offres de services
                  </div>
                </div>

                <button
                  onClick={() => router.push("/services")}
                  style={{
                    background: "#F97316",
                    color: "#fff",
                    border: "none",
                    borderRadius: 12,
                    padding: "10px 20px",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 14,
                  }}
                >
                  <MessageSquare size={16} />
                  Répondre
                </button>
              </div>
            </div>
          </div>
          {/* EVENTS */}

          <div className="card-lg">
            <div
              style={{
                padding: "0 0 24px 0",
                borderBottom: "1px solid var(--glass-border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    marginBottom: 6,
                  }}
                >
                  Événements récents
                </h2>

                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: 14,
                  }}
                >
                  Aperçu rapide de vos événements.
                </p>
              </div>

              <button
                onClick={() => router.push("/evenements")}
                className="btn btn-secondary"
              >
                Voir tout
              </button>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              {events.slice(0, 5).map((ev, i) => {
                const pct = Math.round(
                  (ev.participants / ev.capacity) * 100
                );

                return (
                  <div
                    key={ev.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "1.3fr auto auto auto",
                      gap: 18,
                      alignItems: "center",
                      padding: "22px 0",
                      borderBottom:
                        i < 4
                          ? "1px solid var(--glass-border)"
                          : "none",
                    }}
                  >
                    {/* Left */}

                    <div>
                      <div
                        style={{
                          fontWeight: 700,
                          color: "var(--text-primary)",
                          marginBottom: 6,
                          fontSize: 15,
                        }}
                      >
                        {ev.name}
                      </div>

                      <div
                        style={{
                          fontSize: 13,
                          color: "var(--text-secondary)",
                          marginBottom: 10,
                        }}
                      >
                        {ev.date}
                      </div>

                      <div
                        style={{
                          width: "100%",
                          maxWidth: 180,
                          height: 6,
                          background: "var(--bg-tertiary)",
                          borderRadius: 999,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${pct}%`,
                            height: "100%",
                            background: "#F97316",
                            borderRadius: 999,
                          }}
                        />
                      </div>
                    </div>

                    {/* Participants */}

                    <div
                      style={{
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 18,
                          color: "var(--text-primary)",
                        }}
                      >
                        {ev.participants}
                      </div>

                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--text-secondary)",
                        }}
                      >
                        Participants
                      </div>
                    </div>

                    {/* Status */}

                    <div>
                      <span
                        style={{
                          background:
                            statusStyles[ev.status]?.bg,
                          color:
                            statusStyles[ev.status]?.color,
                          padding: "8px 14px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {ev.status}
                      </span>
                    </div>

                    {/* Actions */}

                    <Dropdown
                      trigger={
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 12,
                            background: "var(--bg-tertiary)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                          }}
                        >
                          <MoreHorizontal
                            size={18}
                            color="var(--text-secondary)"
                          />
                        </div>
                      }
                      items={[
                        {
                          label: "Voir détails",
                          icon: <Eye size={14} />,
                          onClick: () =>
                            router.push(
                              `/evenements/${ev.id}`
                            ),
                        },
                        {
                          label: "Modifier",
                          icon: <Edit2 size={14} />,
                          onClick: () => {
                            setEditEvent(ev);
                            setEventModal(true);
                          },
                        },
                        {
                          label: "Supprimer",
                          icon: <Trash2 size={14} />,
                          onClick: () =>
                            setConfirmDelete(ev.id),
                          danger: true,
                        },
                      ]}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* BUDGET */}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 22,
            }}
          >
            {/* Total budget */}

            <div className="card-lg">
              <div
                style={{
                  marginBottom: 24,
                }}
              >
                <span
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: 14,
                  }}
                >
                  Budget global
                </span>

                <h2
                  style={{
                    marginTop: 10,
                    fontSize: 34,
                    fontWeight: 800,
                    color: "var(--text-primary)",
                    letterSpacing: "-0.04em",
                  }}
                >
                  {dashboardData ? `${(dashboardData.totalBudget / 1000).toFixed(0)}k FCFA` : "Chargement..."}
                </h2>
              </div>

              <div
                style={{
                  height: 10,
                  background: "var(--bg-tertiary)",
                  borderRadius: 999,
                  overflow: "hidden",
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    width: dashboardData ? `${Math.min((dashboardData.totalExpenses / dashboardData.totalBudget) * 100, 100)}%` : "0%",
                    height: "100%",
                    background:
                      "linear-gradient(90deg,#F97316,#FB923C)",
                    borderRadius: 999,
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  fontSize: 13,
                  color: "var(--text-secondary)",
                }}
              >
                <span>{dashboardData ? `${Math.round((dashboardData.totalExpenses / dashboardData.totalBudget) * 100)}% utilisé` : "0% utilisé"}</span>
              </div>
            </div>

            {/* Categories */}

            <div className="card-lg">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 28,
                }}
              >
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                  }}
                >
                  Répartition budgétaire
                </h3>

                <button
                  onClick={() => router.push("/budget")}
                  style={{
                    border: "none",
                    background: "none",
                    color: "#F97316",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Voir plus
                </button>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 22,
                }}
              >
                {dashboardData && dashboardData.budgetStats && dashboardData.budgetStats.length > 0 ? (
                  dashboardData.budgetStats.map((budget: any) => (
                    <div key={budget.eventId}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 10,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: "var(--text-primary)",
                          }}
                        >
                          {budget.eventName}
                        </span>

                        <span
                          style={{
                            fontSize: 13,
                            color: "var(--text-secondary)",
                          }}
                        >
                          {budget.percentageUsed}%
                        </span>
                      </div>

                      <div
                        style={{
                          height: 8,
                          background: "var(--bg-tertiary)",
                          borderRadius: 999,
                          overflow: "hidden",
                          marginBottom: 8,
                        }}
                      >
                        <div
                          style={{
                            width: `${budget.percentageUsed}%`,
                            height: "100%",
                            background: "#F97316",
                            borderRadius: 999,
                          }}
                        />
                      </div>

                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--text-secondary)",
                        }}
                      >
                        {(budget.totalSpent / 1000).toFixed(0)}k / {(budget.totalBudget / 1000).toFixed(0)}k FCFA
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: "var(--text-secondary)" }}>Aucun budget disponible</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}

      <EventModal
        open={eventModal}
        onClose={() => setEventModal(false)}
        event={editEvent}
      />

      <ConfirmDialog
        open={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() =>
          confirmDelete && deleteEvent(confirmDelete)
        }
        title="Supprimer cet événement ?"
        description="Cette action est irréversible."
      />
    </div>
  );
}
