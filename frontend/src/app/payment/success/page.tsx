"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const commandeId = searchParams.get("commandeId");
  const [loading, setLoading] = useState(false);
  const [paymentVerified, setPaymentVerified] = useState(true);

  useEffect(() => {
    // Si commandeId est présent, le paiement est déjà vérifié
    if (commandeId) {
      setPaymentVerified(true);
      setLoading(false);
    } else {
      setPaymentVerified(false);
      setLoading(false);
    }
  }, [commandeId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-black border-t-transparent mx-auto mb-4"></div>
          <p className="text-black text-lg font-medium">Vérification du paiement...</p>
        </div>
      </div>
    );
  }

  if (!paymentVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="glass-card rounded-3xl p-12">
            <div className="text-6xl mb-6">❌</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 force-white">Paiement non vérifié</h1>
            <p className="text-gray-700 mb-8 force-white">
              Nous n'avons pas pu vérifier votre paiement. Veuillez contacter le support si vous avez effectué un paiement.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/products"
                className="glass-button px-8 py-3 rounded-xl text-white font-bold hover:bg-white/30 transition force-white"
              >
                Retour aux produits
              </Link>
              <Link
                href="/commande"
                className="glass-button px-8 py-3 rounded-xl text-white font-bold hover:bg-white/30 transition force-white"
              >
                Mes commandes
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4">
      <div className="max-w-3xl mx-auto w-full">
        <div className="bg-gray-50 rounded-3xl p-12 text-center border border-gray-200 shadow-lg">
          {/* Icône de succès */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Titre */}
          <h1 className="text-5xl font-bold text-black mb-4">
            🎉 Paiement réussi !
          </h1>
          <p className="text-xl text-black mb-8">
            Votre commande a été confirmée et votre paiement a été traité avec succès.
          </p>

          {/* Informations */}
          {commandeId && (
            <div className="bg-gray-100 rounded-xl p-6 mb-8 text-left border border-gray-300">
              <p className="text-black font-semibold mb-2">
                Numéro de commande :
              </p>
              <p className="text-2xl font-bold text-green-600">
                {commandeId}
              </p>
              <p className="text-sm text-black mt-4">
                Vous recevrez un email de confirmation à l'adresse fournie.
              </p>
            </div>
          )}

          {/* Prochaines étapes */}
          <div className="bg-gray-100 rounded-xl p-6 mb-8 border border-gray-300">
            <h2 className="text-xl font-bold text-black mb-4">Prochaines étapes :</h2>
            <ul className="text-left space-y-2 text-black">
              <li className="flex items-start">
                <span className="mr-2">📧</span>
                <span>Vous recevrez un email de confirmation sous peu</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">📞</span>
                <span>Notre équipe vous contactera pour organiser la livraison</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">🚗</span>
                <span>Livraison prévue sous 24-72h</span>
              </li>
            </ul>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="bg-gray-800 hover:bg-gray-900 px-8 py-4 rounded-xl text-white font-bold transition transform hover:scale-105"
            >
              Continuer vos achats
            </Link>
            {commandeId && (
              <Link
                href="/commande"
                className="bg-orange-600 hover:bg-orange-700 px-8 py-4 rounded-xl text-white font-bold transition transform hover:scale-105"
              >
                Voir mes commandes
              </Link>
            )}
          </div>

          {/* Contact */}
          <div className="mt-8 pt-8 border-t border-gray-300">
            <p className="text-sm text-black">
              Questions ? Contactez-nous au{" "}
              <a href="tel:+21671123456" className="text-blue-600 hover:underline font-semibold">
                +216 71 123 456
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

