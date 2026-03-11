import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gestor de Equipamentos",
  description: "Sistema para gerenciamento patrimonial de notebooks, celulares e chips",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex bg-gray-50 min-h-screen print:bg-white print:block">
          <Sidebar />
          <main className="flex-1 p-8 overflow-y-auto w-full print:p-0 print:overflow-visible print:block">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
