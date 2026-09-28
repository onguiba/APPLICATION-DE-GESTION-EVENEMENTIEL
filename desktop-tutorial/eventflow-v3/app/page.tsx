"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  Users,
  ShieldCheck,
  ChevronDown,
  Star,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Ticket,
  Menu,
  X,
  TrendingUp,
  Zap,
  Lock,
  Globe,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

// Removed heroImages - using premium gradient design instead

const galleryImages = [
  {
    src: "/images/1.jpeg",
    title: "Conférence Technologique 2026",
    description: "Une conférence innovante réunissant les leaders de la technologie pour explorer les tendances futures et les solutions numériques.",
  },
  {
    src: "/images/2.jpeg",
    title: "Gala Corporatif Premium",
    description: "Un événement d'élégance et de prestige rassemblant les partenaires et clients pour célébrer les succès de l'année.",
  },
  {
    src: "/images/3.jpeg",
    title: "Séminaire de Formation",
    description: "Une journée intensive de formation et de développement professionnel avec des experts reconnus du secteur.",
  },
  {
    src: "/images/4.jpeg",
    title: "Lancement de Produit",
    description: "Présentation exclusive du nouveau produit phare avec démonstrations en direct et interactions avec les participants.",
  },
  {
    src: "/images/5.jpeg",
    title: "Networking Business",
    description: "Une opportunité unique de créer des connexions professionnelles et d'explorer de nouvelles collaborations.",
  },
  {
    src: "/images/6.jpeg",
    title: "Festival Culturel",
    description: "Un événement vibrant célébrant la culture, l'art et la créativité avec performances et expositions.",
  },
  {
    src: "/images/7.jpeg",
    title: "Congrès International",
    description: "Un rassemblement mondial d'experts et de professionnels pour discuter des enjeux majeurs et partager les meilleures pratiques.",
  },
  {
    src: "/images/9.jpeg",
    title: "Atelier Créatif",
    description: "Un espace collaboratif pour l'innovation et la création avec des sessions interactives et des projets pratiques.",
  },
];

const premiumGalleryImages = [
  {
    src: "/images-premium/IMAGE%20avec%20premium/355675021_657420839762867_5646331463066696271_n.jpg",
    title: "Soirée Gala Exclusive",
    description: "Une soirée d'exception avec les personnalités influentes et les décideurs du secteur.",
  },
  {
    src: "/images-premium/IMAGE%20avec%20premium/3792d1bc388d7ff0c72977287f8a5f87.jpg",
    title: "Conférence de Prestige",
    description: "Une conférence de haut niveau réunissant les experts internationaux et les innovateurs.",
  },
  {
    src: "/images-premium/IMAGE%20avec%20premium/46cfe3a74f5a2287483d1485f608f489.jpg",
    title: "Événement Corporate",
    description: "Un événement professionnel de classe mondiale avec des présentations et des ateliers premium.",
  },
  {
    src: "/images-premium/IMAGE%20avec%20premium/6bad9aedaf2aa93c05402944ce31f73c.jpg",
    title: "Réception VIP",
    description: "Une réception exclusive pour les clients premium et les partenaires stratégiques.",
  },
  {
    src: "/images-premium/IMAGE%20avec%20premium/81e5bdfce12f1db25afdb11a65755d3f.jpg",
    title: "Séminaire Exécutif",
    description: "Un séminaire destiné aux cadres supérieurs et aux décideurs clés de l'organisation.",
  },
  {
    src: "/images-premium/IMAGE%20avec%20premium/8dc34e65d096658dad2e40171a7fb8e0.jpg",
    title: "Congrès Professionnel",
    description: "Un congrès de grande envergure rassemblant les professionnels du secteur pour des échanges stratégiques.",
  },
  {
    src: "/images-premium/IMAGE%20avec%20premium/9b3b2a71c55cf30cf905067ba25eba4c.jpg",
    title: "Lancement Prestigieux",
    description: "Le lancement d'un projet majeur avec une présentation spectaculaire et des invités de marque.",
  },
  {
    src: "/images-premium/IMAGE%20avec%20premium/a8489f59cea9255272996e047e7c4c0b.jpg",
    title: "Forum Stratégique",
    description: "Un forum réunissant les penseurs stratégiques pour débattre des tendances futures.",
  },
  {
    src: "/images-premium/IMAGE%20avec%20premium/aa2ab3aed0aa1a05aaef9c649c76064b.jpg",
    title: "Événement Corporatif",
    description: "Un événement corporate de grande qualité avec des activités de team building et de networking.",
  },
  {
    src: "/images-premium/IMAGE%20avec%20premium/dd8a19b2354aaed1e657b23d4497cb39.jpg",
    title: "Gala de Charité",
    description: "Un gala caritatif de prestige au profit d'une cause noble avec des personnalités éminentes.",
  },
  {
    src: "/images-premium/IMAGE%20avec%20premium/f50734ff7861a0336dd0a542971d772c.jpg",
    title: "Conférence Internationale",
    description: "Une conférence internationale de premier plan avec des orateurs de renommée mondiale.",
  },
  {
    src: "/images-premium/IMAGE%20avec%20premium/WhatsApp-Image-2022-10-25-at-10.09.31.jpeg",
    title: "Événement Mémorable",
    description: "Un événement inoubliable marquant un moment clé dans l'histoire de l'organisation.",
  },
];

