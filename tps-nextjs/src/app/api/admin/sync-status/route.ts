import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from "@/lib/mongodb";
import Commande from '@/models/Commande';
import Product from '@/models/Product';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // Récupérer toutes les commandes
    const commandes = await Commande.find({});
    const produitsAvecCommandes = new Set(commandes.map(c => c.produitId.toString()));

    // Récupérer tous les produits
    const produits = await Product.find({});

    let vendusMisAJour = 0;
    let disponiblesMisAJour = 0;

    // Mettre à jour chaque produit selon s'il a une commande ou non
    for (const produit of produits) {
      const produitId = produit._id.toString();
      const aUneCommande = produitsAvecCommandes.has(produitId);

      if (aUneCommande && produit.etat !== 'Vendu') {
        // Le produit a une commande mais n'est pas marqué comme "Vendu"
        await Product.findByIdAndUpdate(produitId, {
          etat: 'Vendu'
        });
        vendusMisAJour++;
      } else if (!aUneCommande && produit.etat !== 'Disponible') {
        // Le produit n'a pas de commande mais n'est pas marqué comme "Disponible"
        await Product.findByIdAndUpdate(produitId, {
          etat: 'Disponible',
          $unset: { commandeId: "" }
        });
        disponiblesMisAJour++;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Synchronisation réussie',
      details: {
        produitsMarquesVendus: vendusMisAJour,
        produitsMarquesDisponibles: disponiblesMisAJour,
        totalCommandes: commandes.length,
        totalProduits: produits.length
      }
    });
  } catch (error: any) {
    console.error('❌ Erreur lors de la synchronisation:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Erreur lors de la synchronisation', 
        details: error.message || 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}


