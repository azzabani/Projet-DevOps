"use client";

import { useEffect, useState } from "react";

interface Stats {
  totalClients: number;
  totalAnnonces: number;
  annoncesDisponibles: number;
  annoncesVendues: number;
  totalVentes: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Erreur chargement stats admin :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-orange-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-orange-50">
        <div className="text-center">
          <p className="text-gray-500 text-xl font-medium">Aucune donnée trouvée.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-800 text-white py-12 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold mb-2">📊 Dashboard Administrateur</h1>
          <p className="text-orange-100 text-lg">Bienvenue dans votre espace de gestion</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Clients inscrits */}
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border-l-4 border-orange-600 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-medium text-sm uppercase tracking-wide">Clients inscrits</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{stats.totalClients}</p>
              </div>
              <div className="text-5xl opacity-30 group-hover:scale-110 transition-transform">👥</div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">Nombre total d'utilisateurs</p>
            </div>
          </div>

          {/* Total Annonces */}
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border-l-4 border-green-600 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-medium text-sm uppercase tracking-wide">Total Annonces</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{stats.totalAnnonces}</p>
              </div>
              <div className="text-5xl opacity-30 group-hover:scale-110 transition-transform">📋</div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">Toutes les annonces publiées</p>
            </div>
          </div>

          {/* Annonces Disponibles */}
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border-l-4 border-yellow-500 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-medium text-sm uppercase tracking-wide">Disponibles</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{stats.annoncesDisponibles}</p>
              </div>
              <div className="text-5xl opacity-30 group-hover:scale-110 transition-transform">✅</div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">Annonces en vente actuellement</p>
            </div>
          </div>

          {/* Annonces Vendues */}
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border-l-4 border-orange-500 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-medium text-sm uppercase tracking-wide">Vendues</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{stats.annoncesVendues}</p>
              </div>
              <div className="text-5xl opacity-30 group-hover:scale-110 transition-transform">🎉</div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">Annonces complétées</p>
            </div>
          </div>

          {/* Ventes Réalisées - Large Card */}
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 text-white md:col-span-2 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 font-medium text-sm uppercase tracking-wide">Ventes Réalisées</p>
                <p className="text-5xl font-bold mt-2">{stats.totalVentes}</p>
              </div>
              <div className="text-6xl opacity-40 group-hover:scale-110 transition-transform">💰</div>
            </div>
            <div className="mt-6 pt-6 border-t border-purple-400">
              <p className="text-purple-100 text-sm">Montant total des transactions</p>
            </div>
          </div>
        </div>

        {/* SUMMARY SECTION */}
        {/* SUMMARY SECTION */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-orange-600 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📈 Résumé d'activité</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center mb-3">
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                <p className="text-gray-700 font-medium">Taux de conversion</p>
              </div>
              <p className="text-3xl font-bold text-green-600">
                {stats.totalAnnonces > 0 
                  ? ((stats.annoncesVendues / stats.totalAnnonces) * 100).toFixed(1)
                  : 0}%
              </p>
              <p className="text-sm text-gray-500 mt-1">Annonces vendues sur total</p>
            </div>
            <div>
              <div className="flex items-center mb-3">
                <span className="inline-block w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
                <p className="text-gray-700 font-medium">Annonces en attente</p>
              </div>
              <p className="text-3xl font-bold text-orange-600">
                {stats.totalAnnonces - stats.annoncesVendues}
              </p>
              <p className="text-sm text-gray-500 mt-1">Annonces à traiter</p>
            </div>
          </div>
        </div>

        {/* SECTION VENTES */}
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-lg p-8 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold">💰 Gestion des Ventes</h2>
            <a
              href="/admin/ventes"
              className="px-6 py-3 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition shadow-lg"
            >
              Voir tous les détails →
            </a>
          </div>
          <p className="text-purple-100 mb-4">Gérez toutes les commandes et suivez les ventes en temps réel</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
              <p className="text-purple-100 text-sm font-semibold uppercase mb-2">Total ventes</p>
              <p className="text-4xl font-bold">{stats.totalVentes}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
              <p className="text-purple-100 text-sm font-semibold uppercase mb-2">Revenu total</p>
              <p className="text-4xl font-bold">{stats.totalRevenue?.toLocaleString()}€</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
