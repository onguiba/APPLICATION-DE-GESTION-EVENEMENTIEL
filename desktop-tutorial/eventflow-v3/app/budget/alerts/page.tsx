"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

interface BudgetCategory {
  id: number;
  name: string;
  allocatedAmount: number;
  spent: number;
}

interface Budget {
  id: number;
  eventId: number;
  totalAmount: number;
  status: string;
  categories: BudgetCategory[];
  event: {
    id: number;
    name: string;
    date: string;
    location: string;
  };
}

export default function BudgetAlertsPage() {
  const router = useRouter();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await fetch("/api/budgets");
        if (response.ok) {
          const data = await response.json();
          setBudgets(data);
        }
      } catch (error) {
        console.error("Error fetching budgets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();
  }, []);

  // Get all alerts from all budgets
  const allAlerts = budgets.flatMap((budget) =>
    budget.categories
      .filter(
        (cat) =>
          cat.allocatedAmount > 0 &&
          (cat.spent / cat.allocatedAmount) * 100 > 85
      )
      .map((cat) => ({
        budgetId: budget.id,
        eventId: budget.eventId,
        eventName: budget.event.name,
        eventDate: budget.event.date,
        eventLocation: budget.event.location,
        categoryName: cat.name,
        allocated: cat.allocatedAmount,
        spent: cat.spent,
        percentage: Math.round((cat.spent / cat.allocatedAmount) * 100),
        remaining: cat.allocatedAmount - cat.spent,
      }))
  );

  const criticalAlerts = allAlerts.filter((a) => a.percentage >= 100);
  const warningAlerts = allAlerts.filter((a) => a.percentage < 100);

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
        title="Alertes budgétaires"
        subtitle="Suivi des dépassements et catégories critiques"
      />

      <div
        style={{
          padding: "28px",
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        {/* BACK BUTTON */}
        <button
          onClick={() => router.back()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "none",
            border: "none",
            color: "#f97316",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          <ChevronLeft size={18} />
          Retour
        </button>

        {/* STATS */}
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
              {allAlerts.length}
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "#111827",
                marginBottom: 4,
              }}
            >
              Alertes totales
            </div>
            <span style={{ fontSize: 13, color: "#94a3b8" }}>
              Catégories critiques
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
                background: "#dc262615",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 18,
              }}
            >
              <TrendingUp size={22} color="#dc2626" />
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: "#0f172a",
                marginBottom: 6,
              }}
            >
              {criticalAlerts.length}
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "#111827",
                marginBottom: 4,
              }}
            >
              Dépassements
            </div>
            <span style={{ fontSize: 13, color: "#94a3b8" }}>
              Budget dépassé
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
                background: "#f5991615",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 18,
              }}
            >
              <AlertTriangle size={22} color="#f59916" />
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: "#0f172a",
                marginBottom: 6,
              }}
            >
              {warningAlerts.length}
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "#111827",
                marginBottom: 4,
              }}
            >
              Avertissements
            </div>
            <span style={{ fontSize: 13, color: "#94a3b8" }}>
              Approche du budget
            </span>
          </div>
        </div>

        {/* CRITICAL ALERTS */}
        {criticalAlerts.length > 0 && (
          <div
            style={{
              background: "#fef2f2",
              borderRadius: 28,
              border: "1px solid #fee2e2",
              padding: 28,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 20,
              }}
            >
              <AlertTriangle size={24} color="#dc2626" />
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#7f1d1d",
                }}
              >
                Dépassements budgétaires
              </h3>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {criticalAlerts.map((alert, idx) => (
                <Link
                  key={idx}
                  href={`/budget/${alert.eventId}`}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: 16,
                      padding: 16,
                      border: "1px solid #fecaca",
                      cursor: "pointer",
                      transition: "background 0.2s",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "#fef2f2";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "#fff";
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: 700,
                          color: "#111827",
                          marginBottom: 4,
                        }}
                      >
                        {alert.eventName}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: "#7f1d1d",
                          marginBottom: 8,
                        }}
                      >
                        {alert.categoryName}
                      </div>
                      <p
                        style={{
                          fontSize: 12,
                          color: "#7f1d1d",
                          margin: 0,
                        }}
                      >
                        Dépensé: {(alert.spent / 1000).toFixed(0)}k FCFA sur{" "}
                        {(alert.allocated / 1000).toFixed(0)}k FCFA - Dépassement de{" "}
                        {(Math.abs(alert.remaining) / 1000).toFixed(0)}k FCFA
                      </p>
                    </div>
                    <div
                      style={{
                        textAlign: "right",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 16,
                            fontWeight: 800,
                            color: "#dc2626",
                          }}
                        >
                          {alert.percentage}%
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "#7f1d1d",
                          }}
                        >
                          Utilisé
                        </div>
                      </div>
                      <ChevronRight size={18} color="#dc2626" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* WARNING ALERTS */}
        {warningAlerts.length > 0 && (
          <div
            style={{
              background: "#e8f5e9",
              borderRadius: 28,
              border: "1px solid #d1fae5",
              padding: 28,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 20,
              }}
            >
              <AlertTriangle size={24} color="#f59916" />
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#78350f",
                }}
              >
                Avertissements budgétaires
              </h3>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {warningAlerts.map((alert, idx) => (
                <Link
                  key={idx}
                  href={`/budget/${alert.eventId}`}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: 16,
                      padding: 16,
                      border: "1px solid #a7f3d0",
                      cursor: "pointer",
                      transition: "background 0.2s",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "#e8f5e9";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "#fff";
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: 700,
                          color: "#111827",
                          marginBottom: 4,
                        }}
                      >
                        {alert.eventName}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: "#78350f",
                          marginBottom: 8,
                        }}
                      >
                        {alert.categoryName}
                      </div>
                      <p
                        style={{
                          fontSize: 12,
                          color: "#78350f",
                          margin: 0,
                        }}
                      >
                        Dépensé: {(alert.spent / 1000).toFixed(0)}k FCFA sur{" "}
                        {(alert.allocated / 1000).toFixed(0)}k FCFA - {(alert.remaining / 1000).toFixed(0)}k FCFA restant
                      </p>
                    </div>
                    <div
                      style={{
                        textAlign: "right",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 16,
                            fontWeight: 800,
                            color: "#f59916",
                          }}
                        >
                          {alert.percentage}%
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "#78350f",
                          }}
                        >
                          Utilisé
                        </div>
                      </div>
                      <ChevronRight size={18} color="#f59916" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* NO ALERTS */}
        {allAlerts.length === 0 && !loading && (
          <div
            style={{
              background: "#fff",
              borderRadius: 28,
              border: "1px solid #f1f5f9",
              padding: 60,
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(15,23,42,0.04)",
            }}
          >
            <div
              style={{
                width: 70,
                height: 70,
                borderRadius: 24,
                background: "#dcfce7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <AlertTriangle size={32} color="#22c55e" />
            </div>
            <h3
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: "#111827",
                marginBottom: 10,
              }}
            >
              Aucune alerte
            </h3>
            <p
              style={{
                color: "#94a3b8",
                maxWidth: 420,
                margin: "0 auto",
              }}
            >
              Tous vos budgets sont sous contrôle. Continuez à surveiller vos dépenses!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
