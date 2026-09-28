"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import { Download, Calendar, MapPin, User, AlertCircle } from "lucide-react";

interface Report {
  eventId: number;
  eventName: string;
  date: string;
  location: string;
  description: string;
  organizerName: string;
  attendanceStatus: string;
}

export default function ParticipantReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<number | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch("/api/participants/reports");
        if (response.ok) {
          const reportsData = await response.json();
          setReports(reportsData);
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleDownload = async (eventId: number, eventName: string) => {
    setDownloading(eventId);
    try {
      const response = await fetch(`/api/participants/reports/${eventId}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Lynkéné_Report_${eventName}.html`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Error downloading report:", error);
    } finally {
      setDownloading(null);
    }
  };

  if (loading) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <p style={{ color: "#94a3b8" }}>Chargement...</p>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#f8fafc", minHeight: "100vh" }}>
      <Header title="Mes Rapports" subtitle="Historique des événements auxquels vous avez participé" />

      <div style={{ padding: "28px", display: "flex", flexDirection: "column", gap: 20 }}>
        {reports.length > 0 ? (
          reports.map((report) => (
            <div key={report.eventId} style={{ background: "#fff", borderRadius: 28, border: "1px solid #f1f5f9", padding: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>
                    {report.eventName}
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#64748b" }}>
                      <Calendar size={16} />
                      <span>{report.date}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#64748b" }}>
                      <MapPin size={16} />
                      <span>{report.location}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#64748b" }}>
                      <User size={16} />
                      <span>Organisateur: {report.organizerName}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDownload(report.eventId, report.eventName)}
                  disabled={downloading === report.eventId}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "#f97316",
                    color: "#fff",
                    border: "none",
                    borderRadius: 12,
                    padding: "12px 20px",
                    fontWeight: 600,
                    cursor: downloading === report.eventId ? "not-allowed" : "pointer",
                    opacity: downloading === report.eventId ? 0.6 : 1
                  }}
                >
                  <Download size={18} />
                  {downloading === report.eventId ? "Téléchargement..." : "Télécharger"}
                </button>
              </div>

              {report.description && (
                <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 16 }}>
                  <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6 }}>
                    {report.description}
                  </p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div style={{ background: "#fff", borderRadius: 28, border: "1px solid #f1f5f9", padding: 40, textAlign: "center" }}>
            <AlertCircle size={48} color="#94a3b8" style={{ margin: "0 auto 16px" }} />
            <p style={{ color: "#94a3b8", fontSize: 16 }}>Aucun rapport disponible pour le moment</p>
          </div>
        )}
      </div>
    </div>
  );
}
