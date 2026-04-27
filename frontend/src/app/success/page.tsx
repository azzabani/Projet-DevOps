"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [commande, setCommande] = useState<any>(null);

  useEffect(() => {
    const commandeId = searchParams.get('commandeId');

    if (!commandeId) {
      router.push('/');
      return;
    }

    // Récupérer les infos de la commande
    const fetchCommande = async () => {
      try {
        const res = await fetch(`/api/commande/${commandeId}`);
        const data = await res.json();
        
        if (data) {
          setCommande(data);
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error("Erreur récupération commande:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommande();
  }, [searchParams, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-orange-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="mt-4 text-gray-600">Traitement de votre commande...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* SUCCESS CARD */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-t-4 border-green-500">
          
          {/* Header avec succès */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center animate-bounce">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold mb-2">Commande Confirmée! 🎉</h1>
            <p className="text-green-100 text-lg">Merci pour votre achat!</p>
          </div>

          {/* Contenu */}
          <div className="p-8">
            <div className="bg-orange-50 border-l-4 border-orange-600 rounded-lg p-6 mb-8">
              <p className="text-gray-700 text-center">
                <span className="font-bold text-lg">Félicitations!</span> Vous avez acquis le véhicule <span className="text-orange-600 font-bold">{commande?.marque}</span>. 
                Un email de confirmation avec tous les détails a été envoyé à <span className="font-semibold">{commande?.client?.email}</span>.
              </p>
            </div>

            {/* Récapitulatif */}
            {commande && (
              <div className="space-y-6">
                <div className="border-t border-gray-200 pt-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">📋 Récapitulatif de votre commande</h2>
                  
                  <div className="bg-gray-50 rounded-xl p-6 space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600 font-medium">N° de Commande:</span>
                      <span className="font-mono text-orange-600 font-bold">{commande._id}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600 font-medium">Véhicule:</span>
                      <span className="font-semibold text-gray-900">{commande.marque}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600 font-medium">Montant:</span>
                      <span className="text-2xl font-bold text-green-600">
                        {commande.prix ? commande.prix.toLocaleString() : '0'}€
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 font-medium">Statut:</span>
                      <span className="px-4 py-1 bg-green-100 text-green-800 font-bold rounded-full">✅ Confirmée</span>
                    </div>
                  </div>
                </div>

                {/* Infos client */}
                <div className="border-t border-gray-200 pt-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">👤 Informations de livraison</h2>
                  
                  <div className="bg-gray-50 rounded-xl p-6 space-y-2 text-sm">
                    <p><span className="font-semibold text-gray-700">Nom:</span> {commande.client?.prenom} {commande.client?.nom}</p>
                    <p><span className="font-semibold text-gray-700">Email:</span> {commande.client?.email}</p>
                    <p><span className="font-semibold text-gray-700">Téléphone:</span> {commande.client?.telephone}</p>
                    <p><span className="font-semibold text-gray-700">Adresse:</span> {commande.client?.adresse}, {commande.client?.codePostal} {commande.client?.ville}</p>
                  </div>
                </div>

                {/* Prochaines étapes */}
                <div className="border-t border-gray-200 pt-6 bg-orange-50 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-3">📌 Prochaines étapes:</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start">
                      <span className="text-orange-600 font-bold mr-2">1.</span>
                      <span>Vous recevrez un email de confirmation avec tous les documents</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-600 font-bold mr-2">2.</span>
                      <span>Nos équipes vous contacteront pour organiser la livraison</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-600 font-bold mr-2">3.</span>
                      <span>Le véhicule sera livré à votre adresse</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link
                href="/products"
                className="flex-1 py-3 px-6 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition text-center shadow-lg"
              >
                🚗 Voir d'autres véhicules
              </Link>
              
              <Link
                href="/"
                className="flex-1 py-3 px-6 bg-gray-100 text-gray-800 font-bold rounded-xl hover:bg-gray-200 transition text-center border border-gray-300"
              >
                🏠 Retour à l'accueil
              </Link>
            </div>

            {/* Message de contact */}
            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-center text-sm text-yellow-900">
              <p><span className="font-bold">Questions?</span> Contactez-nous au <span className="font-semibold">+216 71 123 456</span> ou à <span className="font-semibold">contact@autoexcellence.tn</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}