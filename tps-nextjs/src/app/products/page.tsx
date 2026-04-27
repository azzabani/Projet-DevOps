"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Product {
  _id: string;
  marque: string;
  description: string;
  prix: number;
  etat: string;
  kilometrage: number;
  carburant: string;
  image: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>("tous");
  const [selectedFuel, setSelectedFuel] = useState<string>("tous");
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Vérifier l'authentification
  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    if (!token) {
      alert("⚠️ Vous devez vous connecter pour accéder à cette page.\n\nVous allez être redirigé vers la page de connexion.");
      router.push("/login");
      return;
    }
  }, [router]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
        setFilteredProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erreur lors du fetch des produits :", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Fonction pour vérifier l'authentification avant d'acheter
  const handleBuyClick = (e: React.MouseEvent<HTMLAnchorElement>, productId: string) => {
    if (!mounted) {
      e.preventDefault();
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      e.preventDefault();
      alert("⚠️ Vous devez vous connecter pour acheter un véhicule.\n\nVous allez être redirigé vers la page de connexion.");
      router.push("/login");
      return;
    }
    // Si connecté, laisser le lien fonctionner normalement
  };

  useEffect(() => {
    let filtered = products;
    
    if (selectedBrand !== "tous") {
      filtered = filtered.filter(p => p.marque.toLowerCase() === selectedBrand.toLowerCase());
    }
    
    if (selectedFuel !== "tous") {
      filtered = filtered.filter(p => p.carburant.toLowerCase() === selectedFuel.toLowerCase());
    }
    
    setFilteredProducts(filtered);
  }, [selectedBrand, selectedFuel, products]);

  const brands = ["tous", ...new Set(products.map(p => p.marque))];
  const fuels = ["tous", ...new Set(products.map(p => p.carburant))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-800 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold mb-2">Nos Véhicules</h1>
          <p className="text-orange-100 text-lg">Découvrez notre sélection de voitures</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* FILTRES */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-10 border border-orange-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Filtres</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Filtre Marque */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Marque
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 bg-white cursor-pointer text-gray-900 font-medium text-base"
              >
                {brands.map(brand => (
                  <option key={brand} value={brand}>
                    {brand === "tous" ? "Toutes les marques" : brand}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtre Carburant */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Carburant
              </label>
              <select
                value={selectedFuel}
                onChange={(e) => setSelectedFuel(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 bg-white cursor-pointer text-gray-900 font-medium text-base"
              >
                {fuels.map(fuel => (
                  <option key={fuel} value={fuel}>
                    {fuel === "tous" ? "Tous les carburants" : fuel}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* COMPTEUR */}
        <p className="text-gray-600 text-lg mb-8 font-medium">
          {filteredProducts.length} véhicule{filteredProducts.length !== 1 ? 's' : ''} trouvé{filteredProducts.length !== 1 ? 's' : ''}
        </p>

        {/* GRILLE DE PRODUITS */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-md border border-gray-100">
            <p className="text-gray-500 text-xl font-medium">Aucun véhicule ne correspond à votre recherche</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group"
              >
                {/* IMAGE */}
                <div className="relative h-48 overflow-hidden bg-gray-200">
                  <Image
                    src={p.image}
                    alt={p.marque}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-orange-600 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                    {p.prix.toLocaleString()} €
                  </div>
                </div>

                {/* CONTENU */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{p.marque}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{p.description}</p>

                  {/* BADGES */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                      {p.etat}
                    </span>
                    <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-semibold">
                      {p.carburant}
                    </span>
                  </div>

                  {/* INFOS */}
                  <div className="space-y-2 mb-6 pb-6 border-b border-gray-200">
                    <div className="flex items-center text-gray-700">
                      <span className="text-lg mr-2">⚙️</span>
                      <span className="text-sm"><strong>Kilométrage:</strong> {p.kilometrage.toLocaleString()} km</span>
                    </div>
                  </div>

                  {/* BOUTONS */}
                  <div className="flex gap-3">
                    <a
                      href={`/products/${p._id}`}
                      className="flex-1 text-center px-4 py-3 bg-gray-100 text-gray-800 rounded-lg font-semibold hover:bg-gray-200 transition border border-gray-200"
                    >
                      Détails
                    </a>
                    <a
                      href={`/commande/${p._id}`}
                      onClick={(e) => handleBuyClick(e, p._id)}
                      className="flex-1 text-center px-4 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition shadow-md"
                    >
                      Acheter
                    </a>
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
