"use client";

import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
     <aside className="w-64 bg-gradient-to-r from-orange-600 to-orange-800 text-white py-12 px-4 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Admin</h2>

        <nav className="flex flex-col space-y-4">
          <Link href="/admin" className="hover:text-gray-300">Dashboard</Link>
          <Link href="/admin/clients" className="hover:text-gray-300">Gestion Clients</Link>
          <Link href="/admin/annonces" className="hover:text-gray-300">Gestion Annonces</Link>
          <Link href="/admin/ventes" className="hover:text-gray-300">Gestion Ventes</Link>
          <div className="border-t border-orange-400 my-4"></div>
          <Link href="/admin/reset" className="hover:text-gray-300 text-yellow-200">🔄 Réinitialiser</Link>
        </nav>
      </aside>

      {/* Contenu */}
      <main className="flex-1 p-8 bg-gray-50">
        {children}
      </main>
    </div>
  );
}
