"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import { Briefcase, Users, Search } from "lucide-react";
import Link from "next/link";

interface Provider {
  id: number;
  name: string;
  email: string;
  phone: string;
  accountType: string;
  servicesCount: number;
}

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        // Fetch all services to group by provider
        const servicesRes = await fetch("/api/services");
        if (servicesRes.ok) {
          const services = await servicesRes.json();

          // Group services by userId (provider)
          const providerMap = new Map<number, any>();

          services.forEach((service: any) => {
            if (!providerMap.has(service.userId)) {
              providerMap.set(service.userId, {
                id: service.userId,
                servicesCount: 0,
              });
            }
            const provider = providerMap.get(service.userId);
            provider.servicesCount += 1;
          });

          setProviders(Array.from(providerMap.values()));
        }
      } catch (error) {
        console.error("Error fetching providers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  const filteredProviders = providers.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
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
        title="Annuaire des prestataires"
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
              <Users size={22} color="#f97316" />
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: "#0f172a",
                marginBottom: 6,
              }}
            >
              {providers.length}
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "#111827",
                marginBottom: 4,
              }}
            >
              Prestataires
            </div>
            <span style={{ fontSize: 13, color: "#94a3b8" }}>
              Disponibles
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
              <Briefcase size={22} color="#ea580c" />
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: "#0f172a",
                marginBottom: 6,
              }}
            >
              {providers.reduce((sum, p) => sum + p.servicesCount, 0)}
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
              Services proposés
            </span>
          </div>
        </div>

        {/* SEARCH */}
        <div
          style={{
            background: "#fff",
            borderRadius: 24,
            border: "1px solid #f1f5f9",
            padding: 24,
            boxShadow: "0 10px 30px rgba(15,23,42,0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "#f8fafc",
              borderRadius: 12,
              padding: "12px 16px",
              border: "1px solid #e2e8f0",
            }}
          >
            <Search size={18} color="#94a3b8" />
            <input
              type="text"
              placeholder="Rechercher un prestataire..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                background: "none",
                border: "none",
                outline: "none",
                fontSize: 14,
                color: "#111827",
              }}
            />
          </div>
        </div>

        {/* PROVIDERS LIST */}
        {loading ? (
          <div
            style={{
              background: "#fff",
              borderRadius: 28,
              border: "1px solid #f1f5f9",
              padding: 40,
              textAlign: "center",
              color: "#94a3b8",
              boxShadow: "0 10px 30px rgba(15,23,42,0.04)",
            }}
          >
            Chargement...
          </div>
        ) : filteredProviders.length === 0 ? (
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
              <Users size={32} color="#f97316" />
            </div>
            <h3
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: "#111827",
                marginBottom: 10,
              }}
            >
              Aucun prestataire trouvé
            </h3>
            <p
              style={{
                color: "#94a3b8",
                maxWidth: 420,
                margin: "0 auto",
              }}
            >
              {searchQuery
                ? "Aucun prestataire ne correspond à votre recherche"
                : "Aucun prestataire n'a encore créé d'offres"}
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
              gap: 24,
            }}
          >
            {filteredProviders.map((provider) => (
              <Link
                key={provider.id}
                href={`/providers/${provider.id}`}
                style={{ textDecoration: "none" }}
              >
                <div
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
                      padding: 24,
                      background: "linear-gradient(135deg,#f9731615,#fb923c15)",
                      borderBottom: "1px solid #f1f5f9",
                    }}
                  >
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 16,
                        background: "#f97316",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 16,
                      }}
                    >
                      <Briefcase size={28} color="#fff" />
                    </div>
                    <h3
                      style={{
                        fontSize: 18,
                        fontWeight: 800,
                        color: "#0f172a",
                        margin: 0,
                        marginBottom: 4,
                      }}
                    >
                      Prestataire {provider.id}
                    </h3>
                    <p
                      style={{
                        fontSize: 13,
                        color: "#94a3b8",
                        margin: 0,
                      }}
                    >
                      {provider.servicesCount} offre
                      {provider.servicesCount !== 1 ? "s" : ""}
                    </p>
                  </div>

                  {/* CONTENT */}
                  <div style={{ padding: 24 }}>
                    <div style={{ marginBottom: 16 }}>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#6b7280",
                          marginBottom: 4,
                        }}
                      >
                        Services proposés
                      </div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: "#0f172a",
                        }}
                      >
                        {provider.servicesCount} offre
                        {provider.servicesCount !== 1 ? "s" : ""}
                      </div>
                    </div>

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
                      Voir les offres
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
