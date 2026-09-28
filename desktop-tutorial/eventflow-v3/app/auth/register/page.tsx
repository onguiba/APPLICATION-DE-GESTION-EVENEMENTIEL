"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useStore } from "@/lib/store/useStore";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();
  const { showToast } = useStore();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    email: "",
    phone: "",
    password: "",
    role: "Organisateur",
    terms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};

    if (!form.prenom) e.prenom = "Champ requis";
    if (!form.nom) e.nom = "Champ requis";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email))
      e.email = "Email invalide";
    if (!form.password || form.password.length < 8)
      e.password = "8 caracteres minimum";
    if (!form.terms)
      e.terms = "Veuillez accepter les conditions";

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

    showToast(
      `Bienvenue ${form.prenom} 👋 Votre compte a ete cree.`,
      "success"
    );

    router.push("/dashboard");
  };

  const set = (k: string, v: string | boolean) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((x) => ({ ...x, [k]: "" }));
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 14,
    border: "1px solid #E5E7EB",
    background: "#fff",
    fontSize: 14,
    outline: "none",
    color: "#111827",
    transition: "0.2s",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  } as const;

  const labelStyle = {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 8,
    color: "#374151",
  } as const;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#e8f5e9",
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
                alt="Lynkene"
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
              Lynkene
            </span>
          </Link>

          <Link
            href="/auth/login"
            style={{
              textDecoration: "none",
              color: "#10B981",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            Connexion
          </Link>
        </div>
      </header>

      {/* CONTENT */}
      <main
        style={{
          flex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 1150,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            background: "#fff",
            borderRadius: 32,
            overflow: "hidden",
            boxShadow: "0 30px 80px rgba(0,0,0,0.08)",
          }}
        >
          {/* LEFT SIDE */}
          <div
            style={{
              background: "linear-gradient(180deg, #10B981, #059669)",
              padding: 48,
              color: "#fff",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  width: 62,
                  height: 62,
                  borderRadius: 20,
                  background: "rgba(255,255,255,0.18)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 28,
                  backdropFilter: "blur(10px)",
                }}
              >
                <Sparkles size={28} />
              </div>

              <h1
                style={{
                  fontSize: 42,
                  lineHeight: 1.1,
                  fontWeight: 800,
                  marginBottom: 18,
                  fontFamily: "Syne, sans-serif",
                  letterSpacing: "-0.04em",
                }}
              >
                Organisez vos evenements simplement.
              </h1>

              <p
                style={{
                  fontSize: 16,
                  lineHeight: 1.7,
                  color: "rgba(255,255,255,0.88)",
                  maxWidth: 430,
                }}
              >
                Creez, gerez et developpez vos evenements avec une
                plateforme moderne pensee pour les organisateurs,
                entreprises et associations.
              </p>
            </div>

            <div
              style={{
                marginTop: 40,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {[
                "Inscription rapide et intuitive",
                "Gestion des participants simplifiee",
                "Paiements et invitations centralises",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    fontSize: 15,
                    color: "#fff",
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 999,
                      background: "rgba(255,255,255,0.18)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <ShieldCheck size={15} />
                  </div>

                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div
            style={{
              padding: 48,
              display: "flex",
              alignItems: "center",
            }}
          >
            <div style={{ width: "100%" }}>
              <div style={{ marginBottom: 30 }}>
                <h2
                  style={{
                    fontSize: 32,
                    fontWeight: 800,
                    color: "#111827",
                    marginBottom: 10,
                    fontFamily: "Syne, sans-serif",
                    letterSpacing: "-0.03em",
                  }}
                >
                  Creer un compte
                </h2>

                <p
                  style={{
                    color: "#6B7280",
                    fontSize: 15,
                    lineHeight: 1.6,
                  }}
                >
                  Rejoignez Lynkene et commencez a gerer vos
                  evenements des aujourd'hui.
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 18,
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                  }}
                >
                  <div>
                    <label style={labelStyle}>Prenom</label>

                    <input
                      value={form.prenom}
                      onChange={(e) =>
                        set("prenom", e.target.value)
                      }
                      placeholder="Prenom"
                      style={{
                        ...inputStyle,
                        borderColor: errors.prenom
                          ? "#EF4444"
                          : "#E5E7EB",
                      }}
                    />

                    {errors.prenom && (
                      <span
                        style={{
                          color: "#EF4444",
                          fontSize: 12,
                          marginTop: 6,
                          display: "block",
                        }}
                      >
                        {errors.prenom}
                      </span>
                    )}
                  </div>

                  <div>
                    <label style={labelStyle}>Nom</label>

                    <input
                      value={form.nom}
                      onChange={(e) =>
                        set("nom", e.target.value)
                      }
                      placeholder="Nom"
                      style={{
                        ...inputStyle,
                        borderColor: errors.nom
                          ? "#EF4444"
                          : "#E5E7EB",
                      }}
                    />

                    {errors.nom && (
                      <span
                        style={{
                          color: "#EF4444",
                          fontSize: 12,
                          marginTop: 6,
                          display: "block",
                        }}
                      >
                        {errors.nom}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Adresse email</label>

                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      set("email", e.target.value)
                    }
                    placeholder="vous@exemple.com"
                    style={{
                      ...inputStyle,
                      borderColor: errors.email
                        ? "#EF4444"
                        : "#E5E7EB",
                    }}
                  />

                  {errors.email && (
                    <span
                      style={{
                        color: "#EF4444",
                        fontSize: 12,
                        marginTop: 6,
                        display: "block",
                      }}
                    >
                      {errors.email}
                    </span>
                  )}
                </div>

                <div>
                  <label style={labelStyle}>Telephone</label>

                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      set("phone", e.target.value)
                    }
                    placeholder="+237 6XX XXX XXX"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Mot de passe</label>

                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) =>
                      set("password", e.target.value)
                    }
                    placeholder="Minimum 8 caracteres"
                    style={{
                      ...inputStyle,
                      borderColor: errors.password
                        ? "#EF4444"
                        : "#E5E7EB",
                    }}
                  />

                  {errors.password && (
                    <span
                      style={{
                        color: "#EF4444",
                        fontSize: 12,
                        marginTop: 6,
                        display: "block",
                      }}
                    >
                      {errors.password}
                    </span>
                  )}
                </div>

                <div>
                  <label style={labelStyle}>Type de compte</label>

                  <select
                    value={form.role}
                    onChange={(e) =>
                      set("role", e.target.value)
                    }
                    style={{
                      ...inputStyle,
                      cursor: "pointer",
                    }}
                  >
                    <option>Organisateur</option>
                    <option>Prestataire</option>
                    <option>Participant</option>
                  </select>
                </div>

                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                    }}
                  >
                    <input
                      id="terms"
                      type="checkbox"
                      checked={form.terms}
                      onChange={(e) =>
                        set("terms", e.target.checked)
                      }
                      style={{
                        marginTop: 4,
                        accentColor: "#10B981",
                        cursor: "pointer",
                      }}
                    />

                    <label
                      htmlFor="terms"
                      style={{
                        fontSize: 14,
                        color: "#6B7280",
                        lineHeight: 1.6,
                        cursor: "pointer",
                      }}
                    >
                      J'accepte les{" "}
                      <Link
                        href="#"
                        style={{
                          color: "#059669",
                          textDecoration: "none",
                          fontWeight: 600,
                        }}
                      >
                        conditions d'utilisation
                      </Link>{" "}
                      et la{" "}
                      <Link
                        href="#"
                        style={{
                          color: "#059669",
                          textDecoration: "none",
                          fontWeight: 600,
                        }}
                      >
                        politique de confidentialite
                      </Link>
                      .
                    </label>
                  </div>

                  {errors.terms && (
                    <span
                      style={{
                        color: "#EF4444",
                        fontSize: 12,
                        marginTop: 6,
                        display: "block",
                      }}
                    >
                      {errors.terms}
                    </span>
                  )}
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{
                    marginTop: 8,
                    height: 54,
                    borderRadius: 16,
                    border: "none",
                    background:
                      "linear-gradient(135deg, #10B981, #059669)",
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: loading ? "wait" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    boxShadow:
                      "0 14px 30px rgba(16,185,129,0.28)",
                    transition: "0.2s",
                  }}
                >
                  {loading ? (
                    "Creation du compte..."
                  ) : (
                    <>
                      Creer mon compte
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                <p
                  style={{
                    textAlign: "center",
                    marginTop: 6,
                    color: "#6B7280",
                    fontSize: 14,
                  }}
                >
                  Vous avez deja un compte ?{" "}
                  <Link
                    href="/auth/login"
                    style={{
                      color: "#059669",
                      textDecoration: "none",
                      fontWeight: 700,
                    }}
                  >
                    Se connecter
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer
        style={{
          borderTop: "1px solid #c1fae8",
          background: "#fff",
        }}
      >
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            padding: "22px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <p
            style={{
              color: "#6B7280",
              fontSize: 14,
            }}
          >
            2026 Lynkene. Tous droits reserves.
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
            }}
          >
            <Link
              href="#"
              style={{
                textDecoration: "none",
                color: "#6B7280",
                fontSize: 14,
              }}
            >
              Confidentialite
            </Link>

            <Link
              href="#"
              style={{
                textDecoration: "none",
                color: "#6B7280",
                fontSize: 14,
              }}
            >
              Conditions
            </Link>

            <Link
              href="#"
              style={{
                textDecoration: "none",
                color: "#6B7280",
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
