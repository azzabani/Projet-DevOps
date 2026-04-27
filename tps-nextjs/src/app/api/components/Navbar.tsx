"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type NavbarProps = {
  readonly links: readonly { readonly name: string; readonly href: string }[];
};

export default function Navbar({ links }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    // Supprimer le token
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    // Rediriger vers la page d'accueil
    router.push("/");
    // Fermer le menu mobile si ouvert
    setIsOpen(false);
  };

  return (
    <nav className="glass-nav sticky top-0 z-50" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="glass-strong rounded-xl p-2 font-bold text-xl group-hover:scale-110 transition shadow-lg">
            🚗
          </div>
          <div>
            <p className="text-xl font-bold text-black">Auto Excellence</p>
            <p className="text-xs text-black opacity-70">Showroom</p>
          </div>
        </Link>

        {/* Menu Desktop */}
        <div className="hidden lg:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-black font-medium hover:text-orange-600 transition group px-3 py-2 rounded-lg glass-button"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300 rounded-full"></span>
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="hidden sm:block px-6 py-2 rounded-xl font-bold shadow-lg bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 transition transform hover:scale-105"
            >
              Déconnexion
            </button>
          ) : (
            <Link
              href="/login"
              className="hidden sm:block px-6 py-2 rounded-xl font-bold shadow-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transition transform hover:scale-105"
            >
              Connexion
            </Link>
          )}

          {/* Bouton menu mobile */}
          <button
            className="lg:hidden text-black text-3xl hover:text-orange-600 transition glass-button rounded-lg p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu mobile"
          >
            {isOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {mounted && isOpen && (
        <div className="lg:hidden glass-strong px-4 pb-4 space-y-3 border-t border-white/60">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-4 py-3 rounded-xl glass-button hover:bg-white transition font-medium text-black"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          {isLoggedIn ? (
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="block w-full text-center px-4 py-3 rounded-xl font-bold bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 transition"
            >
              Déconnexion
            </button>
          ) : (
            <Link
              href="/login"
              className="block text-center px-4 py-3 rounded-xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transition"
              onClick={() => setIsOpen(false)}
            >
              Connexion
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

