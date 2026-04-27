import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from "@/lib/mongodb";
import Commande from '@/models/Commande';
import Product from '@/models/Product';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, marque, prix, client } = body;

    // Validation des données
    if (!productId || !marque || !prix || !client) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Données manquantes', 
          details: { 
            productId: !!productId, 
            marque: !!marque, 
            prix: !!prix, 
            client: !!client 
          } 
        },
        { status: 400 }
      );
    }

    // Connexion à MongoDB
    await dbConnect();

    // Vérifier que le produit existe et n'est pas vendu
    const product = await Product.findById(productId);
    
    if (!product) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Produit non trouvé' 
        },
        { status: 404 }
      );
    }

    if (product.etat === 'Vendu') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Ce véhicule a déjà été vendu et n\'est plus disponible' 
        },
        { status: 400 }
      );
    }

    // Validation du prix
    if (typeof prix !== 'number' || prix <= 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Prix invalide', 
          details: { prix } 
        },
        { status: 400 }
      );
    }

    // Créer la commande après paiement simulé réussi
    const nouvelleCommande = new Commande({
      produitId: productId,
      marque: marque,
      prix: prix,
      client: {
        nom: client.nom || '',
        prenom: client.prenom || '',
        email: client.email || '',
        telephone: client.telephone || '',
        adresse: client.adresse || '',
        ville: client.ville || '',
        codePostal: client.codePostal || '',
      },
      statut: 'confirmée', // Statut confirmé après paiement simulé
      paymentStatus: 'paid',
      paidAt: new Date(),
    });

    await nouvelleCommande.save();

    // Marquer le produit comme vendu
    await Product.findByIdAndUpdate(productId, {
      etat: 'Vendu',
      commandeId: nouvelleCommande._id,
    });

    return NextResponse.json({
      success: true,
      commandeId: nouvelleCommande._id.toString(),
      message: 'Paiement traité avec succès (mode test)',
    });
  } catch (error: any) {
    console.error('❌ Erreur traitement paiement virtuel:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Erreur lors du traitement du paiement', 
        details: error.message || 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}


