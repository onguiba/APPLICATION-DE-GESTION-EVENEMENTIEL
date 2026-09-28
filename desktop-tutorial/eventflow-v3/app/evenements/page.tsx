"use client";

import Header from "@/components/layout/Header";
import { useStore, AppEvent } from "@/lib/store/useStore";
import {
  MapPin,
  Users,
  Calendar,
  MoreHorizontal,
  Grid3X3,
  List,
  Eye,
  Edit2,
  Trash2,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import EventModal from "@/components/modals/EventModal";
import ConfirmDialog from "@/components/modals/ConfirmDialog";
import Dropdown from "@/components/ui/Dropdown";

const statusConfig: Record<
  string,
  { text: string; bg: string; border: string }
> = {
  "En cours": {
    text: "#ea580c",
    bg: "#fff7ed",
    border: "#fdba74",
  },
  Planifié: {
    text: "#f97316",
    bg: "#fff7ed",
    border: "#fed7aa",
  },
  Brouillon: {
    text: "#737373",
    bg: "#fafafa",
    border: "#e5e5e5",
  },
  Terminé: {
    text: "#16a34a",
    bg: "#f0fdf4",
    border: "#bbf7d0",
  },
};

const filters = ["Tous", "En cours", "Planifié", "Brouillon", "Terminé"];

export default function EvenementsPage() {
  const router = useRouter();
  const { events, deleteEvent, searchQuery } = useStore();

  const [activeFilter, setActiveFilter] = useState("Tous");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [eventModal, setEventModal] = useState(false);
  const [editEvent, setEditEvent] = useState<AppEvent | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const filtered = events
    .filter(
      (e) => activeFilter === "Tous" || e.status === activeFilter
    )
    .filter(
      (e) =>
        !searchQuery ||
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        overflow: "auto",
        background: "#f8fafc",
      }}
    >
      <Header
        title="Événements"
        subtitle={`${events.length} événements disponibles`}
        action={{
          label: "Créer un événement",
          onClick: () => {
            setEditEvent(null);
            setEventModal(true);
          },
        }}
      />

      <div style={{ padding: "32px" }}>
        {/* TOP BAR */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 28,
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          {/* FILTERS */}
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            {filters.map((filter) => {
              const active = activeFilter === filter;

              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  style={{
                    border: active
                      ? "1px solid #fb923c"
                      : "1px solid #e5e7eb",
                    background: active ? "#fff7ed" : "#fff",
                    color: active ? "#ea580c" : "#52525b",
                    borderRadius: 999,
                    padding: "10px 16px",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "0.2s",
                  }}
                >
                  {filter}
                </button>
              );
            })}
          </div>

          {/* VIEW TOGGLE */}
          <div
            style={{
              display: "flex",
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: 4,
            }}
          >
            {(["grid", "list"] as const).map((v) => {
              const active = view === v;

              return (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  style={{
                    width: 42,
                    height: 42,
                    border: "none",
                    borderRadius: 10,
                    background: active ? "#f97316" : "transparent",
                    color: active ? "#fff" : "#737373",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "0.2s",
                  }}
                >
                  {v === "grid" ? (
                    <Grid3X3 size={18} />
                  ) : (
                    <List size={18} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* EMPTY STATE */}
        {filtered.length === 0 && (
          <div
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 24,
              padding: "80px 32px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: 24,
                background: "#fff7ed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
              }}
            >
              <Calendar size={34} color="#f97316" />
            </div>

            <h2
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: "#18181b",
                marginBottom: 10,
              }}
            >
              Aucun événement trouvé
            </h2>

            <p
              style={{
                color: "#71717a",
                fontSize: 14,
                marginBottom: 28,
              }}
            >
              Commencez par créer votre premier événement.
            </p>

            <button
              onClick={() => {
                setEditEvent(null);
                setEventModal(true);
              }}
              style={{
                border: "none",
                background: "#f97316",
                color: "#fff",
                padding: "14px 20px",
                borderRadius: 14,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Plus size={16} />
              Créer un événement
            </button>
          </div>
        )}

        {/* GRID VIEW */}
        {view === "grid" && filtered.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
              gap: 24,
            }}
          >
            {filtered.map((ev) => {
              const fillPct = Math.round(
                (ev.participants / ev.capacity) * 100
              );

              const sc =
                statusConfig[ev.status] || statusConfig["Brouillon"];

              return (
                <div
                  key={ev.id}
                  onClick={() => router.push(`/evenements/${ev.id}`)}
                  style={{
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: 24,
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "0.2s",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                  }}
                >
                  {/* IMAGE */}
                  <div
                    style={{
                      height: 180,
                      background:
                        "linear-gradient(135deg,#fff7ed 0%,#ffedd5 100%)",
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ fontSize: 70 }}>{ev.img}</span>

                    <div
                      style={{
                        position: "absolute",
                        top: 16,
                        left: 16,
                      }}
                    >
                      <span
                        style={{
                          padding: "7px 12px",
                          borderRadius: 999,
                          background: "#fff",
                          border: "1px solid #fed7aa",
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#ea580c",
                        }}
                      >
                        {ev.type}
                      </span>
                    </div>

                    <div
                      style={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                      }}
                    >
                      <span
                        style={{
                          padding: "7px 12px",
                          borderRadius: 999,
                          background: sc.bg,
                          border: `1px solid ${sc.border}`,
                          fontSize: 12,
                          fontWeight: 600,
                          color: sc.text,
                        }}
                      >
                        {ev.status}
                      </span>
                    </div>

                    <div
                      style={{
                        position: "absolute",
                        bottom: 16,
                        right: 16,
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Dropdown
                        trigger={
                          <div
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: 12,
                              background: "#fff",
                              border: "1px solid #e5e7eb",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <MoreHorizontal
                              size={16}
                              color="#52525b"
                            />
                          </div>
                        }
                        items={[
                          {
                            label: "Voir détails",
                            icon: <Eye size={14} />,
                            onClick: () =>
                              router.push(`/evenements/${ev.id}`),
                          },
                          {
                            label: "Modifier",
                            icon: <Edit2 size={14} />,
                            onClick: () => {
                              setEditEvent(ev);
                              setEventModal(true);
                            },
                          },
                          {
                            label: "Supprimer",
                            icon: <Trash2 size={14} />,
                            onClick: () =>
                              setConfirmDelete(ev.id),
                            danger: true,
                          },
                        ]}
                      />
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div style={{ padding: 22 }}>
                    <h3
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: "#18181b",
                        marginBottom: 14,
                        lineHeight: 1.3,
                      }}
                    >
                      {ev.name}
                    </h3>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                        marginBottom: 18,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          color: "#71717a",
                          fontSize: 13,
                        }}
                      >
                        <Calendar size={14} />
                        {ev.date}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          color: "#71717a",
                          fontSize: 13,
                        }}
                      >
                        <MapPin size={14} />
                        {ev.location}
                      </div>
                    </div>

                    {/* PROGRESS */}
                    <div style={{ marginBottom: 18 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 8,
                          fontSize: 12,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            color: "#71717a",
                          }}
                        >
                          <Users size={13} />
                          {ev.participants}/{ev.capacity}
                        </div>

                        <span
                          style={{
                            color: "#f97316",
                            fontWeight: 600,
                          }}
                        >
                          {fillPct}%
                        </span>
                      </div>

                      <div
                        style={{
                          height: 8,
                          borderRadius: 999,
                          background: "#f4f4f5",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${fillPct}%`,
                            height: "100%",
                            borderRadius: 999,
                            background:
                              "linear-gradient(90deg,#f97316,#fb923c)",
                          }}
                        />
                      </div>
                    </div>

                    {/* FOOTER */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "#71717a",
                            marginBottom: 2,
                          }}
                        >
                          Budget
                        </div>

                        <div
                          style={{
                            fontSize: 18,
                            fontWeight: 700,
                            color: "#18181b",
                          }}
                        >
                          {(ev.budget / 1000).toFixed(0)}k FCFA
                        </div>
                      </div>

                      <button
                        style={{
                          border: "none",
                          background: "#fff7ed",
                          color: "#ea580c",
                          borderRadius: 12,
                          padding: "10px 14px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Voir
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* LIST VIEW */}
        {view === "list" && filtered.length > 0 && (
          <div
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 24,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "2fr 1fr 1fr 1fr 1fr auto",
                gap: 16,
                padding: "18px 24px",
                borderBottom: "1px solid #f4f4f5",
                fontSize: 12,
                color: "#71717a",
                fontWeight: 600,
              }}
            >
              <span>Événement</span>
              <span>Date</span>
              <span>Lieu</span>
              <span>Participants</span>
              <span>Budget</span>
              <span></span>
            </div>

            {filtered.map((ev, i) => {
              const sc =
                statusConfig[ev.status] || statusConfig["Brouillon"];

              return (
                <div
                  key={ev.id}
                  onClick={() =>
                    router.push(`/evenements/${ev.id}`)
                  }
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "2fr 1fr 1fr 1fr 1fr auto",
                    gap: 16,
                    padding: "20px 24px",
                    alignItems: "center",
                    borderBottom:
                      i < filtered.length - 1
                        ? "1px solid #f4f4f5"
                        : "none",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        width: 54,
                        height: 54,
                        borderRadius: 18,
                        background: "#fff7ed",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 28,
                      }}
                    >
                      {ev.img}
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: "#18181b",
                          marginBottom: 6,
                        }}
                      >
                        {ev.name}
                      </div>

                      <span
                        style={{
                          padding: "5px 10px",
                          borderRadius: 999,
                          background: sc.bg,
                          border: `1px solid ${sc.border}`,
                          color: sc.text,
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                      >
                        {ev.status}
                      </span>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: 13,
                      color: "#71717a",
                    }}
                  >
                    {ev.date}
                  </span>

                  <span
                    style={{
                      fontSize: 13,
                      color: "#71717a",
                    }}
                  >
                    {ev.location}
                  </span>

                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#18181b",
                    }}
                  >
                    {ev.participants}/{ev.capacity}
                  </span>

                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#18181b",
                    }}
                  >
                    {(ev.budget / 1000).toFixed(0)}k FCFA
                  </span>

                  <div onClick={(e) => e.stopPropagation()}>
                    <Dropdown
                      trigger={
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: 12,
                            border: "1px solid #e5e7eb",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "#fff",
                          }}
                        >
                          <MoreHorizontal
                            size={16}
                            color="#52525b"
                          />
                        </div>
                      }
                      items={[
                        {
                          label: "Voir détails",
                          icon: <Eye size={14} />,
                          onClick: () =>
                            router.push(`/evenements/${ev.id}`),
                        },
                        {
                          label: "Modifier",
                          icon: <Edit2 size={14} />,
                          onClick: () => {
                            setEditEvent(ev);
                            setEventModal(true);
                          },
                        },
                        {
                          label: "Supprimer",
                          icon: <Trash2 size={14} />,
                          onClick: () =>
                            setConfirmDelete(ev.id),
                          danger: true,
                        },
                      ]}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <EventModal
        open={eventModal}
        onClose={() => setEventModal(false)}
        event={editEvent}
      />

      <ConfirmDialog
        open={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() =>
          confirmDelete && deleteEvent(confirmDelete)
        }
        title="Supprimer cet événement ?"
        description="Cette action supprimera définitivement toutes les données liées à cet événement."
      />
    </div>
  );
}
