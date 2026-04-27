"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Footer from "@/app/api/components/Footer";

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

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(Array.isArray(data) ? data.slice(0, 6) : []);
      } catch (err) {
        console.error("Erreur lors du fetch des produits :", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen text-black">
      {/* HERO SECTION */}
      <section
        className="relative h-[80vh] md:h-screen bg-cover bg-center flex flex-col justify-center items-center text-black overflow-hidden"
        style={{
          backgroundImage: "url('/assets/1.png')",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-amber-800/20 to-orange-900/25"></div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="glass-strong rounded-3xl p-8 md:p-12 mb-8 shadow-2xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg text-amber-900" suppressHydrationWarning>
              Auto Excellence Showroom
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-black" suppressHydrationWarning>
              Trouvez la voiture de vos rêves parmi nos véhicules disponibles
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="px-8 py-4 rounded-xl text-white font-bold text-lg shadow-lg transition transform hover:scale-105 bg-gradient-to-r from-amber-500 to-orange-500"
            >
              🚗 Voir nos véhicules
            </Link>
            <Link
              href="#avantages"
              className="glass-button px-8 py-4 rounded-xl font-bold text-lg shadow-lg text-amber-900"
            >
              ℹ️ En savoir plus
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 z-10 animate-bounce glass-button rounded-full p-3">
          <svg className="w-6 h-6 text-amber-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* VOITURES EN VEDETTE */}
      <section className="py-16 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="glass-strong rounded-2xl p-6 inline-block">
              <h2 className="text-4xl font-bold mb-4 text-black">🏆 Nos véhicules en vedette</h2>
              <p className="text-lg text-black opacity-90">Découvrez notre sélection des meilleures offres</p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="glass-strong rounded-full p-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((p) => (
                <div
                  key={p._id}
                  className="glass-card rounded-2xl hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                >
                  {/* IMAGE */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.marque}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 glass-strong text-amber-900 px-4 py-2 rounded-full font-bold shadow-lg">
                      {p.prix.toLocaleString()} €
                    </div>
                    {p.etat === "Vendu" && (
                      <div className="absolute inset-0 bg-red-600/80 backdrop-blur-sm flex items-center justify-center">
                        <p className="text-white text-2xl font-bold">VENDU</p>
                      </div>
                    )}
                  </div>

                  {/* CONTENU */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-amber-900 mb-2">{p.marque}</h3>
                    <p className="text-black text-sm mb-4 line-clamp-2">{p.description}</p>

                    {/* BADGES */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="glass-button text-xs font-semibold px-3 py-1 rounded-full text-amber-900">
                        📍 {p.kilometrage.toLocaleString()} km
                      </span>
                      <span className="glass-button text-xs font-semibold px-3 py-1 rounded-full text-amber-900">
                        ⛽ {p.carburant}
                      </span>
                    </div>

                    {/* BOUTON */}
                    <Link
                      href={`/products/${p._id}`}
                      className="block text-center w-full py-3 rounded-xl font-semibold transition bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black shadow-md"
                    >
                      Voir détails
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-block px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition transform hover:scale-105 bg-gradient-to-r from-amber-500 to-orange-500 text-white"
            >
              Voir tous les véhicules
            </Link>
          </div>
        </div>
      </section>

      {/* AVANTAGES */}
      <section id="avantages" className="py-16 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="glass-strong rounded-2xl p-6 inline-block">
              <h2 className="text-4xl font-bold mb-4 text-black">✨ Pourquoi nous choisir ?</h2>
              <p className="text-lg text-black opacity-90">Auto Excellence Showroom vous offre les meilleures garanties</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card rounded-2xl p-8 hover:shadow-xl transition border-l-4 border-amber-400">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-2xl font-bold text-amber-900 mb-3">Qualité garantie</h3>
              <p className="text-black">
                Contrôle qualité 120 points et garantie minimum 6 mois sur véhicules d'occasion.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-8 hover:shadow-xl transition border-l-4 border-green-400">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-amber-900 mb-3">Livraison rapide</h3>
              <p className="text-black">
                Livraison à domicile en 24-72h partout en Tunisie avec service professionnel.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-8 hover:shadow-xl transition border-l-4 border-yellow-400">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-amber-900 mb-3">Service client 24/7</h3>
              <p className="text-black">
                Notre équipe de 27 experts est toujours disponible pour répondre à vos questions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-16 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="glass-strong rounded-2xl p-6 inline-block">
              <h2 className="text-4xl font-bold mb-4 text-black">🛠️ Nos services</h2>
              <p className="text-black">Bien plus qu'une simple vente automobile</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card rounded-xl p-6 hover:bg-white transition">
              <div className="text-3xl mb-3">🔧</div>
              <h4 className="font-bold mb-2 text-black">Service mécanique</h4>
              <p className="text-black text-sm">Diagnostic et entretien complet</p>
            </div>

            <div className="glass-card rounded-xl p-6 hover:bg-white transition">
              <div className="text-3xl mb-3">💰</div>
              <h4 className="font-bold mb-2 text-black">Financement</h4>
              <p className="text-black text-sm">Via nos partenaires bancaires</p>
            </div>

            <div className="glass-card rounded-xl p-6 hover:bg-white transition">
              <div className="text-3xl mb-3">🚗</div>
              <h4 className="font-bold mb-2 text-black">Leasing</h4>
              <p className="text-black text-sm">Pour entreprises et particuliers</p>
            </div>

            <div className="glass-card rounded-xl p-6 hover:bg-white transition">
              <div className="text-3xl mb-3">📋</div>
              <h4 className="font-bold mb-2 text-black">Admin</h4>
              <p className="text-black text-sm">Assistance administratif complète</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 px-4 relative">
        <div className="max-w-3xl mx-auto">
          <div className="glass-strong rounded-3xl p-12 text-center">
            <h2 className="text-4xl font-bold mb-6 text-black">🎯 Prêt à trouver votre voiture ?</h2>
            <p className="text-black text-lg mb-8">
              Explorez notre sélection de plus de 85 véhicules soigneusement sélectionnés.
            </p>
            <Link
              href="/products"
              className="inline-block px-8 py-4 rounded-xl text-white font-bold text-lg shadow-lg transition transform hover:scale-105 bg-gradient-to-r from-amber-500 to-orange-500"
            >
              Parcourir les véhicules →
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER INFO */}
      <Footer />
    </div>
  );
}
