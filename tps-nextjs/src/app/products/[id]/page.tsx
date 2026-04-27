"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface Product {
  _id: string;
  marque: string;
  description: string;
  prix: number;
  etat: string;
  kilometrage: number;
  carburant: string;
  image: string; // Image principale
  images?: string[]; // Images supplémentaires
  annee?: number;
  couleur?: string;
  transmission?: string;
  puissance?: number;
  portes?: number;
  siege?: number;
}

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Vérifier l'authentification
  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    if (!token) {
      alert("⚠️ Vous devez vous connecter pour voir les détails d'un véhicule.\n\nVous allez être redirigé vers la page de connexion.");
      router.push("/login");
      return;
    }
  }, [router]);

  // Fonction pour vérifier l'authentification avant d'acheter
  const handleBuyClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
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
    console.log("🔄 Product ID from params:", params.id);
    
    if (!params.id) {
      console.log("❌ No product ID found");
      router.push("/products");
      return;
    }

    const fetchProduct = async () => {
      try {
        console.log(`📡 Fetching product from: /api/products/${params.id}`);
        const res = await fetch(`/api/products/${params.id}`);
        
        console.log("📊 Response status:", res.status);
        
        if (!res.ok) {
          console.error(`❌ API Error: ${res.status}`);
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log("✅ Product data:", data);
        setProduct(data);
      } catch (error) {
        console.error("❌ Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id, router]);

  // Fonction pour obtenir les images spécifiques à la marque
  const getBrandImages = (marque: string, mainImage: string) => {
    const brand = marque.toLowerCase();
    
    // Mappage des marques aux images spécifiques
    const brandImageMap: Record<string, string[]> = {
      'lamborghini': ['/assets/lab.jpg'],
      'ferrari': ['/assets/ferrai.jpg'],
      'porsche': ['/assets/porshe.jpg', '/assets/porshe2.jpg','/assets/prshe3.jpg'],
      'audi': ['/assets/aud.jpg',],
      'mercedes': ['/assets/merce.jpg'],
      'mclaren': ['/assets/mc.jpg', '/assets/mc.jpg', ],
      'rolls royce': ['/assets/Rolls.jpg'],
      'bugatti': ['/assets/lego.jpg']
    };

    // Trouver les images correspondantes
    let specificImages: string[] = [];
    
    for (const [key, images] of Object.entries(brandImageMap)) {
      if (brand.includes(key)) {
        specificImages = images;
        break;
      }
    }

   

    // S'assurer que l'image principale est en première position
    const allImages = [mainImage, ...specificImages.filter(img => img !== mainImage)];
    
    // Limiter à 4 images max
    return allImages.slice(0, 4);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des détails...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Produit non trouvé</h2>
          <p className="text-gray-600 mb-6">Le véhicule demandé n&apos;existe pas.</p>
          <Link 
            href="/products" 
            className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            ← Retour aux véhicules
          </Link>
        </div>
      </div>
    );
  }

  // Obtenir les images spécifiques à cette marque
  const productImages = getBrandImages(product.marque, product.image);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link 
            href="/products" 
            className="inline-flex items-center text-orange-600 hover:text-orange-800 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour aux véhicules
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{product.marque}</h1>
          <p className="text-gray-600 text-lg mt-2">{product.description}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Image principale - GRANDE */}
            <div className="md:w-1/2 p-6">
              <div className="relative h-80 md:h-[500px] rounded-lg overflow-hidden">
                <Image
                  src={productImages[selectedImage]}
                  alt={`${product.marque} - vue ${selectedImage + 1}`}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              
              {/* Miniatures des images de la même marque */}
              <div className="grid grid-cols-4 gap-2 mt-4">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-20 rounded-md overflow-hidden border-2 transition-all ${
                      selectedImage === index 
                        ? "border-orange-500 ring-2 ring-orange-200 scale-105" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.marque} - vue ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 25vw, 12vw"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Détails */}
            <div className="md:w-1/2 p-6">
              <div className="mb-6">
                <div className="text-3xl font-bold text-green-700">
                  {product.prix.toLocaleString()} €
                </div>
                <p className="text-gray-500">Prix TTC</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-gray-600 font-medium">État</span>
                  <span className="font-semibold text-lg">{product.etat}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-gray-600 font-medium">Kilométrage</span>
                  <span className="font-semibold text-lg">{product.kilometrage.toLocaleString()} km</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-gray-600 font-medium">Carburant</span>
                  <span className="font-semibold text-lg">{product.carburant}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-gray-600 font-medium">Prix</span>
                  <span className="font-semibold text-2xl text-green-700">{product.prix.toLocaleString()} €</span>
                </div>
                
                {/* Spécifications supplémentaires */}
                {product.annee && (
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-gray-600 font-medium">Année</span>
                    <span className="font-semibold text-lg">{product.annee}</span>
                  </div>
                )}
                {product.couleur && (
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-gray-600 font-medium">Couleur</span>
                    <span className="font-semibold text-lg">{product.couleur}</span>
                  </div>
                )}
                {product.transmission && (
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-gray-600 font-medium">Transmission</span>
                    <span className="font-semibold text-lg">{product.transmission}</span>
                  </div>
                )}
                {product.puissance && (
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-gray-600 font-medium">Puissance</span>
                    <span className="font-semibold text-lg">{product.puissance} ch</span>
                  </div>
                )}
                {product.portes && (
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-gray-600 font-medium">Portes</span>
                    <span className="font-semibold text-lg">{product.portes}</span>
                  </div>
                )}
                {product.siege && (
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-gray-600 font-medium">Sièges</span>
                    <span className="font-semibold text-lg">{product.siege}</span>
                  </div>
                )}
              </div>

              {/* Description détaillée */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Description complète</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">
                    {product.description} Ce véhicule d&apos;exception est disponible immédiatement 
                    au showroom Auto Excellence. Il a été méticuleusement vérifié et préparé par 
                    nos experts pour garantir une qualité optimale et une expérience de conduite inégalée.
                  </p>
                  
                  <div className="mt-4">
                    <h3 className="font-bold text-gray-900 mb-2">✅ Inclus avec l&apos;achat :</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Garantie 12 mois</span>
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Contrôle technique récent</span>
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Certificat de non-gage</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="space-y-4">
                <Link
                  href={`/commande/${product._id}`}
                  onClick={handleBuyClick}
                  className="block w-full py-4 px-6 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-lg text-center shadow-lg hover:shadow-xl transition"
                >
                  🚗 Acheter maintenant
                </Link>
                
                <button className="block w-full py-3 px-6 border-2 border-orange-600 text-orange-600 hover:bg-orange-50 font-semibold rounded-lg text-center transition">
                  📞 Demander un essai
                </button>
                
                <button className="block w-full py-3 px-6 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-lg text-center transition">
                  ✉️ Contacter le vendeur
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section contact */}
        <div className="mt-8 bg-orange-50 rounded-xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">📞 Contact Auto Excellence</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-gray-900">Téléphone</p>
                <p className="text-gray-600">01 23 45 67 89</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-gray-900">Email</p>
                <p className="text-gray-600">contact@autoexcellence.fr</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-gray-900">Showroom</p>
                <p className="text-gray-600">Tunis - Auto Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}