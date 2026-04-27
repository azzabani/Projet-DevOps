"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{success: boolean, message?: string, details?: any} | null>(null);

  const handleReset = async () => {
    if (!confirm("⚠️ Êtes-vous sûr de vouloir réinitialiser toutes les données ?\n\nCette action va :\n- Supprimer TOUTES les commandes\n- Remettre TOUS les véhicules en 'Disponible'\n\nCette action est irréversible !")) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/admin/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setResult({
          success: true,
          message: "Réinitialisation réussie !",
          details: data.details
        });
      } else {
        setResult({
          success: false,
          message: data.error || "Erreur lors de la réinitialisation"
        });
      }
    } catch (error) {
      console.error("Erreur:", error);
      setResult({
        success: false,
        message: "Une erreur est survenue lors de la réinitialisation"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/admin/sync-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setResult({
          success: true,
          message: "Synchronisation réussie !",
          details: data.details
        });
      } else {
        setResult({
          success: false,
          message: data.error || "Erreur lors de la synchronisation"
        });
      }
    } catch (error) {
      console.error("Erreur:", error);
      setResult({
        success: false,
        message: "Une erreur est survenue lors de la synchronisation"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-50 rounded-2xl shadow-lg p-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-black mb-6">
            🔄 Réinitialisation des Données
          </h1>

          <div className="bg-blue-50 border-2 border-blue-400 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold text-black mb-2">ℹ️ Synchronisation automatique</p>
                <p className="text-sm text-black">
                  Les statuts des véhicules sont maintenant synchronisés automatiquement :
                </p>
                <ul className="text-sm text-black list-disc list-inside space-y-1 mt-2">
                  <li><strong>"Disponible"</strong> : Le véhicule n'a aucune commande</li>
                  <li><strong>"Vendu"</strong> : Le véhicule a au moins une commande</li>
                </ul>
                <p className="text-sm text-blue-700 mt-3">
                  💡 Utilisez le bouton "Synchroniser les statuts" pour mettre à jour manuellement tous les statuts selon les commandes actuelles.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="font-semibold text-black mb-2">⚠️ Attention - Réinitialisation !</p>
                <p className="text-sm text-black mb-2">
                  Cette action va :
                </p>
                <ul className="text-sm text-black list-disc list-inside space-y-1">
                  <li>Supprimer <strong>TOUTES</strong> les commandes de la base de données</li>
                  <li>Remettre <strong>TOUS</strong> les véhicules en état "Disponible"</li>
                </ul>
                <p className="text-sm text-red-600 font-semibold mt-3">
                  ⚠️ Cette action est irréversible !
                </p>
              </div>
            </div>
          </div>

          {result && (
            <div className={`mb-6 rounded-xl p-6 border-2 ${
              result.success 
                ? "bg-green-50 border-green-400" 
                : "bg-red-50 border-red-400"
            }`}>
              <div className="flex items-start gap-3">
                {result.success ? (
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                <div>
                  <p className={`font-semibold mb-2 ${result.success ? "text-green-800" : "text-red-800"}`}>
                    {result.success ? "✅ Succès" : "❌ Erreur"}
                  </p>
                  <p className={`text-sm ${result.success ? "text-green-700" : "text-red-700"}`}>
                    {result.message}
                  </p>
                  {result.success && result.details && (
                    <div className="mt-3 text-sm text-green-700">
                      {result.details.commandesSupprimees !== undefined && (
                        <>
                          <p>• {result.details.commandesSupprimees} commande(s) supprimée(s)</p>
                          <p>• {result.details.produitsRemisDisponible} véhicule(s) remis en "Disponible"</p>
                        </>
                      )}
                      {result.details.produitsMarquesVendus !== undefined && (
                        <>
                          <p>• {result.details.produitsMarquesVendus} véhicule(s) marqué(s) comme "Vendu"</p>
                          <p>• {result.details.produitsMarquesDisponibles} véhicule(s) marqué(s) comme "Disponible"</p>
                          <p>• {result.details.totalCommandes} commande(s) trouvée(s)</p>
                          <p>• {result.details.totalProduits} véhicule(s) au total</p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex gap-4">
              <button
                onClick={handleSync}
                disabled={loading}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold text-white transition ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Synchronisation en cours...
                  </span>
                ) : (
                  "🔄 Synchroniser les statuts"
                )}
              </button>
              <button
                onClick={() => router.push("/admin")}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-black rounded-lg font-semibold transition"
              >
                Annuler
              </button>
            </div>
            
            <div className="border-t border-gray-300 pt-4">
              <p className="text-sm text-black mb-4 font-semibold">Zone de danger :</p>
              <button
                onClick={handleReset}
                disabled={loading}
                className={`w-full px-6 py-3 rounded-lg font-semibold text-white transition ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Réinitialisation en cours...
                  </span>
                ) : (
                  "🗑️ Réinitialiser toutes les données"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

