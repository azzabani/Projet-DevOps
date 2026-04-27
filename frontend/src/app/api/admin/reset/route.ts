import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from "@/lib/mongodb";
import Commande from '@/models/Commande';
import Product from '@/models/Product';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // 1. Supprimer toutes les commandes
    const deleteResult = await Commande.deleteMany({});
    console.log(`✅ ${deleteResult.deletedCount} commande(s) supprimée(s)`);

    // 2. Remettre tous les produits en état "Disponible" (puisqu'il n'y a plus de commandes)
    const updateResult = await Product.updateMany(
      {}, // Tous les produits
      { 
        $set: { 
          etat: "Disponible"
        },
        $unset: { commandeId: "" } // Supprimer le champ commandeId s'il existe
      }
    );
    console.log(`✅ ${updateResult.modifiedCount} produit(s) remis en "Disponible"`);

    return NextResponse.json({
      success: true,
      message: 'Réinitialisation réussie',
      details: {
        commandesSupprimees: deleteResult.deletedCount,
        produitsRemisDisponible: updateResult.modifiedCount + updateAllResult.modifiedCount
      }
    });
  } catch (error: any) {
    console.error('❌ Erreur lors de la réinitialisation:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Erreur lors de la réinitialisation', 
        details: error.message || 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}

