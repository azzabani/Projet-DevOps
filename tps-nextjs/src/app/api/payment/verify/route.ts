import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { dbConnect } from "@/lib/mongodb";
import Commande from '@/models/Commande';
import Product from '@/models/Product';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID manquant' },
        { status: 400 }
      );
    }

    // Récupérer la session Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      await dbConnect();

      const productId = session.metadata?.productId;
      const metadata = session.metadata || {};

      if (!productId) {
        return NextResponse.json({
          success: false,
          error: 'ProductId manquant dans les métadonnées',
        });
      }

      // Vérifier si le produit existe et n'est pas déjà vendu
      const product = await Product.findById(productId);
      if (!product) {
        return NextResponse.json({
          success: false,
          error: 'Produit non trouvé',
        });
      }

      if (product.etat === 'Vendu') {
        return NextResponse.json({
          success: false,
          error: 'Ce produit a déjà été vendu',
        });
      }

      // Créer la commande après paiement réussi
      const nouvelleCommande = new Commande({
        produitId: productId,
        marque: metadata.clientNom ? product.marque : product.marque,
        prix: session.amount_total ? session.amount_total / 100 : product.prix,
        client: {
          nom: metadata.clientNom?.split(' ').slice(-1)[0] || '',
          prenom: metadata.clientNom?.split(' ').slice(0, -1).join(' ') || '',
          email: metadata.clientEmail || session.customer_email || '',
          telephone: metadata.clientTelephone || '',
          adresse: metadata.clientAdresse || '',
          ville: metadata.clientVille || '',
          codePostal: metadata.clientCodePostal || '',
        },
        statut: 'confirmée', // Statut par défaut après paiement réussi
        paymentId: session.payment_intent,
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
        commande: {
          _id: nouvelleCommande._id,
          statut: nouvelleCommande.statut,
          paymentStatus: 'paid',
        },
        paymentStatus: 'paid',
      });
    }

    return NextResponse.json({
      success: false,
      paymentStatus: session.payment_status,
    });
  } catch (error: any) {
    console.error('Erreur vérification paiement:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification du paiement', details: error.message },
      { status: 500 }
    );
  }
}

