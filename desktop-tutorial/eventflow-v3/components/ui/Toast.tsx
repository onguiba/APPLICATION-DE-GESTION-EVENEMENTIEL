"use client";
import { useStore } from "@/lib/store/useStore";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

export default function Toast() {
  const { toasts, removeToast } = useStore();
  if (!toasts || toasts.length === 0) return null;

  const toast = toasts[0];

  const configs = {
    success: { bg: "rgba(45,255,192,0.1)", border: "rgba(45,255,192,0.3)", icon: "var(--mint)", Ic: CheckCircle, glow: "rgba(45,255,192,0.15)" },
    error:   { bg: "rgba(255,69,103,0.1)", border: "rgba(255,69,103,0.3)", icon: "var(--red)",  Ic: AlertCircle, glow: "rgba(255,69,103,0.15)" },
    info:    { bg: "rgba(124,92,252,0.1)", border: "rgba(124,92,252,0.3)", icon: "var(--primary-light)", Ic: Info, glow: "rgba(124,92,252,0.15)" },
    warning: { bg: "rgba(255,193,7,0.1)", border: "rgba(255,193,7,0.3)", icon: "var(--warning)", Ic: AlertCircle, glow: "rgba(255,193,7,0.15)" },
  };
  const { bg, border, icon, Ic, glow } = configs[toast.type];

  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", alignItems: "center", gap: 10, background: "var(--bg-2)", border: `1px solid ${border}`, borderRadius: 12, padding: "13px 16px", boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${border}, 0 0 20px ${glow}`, animation: "fadeUp 0.3s cubic-bezier(.16,1,.3,1) forwards", maxWidth: 360 }}>
      <div style={{ width: 30, height: 30, borderRadius: 8, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Ic size={15} color={icon} />
      </div>
      <span style={{ fontSize: 13, color: "var(--text)", flex: 1, fontWeight: 500 }}>{toast.message}</span>
      <button onClick={() => removeToast(toast.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", padding: 2 }}>
        <X size={14} />
      </button>
    </div>
  );
}
