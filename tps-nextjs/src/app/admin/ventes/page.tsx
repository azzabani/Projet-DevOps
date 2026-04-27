"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Commande {
  _id: string;
  marque?: string;
  prix: number;
  client?: {
    nom?: string;
    prenom?: string;
    email?: string;
    telephone?: string;
    adresse?: string;
    ville?: string;
    codePostal?: string;
  };
  statut?: string;
  dateCommande?: string;
  createdAt?: string; // Pour compatibilité avec les anciennes données
}

export default function VentesPage() {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtreStatut, setFiltreStatut] = useState("tous");
  const [recherche, setRecherche] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const fetchCommandes = async () => {
    try {
      const res = await fetch("/api/admin/ventes-recentes");
      const data = await res.json();
      setCommandes(data);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommandes();
  }, []);

  const handleStatusChange = async (commandeId: string, nouveauStatut: string) => {
    setUpdatingStatus(commandeId);
    try {
      const res = await fetch(`/api/admin/commande/${commandeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut: nouveauStatut })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Mettre à jour la commande dans l'état local
        setCommandes(prevCommandes =>
          prevCommandes.map(c =>
            c._id === commandeId ? { ...c, statut: nouveauStatut } : c
          )
        );
      } else {
        alert("Erreur lors de la mise à jour du statut: " + (data.message || "Erreur inconnue"));
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur est survenue lors de la mise à jour du statut.");
    } finally {
      setUpdatingStatus(null);
    }
  };

  let commandesFiltrees = filtreStatut === "tous" 
    ? commandes 
    : commandes.filter(c => c.statut === filtreStatut);

  commandesFiltrees = commandesFiltrees.filter(c => {
    const searchLower = recherche.toLowerCase();
    return (
      (c.client?.prenom?.toLowerCase().includes(searchLower) ?? false) ||
      (c.client?.nom?.toLowerCase().includes(searchLower) ?? false) ||
      (c.marque?.toLowerCase().includes(searchLower) ?? false) ||
      (c.client?.email?.toLowerCase().includes(searchLower) ?? false)
    );
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des ventes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-8 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <Link href="/admin" className="inline-flex items-center text-orange-100 hover:text-white mb-4 transition text-sm font-medium">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour au dashboard
          </Link>
          <h1 className="text-4xl font-bold">💰 Gestion des Ventes</h1>
          <p className="text-orange-100 mt-2">Gérez toutes les commandes de véhicules</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* STATS RAPIDES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-600">
            <p className="text-gray-600 text-sm font-semibold uppercase">Total ventes</p>
            <p className="text-4xl font-bold text-gray-900 mt-2">{commandes.length}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-600">
            <p className="text-gray-600 text-sm font-semibold uppercase">Revenu total</p>
            <p className="text-4xl font-bold text-orange-600 mt-2">
              {commandes.reduce((sum, c) => sum + c.prix, 0).toLocaleString()}€
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-600">
            <p className="text-gray-600 text-sm font-semibold uppercase">Moyenne par vente</p>
            <p className="text-4xl font-bold text-purple-600 mt-2">
              {commandes.length > 0 ? Math.round(commandes.reduce((sum, c) => sum + c.prix, 0) / commandes.length).toLocaleString() : 0}€
            </p>
          </div>
        </div>

        {/* FILTRES ET RECHERCHE */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">Recherche</label>
              <input
                type="text"
                placeholder="Rechercher par client, email, marque..."
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 bg-white text-gray-900 font-medium text-base placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">Filtrer par statut</label>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setFiltreStatut("tous")}
                  className={`px-6 py-2 rounded-lg font-semibold transition ${
                    filtreStatut === "tous"
                      ? "bg-orange-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  Tous ({commandes.length})
                </button>
                <button
                  onClick={() => setFiltreStatut("confirmée")}
                  className={`px-6 py-2 rounded-lg font-semibold transition ${
                    filtreStatut === "confirmée"
                      ? "bg-green-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  Confirmées ({commandes.filter(c => c.statut === "confirmée").length})
                </button>
                <button
                  onClick={() => setFiltreStatut("en cours de livraison")}
                  className={`px-6 py-2 rounded-lg font-semibold transition ${
                    filtreStatut === "en cours de livraison"
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  En livraison ({commandes.filter(c => c.statut === "en cours de livraison").length})
                </button>
                <button
                  onClick={() => setFiltreStatut("livré")}
                  className={`px-6 py-2 rounded-lg font-semibold transition ${
                    filtreStatut === "livré"
                      ? "bg-purple-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  Livrées ({commandes.filter(c => c.statut === "livré").length})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* TABLEAU VENTES */}
        {commandesFiltrees.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <p className="text-gray-500 text-lg font-medium">🔍 Aucune vente trouvée</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-orange-600 to-orange-700 text-white">
                    <th className="px-6 py-4 text-left text-sm font-bold">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Véhicule</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Client</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Téléphone</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Adresse</th>
                    <th className="px-6 py-4 text-right text-sm font-bold">Prix</th>
                    <th className="px-6 py-4 text-center text-sm font-bold">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {commandesFiltrees.map((commande) => (
                    <tr key={commande._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium whitespace-nowrap">
                        {formatDate(commande.dateCommande || commande.createdAt || new Date().toISOString())}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-orange-600">
                        {commande.marque || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {(commande.client?.prenom || "") + " " + (commande.client?.nom || "")} 
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {commande.client?.email ? (
                          <a href={`mailto:${commande.client.email}`} className="hover:text-orange-600 transition underline">
                            {commande.client.email}
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {commande.client?.telephone ? (
                          <a href={`tel:${commande.client.telephone}`} className="hover:text-orange-600 transition font-medium">
                            {commande.client.telephone}
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="max-w-xs">
                          <p className="font-medium">{commande.client?.adresse || "—"}</p>
                          <p>{commande.client?.codePostal || ""} {commande.client?.ville || ""}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-bold text-green-600">
                        {commande.prix.toLocaleString()}€
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <span className={`px-4 py-2 rounded-full text-xs font-bold ${
                            commande.statut === "confirmée"
                              ? "bg-green-100 text-green-800"
                              : commande.statut === "en cours de livraison"
                              ? "bg-blue-100 text-blue-800"
                              : commande.statut === "livré"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {commande.statut === "confirmée" && "✅ Confirmée"}
                            {commande.statut === "en cours de livraison" && "🚚 En livraison"}
                            {commande.statut === "livré" && "📦 Livré"}
                            {!commande.statut && "❓ Inconnu"}
                          </span>
                          
                          {/* Menu déroulant pour changer le statut */}
                          {commande.statut && commande.statut !== "livré" && (
                            <select
                              onChange={(e) => {
                                if (e.target.value && e.target.value !== commande.statut) {
                                  handleStatusChange(commande._id, e.target.value);
                                }
                              }}
                              disabled={updatingStatus === commande._id}
                              value={commande.statut}
                              className={`px-3 py-1 text-xs font-semibold rounded-lg border-2 transition ${
                                updatingStatus === commande._id
                                  ? "bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300"
                                  : "bg-white text-gray-800 border-gray-300 hover:border-blue-500 cursor-pointer"
                              }`}
                            >
                              <option value="confirmée">✅ Confirmée</option>
                              <option value="en cours de livraison">🚚 En livraison</option>
                              <option value="livré">📦 Livré</option>
                            </select>
                          )}
                          
                          {commande.statut === "livré" && (
                            <span className="text-xs text-gray-500 italic">Commande terminée</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Affichage du total */}
            <div className="bg-gradient-to-r from-gray-50 to-orange-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
              <p className="text-gray-700 font-semibold">Total ({commandesFiltrees.length} ventes)</p>
              <p className="text-2xl font-bold text-orange-600">
                {commandesFiltrees.reduce((sum, c) => sum + c.prix, 0).toLocaleString()}€
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
