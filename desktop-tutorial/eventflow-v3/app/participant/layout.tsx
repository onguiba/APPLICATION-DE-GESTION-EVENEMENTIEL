"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Calendar, Wallet, FileText, Bell } from "lucide-react";

export default function ParticipantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const tabs = [
    { name: "Actualité", href: "/participant", icon: Home },
    { name: "Événements", href: "/participant/events", icon: Calendar },
    { name: "Mes Tickets", href: "/participant/budget", icon: Wallet },
    { name: "Mes Rapports", href: "/participant/reports", icon: FileText },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      {/* SIDEBAR */}
      <div
        style={{
          width: 280,
          background: "#fff",
          borderRight: "1px solid #e2e8f0",
          display: "flex",
          flexDirection: "column",
          padding: "24px",
          gap: 24,
        }}
      >
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#10B981", margin: 0 }}>
            TchadEvent
          </h1>
          <p style={{ fontSize: 12, color: "#94a3b8", margin: "4px 0 0 0" }}>
            Participant
          </p>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.href || (tab.href !== "/participant" && pathname.startsWith(tab.href));

            return (
              <Link
                key={tab.href}
                href={tab.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 16px",
                  borderRadius: 12,
                  textDecoration: "none",
                  color: isActive ? "#10B981" : "#64748b",
                  background: isActive ? "#10B98115" : "transparent",
                  fontWeight: isActive ? 600 : 500,
                  fontSize: 14,
                  transition: "all 0.2s",
                }}
              >
                <Icon size={20} />
                {tab.name}
              </Link>
            );
          })}
        </nav>

        <div
          style={{
            marginTop: "auto",
            paddingTop: 24,
            borderTop: "1px solid #e2e8f0",
          }}
        >
          <div
            style={{
              background: "#10B98115",
              borderRadius: 12,
              padding: 16,
              textAlign: "center",
            }}
          >
            <Bell size={24} color="#10B981" style={{ margin: "0 auto 8px" }} />
            <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>
              Vous recevrez les notifications pour vos événements
            </p>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {children}
      </div>
    </div>
  );
}
