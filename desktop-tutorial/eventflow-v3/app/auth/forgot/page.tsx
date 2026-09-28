"use client";
import Link from "next/link";
import { useState } from "react";
import { Zap, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const inputStyle = { width: "100%", background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "11px 14px", color: "var(--text)", fontSize: 14, outline: "none", fontFamily: "'DM Sans', sans-serif" } as const;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40 }}>
        <div style={{ width: 30, height: 30, background: "var(--accent)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Zap size={14} color="#0a0a0a" fill="#0a0a0a" />
        </div>
        <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: "-0.03em" }}>Lynkéné</span>
      </div>

      {!sent ? (
        <>
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 26, fontFamily: "Syne, sans-serif", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 6 }}>Mot de passe oublié.</h1>
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Entrez votre email pour recevoir un lien de réinitialisation.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, color: "var(--text-muted)", marginBottom: 6, fontWeight: 500, letterSpacing: "0.04em" }}>EMAIL</label>
              <input type="email" placeholder="vous@exemple.com" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
            </div>
            <button onClick={() => email && setSent(true)} style={{ background: "var(--accent)", color: "#0a0a0a", padding: "12px", borderRadius: 8, border: "none", fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              Envoyer le lien
            </button>
          </div>
        </>
      ) : (
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(200,245,74,0.1)", border: "1px solid rgba(200,245,74,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <CheckCircle size={28} color="var(--accent)" />
          </div>
          <h2 style={{ fontSize: 22, fontFamily: "Syne, sans-serif", fontWeight: 800, marginBottom: 8 }}>Email envoyé !</h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6 }}>Un lien de réinitialisation a été envoyé à <strong style={{ color: "var(--text)" }}>{email}</strong>.</p>
        </div>
      )}

      <div style={{ marginTop: 28, textAlign: "center" }}>
        <Link href="/auth/login" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}>
          <ArrowLeft size={13} /> Retour à la connexion
        </Link>
      </div>
    </div>
  );
}
