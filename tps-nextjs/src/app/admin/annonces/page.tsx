"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Car {
  _id: string;
  title: string;
  description?: string;
  prix?: number;
  price?: number;
  image?: string;
  imageUrl?: string;
  marque?: string;
  kilometrage?: number;
  carburant?: string;
  etat?: string;
}

export default function AdminCarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchCars = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setCars(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette annonce ?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });

      if (res.ok) {
        alert("Annonce supprimée !");
        fetchCars();
      } else {
        const error = await res.json();
        alert("Erreur : " + error.error);
      }
    } catch (error) {
      alert("Erreur : " + error);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/annonces/edit/${id}`);
  };

  const handleAdd = () => {
    router.push("/admin/annonces/new");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des annonces...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-indigo-50">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-8 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">📋 Gestion des annonces</h1>
            <p className="text-orange-100 mt-2">Gérez votre inventaire de véhicules</p>
          </div>

          <button
            onClick={handleAdd}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition transform hover:scale-105"
          >
            ➕ Nouvelle annonce
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {cars.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <p className="text-gray-500 text-xl font-medium">Aucune annonce</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map((car) => (
              <div
                key={car._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group"
              >
                {/* IMAGE */}
                <div className="relative h-48 overflow-hidden bg-gray-200">
                  {car.image ? (
                    <Image
                      src={car.image}
                      alt={car.marque || car.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* CONTENU */}
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {car.marque || car.title}
                  </h2>

                  {/* INFOS VEHICULE */}
                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    {car.kilometrage && (
                      <p className="flex items-center">
                        <span className="font-semibold mr-2">📍</span> {car.kilometrage.toLocaleString()} km
                      </p>
                    )}
                    {car.carburant && (
                      <p className="flex items-center">
                        <span className="font-semibold mr-2">⛽</span> {car.carburant}
                      </p>
                    )}
                    {car.etat && (
                      <p className="flex items-center">
                        <span className="font-semibold mr-2">✅</span> 
                        <span className={car.etat === "Vendu" ? "text-red-600 font-bold" : "text-green-600 font-bold"}>
                          {car.etat === "Vendu" ? "Vendu" : "Disponible"}
                        </span>
                      </p>
                    )}
                  </div>

                  {/* PRIX */}
                  <div className="bg-gradient-to-r from-green-50 to-orange-50 p-3 rounded-lg mb-4 border border-green-200">
                    <p className="text-3xl font-bold text-green-600">
                      {(car.prix ?? car.price)?.toLocaleString() || "—"}€
                    </p>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(car._id)}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition transform hover:scale-105"
                    >
                      ✏️ Modifier
                    </button>

                    <button
                      onClick={() => handleDelete(car._id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold transition transform hover:scale-105"
                    >
                      🗑️ Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
 