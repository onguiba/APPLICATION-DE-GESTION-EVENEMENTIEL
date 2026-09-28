"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import { Wallet, Receipt, AlertCircle } from "lucide-react";

interface Ticket {
  ticketId: number;
  amount: number;
  paymentStatus: string;
  purchaseDate: string;
  qrCode: string;
}

interface EventTickets {
  eventId: number;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  tickets: Ticket[];
  totalAmount: number;
}

interface TicketsData {
  tickets: EventTickets[];
  totalSpent: number;
  ticketCount: number;
}

export default function ParticipantBudgetPage() {
  const [data, setData] = useState<TicketsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch("/api/participants/tickets");
        if (response.ok) {
          const ticketsData = await response.json();
          setData(ticketsData);
        }
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <p style={{ color: "#94a3b8" }}>Chargement...</p>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#f8fafc", minHeight: "100vh" }}>
      <Header title="Mes Tickets" subtitle="Résumé de vos achats de tickets" />

      <div style={{ padding: "28px", display: "flex", flexDirection: "column", gap: 28 }}>
        {/* STATS CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 18 }}>
          <div style={{ background: "#fff", borderRadius: 24, padding: 24, border: "1px solid #f1f5f9" }}>
            <div style={{ width: 52, height: 52, borderRadius: 18, background: "#f9731615", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
              <Wallet size={22} color="#f97316" />
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>
              {data?.ticketCount || 0}
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>Tickets achetés</div>
          </div>

          <div style={{ background: "#fff", borderRadius: 24, padding: 24, border: "1px solid #f1f5f9" }}>
            <div style={{ width: 52, height: 52, borderRadius: 18, background: "#ea580c15", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
              <Receipt size={22} color="#ea580c" />
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>
              {((data?.totalSpent || 0) / 1000).toFixed(0)}k
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>Total dépensé</div>
          </div>
        </div>

        {/* TICKETS BY EVENT */}
        {data && data.tickets.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {data.tickets.map((eventTickets) => (
              <div key={eventTickets.eventId} style={{ background: "#fff", borderRadius: 28, border: "1px solid #f1f5f9", padding: 28 }}>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>
                  {eventTickets.eventName}
                </h3>
                <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 20 }}>
                  {eventTickets.eventDate} • {eventTickets.eventLocation}
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                  {eventTickets.tickets.map((ticket) => (
                    <div key={ticket.ticketId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16, background: "#f8fafc", borderRadius: 16 }}>
                      <div>
                        <div style={{ fontWeight: 600, color: "#111827", marginBottom: 4 }}>
                          Ticket #{ticket.ticketId}
                        </div>
                        <div style={{ fontSize: 13, color: "#94a3b8" }}>
                          {new Date(ticket.purchaseDate).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: "#f97316", marginBottom: 4 }}>
                          {(ticket.amount / 1000).toFixed(0)}k FCFA
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: ticket.paymentStatus === 'Payé' ? '#22c55e' : '#f59e0b' }}>
                          {ticket.paymentStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 600, color: "#111827" }}>Total pour cet événement</span>
                  <span style={{ fontSize: 20, fontWeight: 800, color: "#f97316" }}>
                    {(eventTickets.totalAmount / 1000).toFixed(0)}k FCFA
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ background: "#fff", borderRadius: 28, border: "1px solid #f1f5f9", padding: 40, textAlign: "center" }}>
            <AlertCircle size={48} color="#94a3b8" style={{ margin: "0 auto 16px" }} />
            <p style={{ color: "#94a3b8", fontSize: 16 }}>Aucun ticket acheté pour le moment</p>
          </div>
        )}
      </div>
    </div>
  );
}
