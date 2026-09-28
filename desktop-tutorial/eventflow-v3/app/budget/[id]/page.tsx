"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import {
  AlertTriangle,
  CheckCircle,
  ChevronLeft,
  Download,
  Plus,
  Edit2,
  Trash2,
  Wallet,
  Receipt,
  MoreHorizontal,
} from "lucide-react";
import Dropdown from "@/components/ui/Dropdown";

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

export default function EventBudgetPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = parseInt(params.id as string);

  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const response = await fetch("/api/budgets");
        if (response.ok) {
          const budgets = await response.json();
          const eventBudget = budgets.find((b: Budget) => b.eventId === eventId);
          setBudget(eventBudget || null);
        }
      } catch (error) {
        console.error("Error fetching budget:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBudget();
  }, [eventId]);

  if (loading) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "#f8fafc",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "#94a3b8" }}>Chargement...</p>
      </div>
    );
  }

  if (!budget) {
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
          title="Budget de l'événement"
          subtitle="Aucun budget trouvé"
        />
        <div
          style={{
            padding: "28px",
            textAlign: "center",
          }}
        >
          <button
            onClick={() => router.back()}
            style={{
              background: "linear-gradient(135deg,#f97316,#fb923c)",
              color: "#fff",
              border: "none",
              borderRadius: 16,
              padding: "12px 24px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  const totalAllocated = budget.categories.reduce(
    (sum, cat) => sum + cat.allocatedAmount,
    0
  );
  const totalSpent = budget.categories.reduce(
    (sum, cat) => sum + cat.spent,
    0
  );
  const percentUsed = totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;

  const categoriesWithAlerts = budget.categories.filter(
    (cat) => cat.allocatedAmount > 0 && (cat.spent / cat.allocatedAmount) * 100 > 85
  );

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
        title={budget.event.name}
        subtitle={`Budget - ${budget.event.date} à ${budget.event.location}`}
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
          Retour aux budgets
        </button>

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
              {(totalAllocated / 1000).toFixed(0)}k
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "#111827",
                marginBottom: 4,
              }}
            >
              Budget total
            </div>
            <span style={{ fontSize: 13, color: "#94a3b8" }}>
              FCFA prévus
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
              <Receipt size={22} color="#ea580c" />
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: "#0f172a",
                marginBottom: 6,
              }}
            >
              {(totalSpent / 1000).toFixed(0)}k
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "#111827",
                marginBottom: 4,
              }}
            >
              Dépenses
            </div>
            <span style={{ fontSize: 13, color: "#94a3b8" }}>
              {Math.round(percentUsed)}% utilisé
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
                background: categoriesWithAlerts.length > 0 ? "#ef444415" : "#22c55e15",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 18,
              }}
            >
              {categoriesWithAlerts.length > 0 ? (
                <AlertTriangle size={22} color="#ef4444" />
              ) : (
                <CheckCircle size={22} color="#22c55e" />
              )}
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: "#0f172a",
                marginBottom: 6,
              }}
            >
              {categoriesWithAlerts.length}
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
              Catégories critiques
            </span>
          </div>
        </div>

        {/* BUDGET BREAKDOWN */}
        <div
          style={{
            background: "#fff",
            borderRadius: 28,
            border: "1px solid #f1f5f9",
            padding: 28,
            boxShadow: "0 10px 30px rgba(15,23,42,0.04)",
          }}
        >
          <div
            style={{
              marginBottom: 30,
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
              Répartition budgétaire
            </h2>
            <p
              style={{
                color: "#94a3b8",
                fontSize: 14,
              }}
            >
              Vue globale des dépenses par catégorie
            </p>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            {budget.categories.map((category) => {
              const pct = category.allocatedAmount > 0 
                ? Math.round((category.spent / category.allocatedAmount) * 100)
                : 0;
              const alert = pct > 85;

              return (
                <div key={category.id}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 10,
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      {alert ? (
                        <AlertTriangle size={16} color="#ef4444" />
                      ) : (
                        <CheckCircle size={16} color="#22c55e" />
                      )}
                      <span
                        style={{
                          fontWeight: 600,
                          color: "#111827",
                        }}
                      >
                        {category.name}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: alert ? "#ef4444" : "#0f172a",
                      }}
                    >
                      {(category.spent / 1000).toFixed(0)}k /{" "}
                      {(category.allocatedAmount / 1000).toFixed(0)}k
                    </span>
                  </div>

                  <div
                    style={{
                      height: 12,
                      borderRadius: 999,
                      background: "#f1f5f9",
                      overflow: "hidden",
                      marginBottom: 8,
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.min(pct, 100)}%`,
                        height: "100%",
                        borderRadius: 999,
                        background: alert ? "#ef4444" : "#f97316",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        color: "#94a3b8",
                        fontSize: 13,
                      }}
                    >
                      Utilisation
                    </span>
                    <span
                      style={{
                        color: alert ? "#ef4444" : "#f97316",
                        fontWeight: 700,
                        fontSize: 13,
                      }}
                    >
                      {pct}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ALERTS SECTION */}
        {categoriesWithAlerts.length > 0 && (
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
              <AlertTriangle size={24} color="#ef4444" />
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#991b1b",
                }}
              >
                Alertes budgétaires
              </h3>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {categoriesWithAlerts.map((category) => {
                const pct = Math.round(
                  (category.spent / category.allocatedAmount) * 100
                );
                const remaining = category.allocatedAmount - category.spent;

                return (
                  <div
                    key={category.id}
                    style={{
                      background: "#fff",
                      borderRadius: 16,
                      padding: 16,
                      border: "1px solid #fecaca",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 700,
                          color: "#111827",
                        }}
                      >
                        {category.name}
                      </span>
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: "#ef4444",
                        }}
                      >
                        {pct}% utilisé
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: 13,
                        color: "#7f1d1d",
                        margin: 0,
                      }}
                    >
                      Dépensé: {(category.spent / 1000).toFixed(0)}k FCFA sur{" "}
                      {(category.allocatedAmount / 1000).toFixed(0)}k FCFA
                      {remaining > 0 && (
                        <span>
                          {" "}
                          - {(remaining / 1000).toFixed(0)}k FCFA restant
                        </span>
                      )}
                      {remaining <= 0 && (
                        <span style={{ color: "#dc2626" }}>
                          {" "}
                          - Dépassement de{" "}
                          {(Math.abs(remaining) / 1000).toFixed(0)}k FCFA
                        </span>
                      )}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
