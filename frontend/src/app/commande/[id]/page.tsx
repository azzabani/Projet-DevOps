"use client";

import { useState, useEffect } from "react";
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
  image: string;
}

export default function CommandePage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [paymentCanceled, setPaymentCanceled] = useState(false);
  
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: "",
    ville: "",
    codePostal: "",
    acceptConditions: false
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    // Vérifier l'authentification en premier
    const token = localStorage.getItem("token");
    if (!token) {
      alert("⚠️ Vous devez vous connecter pour passer une commande.\n\nVous allez être redirigé vers la page de connexion.");
      router.push("/login");
      return;
    }

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        const data = await res.json();
        
        // Vérifier si le produit est vendu
        if (data.etat === "Vendu") {
          setProduct(null); // Ne pas définir le produit pour afficher le message d'erreur
        } else {
          setProduct(data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du produit:", error);
      } finally {
        setLoading(false);
      }
    };

    // Vérifier si le paiement a été annulé
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("canceled") === "true") {
      setPaymentCanceled(true);
      // Retirer le paramètre de l'URL
      window.history.replaceState({}, "", window.location.pathname);
    }

    fetchProduct();
  }, [params.id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Supprimer l'erreur si l'utilisateur corrige
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Fonction pour remplir le formulaire avec des données de test
  const fillTestData = () => {
    setFormData({
      nom: "Dupont",
      prenom: "Jean",
      email: "jean.dupont@example.com",
      telephone: "0612345678",
      adresse: "123 Rue de la Test",
      ville: "Paris",
      codePostal: "75001",
      acceptConditions: true
    });
    // Supprimer les erreurs
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.nom.trim()) newErrors.nom = "Le nom est obligatoire";
    if (!formData.prenom.trim()) newErrors.prenom = "Le prénom est obligatoire";
    if (!formData.email.trim()) newErrors.email = "L'email est obligatoire";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Email invalide";
    if (!formData.telephone.trim()) newErrors.telephone = "Le téléphone est obligatoire";
    if (!formData.adresse.trim()) newErrors.adresse = "L'adresse est obligatoire";
    if (!formData.ville.trim()) newErrors.ville = "La ville est obligatoire";
    if (!formData.codePostal.trim()) newErrors.codePostal = "Le code postal est obligatoire";
    if (!formData.acceptConditions) newErrors.acceptConditions = "Vous devez accepter les conditions";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    if (!product) {
      alert("Produit non trouvé");
      setSubmitting(false);
      return;
    }

    try {
      // Vérifier une dernière fois que le produit n'est pas vendu
      if (product.etat === "Vendu") {
        alert("Ce véhicule a déjà été vendu. Veuillez choisir un autre véhicule.");
        setSubmitting(false);
        router.push("/products");
        return;
      }

      // Rediriger vers la page de paiement virtuelle
      const orderData = JSON.stringify({
        productId: product._id,
        marque: product.marque,
        prix: product.prix,
        client: formData
      });

      // Encoder les données pour l'URL
      router.push(`/payment/virtual?productId=${product._id}&orderData=${encodeURIComponent(orderData)}`);
    } catch (error: any) {
      console.error("Erreur complète:", error);
      alert(`Une erreur est survenue lors du traitement de votre commande.\n\nErreur: ${error.message || "Erreur inconnue"}\n\nVérifiez la console pour plus de détails.`);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-black">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-gray-50 rounded-3xl p-12 text-center border border-gray-200 shadow-lg">
            <div className="mb-6">
              <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-black mb-4">
              ⚠️ Véhicule déjà vendu
            </h1>
            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6 mb-8">
              <p className="text-lg text-red-800 font-semibold mb-2">
                Ce véhicule a déjà été vendu
              </p>
              <p className="text-red-700">
                Désolé, ce véhicule n'est plus disponible à la vente. Veuillez consulter nos autres véhicules disponibles.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="bg-gray-800 hover:bg-gray-900 px-8 py-4 rounded-xl text-white font-bold transition transform hover:scale-105"
              >
                Voir les véhicules disponibles
              </Link>
              <Link
                href="/"
                className="bg-gray-600 hover:bg-gray-700 px-8 py-4 rounded-xl text-white font-bold transition transform hover:scale-105"
              >
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <div className="bg-gray-100 border-b border-gray-300 text-black py-8 px-4 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <Link href="/products" className="inline-flex items-center text-black hover:text-gray-700 mb-4 transition text-sm">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour aux produits
          </Link>
          <h1 className="text-4xl font-bold text-black">🛒 Finaliser votre commande</h1>
          <p className="text-black mt-2">Complétez le formulaire pour confirmer l'achat</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* RÉCAPITULATIF - SIDEBAR */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-orange-100">
              {/* Image */}
              <div className="relative h-48 bg-gray-100">
                <img
                  src={product.image}
                  alt={product.marque}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Détails */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-black">{product.marque}</h3>
                  <p className="text-sm text-black mt-1">{product.description}</p>
                </div>

                <div className="space-y-2 border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-black">État:</span>
                    <span className="font-semibold text-black">{product.etat}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-black">Kilométrage:</span>
                    <span className="font-semibold text-black">{product.kilometrage.toLocaleString()} km</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-black">Carburant:</span>
                    <span className="font-semibold text-black">{product.carburant}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-black font-semibold">Prix TTC:</span>
                    <span className="text-3xl font-bold text-orange-600">{product.prix.toLocaleString()}€</span>
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-xs text-orange-900">
                  ✅ Livraison gratuite dans toute la région
                </div>
              </div>
            </div>
          </div>

          {/* FORMULAIRE */}
          <div className="lg:col-span-2">
            {paymentCanceled && (
              <div className="mb-6 bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4 flex items-center gap-3">
                <svg className="w-6 h-6 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="font-semibold text-black">Paiement annulé</p>
                  <p className="text-sm text-black">Vous pouvez réessayer en complétant le formulaire ci-dessous.</p>
                </div>
              </div>
            )}
            <form onSubmit={handleSubmit} className="bg-gray-50 rounded-2xl shadow-lg p-8 border-t-4 border-gray-400 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-black">📋 Vos informations</h2>
                <button
                  type="button"
                  onClick={fillTestData}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition transform hover:scale-105 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Remplir avec données de test
                </button>
              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Prénom */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Prénom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    placeholder="Jean"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${
                      errors.prenom ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:border-orange-600 focus:ring-orange-200"
                    }`}
                  />
                  {errors.prenom && <p className="text-red-500 text-xs mt-1">{errors.prenom}</p>}
                </div>

                {/* Nom */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    placeholder="Dupont"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${
                      errors.nom ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:border-orange-600 focus:ring-orange-200"
                    }`}
                  />
                  {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jean@example.com"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${
                      errors.email ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:border-orange-600 focus:ring-orange-200"
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Téléphone */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Téléphone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    placeholder="+33 6 12 34 56 78"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${
                      errors.telephone ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:border-orange-600 focus:ring-orange-200"
                    }`}
                  />
                  {errors.telephone && <p className="text-red-500 text-xs mt-1">{errors.telephone}</p>}
                </div>

                {/* Adresse */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-black mb-2">
                    Adresse <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleChange}
                    placeholder="123 rue de la Paix"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${
                      errors.adresse ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:border-orange-600 focus:ring-orange-200"
                    }`}
                  />
                  {errors.adresse && <p className="text-red-500 text-xs mt-1">{errors.adresse}</p>}
                </div>

                {/* Ville */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Ville <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="ville"
                    value={formData.ville}
                    onChange={handleChange}
                    placeholder="Tunis"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${
                      errors.ville ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:border-orange-600 focus:ring-orange-200"
                    }`}
                  />
                  {errors.ville && <p className="text-red-500 text-xs mt-1">{errors.ville}</p>}
                </div>

                {/* Code Postal */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Code Postal <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="codePostal"
                    value={formData.codePostal}
                    onChange={handleChange}
                    placeholder="1000"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${
                      errors.codePostal ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:border-orange-600 focus:ring-orange-200"
                    }`}
                  />
                  {errors.codePostal && <p className="text-red-500 text-xs mt-1">{errors.codePostal}</p>}
                </div>
              </div>

              {/* Conditions */}
              <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    name="acceptConditions"
                    checked={formData.acceptConditions}
                    onChange={handleChange}
                    className="mt-1 w-5 h-5 text-orange-600 rounded focus:ring-2 focus:ring-orange-200"
                  />
                  <span className="ml-3 text-sm text-black">
                    J'accepte les conditions de vente et je confirme l'achat de ce véhicule <span className="text-red-500">*</span>
                  </span>
                </label>
                {errors.acceptConditions && <p className="text-red-500 text-xs mt-2">{errors.acceptConditions}</p>}
              </div>

              {/* Bouton Submit */}
              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-4 px-6 rounded-lg font-bold text-lg text-white transition shadow-lg ${
                  submitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-orange-600 to-indigo-600 hover:from-orange-700 hover:to-indigo-700 hover:shadow-xl"
                }`}
              >
                {submitting ? "⏳ Redirection vers le paiement..." : "💳 Procéder au paiement"}
              </button>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-center gap-2 text-xs text-black">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Paiement 100% sécurisé</span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}