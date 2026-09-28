"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import ServiceOfferModal from "@/components/modals/ServiceOfferModal";
import {
  Plus,
  Edit2,
  Trash2,
  MoreHorizontal,
  Briefcase,
  DollarSign,
  CheckCircle,
} from "lucide-react";
import Dropdown from "@/components/ui/Dropdown";
import ConfirmDialog from "@/components/modals/ConfirmDialog";

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  servicesIncluded: string;
  status: string;
  createdAt: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/services");
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const response = await fetch(`/api/services/${deleteId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setServices(services.filter((s) => s.id !== deleteId));
        setDeleteId(null);
      }
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  const parseServices = (servicesStr: string) => {
    try {
      return JSON.parse(servicesStr);
    } catch {
      return [];
    }
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
        title="Mes offres de service"
        subtitle="Gérez vos offres et services"
        action={{
          label: "Nouvelle offre",
          onClick: () => setModalOpen(true),
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
                background: "#f9731615",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 18,
              }}
            >
              <Briefcase size={22} color="#f97316" />
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: "#0f172a",
                marginBottom: 6,
              }}
            >
              {services.length}
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "#111827",
                marginBottom: 4,
              }}
            >
              Offres totales
            </div>
            <span style={{ fontSize: 13, color: "#94a3b8" }}>
              Services créés
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
                background: "#22c55e15",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 18,
              }}
            >
              <CheckCircle size={22} color="#22c55e" />
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: "#0f172a",
                marginBottom: 6,
              }}
            >
              {services.filter((s) => s.status === "Actif").length}
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "#111827",
                marginBottom: 4,
              }}
            >
              Actifs
            </div>
            <span style={{ fontSize: 13, color: "#94a3b8" }}>
              Offres disponibles
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
              <DollarSign size={22} color="#ea580c" />
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: "#0f172a",
                marginBottom: 6,
              }}
            >
              {(
                services.reduce((sum, s) => sum + s.price, 0) / 1000
              ).toFixed(0)}
              k
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "#111827",
                marginBottom: 4,
              }}
            >
              Valeur totale
            </div>
            <span style={{ fontSize: 13, color: "#94a3b8" }}>
              FCFA
            </span>
          </div>
        </div>

        {/* SERVICES LIST */}
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
              Mes offres
            </h2>
            <p style={{ fontSize: 14, color: "#94a3b8" }}>
              {services.length} offre{services.length !== 1 ? "s" : ""} créée{services.length !== 1 ? "s" : ""}
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
          ) : services.length === 0 ? (
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
                <Briefcase size={32} color="#f97316" />
              </div>
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#111827",
                  marginBottom: 8,
                }}
              >
                Aucune offre
              </h3>
              <p style={{ color: "#94a3b8", marginBottom: 20 }}>
                Créez votre première offre de service pour commencer
              </p>
              <button
                onClick={() => setModalOpen(true)}
                style={{
                  background: "linear-gradient(135deg,#f97316,#fb923c)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 16,
                  padding: "12px 24px",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Plus size={16} />
                Créer une offre
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {services.map((service) => (
                <div
                  key={service.id}
                  style={{
                    padding: "20px 24px",
                    borderBottom: "1px solid #f8fafc",
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 1fr 1fr auto",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        color: "#111827",
                        marginBottom: 4,
                        fontSize: 15,
                      }}
                    >
                      {service.name}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#94a3b8",
                        marginBottom: 8,
                      }}
                    >
                      {service.description.substring(0, 60)}...
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#6b7280",
                      }}
                    >
                      {parseServices(service.servicesIncluded).length} service
                      {parseServices(service.servicesIncluded).length !== 1 ? "s" : ""} inclus
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
                      {(service.price / 1000).toFixed(0)}k
                    </div>
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>
                      FCFA
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
                      {service.category}
                    </div>
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>
                      Catégorie
                    </div>
                  </div>

                  <div style={{ textAlign: "center" }}>
                    <span
                      style={{
                        width: "fit-content",
                        padding: "6px 12px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 700,
                        background:
                          service.status === "Actif"
                            ? "#dcfce7"
                            : "#f3f4f6",
                        color:
                          service.status === "Actif"
                            ? "#16a34a"
                            : "#6b7280",
                        display: "inline-block",
                      }}
                    >
                      {service.status}
                    </span>
                  </div>

                  <Dropdown
                    trigger={
                      <button
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 12,
                          border: "1px solid #e2e8f0",
                          background: "#fff",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <MoreHorizontal size={16} color="#64748b" />
                      </button>
                    }
                    items={[
                      {
                        label: "Modifier",
                        icon: <Edit2 size={13} />,
                        onClick: () => {
                          // TODO: Implement edit
                        },
                      },
                      {
                        label: "Supprimer",
                        icon: <Trash2 size={13} />,
                        onClick: () => setDeleteId(service.id),
                        danger: true,
                      },
                    ]}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ServiceOfferModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchServices}
      />

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Supprimer cette offre ?"
        description="Cette action est irréversible."
      />
    </div>
  );
}
