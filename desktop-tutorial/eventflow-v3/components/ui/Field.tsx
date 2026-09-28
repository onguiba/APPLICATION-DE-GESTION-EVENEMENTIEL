import { CSSProperties } from "react";

interface FieldProps { label: string; children: React.ReactNode; style?: CSSProperties; }
export function Field({ label, children, style }: FieldProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
      <label style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, letterSpacing: "0.06em" }}>{label.toUpperCase()}</label>
      {children}
    </div>
  );
}

export const inputStyle: CSSProperties = {
  background: "#ffffff",
  border: "1px solid #d1d5db",
  borderRadius: 9,
  padding: "12px 14px",
  color: "#1f2937",
  fontSize: 14,
  outline: "none",
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  width: "100%",
  transition: "all 0.2s ease",
  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
};

export const selectStyle: CSSProperties = { ...inputStyle, appearance: "none" as const, cursor: "pointer" };
