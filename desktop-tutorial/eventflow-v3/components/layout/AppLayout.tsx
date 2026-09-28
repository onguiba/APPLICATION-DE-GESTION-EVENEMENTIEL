"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import MobileNavBar from "@/components/layout/MobileNavBar";
import { Menu, X } from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      className="app-layout"
      style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}
    >
      {/* ── Sidebar overlay (mobile) ── */}
      <div
        className={`sidebar-overlay${sidebarOpen ? " visible" : ""}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* ── Hamburger button (mobile) ── */}
      <button
        className="mobile-menu-btn"
        onClick={() => setSidebarOpen((v) => !v)}
        aria-label={sidebarOpen ? "Fermer le menu" : "Ouvrir le menu"}
      >
        {sidebarOpen ? (
          <X size={20} color="var(--text-primary)" strokeWidth={2} />
        ) : (
          <Menu size={20} color="var(--text-primary)" strokeWidth={2} />
        )}
      </button>

      {/* ── Sidebar (desktop always visible, mobile slide-in) ── */}
      <div className={`sidebar-desktop${sidebarOpen ? " open" : ""}`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* ── Main content ── */}
      <main
        className="main-content"
        style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}
      >
        {children}
      </main>

      {/* ── Mobile bottom navigation ── */}
      <MobileNavBar />
    </div>
  );
}