const features = [
  {
    title: "Organisation intuitive",
    desc: "Créez et gérez vos événements avec une interface claire et moderne.",
    icon: Calendar,
  },
  {
    title: "Billetterie intelligente",
    desc: "QR codes, réservations et suivi des participants en temps réel.",
    icon: Ticket,
  },
  {
    title: "Gestion des invités",
    desc: "Invitations automatiques, confirmations et rappels simplifiés.",
    icon: Users,
  },
  {
    title: "Paiements sécurisés",
    desc: "Mobile Money et Orange Money intégrés directement.",
    icon: ShieldCheck,
  },
];

const testimonials = [
  {
    name: "Directeur Général",
    role: "Groupe Fortune 500",
    text: "Une plateforme qui redéfinit l'excellence en gestion d'événements. Sophistiquée, intuitive, transformatrice.",
  },
  {
    name: "Responsable Événementiel",
    role: "Luxury Events International",
    text: "L'élégance du design rencontre la puissance fonctionnelle. Un véritable game-changer pour notre industrie.",
  },
  {
    name: "Directeur Opérationnel",
    role: "Premium Conference Group",
    text: "Chaque détail respire la qualité. Une solution qui élève nos standards à un nouveau niveau.",
  },
];

const faqs = [
  {
    q: "Puis-je commencer gratuitement ?",
    a: "Oui, vous pouvez créer un compte gratuitement et tester la plateforme.",
  },
  {
    q: "La plateforme est-elle responsive ?",
    a: "Oui, TchadEvent fonctionne parfaitement sur mobile, tablette et desktop.",
  },
  {
    q: "Les paiements Mobile Money sont-ils disponibles ?",
    a: "Oui, MTN MoMo et Orange Money sont intégrés.",
  },
];

const stats = [
  { label: "Événements organisés", value: "2,500+" },
  { label: "Utilisateurs actifs", value: "15,000+" },
  { label: "Paiements traités", value: "$5M+" },
  { label: "Satisfaction client", value: "98%" },
];

