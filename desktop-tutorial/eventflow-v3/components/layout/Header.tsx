"use client";

import Image from "next/image";
import { Bell, Search, Plus, X } from "lucide-react";
import { useStore } from "@/lib/store/useStore";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick?: () => void;
  };
}

export default function Header({
  title,
  subtitle,
  action,
}: HeaderProps) {
  const { notifications, searchQuery, setSearchQuery } = useStore();

  const unread = notifications.filter((n) => !n.lu).length;

  const router = useRouter();

  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "var(--glass-bg)",
        backdropFilter: "blur(var(--glass-blur))",
        borderBottom: "1px solid var(--glass-border)",
      }}
    >
      <div
        style={{
          padding: "18px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        {/* LEFT */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          {/* Logo */}

          <div
            onClick={() => router.push("/dashboard")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 14,
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
                alt="Lynkéné"
                width={28}
                height={28}
              />
            </div>

            <div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#10B981",
                  letterSpacing: "-0.03em",
                }}
              >
                Lynkéné
              </div>

              <div
                style={{
                  fontSize: 11,
                  color: "#999",
                  marginTop: 2,
                }}
              >
                Event Management Platform
              </div>
            </div>
          </div>

          {/* Divider */}

          <div
            style={{
              width: 1,
              height: 42,
              background: "#ececec",
            }}
          />

          {/* Page title */}

          <div>
            <h1
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: "var(--text-primary)",
                letterSpacing: "-0.03em",
                marginBottom: 3,
              }}
            >
              {title}
            </h1>

            {subtitle && (
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-secondary)",
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* RIGHT */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          {/* SEARCH */}

          {searchOpen ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "var(--bg-secondary)",
                border: "1.5px solid var(--accent-primary)",
                borderRadius: 16,
                padding: "12px 16px",
                width: 300,
                boxShadow: "var(--shadow-cyan)",
              }}
            >
              <Search size={16} color="#f7931e" />

              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un événement..."
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  color: "var(--text-primary)",
                  fontSize: 14,
                  fontFamily: "inherit",
                }}
              />

              <button
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery("");
                }}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={15} color="#888" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: 16,
                padding: "12px 16px",
                cursor: "pointer",
                minWidth: 230,
              }}
            >
              <Search size={16} color="#999" />

              <span
                style={{
                  color: "#999",
                  fontSize: 14,
                }}
              >
                Rechercher...
              </span>

              <kbd
                style={{
                  marginLeft: "auto",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "var(--text-secondary)",
                  borderRadius: 8,
                  padding: "4px 8px",
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                ⌘K
              </kbd>
            </button>
          )}

          {/* NOTIFICATIONS */}

          <button
            onClick={() => router.push("/notifications")}
            style={{
              position: "relative",
              width: 50,
              height: 50,
              borderRadius: 16,
              border: "1px solid rgba(255, 255, 255, 0.1)",
              background: "rgba(255, 255, 255, 0.03)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all .2s ease",
            }}
          >
            <Bell size={18} color="#555" />

            {unread > 0 && (
              <>
                <span
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#f7931e",
                    border: "2px solid white",
                  }}
                />

                <span
                  style={{
                    position: "absolute",
                    top: -4,
                    right: -2,
                    minWidth: 18,
                    height: 18,
                    borderRadius: 999,
                    background: "var(--accent-primary)",
                    color: "var(--bg-primary)",
                    fontSize: 10,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 5px",
                  }}
                >
                  {unread}
                </span>
              </>
            )}
          </button>

          {/* ACTION BUTTON */}

          {action && (
            <button
              onClick={action.onClick}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                border: "none",
                background: "var(--accent-primary)",
                color: "var(--bg-primary)",
                padding: "14px 22px",
                borderRadius: 16,
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 14,
                boxShadow: "var(--shadow-cyan)",
                transition: "all .2s ease",
              }}
              onMouseEnter={(e) => {
                (
                  e.currentTarget as HTMLButtonElement
                ).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (
                  e.currentTarget as HTMLButtonElement
                ).style.transform = "translateY(0)";
              }}
            >
              <Plus size={17} strokeWidth={2.5} />
              {action.label}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
