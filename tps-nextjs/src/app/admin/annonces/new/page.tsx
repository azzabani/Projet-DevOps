"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddCarPage() {
  const router = useRouter();

  const [marque, setMarque] = useState("");
  const [description, setDescription] = useState("");
  const [prix, setPrix] = useState("");
  const [image, setImage] = useState("");
  const [annee, setAnnee] = useState("");
  const [kilometrage, setKilometrage] = useState("");
  const [carburant, setCarburant] = useState("");
  const [etat, setEtat] = useState("Disponible");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setSubmitting(true);

    const product = {
      marque,
      description,
      prix: Number(prix || 0),
      image,
      annee: annee ? Number(annee) : undefined,
      kilometrage: kilometrage ? Number(kilometrage) : undefined,
      carburant,
      etat,
    };

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (!res.ok) {
        const err = await res.text();
        alert("Erreur lors de la création : " + err);
        setSubmitting(false);
        return;
      }

      router.push("/admin/annonces");
    } catch (error) {
      console.error(error);
      alert("Erreur réseau");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-indigo-50">
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-8 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold">➕ Nouvelle annonce</h1>
          <p className="text-orange-100 mt-2">Ajoutez un véhicule à votre inventaire</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Marque <span className="text-red-500">*</span></label>
              <input
                required
                value={marque}
                onChange={(e) => setMarque(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-200 bg-gray-50"
                placeholder="Ex: Peugeot"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Prix (€) <span className="text-red-500">*</span></label>
              <input
                required
                type="number"
                value={prix}
                onChange={(e) => setPrix(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-200 bg-gray-50"
                placeholder="Ex: 8500"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Année</label>
              <input
                type="number"
                value={annee}
                onChange={(e) => setAnnee(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-200 bg-gray-50"
                placeholder="Ex: 2015"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Kilométrage</label>
              <input
                type="number"
                value={kilometrage}
                onChange={(e) => setKilometrage(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-200 bg-gray-50"
                placeholder="Ex: 120000"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Carburant</label>
              <input
                value={carburant}
                onChange={(e) => setCarburant(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-200 bg-gray-50"
                placeholder="Ex: Diesel"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Image (URL)</label>
              <input
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-200 bg-gray-50"
                placeholder="https://.../image.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">État</label>
              <select
                value={etat}
                onChange={(e) => setEtat(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-200 bg-gray-50"
              >
                <option>Disponible</option>
                <option>Vendu</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-bold text-gray-900 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-200 bg-gray-50"
              placeholder="Décrivez le véhicule en détail"
            />
          </div>

          <div className="mt-6 flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-semibold transition disabled:opacity-50"
            >
              {submitting ? "⏳ Création..." : "✅ Ajouter l'annonce"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/admin/annonces")}
              className="px-6 py-3 bg-gray-200 rounded-xl hover:bg-gray-300"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
