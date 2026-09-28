"use client";
import { useState, useRef, useEffect } from "react";
import { X, Download, Copy, Check } from "lucide-react";
import QRCode from "qrcode";

interface QRScannerModalProps {
  open: boolean;
  onClose: () => void;
  participantId?: number;
  participantName?: string;
  eventName?: string;
  accessLink?: string;
}

export default function QRScannerModal({
  open,
  onClose,
  participantId = 1,
  participantName = "Participant",
  eventName = "Événement",
  accessLink = "",
}: QRScannerModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrValue, setQrValue] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open && canvasRef.current) {
      const value = accessLink || `PARTICIPANT:${participantId}:${participantName}:${new Date().toISOString()}`;
      setQrValue(value);
      
      QRCode.toCanvas(canvasRef.current, value, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      }).catch((err: Error) => console.error("QR Code error:", err));
    }
  }, [open, participantId, participantName, accessLink]);

  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement("a");
      link.href = canvasRef.current.toDataURL("image/png");
      link.download = `qr-${participantId}.png`;
      link.click();
    }
  };

  const copyToClipboard = () => {
    if (accessLink) {
      navigator.clipboard.writeText(accessLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--glass-border)",
          borderRadius: 18,
          width: "100%",
          maxWidth: 480,
          padding: 32,
          textAlign: "center",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <div style={{ textAlign: "left" }}>
            <h2
              style={{
                fontSize: 18,
                fontFamily: "Syne, sans-serif",
                fontWeight: 700,
                color: "var(--text-primary)",
              }}
            >
              Code QR - {participantName}
            </h2>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>
              {eventName}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "var(--bg-tertiary)",
              border: "1px solid var(--glass-border)",
              borderRadius: 8,
              width: 30,
              height: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--text-secondary)",
            }}
          >
            <X size={14} />
          </button>
        </div>

        <div
          style={{
            background: "#fff",
            padding: 16,
            borderRadius: 12,
            marginBottom: 24,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <canvas ref={canvasRef} />
        </div>

        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: 13,
            marginBottom: 20,
          }}
        >
          Scannez ce code QR pour accéder aux informations de l'événement
        </p>

        {accessLink && (
          <div
            style={{
              background: "var(--bg-tertiary)",
              border: "1px solid var(--glass-border)",
              borderRadius: 12,
              padding: 12,
              marginBottom: 20,
              display: "flex",
              gap: 8,
              alignItems: "center",
            }}
          >
            <input
              type="text"
              value={accessLink}
              readOnly
              style={{
                ...{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: 8,
                  padding: "8px 12px",
                  color: "var(--text-primary)",
                  fontSize: 11,
                  outline: "none",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  width: "100%",
                  transition: "all 0.2s ease",
                },
              }}
            />
            <button
              onClick={copyToClipboard}
              style={{
                background: "var(--accent-quaternary)",
                border: "none",
                borderRadius: 8,
                padding: "8px 12px",
                color: "#0a0a0a",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontWeight: 600,
                fontSize: 12,
                whiteSpace: "nowrap",
              }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copié" : "Copier"}
            </button>
          </div>
        )}

        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              background: "none",
              border: "1px solid var(--glass-border)",
              borderRadius: 8,
              padding: "12px 16px",
              color: "var(--text-secondary)",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Fermer
          </button>
          <button
            onClick={handleDownload}
            style={{
              flex: 1,
              background: "var(--accent-quaternary)",
              border: "none",
              borderRadius: 8,
              padding: "12px 16px",
              color: "#0a0a0a",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Download size={16} />
            Télécharger
          </button>
        </div>
      </div>
    </div>
  );
}
