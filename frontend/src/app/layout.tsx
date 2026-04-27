"use client";

import { usePathname } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/api/components/Navbar";

// 🔹 Chargement des polices
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 🔹 Liens du menu
const links = [
  { name: "Accueil", href: "/" },
  { name: "Nos Produits", href: "/products" },
  { name: "Commandes", href: "/commande" },
  { name:"chatbot", href:"/chat"}
] as const;

// 🔹 Layout principal
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideNavbar = pathname === "/login" || pathname === "/register";

  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {!hideNavbar && <Navbar links={links} />}
        {children}
        {/* 🔹 Chatbot supprimé */}
      </body>
    </html>
  );
}
