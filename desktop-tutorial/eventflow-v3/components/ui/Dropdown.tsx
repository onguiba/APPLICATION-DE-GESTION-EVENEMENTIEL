"use client";
import { ReactNode, useEffect, useRef, useState } from "react";

interface DropdownItem {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  danger?: boolean;
}

interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
}

export default function Dropdown({ trigger, items }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-flex" }}>
      <div onClick={() => setOpen(!open)} style={{ cursor: "pointer" }}>
        {trigger}
      </div>
      {open && (
        <div
          style={{
            position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 500,
            background: "var(--bg-2)", border: "1px solid var(--border)",
            borderRadius: 10, padding: 4, minWidth: 180,
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            animation: "fadeUp 0.15s ease forwards",
          }}
        >
          {items.map(({ label, icon, onClick, danger }) => (
            <button
              key={label}
              onClick={() => { onClick(); setOpen(false); }}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                width: "100%", background: "none", border: "none",
                borderRadius: 7, padding: "8px 10px",
                color: danger ? "var(--red)" : "var(--text)",
                fontSize: 13, cursor: "pointer", textAlign: "left",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
