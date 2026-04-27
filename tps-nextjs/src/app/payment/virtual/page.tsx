"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function VirtualPaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const productId = searchParams.get("productId");
  const orderData = searchParams.get("orderData");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Formatage automatique pour le numéro de carte
    if (name === "cardNumber") {
      const formatted = value.replace(/\s/g, "").replace(/(.{4})/g, "$1 ").trim();
      setCardData(prev => ({ ...prev, [name]: formatted }));
    }
    // Formatage pour la date d'expiration
    else if (name === "expiryDate") {
      const formatted = value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2");
      setCardData(prev => ({ ...prev, [name]: formatted }));
    }
    // Limiter le CVV à 3 chiffres
    else if (name === "cvv") {
      const formatted = value.replace(/\D/g, "").slice(0, 3);
      setCardData(prev => ({ ...prev, [name]: formatted }));
    }
    else {
      setCardData(prev => ({ ...prev, [name]: value }));
    }
    
    // Supprimer l'erreur si l'utilisateur corrige
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!cardData.cardNumber.replace(/\s/g, "")) {
      newErrors.cardNumber = "Le numéro de carte est requis";
    } else if (cardData.cardNumber.replace(/\s/g, "").length < 13) {
      newErrors.cardNumber = "Numéro de carte invalide";
    }
    
    if (!cardData.expiryDate) {
      newErrors.expiryDate = "La date d'expiration est requise";
    } else if (!/^\d{2}\/\d{2}$/.test(cardData.expiryDate)) {
      newErrors.expiryDate = "Format invalide (MM/AA)";
    }
    
    if (!cardData.cvv) {
      newErrors.cvv = "Le CVV est requis";
    } else if (cardData.cvv.length < 3) {
      newErrors.cvv = "CVV invalide";
    }
    
    if (!cardData.cardholderName.trim()) {
      newErrors.cardholderName = "Le nom du titulaire est requis";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setProcessing(true);

    try {
      // Simuler un délai de traitement (2 secondes)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Parser les données de commande depuis l'URL
      let orderDataParsed;
      try {
        orderDataParsed = orderData ? JSON.parse(decodeURIComponent(orderData)) : {};
      } catch (e) {
        console.error("Erreur parsing orderData:", e);
        orderDataParsed = {};
      }

      // Appeler l'API pour créer la commande après paiement simulé
      const response = await fetch("/api/payment/virtual-process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderDataParsed),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Rediriger vers la page de succès
        router.push(`/payment/success?commandeId=${data.commandeId}`);
      } else {
        alert(`Erreur: ${data.error || "Erreur lors du traitement du paiement"}`);
        setProcessing(false);
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur est survenue lors du traitement du paiement.");
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">
            💳 Paiement Sécurisé
          </h1>
        </div>

        {/* Carte bancaire visuelle */}
        <div className="bg-gradient-to-br from-amber-400 via-orange-300 to-yellow-300 rounded-2xl p-8 mb-8 shadow-2xl text-amber-950">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-amber-900/80 text-sm mb-2">Carte</p>
              <div className="flex items-center gap-2">
                <div className="w-12 h-8 bg-white rounded opacity-20"></div>
                <div className="w-8 h-8 bg-yellow-400 rounded opacity-20"></div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-amber-900/80 text-sm mb-2">Expire</p>
              <p className="text-lg font-semibold text-amber-950">{cardData.expiryDate || "MM/AA"}</p>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-amber-900/80 text-sm mb-2">Numéro de carte</p>
            <p className="text-2xl font-mono tracking-wider text-amber-950">
              {cardData.cardNumber || "•••• •••• •••• ••••"}
            </p>
          </div>
          
          <div>
            <p className="text-amber-900/80 text-sm mb-2">Titulaire</p>
            <p className="text-xl font-semibold uppercase text-amber-950">
              {cardData.cardholderName || "NOM DU TITULAIRE"}
            </p>
          </div>
        </div>

        {/* Formulaire */}
        <div className="bg-gray-50 rounded-2xl shadow-lg p-8 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Bloc d'exemple pour aider le client */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-xs text-blue-900 mb-4">
              <p className="font-semibold mb-1">Exemple de carte pour test</p>
              <p>Numéro : <span className="font-mono">4242 4242 4242 4242</span></p>
              <p>Date d&apos;expiration : 12/34</p>
              <p>CVV : 123</p>
              <p>Nom du titulaire : TEST USER</p>
              <button
                type="button"
                className="mt-2 px-3 py-1 rounded-md bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition"
                onClick={() =>
                  setCardData({
                    cardNumber: "4242 4242 4242 4242",
                    expiryDate: "12/34",
                    cvv: "123",
                    cardholderName: "TEST USER",
                  })
                }
              >
                Remplir automatiquement avec l&apos;exemple
              </button>
            </div>
            {/* Nom du titulaire */}
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Nom du titulaire <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="cardholderName"
                value={cardData.cardholderName}
                onChange={handleChange}
                placeholder="JEAN DUPONT"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition uppercase ${
                  errors.cardholderName
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:border-blue-600 focus:ring-blue-200"
                }`}
                disabled={processing}
              />
              {errors.cardholderName && (
                <p className="text-red-500 text-xs mt-1">{errors.cardholderName}</p>
              )}
            </div>

            {/* Numéro de carte */}
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Numéro de carte <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="cardNumber"
                value={cardData.cardNumber}
                onChange={handleChange}
                placeholder="4242 4242 4242 4242"
                maxLength={19}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition font-mono ${
                  errors.cardNumber
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:border-blue-600 focus:ring-blue-200"
                }`}
                disabled={processing}
              />
              {errors.cardNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Date d'expiration */}
              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Date d'expiration <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  value={cardData.expiryDate}
                  onChange={handleChange}
                  placeholder="MM/AA"
                  maxLength={5}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${
                    errors.expiryDate
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-blue-600 focus:ring-blue-200"
                  }`}
                  disabled={processing}
                />
                {errors.expiryDate && (
                  <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>
                )}
              </div>

              {/* CVV */}
              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  CVV <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="cvv"
                  value={cardData.cvv}
                  onChange={handleChange}
                  placeholder="123"
                  maxLength={3}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${
                    errors.cvv
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-blue-600 focus:ring-blue-200"
                  }`}
                  disabled={processing}
                />
                {errors.cvv && (
                  <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
                )}
              </div>
            </div>

            {/* Info de sécurité */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-black flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-amber-900 mb-1">🔒 Paiement sécurisé</p>
                  <p className="text-xs text-amber-900/80">
                    Vos données de paiement sont protégées et traitées sur une interface sécurisée.
                  </p>
                </div>
              </div>
            </div>

            {/* Boutons */}
            <div className="flex gap-4 pt-4">
              <Link
                href={`/commande/${productId || ""}`}
                className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-black rounded-lg font-semibold text-center transition"
              >
                Annuler
              </Link>
              <button
                type="submit"
                disabled={processing}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg font-semibold transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Traitement en cours...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Payer maintenant
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

