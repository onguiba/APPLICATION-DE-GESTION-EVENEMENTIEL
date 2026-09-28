"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { useStore } from "@/lib/store/useStore";

import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Wallet,
  Bell,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

const navItems = [
  {
    href: "/dashboard",
    label: "Tableau de bord",
    icon: LayoutDashboard,
  },
  {
    href: "/evenements",
    label: "Événements",
    icon: CalendarDays,
  },
  {
    href: "/participants",
    label: "Participants",
    icon: Users,
  },
  {
    href: "/budget",
    label: "Budget",
    icon: Wallet,
  },
  {
    href: "/notifications",
    label: "Notifications",
    icon: Bell,
  },
  {
    href: "/rapports",
    label: "Rapports",
    icon: BarChart3,
  },
];

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();

  const router = useRouter();

  const { notifications, showToast, fetchEvents, fetchParticipants, fetchDepenses } = useStore();

  const unread = notifications.filter((n) => !n.lu).length;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handler);

    fetchEvents();
    fetchParticipants();
    fetchDepenses();

    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleLogout = () => {
    showToast("Déconnexion réussie", "info");

    setTimeout(() => {
      router.push("/auth/login");
    }, 700);
  };

  return (
    <aside
      style={{
        width: 270,
        minWidth: 270,
        height: "100vh",
        position: "sticky",
        top: 0,
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-secondary)",
        borderRight: "1px solid rgba(255, 255, 255, 0.05)",
      }}
    >
      {/* ================= LOGO ================= */}

      <div
        style={{
          padding: "26px 22px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        <Link
          href="/dashboard"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 18,
              background: "#d1fae5",
              border: "1px solid #a7f3d0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <Image
              src="/logo.png"
              alt="TchadEvent"
              width={30}
              height={30}
            />
          </div>

          <div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "#10B981",
                letterSpacing: "-0.03em",
              }}
            >
              TchadEvent
            </div>

            <div
              style={{
                fontSize: 12,
                color: "#999",
                marginTop: 3,
              }}
            >
              Gestion événementielle
            </div>
          </div>
        </Link>
      </div>

      {/* ================= NAVIGATION ================= */}

      <nav
        style={{
          flex: 1,
          padding: "18px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          overflowY: "auto",
        }}
      >
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href || pathname.startsWith(href + "/");

          const isNotif = href === "/notifications";

          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 16px",
                borderRadius: 18,
                textDecoration: "none",
                position: "relative",
                transition: "all .2s ease",
                background: active ? "rgba(255, 255, 255, 0.05)" : "transparent",
                color: active ? "var(--accent-primary)" : "var(--text-secondary)",
                fontWeight: active ? 700 : 500,
                boxShadow: active
                  ? "inset 0 0 0 1px rgba(255, 255, 255, 0.1)"
                  : "none",
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  background: active
                    ? "rgba(0, 217, 255, 0.1)"
                    : "rgba(255, 255, 255, 0.03)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon
                  size={18}
                  color={active ? "var(--accent-primary)" : "var(--text-secondary)"}
                  strokeWidth={2}
                />
              </div>

              <span
                style={{
                  fontSize: 14,
                }}
              >
                {label}
              </span>

              {isNotif && unread > 0 && (
                <span
                  style={{
                    marginLeft: "auto",
                    minWidth: 22,
                    height: 22,
                    borderRadius: 999,
                    background: active ? "var(--accent-primary)" : "rgba(255, 255, 255, 0.1)",
                    color: active ? "#000" : "var(--text-primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 800,
                    padding: "0 6px",
                  }}
                >
                  {unread}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ================= BOTTOM ================= */}

      <div
        style={{
          padding: 14,
          borderTop: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        {/* SETTINGS */}

        <Link
          href="/settings"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "14px 16px",
            borderRadius: 18,
            textDecoration: "none",
            marginBottom: 12,
            background:
              pathname === "/settings"
                ? "rgba(255, 255, 255, 0.05)"
                : "transparent",
            color:
              pathname === "/settings"
                ? "var(--accent-primary)"
                : "var(--text-secondary)",
            fontWeight: 600,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background:
                pathname === "/settings"
                  ? "rgba(0, 217, 255, 0.1)"
                  : "rgba(255, 255, 255, 0.03)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Settings
              size={18}
              color={
                pathname === "/settings"
                  ? "var(--accent-primary)"
                  : "var(--text-secondary)"
              }
            />
          </div>

          Paramètres
        </Link>

        {/* USER CARD */}

        <div
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            borderRadius: 22,
            padding: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            {/* Logo */}

            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: 12,
                background: "#d1fae5",
                color: "var(--text-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: 15,
                flexShrink: 0,
                border: "1px solid #a7f3d0",
                overflow: "hidden",
              }}
            >
              <Image
                src="/logo.png"
                alt="Lynkene"
                width={30}
                height={30}
              />
            </div>

            {/* Infos */}

            <div
              style={{
                flex: 1,
                minWidth: 0,
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: 4,
                }}
              >
                Connecté
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: "var(--accent-secondary)",
                }}
              >
                Prêt à gérer
              </div>
            </div>

            {/* Logout */}

            <button
              onClick={handleLogout}
              title="Se déconnecter"
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                border: "none",
                background: "rgba(255, 255, 255, 0.05)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all .2s ease",
              }}
            >
              <LogOut
                size={17}
                color="var(--text-secondary)"
              />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