export default function HomePage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dbStats, setDbStats] = useState({
    events: 0,
    users: 0,
    payments: 0,
    satisfaction: 0,
  });



  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        setDbStats({
          events: data.events,
          users: data.users,
          payments: Math.round(data.payments / 1000000 * 10) / 10, // Convert to millions
          satisfaction: data.satisfaction,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <main
      style={{
        background: "#fff",
        color: "#111",
        overflowX: "hidden",
      }}
    >
      {/* ================= NAVBAR ================= */}

      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(18px)",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            maxWidth: 1250,
            margin: "0 auto",
            padding: "18px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Logo */}

          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
            }}
          >
            <Image
              src="/logo%20de%20l%27application.jpeg"
              alt="TchadEvent"
              width={50}
              height={50}
            />

            <span
              style={{
                fontSize: 24,
                fontWeight: 800,
                background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.03em",
              }}
            >
              TchadEvent
            </span>
          </Link>

          {/* Desktop nav */}

          <div
            className="desktop-nav"
            style={{
              display: "flex",
              gap: 32,
              alignItems: "center",
            }}
          >
            {[
              ["Accueil", "#"],
              ["Fonctionnalités", "#features"],
              ["Avantages", "#why"],
              ["Témoignages", "#testimonials"],
              ["FAQ", "#faq"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                style={{
                  textDecoration: "none",
                  color: "#333",
                  fontWeight: 500,
                  fontSize: 15,
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#10B981")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#333")}
              >
                {label}
              </a>
            ))}
          </div>

          {/* CTA */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <Link
              href="/auth/login"
              style={{
                textDecoration: "none",
                color: "#444",
                fontWeight: 500,
              }}
            >
              Connexion
            </Link>

            <Link
              href="/auth/register"
              style={{
                background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                color: "#fff",
                padding: "14px 22px",
                borderRadius: 14,
                textDecoration: "none",
                fontWeight: 700,
                boxShadow: "0 10px 30px rgba(16, 185, 129, 0.35)",
              }}
            >
              Commencer
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                display: "none",
              }}
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ================= HERO ================= */}

      <section
        style={{
          minHeight: "100vh",
          position: "relative",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
        }}
      >
        {/* Animated gradient orbs */}

        <div
          style={{
            position: "absolute",
            top: -200,
            right: -100,
            width: 600,
            height: 600,
            background: "rgba(16, 185, 129, 0.25)",
            filter: "blur(140px)",
            borderRadius: "50%",
            zIndex: 1,
            animation: "float 8s ease-in-out infinite",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: -150,
            left: -100,
            width: 500,
            height: 500,
            background: "rgba(16,185,129,0.15)",
            filter: "blur(120px)",
            borderRadius: "50%",
            zIndex: 1,
            animation: "float 10s ease-in-out infinite reverse",
          }}
        />

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(30px); }
          }
          @keyframes slideInUp {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        {/* Hero content */}

        <div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: 1250,
            margin: "0 auto",
            width: "100%",
            padding: "0 24px",
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: 40,
            alignItems: "center",
          }}
        >
          {/* Left */}

          <motion.div
            initial={{ opacity: 0, y: 70 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 16px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#fff",
                marginBottom: 28,
                backdropFilter: "blur(10px)",
              }}
            >
              <Sparkles size={16} />
              Nouvelle expérience événementielle
            </div>

            <h1
              style={{
                fontSize: "clamp(54px,7vw,92px)",
                lineHeight: 0.95,
                color: "#fff",
                fontWeight: 900,
                letterSpacing: "-0.05em",
                marginBottom: 28,
              }}
            >
              Organisez des événements mémorables.
            </h1>

            <p
              style={{
                color: "rgba(255,255,255,0.82)",
                fontSize: 18,
                lineHeight: 1.8,
                maxWidth: 620,
                marginBottom: 40,
              }}
            >
              Une plateforme moderne et élégante pour gérer vos événements,
              inscriptions, paiements et invités dans une seule interface.
            </p>

            <div
              style={{
                display: "flex",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <Link
                href="/auth/register"
                style={{
                  background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                  color: "#fff",
                  padding: "18px 28px",
                  borderRadius: 18,
                  textDecoration: "none",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  boxShadow: "0 15px 40px rgba(16, 185, 129, 0.4)",
                }}
              >
                Commencer maintenant
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/dashboard"
                style={{
                  padding: "18px 28px",
                  borderRadius: 18,
                  textDecoration: "none",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.2)",
                  background: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(12px)",
                  fontWeight: 600,
                }}
              >
                Voir la démo
              </Link>
            </div>
          </motion.div>

          {/* Right - Premium visual card */}

          <motion.div
            initial={{ opacity: 0, y: 70 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: 420,
                background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 32,
                padding: 32,
                backdropFilter: "blur(20px)",
                boxShadow: "0 30px 80px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.1)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Gradient overlay */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 200,
                  height: 200,
                  background: "radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%)",
                  filter: "blur(40px)",
                  pointerEvents: "none",
                }}
              />

              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <div
                  style={{
                    marginBottom: 28,
                  }}
                >
                  <span
                    style={{
                      color: "#10B981",
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    Tableau de bord
                  </span>

                  <h3
                    style={{
                      color: "#fff",
                      fontSize: 28,
                      marginTop: 12,
                      fontWeight: 800,
                    }}
                  >
                    Événement annuel 2026
                  </h3>
                </div>

                {[
                  { label: "Confirmations", value: 87 },
                  { label: "Paiements", value: 92 },
                  { label: "Présences", value: 78 },
                  { label: "Satisfaction", value: 95 },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      marginBottom: 20,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 10,
                        color: "#fff",
                        fontSize: 13,
                        fontWeight: 500,
                      }}
                    >
                      <span>{item.label}</span>
                      <span style={{ color: "#10B981", fontWeight: 700 }}>
                        {item.value}%
                      </span>
                    </div>

                    <div
                      style={{
                        width: "100%",
                        height: 8,
                        background: "rgba(255,255,255,0.1)",
                        borderRadius: 999,
                        overflow: "hidden",
                      }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value}%` }}
                        transition={{
                          delay: 0.6 + i * 0.15,
                          duration: 1.2,
                          ease: "easeOut",
                        }}
                        style={{
                          height: "100%",
                          background: `linear-gradient(90deg, #10B981 0%, #059669 100%)`,
                          borderRadius: 999,
                          boxShadow: "0 0 20px rgba(16, 185, 129, 0.5)",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= GALLERY SECTION ================= */}

      <section
        style={{
          padding: "100px 24px",
          background: "linear-gradient(180deg, #fff 0%, #f8f9fa 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative elements */}
        <div
          style={{
            position: "absolute",
            top: -100,
            left: "5%",
            width: 300,
            height: 300,
            background: "radial-gradient(circle, rgba(247,147,30,0.08) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: 1250,
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            style={{
              textAlign: "center",
              marginBottom: 70,
            }}
          >
            <span
              style={{
                color: "#10B981",
                fontWeight: 700,
                letterSpacing: "0.08em",
              }}
            >
              GALERIE
            </span>

            <h2
              style={{
                fontSize: "clamp(38px,5vw,64px)",
                marginTop: 18,
                lineHeight: 1.1,
              }}
            >
              Découvrez nos événements
            </h2>

            <p
              style={{
                color: "#666",
                fontSize: 18,
                marginTop: 16,
                maxWidth: 600,
                margin: "16px auto 0",
              }}
            >
              Des moments inoubliables capturés à travers nos événements premium
            </p>
          </motion.div>

          {/* Gallery Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
              gridAutoRows: "320px",
            }}
          >
            {galleryImages.map((item, index) => {
              // Créer un effet masonry avec des hauteurs variables
              const heights = [320, 380, 320, 380, 320, 320, 380, 320];
              const height = heights[index % heights.length];

              return (
                <motion.div
                  key={item.src}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.6,
                  }}
                  viewport={{ once: true }}
                  whileHover={{
                    y: -12,
                    boxShadow: "0 25px 70px rgba(16, 185, 129, 0.2)",
                  }}
                  style={{
                    borderRadius: 24,
                    overflow: "hidden",
                    position: "relative",
                    cursor: "pointer",
                    height: height,
                    gridColumn: index % 3 === 0 ? "span 1" : "span 1",
                  }}
                >
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    style={{
                      objectFit: "cover",
                      transition: "transform 0.4s ease",
                    }}
                    className="gallery-image"
                  />

                  {/* Overlay */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(135deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)",
                      zIndex: 2,
                    }}
                  />

                  {/* Content */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: "24px",
                      color: "#fff",
                      background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)",
                      zIndex: 3,
                    }}
                  >
                    <h3
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        marginBottom: 8,
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      style={{
                        fontSize: 13,
                        lineHeight: 1.5,
                        opacity: 0.9,
                      }}
                    >
                      {item.description}
                    </p>
                  </div>

                  {/* Badge */}
                  <div
                    style={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                      color: "#fff",
                      padding: "8px 16px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 700,
                      zIndex: 2,
                      boxShadow: "0 8px 20px rgba(16, 185, 129, 0.3)",
                    }}
                  >
                    Événement {index + 1}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            viewport={{ once: true }}
            style={{
              textAlign: "center",
              marginTop: 60,
            }}
          >
            <Link
              href="/events"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                color: "#fff",
                padding: "16px 32px",
                borderRadius: 18,
                textDecoration: "none",
                fontWeight: 700,
                fontSize: 16,
                boxShadow: "0 15px 40px rgba(16, 185, 129, 0.3)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 20px 50px rgba(16, 185, 129, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 15px 40px rgba(16, 185, 129, 0.3)";
              }}
            >
              Voir tous les événements
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ================= PREMIUM GALLERY SECTION ================= */}

      <section
        style={{
          padding: "100px 24px",
          background: "linear-gradient(180deg, #f8f9fa 0%, #fff 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative elements */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: "5%",
            width: 300,
            height: 300,
            background: "radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: 1250,
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            style={{
              textAlign: "center",
              marginBottom: 70,
            }}
          >
            <span
              style={{
                color: "#10B981",
                fontWeight: 700,
                letterSpacing: "0.08em",
              }}
            >
              ÉVÉNEMENTS PREMIUM
            </span>

            <h2
              style={{
                fontSize: "clamp(38px,5vw,64px)",
                marginTop: 18,
                lineHeight: 1.1,
              }}
            >
              Nos événements d'exception
            </h2>

            <p
              style={{
                color: "#666",
                fontSize: 18,
                marginTop: 16,
                maxWidth: 600,
                margin: "16px auto 0",
              }}
            >
              Découvrez nos événements les plus prestigieux et exclusifs
            </p>
          </motion.div>

          {/* Premium Gallery Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
              gridAutoRows: "320px",
            }}
          >
            {premiumGalleryImages.map((item, index) => {
              const heights = [320, 380, 320, 380, 320, 320, 380, 320, 380, 320, 320, 380];
              const height = heights[index % heights.length];

              return (
                <motion.div
                  key={item.src}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.6,
                  }}
                  viewport={{ once: true }}
                  whileHover={{
                    y: -12,
                    boxShadow: "0 25px 70px rgba(16, 185, 129, 0.2)",
                  }}
                  style={{
                    borderRadius: 24,
                    overflow: "hidden",
                    position: "relative",
                    cursor: "pointer",
                    height: height,
                  }}
                >
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    style={{
                      objectFit: "cover",
                      transition: "transform 0.4s ease",
                    }}
                    className="gallery-image"
                  />

                  {/* Overlay */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(135deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)",
                      zIndex: 2,
                    }}
                  />

                  {/* Content */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: "24px",
                      color: "#fff",
                      background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)",
                      zIndex: 3,
                    }}
                  >
                    <h3
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        marginBottom: 8,
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      style={{
                        fontSize: 13,
                        lineHeight: 1.5,
                        opacity: 0.9,
                      }}
                    >
                      {item.description}
                    </p>
                  </div>

                  {/* Badge Premium */}
                  <div
                    style={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                      color: "#fff",
                      padding: "8px 16px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 700,
                      zIndex: 2,
                      boxShadow: "0 8px 20px rgba(16, 185, 129, 0.3)",
                    }}
                  >
                    ⭐ Premium
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}

      <section
        style={{
          padding: "80px 24px",
          background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -100,
            left: -100,
            width: 400,
            height: 400,
            background: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
            filter: "blur(80px)",
          }}
        />

        <div
          style={{
            maxWidth: 1250,
            margin: "0 auto",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
              gap: 40,
            }}
          >
            {[
              { label: "Événements organisés", value: dbStats.events },
              { label: "Utilisateurs actifs", value: dbStats.users },
              { label: "Paiements traités", value: `$${dbStats.payments}M+` },
              { label: "Satisfaction client", value: `${dbStats.satisfaction}%` },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.6,
                }}
                viewport={{ once: true }}
                style={{
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "clamp(32px,5vw,48px)",
                    fontWeight: 900,
                    color: "#fff",
                    marginBottom: 12,
                  }}
                >
                  {typeof stat.value === 'number' ? `${stat.value}+` : stat.value}
                </div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.85)",
                    fontSize: 16,
                  }}
                >
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}

      <section
        id="features"
        style={{
          padding: "130px 24px",
          background: "linear-gradient(180deg, #fff 0%, #f8f9fa 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative elements */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "10%",
            width: 300,
            height: 300,
            background: "radial-gradient(circle, rgba(247,147,30,0.08) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: 1250,
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            style={{
              textAlign: "center",
              marginBottom: 80,
            }}
          >
            <span
              style={{
                color: "#10B981",
                fontWeight: 700,
                letterSpacing: "0.08em",
              }}
            >
              FONCTIONNALITÉS
            </span>

            <h2
              style={{
                fontSize: "clamp(38px,5vw,64px)",
                marginTop: 18,
                lineHeight: 1.1,
              }}
            >
              Une expérience moderne et intuitive
            </h2>
          </motion.div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
              gap: 24,
            }}
          >
            {features.map(({ title, desc, icon: Icon }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.15,
                  duration: 0.6,
                }}
                viewport={{ once: true }}
                whileHover={{
                  y: -12,
                  boxShadow: "0 20px 60px rgba(16, 185, 129, 0.15)",
                }}
                style={{
                  background: "#fff",
                  borderRadius: 28,
                  padding: 36,
                  border: "1px solid #f1f1f1",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Hover gradient */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 150,
                    height: 150,
                    background: "radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)",
                    borderRadius: "50%",
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                    pointerEvents: "none",
                  }}
                  className="hover-gradient"
                />

                <div
                  style={{
                    width: 68,
                    height: 68,
                    borderRadius: 22,
                    background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 26,
                    boxShadow: "0 10px 30px rgba(16, 185, 129, 0.1)",
                  }}
                >
                  <Icon size={28} color="#10B981" />
                </div>

                <h3
                  style={{
                    fontSize: 24,
                    marginBottom: 14,
                  }}
                >
                  {title}
                </h3>

                <p
                  style={{
                    color: "#666",
                    lineHeight: 1.8,
                  }}
                >
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= WHY EVENTFLOW ================= */}

      <section
        id="why"
        style={{
          padding: "130px 24px",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated orbs */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: "10%",
            width: 400,
            height: 400,
            background: "radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(80px)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: 1250,
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            style={{
              textAlign: "center",
              marginBottom: 80,
            }}
          >
            <span
              style={{
                color: "#10B981",
                fontWeight: 700,
                letterSpacing: "0.08em",
              }}
            >
              AVANTAGES
            </span>

            <h2
              style={{
                fontSize: "clamp(38px,5vw,64px)",
                marginTop: 18,
                lineHeight: 1.1,
                color: "#fff",
              }}
            >
              Pourquoi choisir TchadEvent?
            </h2>
          </motion.div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
              gap: 28,
            }}
          >
            {[
              {
                icon: Zap,
                title: "Ultra rapide",
                desc: "Interface optimisée pour une expérience fluide et réactive.",
              },
              {
                icon: Lock,
                title: "Sécurisé",
                desc: "Vos données sont protégées avec les standards de sécurité les plus élevés.",
              },
              {
                icon: Globe,
                title: "Accessible partout",
                desc: "Accédez à votre tableau de bord depuis n'importe quel appareil.",
              },
              {
                icon: TrendingUp,
                title: "Analytiques avancées",
                desc: "Suivez vos événements avec des rapports détaillés et des insights.",
              },
            ].map(({ icon: Icon, title, desc }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.15,
                  duration: 0.6,
                }}
                viewport={{ once: true }}
                style={{
                  background: "#fff",
                  borderRadius: 24,
                  padding: 32,
                  border: "1px solid #f1f1f1",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                    boxShadow: "0 8px 20px rgba(16, 185, 129, 0.12)",
                  }}
                >
                  <Icon size={28} color="#10B981" />
                </div>

                <h3
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    marginBottom: 12,
                  }}
                >
                  {title}
                </h3>

                <p
                  style={{
                    color: "#666",
                    lineHeight: 1.8,
                  }}
                >
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}

      <section
        id="testimonials"
        style={{
          padding: "120px 24px",
          background: "linear-gradient(180deg, #fff 0%, #f8f9fa 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative element */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: "5%",
            width: 350,
            height: 350,
            background: "radial-gradient(circle, rgba(247,147,30,0.08) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: 70,
            }}
          >
            <h2
              style={{
                fontSize: "clamp(38px,5vw,62px)",
                marginBottom: 16,
              }}
            >
              Ce que disent nos utilisateurs
            </h2>

            <p
              style={{
                color: "#666",
                fontSize: 18,
              }}
            >
              Une expérience appréciée par des centaines d’organisateurs.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
              gap: 26,
            }}
          >
            {testimonials.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.2,
                  duration: 0.6,
                }}
                viewport={{ once: true }}
                style={{
                  background: "#fff",
                  padding: 36,
                  borderRadius: 28,
                  boxShadow: "0 10px 40px rgba(0,0,0,0.05)",
                  border: "1px solid rgba(16, 185, 129, 0.1)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Accent line */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: 4,
                    height: "100%",
                    background: "linear-gradient(180deg, #10B981 0%, #059669 100%)",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    gap: 4,
                    marginBottom: 20,
                  }}
                >
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill="#10B981"
                      color="#10B981"
                    />
                  ))}
                </div>

                <p
                  style={{
                    color: "#555",
                    lineHeight: 1.9,
                    marginBottom: 28,
                    fontSize: 16,
                  }}
                >
                  “{item.text}”
                </p>

                <div>
                  <h4
                    style={{
                      marginBottom: 6,
                    }}
                  >
                    {item.name}
                  </h4>

                  <span
                    style={{
                      color: "#888",
                    }}
                  >
                    {item.role}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}

      <section
        id="faq"
        style={{
          padding: "120px 24px",
        }}
      >
        <div
          style={{
            maxWidth: 850,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: 70,
            }}
          >
            <h2
              style={{
                fontSize: "clamp(38px,5vw,62px)",
                marginBottom: 18,
              }}
            >
              Questions fréquentes
            </h2>

            <p
              style={{
                color: "#666",
                fontSize: 18,
              }}
            >
              Tout ce que vous devez savoir sur TchadEvent.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.q}
                layout
                style={{
                  border: "1px solid #eee",
                  borderRadius: 24,
                  overflow: "hidden",
                  background: "#fff",
                }}
              >
                <button
                  onClick={() =>
                    setActiveFaq(activeFaq === index ? null : index)
                  }
                  style={{
                    width: "100%",
                    background: "#fff",
                    border: "none",
                    padding: "24px 28px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      fontWeight: 600,
                      fontSize: 17,
                    }}
                  >
                    {faq.q}
                  </span>

                  <motion.div
                    animate={{
                      rotate: activeFaq === index ? 180 : 0,
                    }}
                  >
                    <ChevronDown color="#10B981" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {activeFaq === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          padding: "0 28px 28px",
                          color: "#666",
                          lineHeight: 1.8,
                        }}
                      >
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}

      <section
        style={{
          padding: "140px 24px",
          background: "linear-gradient(135deg, #10B981 0%, #059669 50%, #10B981 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated background elements */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 500,
            height: 500,
            background: "rgba(255,255,255,0.15)",
            borderRadius: "50%",
            filter: "blur(50px)",
            animation: "float 8s ease-in-out infinite",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: -100,
            left: -100,
            width: 400,
            height: 400,
            background: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
            filter: "blur(60px)",
            animation: "float 10s ease-in-out infinite reverse",
          }}
        />

        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            textAlign: "center",
            position: "relative",
            zIndex: 2,
          }}
        >
          <h2
            style={{
              color: "#fff",
              fontSize: "clamp(42px,6vw,72px)",
              lineHeight: 1.1,
              marginBottom: 24,
            }}
          >
            Lancez votre prochain événement aujourd’hui.
          </h2>

          <p
            style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: 18,
              lineHeight: 1.8,
              maxWidth: 650,
              margin: "0 auto 42px",
            }}
          >
            Simplifiez toute votre organisation avec une plateforme élégante,
            moderne et rapide.
          </p>

          <Link
            href="/auth/register"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              background: "#fff",
              color: "#10B981",
              padding: "20px 36px",
              borderRadius: 18,
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 16,
              boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 25px 60px rgba(0,0,0,0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 20px 50px rgba(0,0,0,0.2)";
            }}
          >
            Créer un compte
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ================= FOOTER ================= */}

      <footer
        style={{
          background: "linear-gradient(180deg, #111 0%, #0a0a0a 100%)",
          color: "#fff",
          padding: "100px 24px 40px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative element */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: "10%",
            width: 300,
            height: 300,
            background: "radial-gradient(circle, rgba(247,147,30,0.08) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: 1250,
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* top */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1.3fr",
              gap: 40,
              marginBottom: 70,
            }}
          >
            {/* Brand */}

            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 22,
                }}
              >
                <Image
                  src="/logo%20de%20l%27application.jpeg"
                  alt="logo"
                  width={48}
                  height={48}
                />

                <span
                  style={{
                    fontSize: 24,
                    fontWeight: 800,
                    color: "#10B981",
                  }}
                >
                  TchadEvent
                </span>
              </div>

              <p
                style={{
                  color: "rgba(255,255,255,0.65)",
                  lineHeight: 1.9,
                  maxWidth: 360,
                }}
              >
                Une plateforme moderne de gestion d’événements conçue pour
                simplifier l’organisation, les inscriptions et les paiements.
              </p>

            </div>

            {/* Links */}

            <div>
              <h4
                style={{
                  marginBottom: 22,
                  color: "#f7931e",
                }}
              >
                Produit
              </h4>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                {[
                  "Fonctionnalités",
                  "Tableau de bord",
                  "Billetterie",
                  "Mobile Money",
                ].map((item) => (
                  <a
                    key={item}
                    href="#"
                    style={{
                      color: "rgba(255,255,255,0.7)",
                      textDecoration: "none",
                    }}
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>

            {/* Company */}

            <div>
              <h4
                style={{
                  marginBottom: 22,
                  color: "#f7931e",
                }}
              >
                Entreprise
              </h4>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                {[
                  "À propos",
                  "Contact",
                  "Carrières",
                  "Confidentialité",
                ].map((item) => (
                  <a
                    key={item}
                    href="#"
                    style={{
                      color: "rgba(255,255,255,0.7)",
                      textDecoration: "none",
                    }}
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>

            {/* Contact */}

            <div>
              <h4
                style={{
                  marginBottom: 22,
                  color: "#f7931e",
                }}
              >
                Contact
              </h4>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 18,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    color: "rgba(255,255,255,0.75)",
                  }}
                >
                  <Mail size={18} />
                  contact@tchadevent.com
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    color: "rgba(255,255,255,0.75)",
                  }}
                >
                  <Phone size={18} />
                  +237 6 50 37 73 38
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    color: "rgba(255,255,255,0.75)",
                  }}
                >
                  <MapPin size={18} />
                  Douala, Cameroun
                </div>
              </div>
            </div>
          </div>

          {/* bottom */}

          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: 28,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 20,
            }}
          >
            <span
              style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: 14,
              }}
            >
              © 2026 TchadEvent — Tous droits réservés.
            </span>

            <div
              style={{
                display: "flex",
                gap: 24,
              }}
            >
              {["Conditions", "Confidentialité", "Cookies"].map((item) => (
                <a
                  key={item}
                  href="#"
                  style={{
                    color: "rgba(255,255,255,0.55)",
                    textDecoration: "none",
                    fontSize: 14,
                  }}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
