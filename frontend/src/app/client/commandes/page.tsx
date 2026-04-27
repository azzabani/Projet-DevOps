"use client";

import { useEffect, useState } from "react";

interface Commande {
  _id: string;
  clientEmail: string;
  produitId: string;
  produitNom: string;
  prix: number;
  date: string;
  status: string;
}

export default function ClientOrdersPage() {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);

  // 1️⃣ récupérer email depuis localStorage ou auth
  const email =
    typeof window !== "undefined" ? localStorage.getItem("email") : null;

  useEffect(() => {
    if (!email) return;

    const fetchCommandes = async () => {
      try {
        const res = await fetch(`/api/commande/client/${email}`);
        const data = await res.json();

        if (data.success) {
          setCommandes(data.data);
        }
      } catch (error) {
        console.error("Erreur :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommandes();
  }, [email]);

  if (!email) {
    return <p className="text-center text-red-500">Veuillez vous connecter.</p>;
  }

  if (loading) {
    return <p className="text-center">Chargement...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-5">
      <h1 className="text-3xl font-bold mb-6">📦 Mes Commandes</h1>

      {commandes.length === 0 ? (
        <p>Aucune commande trouvée.</p>
      ) : (
        commandes.map((cmd) => (
          <div
            key={cmd._id}
            className="border rounded-lg p-4 mb-4 shadow-md bg-white"
          >
            <h2 className="font-bold text-xl">{cmd.produitNom}</h2>
            <p className="text-gray-700">Prix : {cmd.prix} TND</p>
            <p className="text-gray-700">
              Date : {new Date(cmd.date).toLocaleDateString()}
            </p>
            <p className="text-orange-600 font-semibold">
              Statut : {cmd.status}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
