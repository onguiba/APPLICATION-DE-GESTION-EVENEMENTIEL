"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  CalendarDays,
  ShieldCheck,
  Trash2,
  Crown,
  UserCheck,
  RefreshCw,
  ArrowLeft,
  Search,
} from "lucide-react";
import Link from "next/link";

interface AdminUser {
  id: number;
  email: string;
  name: string;
  phone: string | null;
  role: string;
  accountType: string;
  createdAt: string;
  _count: { events: number; participations: number };
}

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Supprimer l'utilisateur "${name}" ? Cette action est irréversible.`)) return;
    await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchUsers();
  };

  const handleToggleRole = async (id: number, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, role: newRole }),
    });
    fetchUsers();
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const admins = users.filter((u) => u.role === "admin").length;
  const totalEvents = users.reduce((sum, u) => sum + u._count.events, 0);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0fdf4 0%, #f9fafb 100%)",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {/* ── Header ── */}
      <header
        style={{
          background: "white",
          borderBottom: "1px solid #e5e7eb",
          padding: "0 24px",
          position: "sticky",
          top: 0,
          zIndex: 10,
          boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Link
              href="/dashboard"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                textDecoration: "none",
                color: "#6b7280",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              <ArrowLeft size={16} />
              Retour
            </Link>
            <div style={{ width: 1, height: 20, background: "#e5e7eb" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #10B981, #059669)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ShieldCheck size={18} color="white" strokeWidth={2.5} />
              </div>
              <div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: "#111827",
                    fontFamily: "'Syne', sans-serif",
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                  }}
                >
                  Panneau Administrateur
                </div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                  TchadEvent · Gestion des utilisateurs
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={fetchUsers}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 14px",
              borderRadius: 10,
              border: "1px solid #e5e7eb",
              background: "white",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              color: "#374151",
            }}
          >
            <RefreshCw size={14} />
            Actualiser
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        {/* ── Stats cards ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            marginBottom: 32,
          }}
        >
          {[
            {
              icon: <Users size={20} color="#10B981" />,
              value: users.length,
              label: "Utilisateurs total",
              bg: "#f0fdf4",
              border: "#d1fae5",
            },
            {
              icon: <Crown size={20} color="#f59e0b" />,
              value: admins,
              label: "Administrateurs",
              bg: "#fffbeb",
              border: "#fde68a",
            },
            {
              icon: <CalendarDays size={20} color="#3b82f6" />,
              value: totalEvents,
              label: "Événements créés",
              bg: "#eff6ff",
              border: "#bfdbfe",
            },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                background: s.bg,
                border: `1px solid ${s.border}`,
                borderRadius: 16,
                padding: "20px 24px",
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                {s.icon}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    color: "#111827",
                    fontFamily: "'Syne', sans-serif",
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </div>
                <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Table card ── */}
        <div
          style={{
            background: "white",
            borderRadius: 20,
            border: "1px solid #e5e7eb",
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          }}
        >
          {/* Table header */}
          <div
            style={{
              padding: "20px 24px",
              borderBottom: "1px solid #f3f4f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#111827",
                  fontFamily: "'Syne', sans-serif",
                  letterSpacing: "-0.02em",
                }}
              >
                Tous les utilisateurs
              </h2>
              <p style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>
                Gérez les accès et les rôles des membres inscrits.
              </p>
            </div>

            {/* Search */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: "8px 14px",
                minWidth: 220,
              }}
            >
              <Search size={15} color="#9ca3af" />
              <input
                type="text"
                placeholder="Rechercher un utilisateur…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  border: "none",
                  background: "transparent",
                  outline: "none",
                  fontSize: 13,
                  color: "#111827",
                  width: "100%",
                }}
              />
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div
              style={{
                padding: 60,
                textAlign: "center",
                color: "#9ca3af",
                fontSize: 14,
              }}
            >
              Chargement…
            </div>
          ) : filtered.length === 0 ? (
            <div
              style={{
                padding: 60,
                textAlign: "center",
                color: "#9ca3af",
                fontSize: 14,
              }}
            >
              Aucun utilisateur trouvé.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f9fafb" }}>
                    {["Nom & Email", "Rôle", "Type", "Événements", "Inscrit le", "Actions"].map(
                      (h) => (
                        <th
                          key={h}
                          style={{
                            padding: "12px 20px",
                            textAlign: "left",
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#6b7280",
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((user, idx) => (
                    <tr
                      key={user.id}
                      style={{
                        borderTop: "1px solid #f3f4f6",
                        background: idx % 2 === 0 ? "white" : "#fafafa",
                        transition: "background 0.15s",
                      }}
                    >
                      {/* Name & Email */}
                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div
                            style={{
                              width: 38,
                              height: 38,
                              borderRadius: 10,
                              background:
                                user.role === "admin"
                                  ? "linear-gradient(135deg, #fbbf24, #f59e0b)"
                                  : "linear-gradient(135deg, #10B981, #059669)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 800,
                              color: "white",
                              fontSize: 14,
                              flexShrink: 0,
                            }}
                          >
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: 14,
                                fontWeight: 600,
                                color: "#111827",
                              }}
                            >
                              {user.name}
                            </div>
                            <div style={{ fontSize: 12, color: "#6b7280" }}>
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role badge */}
                      <td style={{ padding: "14px 20px" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            padding: "4px 10px",
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 700,
                            background:
                              user.role === "admin" ? "#fffbeb" : "#f0fdf4",
                            color:
                              user.role === "admin" ? "#d97706" : "#059669",
                            border: `1px solid ${
                              user.role === "admin" ? "#fde68a" : "#d1fae5"
                            }`,
                          }}
                        >
                          {user.role === "admin" ? (
                            <Crown size={11} />
                          ) : (
                            <UserCheck size={11} />
                          )}
                          {user.role === "admin" ? "Admin" : "Utilisateur"}
                        </span>
                      </td>

                      {/* Account type */}
                      <td style={{ padding: "14px 20px" }}>
                        <span
                          style={{
                            fontSize: 13,
                            color: "#374151",
                            fontWeight: 500,
                          }}
                        >
                          {user.accountType}
                        </span>
                      </td>

                      {/* Events count */}
                      <td style={{ padding: "14px 20px" }}>
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#111827",
                          }}
                        >
                          {user._count.events}
                        </span>
                      </td>

                      {/* Date */}
                      <td style={{ padding: "14px 20px" }}>
                        <span style={{ fontSize: 13, color: "#6b7280" }}>
                          {new Date(user.createdAt).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            onClick={() => handleToggleRole(user.id, user.role)}
                            title={
                              user.role === "admin"
                                ? "Rétrograder en utilisateur"
                                : "Promouvoir en admin"
                            }
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: 9,
                              border: "1px solid #e5e7eb",
                              background: "white",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Crown
                              size={14}
                              color={user.role === "admin" ? "#f59e0b" : "#9ca3af"}
                            />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id, user.name)}
                            title="Supprimer l'utilisateur"
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: 9,
                              border: "1px solid #fee2e2",
                              background: "#fff5f5",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Trash2 size={14} color="#ef4444" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Admin credentials reminder ── */}
        <div
          style={{
            marginTop: 24,
            padding: "18px 24px",
            background: "#fffbeb",
            border: "1px solid #fde68a",
            borderRadius: 14,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <Crown size={20} color="#d97706" />
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#92400e",
              }}
            >
              Compte administrateur par défaut
            </div>
            <div style={{ fontSize: 13, color: "#b45309", marginTop: 2 }}>
              Email : <strong>admin@tchadevent.td</strong> · Mot de passe :{" "}
              <strong>Admin@TchadEvent2026</strong> — Pensez à changer ce mot de
              passe.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
