import type { Metadata } from "next";
import "./globals.css";
import ToastProvider from "@/components/ui/ToastProvider";

export const metadata: Metadata = {
  title: "TchadEvent — Gestion d'événements",
  description: "Planifiez, gérez et suivez vos événements avec précision",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
