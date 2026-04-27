"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function EditCarPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("info");

  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [originalImage, setOriginalImage] = useState(""); // Pour comparer si l'image a changé
  const [description, setDescription] = useState("");

  // Charger les données de la voiture
  useEffect(() => {
    async function fetchCar() {
      try {
        const res = await fetch(`/api/cars/${id}`);
        const data = await res.json();

        // Normaliser les champs venant de la base (schema Product utilise marque/prix/annee)
        setTitle(data.title || data.marque || "");
        setBrand(data.brand || data.marque || "");
        setYear((data.year ?? data.annee)?.toString() ?? "");
        setPrice((data.prix ?? data.price)?.toString() ?? "");
        setImage(data.image || "");
        setOriginalImage(data.image || ""); // Sauvegarder l'image originale
        setDescription(data.description || "");
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCar();
  }, [id]);

  // Mettre à jour la voiture
  async function handleSubmit(e: any) {
    e.preventDefault();
    setSubmitting(true);

    // Envoyer uniquement les champs pertinents pour le schéma Product
    const carData: Record<string, any> = {
      marque: brand,
      description,
      prix: Number(price),
    };

    // Inclure l'image seulement si elle a été modifiée et n'est pas vide
    if (image && image.trim() !== "" && image !== originalImage) {
      carData.image = image;
    }

    if (year) {
      carData.annee = Number(year);
    }

    try {
      await fetch(`/api/cars/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(carData),
      });

      router.push("/admin/annonces");
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Chargement de l'annonce...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white py-10 px-4 shadow-2xl">
        <div className="max-w-6xl mx-auto">
          <Link href="/admin/annonces" className="inline-flex items-center text-purple-100 hover:text-white mb-4 transition text-sm font-medium">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour aux annonces
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold">🚗 Modifier l'annonce</h1>
              <p className="text-purple-100 mt-3 text-lg">Modifiez les informations du véhicule en temps réel</p>
            </div>
            <div className="hidden md:block text-7xl opacity-20">✏️</div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* APERÇU - SIDEBAR */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Image Preview Card */}
              {image && (
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-purple-100 group">
                  <div className="relative h-64 bg-gradient-to-br from-purple-100 to-pink-100 overflow-hidden">
                    <img
                      src={image}
                      alt="Aperçu"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 mb-2">{title || "Titre du véhicule"}</h3>
                    <p className="text-2xl font-bold text-purple-600">{price ? `${price}€` : "Prix"}</p>
                    <div className="flex gap-2 mt-4 flex-wrap">
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold">{brand || "Marque"}</span>
                      <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-xs font-semibold">{year || "Année"}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Info Card */}
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-2xl p-6 shadow-lg">
                <p className="text-sm font-semibold uppercase tracking-wide text-purple-100 mb-3">📋 Informations</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-200 rounded-full mr-2"></span>
                    Tous les champs sont obligatoires
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-200 rounded-full mr-2"></span>
                    Vérifiez l'URL de l'image
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-200 rounded-full mr-2"></span>
                    Sauvegarde automatique
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* FORMULAIRE */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              
              {/* TABS */}
              <div className="flex border-b border-gray-200">
                <button
                  type="button"
                  onClick={() => setActiveTab("info")}
                  className={`flex-1 py-4 px-6 font-semibold text-center transition ${
                    activeTab === "info"
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  📝 Informations
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("description")}
                  className={`flex-1 py-4 px-6 font-semibold text-center transition ${
                    activeTab === "description"
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  📄 Description
                </button>
              </div>

              <div className="p-8">
                {/* TAB: INFORMATIONS */}
                {activeTab === "info" && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Titre */}
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                          Titre <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: Peugeot 308 2015"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition bg-gray-50"
                        />
                      </div>

                      {/* Marque */}
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                          Marque <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: Peugeot"
                          value={brand}
                          onChange={(e) => setBrand(e.target.value)}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition bg-gray-50"
                        />
                      </div>

                      {/* Année */}
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                          Année <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          placeholder="Ex: 2015"
                          value={year}
                          onChange={(e) => setYear(e.target.value)}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition bg-gray-50"
                        />
                      </div>

                      {/* Prix */}
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                          Prix (€) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          placeholder="Ex: 8500"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition bg-gray-50"
                        />
                      </div>
                    </div>

                    {/* Image URL */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                        URL de l'image <span className="text-gray-400 text-xs font-normal">(optionnel - laisser vide pour garder l'image actuelle)</span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://exemple.com/image.jpg (laisser vide pour garder l'image actuelle)"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition bg-gray-50"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        💡 Laissez vide pour conserver l'image actuelle, ou entrez une nouvelle URL HTTPS valide
                      </p>
                      {originalImage && (
                        <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <p className="text-xs font-semibold text-purple-900 mb-2">Image actuelle :</p>
                          <img 
                            src={originalImage} 
                            alt="Image actuelle" 
                            className="w-full h-32 object-cover rounded-lg"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB: DESCRIPTION */}
                {activeTab === "description" && (
                  <div className="space-y-6 animate-fadeIn">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        placeholder="Décrivez le véhicule en détail (état, équipements, historique, etc.)..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        rows={10}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition resize-none bg-gray-50 font-sans"
                      />
                      <p className="text-xs text-gray-500 mt-2">📝 Soyez détaillé pour attirer plus de clients</p>
                    </div>
                  </div>
                )}
              </div>

              {/* BOUTONS D'ACTION */}
              <div className="border-t border-gray-200 bg-gray-50 p-8 flex gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                  {submitting ? "⏳ Mise à jour en cours..." : "✅ Sauvegarder les modifications"}
                </button>
                <Link
                  href="/admin/annonces"
                  className="px-6 py-4 bg-gray-200 text-gray-800 font-bold rounded-xl hover:bg-gray-300 transition border-2 border-gray-300 text-lg text-center"
                >
                  ❌ Annuler
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
