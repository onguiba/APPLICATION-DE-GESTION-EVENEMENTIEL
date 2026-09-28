"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/layout/Header";
import {
  Briefcase,
  DollarSign,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

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

interface Provider {
  id: number;
  name: string;
  email: string;
  phone: string;
  accountType: string;
}

export default function ProviderPage() {
  const params = useParams();
  const providerId = parseInt(params.id as string);

  const [provider, setProvider] = useState<Provider | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch services for this provider
        const servicesRes = await fetch(`/api/services?userId=${providerId}`);
        if (servicesRes.ok) {
          const servicesData = await servicesRes.json();
          setServices(servicesData);

          // Get provider info from first service or from a user endpoint
          if (servicesData.length > 0) {
            // Extract provider info from services (they have user relation)
            // For now, we'll just use the services data
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [providerId]);

  const parseServices = (servicesStr: string) => {
    try {
      return JSON.parse(servicesStr);
    } catch {
      return [];
    }
  };

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
        title="Offres de service"
        subtitle="Découvrez les services disponibles"
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
              Offres disponibles
            </div>
            <span style={{ fontSize: 13, color: "#94a3b8" }}>
              Services proposés
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
              Disponibles maintenant
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

        {/* SERVICES GRID */}
        {services.length === 0 ? (
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
                fontSize: 24,
                fontWeight: 800,
                color: "#111827",
                marginBottom: 10,
              }}
            >
              Aucune offre disponible
            </h3>
            <p
              style={{
                color: "#94a3b8",
                maxWidth: 420,
                margin: "0 auto",
              }}
            >
              Ce prestataire n'a pas encore créé d'offres de service.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))",
              gap: 24,
            }}
          >
            {services.map((service) => (
              <div
                key={service.id}
                style={{
                  background: "#fff",
                  borderRadius: 24,
                  border: "1px solid #f1f5f9",
                  overflow: "hidden",
                  boxShadow: "0 10px 30px rgba(15,23,42,0.04)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(-4px)";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 20px 40px rgba(15,23,42,0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 10px 30px rgba(15,23,42,0.04)";
                }}
              >
                {/* HEADER */}
                <div
                  style={{
                    padding: 20,
                    borderBottom: "1px solid #f1f5f9",
                    background: "linear-gradient(135deg,#f9731615,#fb923c15)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                      marginBottom: 12,
                    }}
                  >
                    <h3
                      style={{
                        fontSize: 18,
                        fontWeight: 800,
                        color: "#0f172a",
                        margin: 0,
                      }}
                    >
                      {service.name}
                    </h3>
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 700,
                        background:
                          service.status === "Actif"
                            ? "#dcfce7"
                            : "#f3f4f6",
                        color:
                          service.status === "Actif"
                            ? "#16a34a"
                            : "#6b7280",
                      }}
                    >
                      {service.status}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#6b7280",
                      background: "#fff",
                      width: "fit-content",
                      padding: "4px 12px",
                      borderRadius: 8,
                    }}
                  >
                    {service.category}
                  </div>
                </div>

                {/* CONTENT */}
                <div style={{ padding: 20 }}>
                  <p
                    style={{
                      fontSize: 14,
                      color: "#475569",
                      lineHeight: 1.6,
                      marginBottom: 16,
                      margin: 0,
                    }}
                  >
                    {service.description}
                  </p>

                  {/* SERVICES INCLUDED */}
                  <div style={{ marginBottom: 16 }}>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#6b7280",
                        marginBottom: 8,
                      }}
                    >
                      Services inclus:
                    </div>
                    <ul
                      style={{
                        margin: 0,
                        paddingLeft: 20,
                        fontSize: 13,
                        color: "#475569",
                      }}
                    >
                      {parseServices(service.servicesIncluded).map(
                        (svc: string, idx: number) => (
                          <li key={idx} style={{ marginBottom: 4 }}>
                            {svc}
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  {/* PRICE */}
                  <div
                    style={{
                      padding: 16,
                      background: "#f8fafc",
                      borderRadius: 12,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#6b7280",
                      }}
                    >
                      Prix
                    </span>
                    <span
                      style={{
                        fontSize: 20,
                        fontWeight: 800,
                        color: "#f97316",
                      }}
                    >
                      {(service.price / 1000).toFixed(0)}k FCFA
                    </span>
                  </div>
                </div>

                {/* FOOTER */}
                <div
                  style={{
                    padding: 16,
                    borderTop: "1px solid #f1f5f9",
                    background: "#f8fafc",
                  }}
                >
                  <button
                    style={{
                      width: "100%",
                      background:
                        "linear-gradient(135deg,#f97316,#fb923c)",
                      color: "#fff",
                      border: "none",
                      borderRadius: 12,
                      padding: "12px 16px",
                      fontWeight: 700,
                      cursor: "pointer",
                      fontSize: 14,
                    }}
                  >
                    Contacter le prestataire
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
