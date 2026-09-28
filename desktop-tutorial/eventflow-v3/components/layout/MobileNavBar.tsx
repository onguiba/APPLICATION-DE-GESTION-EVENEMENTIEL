"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store/useStore";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Bell,
  Wallet,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Accueil", icon: LayoutDashboard },
  { href: "/evenements", label: "Événements", icon: CalendarDays },
  { href: "/participants", label: "Participants", icon: Users },
  { href: "/budget", label: "Budget", icon: Wallet },
  { href: "/notifications", label: "Alertes", icon: Bell },
];

export default function MobileNavBar() {
  const pathname = usePathname();
  const { notifications } = useStore();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <nav className="mobile-nav">
      <div className="mobile-nav-items">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          const isNotif = href === "/notifications";

          return (
            <Link
              key={href}
              href={href}
              className={`mobile-nav-item${active ? " active" : ""}`}
            >
              <div style={{ position: "relative" }} className="nav-icon">
                <Icon
                  size={22}
                  strokeWidth={active ? 2.5 : 1.8}
                  color={active ? "var(--accent-primary)" : "var(--text-tertiary)"}
                />
                {isNotif && unread > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: -4,
                      right: -6,
                      minWidth: 16,
                      height: 16,
                      background: "#EF4444",
                      color: "white",
                      borderRadius: 999,
                      fontSize: 9,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "0 3px",
                    }}
                  >
                    {unread}
                  </span>
                )}
              </div>
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
