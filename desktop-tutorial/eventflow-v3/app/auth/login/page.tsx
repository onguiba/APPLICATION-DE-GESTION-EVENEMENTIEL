
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, CalendarDays } from "lucide-react";
import { useStore } from "@/lib/store/useStore";

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useStore();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};

    if (!form.email) {
      e.email = "Email requis";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      e.email = "Email invalide";
    }

    if (!form.password) {
      e.password = "Mot de passe requis";
    }

    return e;
  };

  const handleSubmit = async () => {
    const e = validate();

    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }

    setLoading(true);

    await new Promise((r) => setTimeout(r, 1000));

    showToast("Connexion réussie !", "success");
    router.push("/dashboard");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          width: "100%",
          borderBottom: "1px solid #f1f1f1",
          background: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "18px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              textDecoration: "none",
            }}
          >
            {/* REMPLACE /logo.png PAR TON LOGO */}
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                overflow: "hidden",
                background: "#d1fae5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                src="/logo.png"
                alt="TchadEvent"
                width={34}
                height={34}
              />
            </div>

            <span
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "#111827",
                fontFamily: "Syne, sans-serif",
                letterSpacing: "-0.03em",
              }}
            >
              TchadEvent
            </span>
          </Link>

          <Link
            href="/auth/register"
            style={{
              textDecoration: "none",
              color: "#10B981",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            Créer un compte
          </Link>
        </div>
      </header>

      {/* MAIN */}
      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
          background:
            "linear-gradient(to bottom right, #fff 0%, #e8f5e9 100%)",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 460,
            background: "#fff",
            borderRadius: 24,
            padding: 40,
            border: "1px solid #f3f4f6",
            boxShadow: "0 10px 40px rgba(0,0,0,0.06)",
          }}
        >
          {/* ICON */}
          <div
            style={{
              width: 68,
              height: 68,
              borderRadius: 20,
              background: "#d1fae5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
            }}
          >
            <CalendarDays size={30} color="#10B981" />
          </div>

          {/* TITLE */}
          <h1
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: "#111827",
              marginBottom: 10,
              fontFamily: "Syne, sans-serif",
              letterSpacing: "-0.04em",
            }}
          >
            Bon retour 👋
          </h1>

          <p
            style={{
              color: "#6b7280",
              fontSize: 15,
              lineHeight: 1.6,
              marginBottom: 32,
            }}
          >
            Connectez-vous à votre espace TchadEvent pour gérer vos événements
            facilement.
          </p>

          {/* FORM */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            {/* EMAIL */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#374151",
                }}
              >
                Adresse email
              </label>

              <input
                type="email"
                placeholder="vous@exemple.com"
                value={form.email}
                onChange={(e) => {
                  setForm((f) => ({
                    ...f,
                    email: e.target.value,
                  }));

                  setErrors((x) => ({
                    ...x,
                    email: "",
                  }));
                }}
                style={{
                  width: "100%",
                  height: 52,
                  borderRadius: 14,
                  border: errors.email
                    ? "1px solid #ef4444"
                    : "1px solid #e5e7eb",
                  padding: "0 16px",
                  outline: "none",
                  fontSize: 15,
                  transition: "0.2s",
                  background: "#fff",
                }}
              />

              {errors.email && (
                <span
                  style={{
                    fontSize: 12,
                    color: "#ef4444",
                    marginTop: 6,
                    display: "block",
                  }}
                >
                  {errors.email}
                </span>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <label
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#374151",
                  }}
                >
                  Mot de passe
                </label>

                <Link
                  href="/auth/forgot"
                  style={{
                    fontSize: 13,
                    textDecoration: "none",
                    color: "#10B981",
                    fontWeight: 600,
                  }}
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => {
                    setForm((f) => ({
                      ...f,
                      password: e.target.value,
                    }));

                    setErrors((x) => ({
                      ...x,
                      password: "",
                    }));
                  }}
                  style={{
                    width: "100%",
                    height: 52,
                    borderRadius: 14,
                    border: errors.password
                      ? "1px solid #ef4444"
                      : "1px solid #e5e7eb",
                    padding: "0 48px 0 16px",
                    outline: "none",
                    fontSize: 15,
                    background: "#fff",
                  }}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "#9ca3af",
                    display: "flex",
                  }}
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {errors.password && (
                <span
                  style={{
                    fontSize: 12,
                    color: "#ef4444",
                    marginTop: 6,
                    display: "block",
                  }}
                >
                  {errors.password}
                </span>
              )}
            </div>

            {/* BUTTON */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: "100%",
                height: 54,
                borderRadius: 14,
                border: "none",
                background: "linear-gradient(135deg, #10B981, #059669)",
                color: "#fff",
                fontSize: 15,
                fontWeight: 700,
                cursor: loading ? "wait" : "pointer",
                marginTop: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "0.2s",
                boxShadow: "0 10px 25px rgba(16,185,129,0.25)",
              }}
            >
              {loading ? (
                "Connexion..."
              ) : (
                <>
                  <span>Se connecter</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </div>

          {/* REGISTER */}
          <p
            style={{
              textAlign: "center",
              marginTop: 28,
              fontSize: 14,
              color: "#6b7280",
            }}
          >
            Vous n'avez pas encore de compte ?{" "}
            <Link
              href="/auth/register"
              style={{
                color: "#10B981",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              S'inscrire
            </Link>
          </p>
        </div>
      </main>

      {/* FOOTER */}
      <footer
        style={{
          borderTop: "1px solid #f3f4f6",
          padding: "18px 20px",
          background: "#fff",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#6b7280",
              fontSize: 14,
            }}
          >
            © 2026 TchadEvent. Tous droits réservés.
          </p>

          <div
            style={{
              display: "flex",
              gap: 18,
            }}
          >
            <Link
              href="/privacy"
              style={{
                textDecoration: "none",
                color: "#6b7280",
                fontSize: 14,
              }}
            >
              Confidentialité
            </Link>

            <Link
              href="/terms"
              style={{
                textDecoration: "none",
                color: "#6b7280",
                fontSize: 14,
              }}
            >
              Conditions
            </Link>

            <Link
              href="/support"
              style={{
                textDecoration: "none",
                color: "#6b7280",
                fontSize: 14,
              }}
            >
              Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

