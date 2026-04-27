"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Client {
  _id: string;
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  ville?: string;
  codePostal?: string;
  createdAt?: string;
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [recherche, setRecherche] = useState("");

  const loadClients = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setClients(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

const deleteClient = async (id: string) => {
  if (!confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) return;

  try {
 await fetch(`/api/users?id=${id}`, { method: "DELETE" });
    loadClients(); // recharge la liste
    alert("Client supprimé avec succès !");
  } catch (error) {
    alert("Erreur : " + error);
  }
};


  useEffect(() => {
    loadClients();
  }, []);

  const clientsFiltres = clients.filter(client =>
    (client.prenom?.toLowerCase().includes(recherche.toLowerCase()) ?? false) ||
    (client.nom?.toLowerCase().includes(recherche.toLowerCase()) ?? false) ||
    (client.email?.toLowerCase().includes(recherche.toLowerCase()) ?? false)
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des clients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-indigo-50">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-8 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <Link href="/admin" className="inline-flex items-center text-orange-100 hover:text-white mb-4 transition text-sm font-medium">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour au dashboard
          </Link>
          <h1 className="text-4xl font-bold">👥 Gestion des clients</h1>
          <p className="text-orange-100 mt-2">Gérez tous vos clients</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-600">
            <p className="text-gray-600 text-sm font-semibold uppercase">Total clients</p>
            <p className="text-4xl font-bold text-orange-600 mt-2">{clients.length}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-600">
            <p className="text-gray-600 text-sm font-semibold uppercase">Clients actifs</p>
            <p className="text-4xl font-bold text-green-600 mt-2">{clientsFiltres.length}</p>
          </div>
        </div>

        {/* RECHERCHE */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <label className="block text-sm font-semibold text-gray-900 mb-3">Rechercher un client</label>
          <input
            type="text"
            placeholder="Nom, prénom ou email..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 bg-white text-gray-900 font-medium text-base placeholder-gray-500"
          />
        </div>

        {/* TABLEAU CLIENTS */}
        {clientsFiltres.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <p className="text-gray-500 text-lg font-medium">🔍 Aucun client trouvé</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-orange-600 to-orange-700 text-white">
                    <th className="px-6 py-4 text-left text-sm font-bold">Nom complet</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Téléphone</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Adresse</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Date d'inscription</th>
                    <th className="px-6 py-4 text-center text-sm font-bold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {clientsFiltres.map((client) => (
                    <tr key={client._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">
                        {client.prenom} {client.nom}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <a href={`mailto:${client.email}`} className="hover:text-orange-600 transition underline">
                          {client.email || "—"}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {client.telephone ? (
                          <a href={`tel:${client.telephone}`} className="hover:text-orange-600 transition font-medium">
                            {client.telephone}
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="max-w-xs">
                          <p className="font-medium">{client.adresse || "—"}</p>
                          <p>{client.codePostal || ""} {client.ville || ""}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {formatDate(client.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => deleteClient(client._id)}
                          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-semibold transition transform hover:scale-105"
                        >
                          🗑️ Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* FOOTER */}
            <div className="bg-gradient-to-r from-gray-50 to-orange-50 px-6 py-4 border-t border-gray-200">
              <p className="text-gray-700 font-semibold">
                {clientsFiltres.length} client{clientsFiltres.length !== 1 ? "s" : ""} affiché{clientsFiltres.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
