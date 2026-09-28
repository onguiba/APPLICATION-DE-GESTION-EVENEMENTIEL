"use client";
import Header from "@/components/layout/Header";
import { useStore } from "@/lib/store/useStore";
import { useState } from "react";
import { inputStyle, selectStyle, Field } from "@/components/ui/Field";
import { User, Lock, Bell, Palette, Globe, Shield } from "lucide-react";

const tabs = [
  { id: "profil", label: "Profil", icon: User },
  { id: "securite", label: "Sécurité", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "apparence", label: "Apparence", icon: Palette },
];

export default function SettingsPage() {
  const { showToast } = useStore();
  const [activeTab, setActiveTab] = useState("profil");
  const [profile, setProfile] = useState({ prenom: "", nom: "", email: "", phone: "", role: "Organisateur", langue: "Français", bio: "" });
  const [notifPrefs, setNotifPrefs] = useState({ email: true, sms: true, whatsapp: false, push: true, budgetAlerts: true, participantAlerts: true, reminderD1: true, reminderD7: false });
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });

  const save = () => showToast("Paramètres sauvegardés", "success");

  const toggle = (key: keyof typeof notifPrefs) =>
    setNotifPrefs(p => ({ ...p, [key]: !p[key] }));

  const Toggle = ({ active, onToggle }: { active: boolean; onToggle: () => void }) => (
    <div onClick={onToggle} style={{ width: 40, height: 22, borderRadius: 11, cursor: "pointer", background: active ? "var(--accent)" : "var(--bg-3)", border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`, position: "relative", transition: "all 0.2s", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: 3, left: active ? 20 : 3, width: 14, height: 14, borderRadius: "50%", background: active ? "#0a0a0a" : "var(--text-muted)", transition: "left 0.2s" }} />
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "auto" }}>
      <Header title="Paramètres" subtitle="Gérez votre compte et vos préférences" />

      <div style={{ padding: "20px 32px 32px", display: "grid", gridTemplateColumns: "220px 1fr", gap: 24 }}>
        {/* Sidebar tabs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8, background: activeTab === id ? "var(--accent-bg)" : "none", border: activeTab === id ? "1px solid rgba(200,245,74,0.15)" : "1px solid transparent", color: activeTab === id ? "var(--accent)" : "var(--text-muted)", fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: activeTab === id ? 500 : 400, textAlign: "left" }}>
              <Icon size={15} strokeWidth={activeTab === id ? 2 : 1.5} />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
          {activeTab === "profil" && (
            <>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
                <h2 style={{ fontSize: 16, fontFamily: "Syne, sans-serif", fontWeight: 700 }}>Informations personnelles</h2>
              </div>
              <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Avatar */}
                <div style={{ display: "flex", gap: 16, alignItems: "center", padding: 16, background: "var(--bg-3)", borderRadius: 10, border: "1px solid var(--border)" }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, var(--accent), #6ee7b7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: "#0a0a0a", fontFamily: "Syne, sans-serif", flexShrink: 0 }}>
                    {profile.prenom[0]}{profile.nom[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, fontFamily: "Syne, sans-serif" }}>{profile.prenom} {profile.nom}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{profile.role} · TchadEvent</div>
                  </div>
                  <button onClick={() => showToast("Upload photo — bientôt disponible", "info")} style={{ marginLeft: "auto", background: "none", border: "1px solid var(--border)", borderRadius: 7, padding: "6px 14px", fontSize: 12, color: "var(--text-muted)", cursor: "pointer" }}>
                    Changer photo
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <Field label="Prénom">
                    <input style={inputStyle} value={profile.prenom} onChange={e => setProfile(p => ({ ...p, prenom: e.target.value }))} />
                  </Field>
                  <Field label="Nom">
                    <input style={inputStyle} value={profile.nom} onChange={e => setProfile(p => ({ ...p, nom: e.target.value }))} />
                  </Field>
                  <Field label="Email">
                    <input style={inputStyle} type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
                  </Field>
                  <Field label="Téléphone">
                    <input style={inputStyle} value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
                  </Field>
                  <Field label="Rôle">
                    <select style={selectStyle} value={profile.role} onChange={e => setProfile(p => ({ ...p, role: e.target.value }))}>
                      <option>Organisateur</option><option>Prestataire</option><option>Entreprise</option>
                    </select>
                  </Field>
                  <Field label="Langue">
                    <select style={selectStyle} value={profile.langue} onChange={e => setProfile(p => ({ ...p, langue: e.target.value }))}>
                      <option>Français</option><option>English</option>
                    </select>
                  </Field>
                </div>
                <Field label="Bio">
                  <textarea style={{ ...inputStyle, resize: "vertical" }} rows={2} value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} />
                </Field>
                <button onClick={save} style={{ alignSelf: "flex-start", background: "var(--accent)", border: "none", borderRadius: 8, padding: "10px 24px", color: "#0a0a0a", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Syne, sans-serif" }}>
                  Sauvegarder
                </button>
              </div>
            </>
          )}

          {activeTab === "securite" && (
            <>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
                <h2 style={{ fontSize: 16, fontFamily: "Syne, sans-serif", fontWeight: 700 }}>Sécurité du compte</h2>
              </div>
              <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ padding: 16, background: "rgba(200,245,74,0.06)", border: "1px solid rgba(200,245,74,0.15)", borderRadius: 10, display: "flex", gap: 10, alignItems: "center" }}>
                  <Shield size={16} color="var(--accent)" />
                  <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Votre compte est sécurisé avec l'authentification JWT + TLS.</span>
                </div>
                <Field label="Mot de passe actuel">
                  <input style={inputStyle} type="password" value={pwd.current} onChange={e => setPwd(p => ({ ...p, current: e.target.value }))} placeholder="••••••••" />
                </Field>
                <Field label="Nouveau mot de passe">
                  <input style={inputStyle} type="password" value={pwd.next} onChange={e => setPwd(p => ({ ...p, next: e.target.value }))} placeholder="8+ caractères" />
                </Field>
                <Field label="Confirmer le mot de passe">
                  <input style={inputStyle} type="password" value={pwd.confirm} onChange={e => setPwd(p => ({ ...p, confirm: e.target.value }))} placeholder="••••••••" />
                </Field>
                <button onClick={() => { if (pwd.next !== pwd.confirm) { showToast("Les mots de passe ne correspondent pas", "error"); return; } showToast("Mot de passe mis à jour", "success"); setPwd({ current: "", next: "", confirm: "" }); }}
                  style={{ alignSelf: "flex-start", background: "var(--accent)", border: "none", borderRadius: 8, padding: "10px 24px", color: "#0a0a0a", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Syne, sans-serif" }}>
                  Changer le mot de passe
                </button>

                <div style={{ marginTop: 8, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
                  <h3 style={{ fontSize: 14, fontFamily: "Syne, sans-serif", fontWeight: 700, marginBottom: 4 }}>Zone dangereuse</h3>
                  <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 14 }}>La suppression du compte est irréversible.</p>
                  <button onClick={() => showToast("Contactez le support pour supprimer votre compte", "info")} style={{ background: "rgba(255,77,77,0.1)", border: "1px solid rgba(255,77,77,0.2)", borderRadius: 8, padding: "9px 18px", color: "var(--red)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    Supprimer mon compte
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === "notifications" && (
            <>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
                <h2 style={{ fontSize: 16, fontFamily: "Syne, sans-serif", fontWeight: 700 }}>Préférences de notifications</h2>
              </div>
              <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 0 }}>
                {[
                  { key: "email" as const, label: "Notifications par email", desc: "Confirmations et résumés d'activité" },
                  { key: "sms" as const, label: "Notifications SMS", desc: "Alertes urgentes et rappels" },
                  { key: "whatsapp" as const, label: "WhatsApp", desc: "Messages personnalisés aux participants" },
                  { key: "push" as const, label: "Notifications push", desc: "Alertes temps réel sur l'application" },
                  { key: "budgetAlerts" as const, label: "Alertes budget", desc: "Notification lors de dépassement ou approche du seuil" },
                  { key: "participantAlerts" as const, label: "Activité participants", desc: "Nouvelles inscriptions et annulations" },
                  { key: "reminderD1" as const, label: "Rappel J-1", desc: "Rappel automatique la veille de l'événement" },
                  { key: "reminderD7" as const, label: "Rappel J-7", desc: "Rappel une semaine avant l'événement" },
                ].map(({ key, label, desc }, i, arr) => (
                  <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{label}</div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{desc}</div>
                    </div>
                    <Toggle active={notifPrefs[key]} onToggle={() => toggle(key)} />
                  </div>
                ))}
                <button onClick={save} style={{ alignSelf: "flex-start", marginTop: 20, background: "var(--accent)", border: "none", borderRadius: 8, padding: "10px 24px", color: "#0a0a0a", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Syne, sans-serif" }}>
                  Sauvegarder
                </button>
              </div>
            </>
          )}

          {activeTab === "apparence" && (
            <>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
                <h2 style={{ fontSize: 16, fontFamily: "Syne, sans-serif", fontWeight: 700 }}>Apparence</h2>
              </div>
              <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 24 }}>
                <div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12, fontWeight: 500 }}>THÈME</div>
                  <div style={{ display: "flex", gap: 12 }}>
                    {[{ label: "Sombre", active: true }, { label: "Clair", active: false }, { label: "Système", active: false }].map(({ label, active }) => (
                      <button key={label} onClick={() => showToast(label === "Sombre" ? "Thème sombre actif" : "Bientôt disponible", active ? "success" : "info")}
                        style={{ flex: 1, padding: "12px", borderRadius: 8, background: active ? "var(--accent-bg)" : "var(--bg-3)", border: `1px solid ${active ? "rgba(200,245,74,0.3)" : "var(--border)"}`, color: active ? "var(--accent)" : "var(--text-muted)", cursor: "pointer", fontSize: 13, fontWeight: active ? 600 : 400, fontFamily: "'DM Sans', sans-serif" }}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12, fontWeight: 500 }}>LANGUE DE L'INTERFACE</div>
                  <div style={{ display: "flex", gap: 12 }}>
                    {[{ label: "🇫🇷  Français", active: true }, { label: "🇬🇧  English", active: false }].map(({ label, active }) => (
                      <button key={label} onClick={() => showToast(active ? "Français sélectionné" : "English — coming soon", "info")}
                        style={{ padding: "10px 20px", borderRadius: 8, background: active ? "var(--accent-bg)" : "var(--bg-3)", border: `1px solid ${active ? "rgba(200,245,74,0.3)" : "var(--border)"}`, color: active ? "var(--accent)" : "var(--text-muted)", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12, fontWeight: 500 }}>COULEUR D'ACCENT</div>
                  <div style={{ display: "flex", gap: 10 }}>
                    {["#c8f54a", "#4d9fff", "#a78bfa", "#ff9c4d", "#6ee7b7", "#ff4d4d"].map(col => (
                      <div key={col} onClick={() => showToast("Couleur appliquée", "success")} style={{ width: 32, height: 32, borderRadius: "50%", background: col, cursor: "pointer", border: col === "#c8f54a" ? "2px solid #fff" : "2px solid transparent", transition: "transform 0.1s" }} />
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
