"use client";

import Header from "@/components/layout/Header";
import { useStore, Participant } from "@/lib/store/useStore";
import {
  Search,
  QrCode,
  Download,
  CheckCircle2,
  Clock3,
  XCircle,
  Edit2,
  Trash2,
  Users,
  UserCheck,
  UserX,
  TimerReset,
  MoreHorizontal,
} from "lucide-react";
import { useState } from "react";
import ParticipantModal from "@/components/modals/ParticipantModal";
import QRScannerModal from "@/components/modals/QRScannerModal";
import ConfirmDialog from "@/components/modals/ConfirmDialog";
import Dropdown from "@/components/ui/Dropdown";

const avatarColors = [
  "#FF8A3D",
  "#FDBA74",
  "#FB923C",
  "#FED7AA",
  "#EA580C",
  "#F97316",
];

export default function ParticipantsPage() {
  const { participants, deleteParticipant, showToast, searchQuery } =
    useStore();

  const [search, setSearch] = useState("");
  const [editP, setEditP] = useState<Participant | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [selectedQRParticipant, setSelectedQRParticipant] = useState<Participant | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const q = search || searchQuery;

  const filtered = participants.filter(
    (p) =>
      !q ||
      p.name.toLowerCase().includes(q.toLowerCase()) ||
      p.event.toLowerCase().includes(q.toLowerCase()) ||
      p.email.toLowerCase().includes(q.toLowerCase())
  );

  const confirmed = participants.filter(
    (p) => p.statut === "Confirmé"
  ).length;

  const pending = participants.filter(
    (p) => p.statut === "En attente"
  ).length;

  const cancelled = participants.filter(
    (p) => p.statut === "Annulé"
  ).length;

  const handleExport = () => {
    const csv = [
      "Nom,Email,Téléphone,Événement,Type,Statut,Paiement,Montant",
      ...participants.map(
        (p) =>
          `${p.name},${p.email},${p.phone},${p.event},${p.type},${p.statut},${p.paiement},${p.montant}`
      ),
    ].join("\n");

    const a = document.createElement("a");
    a.href =
      "data:text/csv;charset=utf-8," + encodeURIComponent(csv);

    a.download = "participants.csv";
    a.click();

    showToast("Export CSV téléchargé", "success");
  };

  const statCards = [
    {
      label: "Participants",
      value: participants.length,
      icon: Users,
      color: "#F97316",
      bg: "#FFF7ED",
    },
    {
      label: "Confirmés",
      value: confirmed,
      icon: UserCheck,
      color: "#16A34A",
      bg: "#F0FDF4",
    },
    {
      label: "En attente",
      value: pending,
      icon: TimerReset,
      color: "#EA580C",
      bg: "#FFF7ED",
    },
    {
      label: "Annulés",
      value: cancelled,
      icon: UserX,
      color: "#DC2626",
      bg: "#FEF2F2",
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        background: "#FFFDFB",
        minHeight: "100vh",
      }}
    >
      <Header
        title="Participants"
        subtitle={`${participants.length} participants enregistrés`}
        action={{
          label: "Ajouter un participant",
          onClick: () => {
            setEditP(null);
            setModalOpen(true);
          },
        }}
      />

      <div
        style={{
          padding: "28px",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 18,
          }}
        >
          {statCards.map(
            ({ label, value, icon: Icon, color, bg }) => (
              <div
                key={label}
                style={{
                  background: "#fff",
                  border: "1px solid #FED7AA",
                  borderRadius: 22,
                  padding: 22,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  boxShadow: "0 4px 14px rgba(15,23,42,0.04)",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "#9A3412",
                      marginBottom: 10,
                      fontWeight: 500,
                    }}
                  >
                    {label}
                  </div>

                  <div
                    style={{
                      fontSize: 30,
                      fontWeight: 800,
                      color: "#18181B",
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {value}
                  </div>
                </div>

                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 16,
                    background: bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={22} color={color} />
                </div>
              </div>
            )
          )}
        </div>

        {/* Top actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "#fff",
              border: "1px solid #FED7AA",
              borderRadius: 16,
              padding: "12px 16px",
              width: 320,
            }}
          >
            <Search size={18} color="#F97316" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un participant..."
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                width: "100%",
                fontSize: 14,
                color: "#18181B",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={() => {
                if (participants.length > 0) {
                  setSelectedQRParticipant(participants[0]);
                  setQrOpen(true);
                } else {
                  showToast("Aucun participant disponible", "info");
                }
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#fff",
                border: "1px solid #FED7AA",
                borderRadius: 14,
                padding: "12px 18px",
                fontSize: 14,
                fontWeight: 600,
                color: "#9A3412",
                cursor: "pointer",
              }}
            >
              <QrCode size={16} />
              Scanner QR
            </button>

            <button
              onClick={handleExport}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#F97316",
                border: "none",
                borderRadius: 14,
                padding: "12px 18px",
                fontSize: 14,
                fontWeight: 700,
                color: "#fff",
                cursor: "pointer",
                boxShadow: "0 10px 24px rgba(249,115,22,0.22)",
              }}
            >
              <Download size={16} />
              Exporter CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #FED7AA",
            borderRadius: 24,
            overflow: "hidden",
            boxShadow: "0 6px 24px rgba(15,23,42,0.05)",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "2.2fr 1.2fr 1fr 1fr 1fr 1fr auto",
              gap: 16,
              padding: "18px 24px",
              borderBottom: "1px solid #FFEDD5",
              background: "#FFF7ED",
            }}
          >
            {[
              "Participant",
              "Événement",
              "Type",
              "Statut",
              "Paiement",
              "Montant",
              "",
            ].map((h) => (
              <span
                key={h}
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#9A3412",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                {h}
              </span>
            ))}
          </div>

          {/* Empty */}
          {filtered.length === 0 && (
            <div
              style={{
                padding: "60px 20px",
                textAlign: "center",
                color: "#A1A1AA",
                fontSize: 14,
              }}
            >
              Aucun participant trouvé.
            </div>
          )}

          {/* Rows */}
          {filtered.map(
            (
              {
                id,
                name,
                email,
                event,
                type,
                statut,
                paiement,
                montant,
              },
              i
            ) => (
              <div
                key={id}
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "2.2fr 1.2fr 1fr 1fr 1fr 1fr auto",
                  gap: 16,
                  padding: "18px 24px",
                  alignItems: "center",
                  borderBottom:
                    i < filtered.length - 1
                      ? "1px solid #FFF1E6"
                      : "none",
                }}
              >
                {/* User */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: "50%",
                      background:
                        avatarColors[
                          i % avatarColors.length
                        ],
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 13,
                      flexShrink: 0,
                    }}
                  >
                    {name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#18181B",
                        marginBottom: 2,
                      }}
                    >
                      {name}
                    </div>

                    <div
                      style={{
                        fontSize: 12,
                        color: "#A1A1AA",
                      }}
                    >
                      {email}
                    </div>
                  </div>
                </div>

                {/* Event */}
                <span
                  style={{
                    fontSize: 13,
                    color: "#52525B",
                    fontWeight: 500,
                  }}
                >
                  {event}
                </span>

                {/* Type */}
                <span
                  style={{
                    width: "fit-content",
                    padding: "6px 12px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 700,
                    background:
                      type === "VIP"
                        ? "#FFF7ED"
                        : "#F8FAFC",

                    color:
                      type === "VIP"
                        ? "#EA580C"
                        : "#52525B",
                  }}
                >
                  {type}
                </span>

                {/* Status */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {statut === "Confirmé" ? (
                    <CheckCircle2
                      size={15}
                      color="#16A34A"
                    />
                  ) : statut === "En attente" ? (
                    <Clock3 size={15} color="#F97316" />
                  ) : (
                    <XCircle size={15} color="#DC2626" />
                  )}

                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color:
                        statut === "Confirmé"
                          ? "#16A34A"
                          : statut === "En attente"
                          ? "#F97316"
                          : "#DC2626",
                    }}
                  >
                    {statut}
                  </span>
                </div>

                {/* Paiement */}
                <span
                  style={{
                    fontSize: 13,
                    color: "#71717A",
                  }}
                >
                  {paiement}
                </span>

                {/* Montant */}
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: "#18181B",
                  }}
                >
                  {(montant / 1000).toFixed(0)}k FCFA
                </span>

                {/* Actions */}
                <Dropdown
                  trigger={
                    <button
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 12,
                        border: "1px solid #FED7AA",
                        background: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <MoreHorizontal
                        size={16}
                        color="#9A3412"
                      />
                    </button>
                  }
                  items={[
                    {
                      label: "Modifier",
                      icon: <Edit2 size={13} />,
                      onClick: () => {
                        setEditP(
                          participants.find(
                            (p) => p.id === id
                          ) || null
                        );

                        setModalOpen(true);
                      },
                    },
                    {
                      label: "Supprimer",
                      icon: <Trash2 size={13} />,
                      onClick: () =>
                        setConfirmDelete(id),
                      danger: true,
                    },
                  ]}
                />
              </div>
            )
          )}
        </div>
      </div>

      <ParticipantModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        participant={editP}
      />

      <ConfirmDialog
        open={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() =>
          confirmDelete &&
          deleteParticipant(confirmDelete)
        }
        title="Supprimer ce participant ?"
        description="Cette action est définitive."
      />

      <QRScannerModal
        open={qrOpen}
        onClose={() => setQrOpen(false)}
        participantId={selectedQRParticipant?.id}
        participantName={selectedQRParticipant?.name}
      />
    </div>
  );
}
