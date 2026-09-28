"use client";
import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps { open: boolean; onClose: () => void; title: string; children: ReactNode; width?: number; }

export default function Modal({ open, onClose, title, children, width = 520 }: ModalProps) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
  if (!open) return null;

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, animation: "fadeIn 0.15s ease forwards" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#f8f9fa", border: "1px solid #e5e7eb", borderRadius: 18, width: "100%", maxWidth: width, animation: "fadeUp 0.22s cubic-bezier(.16,1,.3,1) forwards", maxHeight: "90vh", overflow: "auto", boxShadow: "0 24px 80px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)" }}>
        {/* Top gradient bar */}
        <div style={{ height: 2, background: "linear-gradient(90deg, #10B981, #6EE7B7)", borderRadius: "18px 18px 0 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid #e5e7eb" }}>
          <h2 style={{ fontSize: 17, fontFamily: "Syne, sans-serif", fontWeight: 700, letterSpacing: "-0.02em", color: "#1f2937" }}>{title}</h2>
          <button onClick={onClose} style={{ background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#6b7280" }}>
            <X size={14} />
          </button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}
