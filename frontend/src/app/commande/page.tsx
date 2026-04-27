"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Commande {
  _id: string;
  marque: string;
  model: string;
  prix: number;
  client: {
    prenom?: string;
    nom: string;
    email: string;
    telephone: string;
    adresse: string;
    ville: string;
    codePostal: string;
  };
  dateCommande: string;
  etat?: string;
}

export default function CommandesPage() {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Récupérer l'email du localStorage (du token JWT)
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Décoder le token pour obtenir l'email
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserEmail(payload.email);
      fetchCommandes(payload.email);
    } catch (error) {
      console.error("Erreur décodage token:", error);
      router.push("/login");
    }
  }, [router]);

  const fetchCommandes = async (email: string) => {
    try {
      const response = await fetch(`/api/commande?email=${encodeURIComponent(email)}`);
      if (!response.ok) throw new Error("Erreur chargement commandes");
      const data = await response.json();
      setCommandes(data);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de vos commandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-indigo-50">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-800 text-white py-12 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold mb-2">📦 Mes Commandes</h1>
          <p className="text-orange-100">Historique de vos achats</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {commandes.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Aucune commande</h2>
            <p className="text-gray-600 mb-6">Vous n'avez pas encore effectué d'achat.</p>
            <Link
              href="/products"
              className="inline-block bg-gradient-to-r from-orange-600 to-orange-700 text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg transition"
            >
              Découvrir nos véhicules
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {commandes.map((commande) => (
              <div
                key={commande._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-l-4 border-orange-600"
              >
                <div className="p-6 md:p-8">
                  {/* En-tête commande */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-6 border-b border-gray-200">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {commande.marque} {commande.model}
                      </h3>
                      <p className="text-sm text-gray-500">Commande #{commande._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <div className="mt-4 md:mt-0 text-right">
                      <p className="text-3xl font-bold text-orange-600">{commande.prix.toLocaleString()}€</p>
                      <p className="text-sm text-gray-500">
                        {new Date(commande.dateCommande).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>

                  {/* Informations client */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-200">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                        Informations client
                      </h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>
                          <span className="font-semibold">Nom:</span> {commande.client.prenom ? commande.client.prenom + " " : ""}{commande.client.nom}
                        </p>
                        <p>
                          <span className="font-semibold">Email:</span>
                          <a href={`mailto:${commande.client.email}`} className="text-orange-600 hover:underline ml-1">
                            {commande.client.email}
                          </a>
                        </p>
                        <p>
                          <span className="font-semibold">Téléphone:</span>
                          <a href={`tel:${commande.client.telephone}`} className="text-orange-600 hover:underline ml-1">
                            {commande.client.telephone}
                          </a>
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                        Adresse de livraison
                      </h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>{commande.client.adresse}</p>
                        <p>
                          {commande.client.codePostal} {commande.client.ville}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Détails véhicule */}
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                      Détails du véhicule
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs">Marque</p>
                        <p className="font-semibold text-gray-900">{commande.marque}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Modèle</p>
                        <p className="font-semibold text-gray-900">{commande.model}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Montant</p>
                        <p className="font-semibold text-orange-600">{commande.prix.toLocaleString()}€</p>
                      </div>
                    </div>
                  </div>

                  {/* Statut */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
                        ✅ Commande enregistrée
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bouton retour */}
        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-block bg-gradient-to-r from-orange-600 to-orange-700 text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg transition"
          >
            ← Retour aux produits
          </Link>
        </div>
      </div>
    </div>
  );
}
