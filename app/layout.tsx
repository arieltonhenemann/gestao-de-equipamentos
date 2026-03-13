import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { headers } from "next/headers";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const isLoginPage = pathname.startsWith("/login");

  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {isLoginPage ? (
          children
        ) : (
          <div className="flex bg-gray-50 min-h-screen print:bg-white print:block">
            <Sidebar />
            <main className="flex-1 p-8 overflow-y-auto w-full print:p-0 print:overflow-visible print:block">
              {children}
            </main>
          </div>
        )}
      </body>
    </html>
  );
}

