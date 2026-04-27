import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { dbConnect } from "@/lib/mongodb";
import Product from '@/models/Product';

export async function POST(request: NextRequest) {
  console.log('🔵 [create-checkout] Début de la requête');
  
  try {
    // Vérifier que la clé Stripe est configurée
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('❌ STRIPE_SECRET_KEY non configurée');
      return NextResponse.json(
        { error: 'Configuration Stripe manquante. Veuillez configurer STRIPE_SECRET_KEY dans .env.local' },
        { status: 500 }
      );
    }
    
    console.log('✅ STRIPE_SECRET_KEY configurée (longueur:', process.env.STRIPE_SECRET_KEY.length, ')');

    // Initialiser Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia',
    });

    let body;
    try {
      body = await request.json();
      console.log('✅ Body reçu:', { productId: body.productId, marque: body.marque, prix: body.prix, clientEmail: body.client?.email });
    } catch (parseError) {
      console.error('❌ Erreur parsing JSON:', parseError);
      return NextResponse.json(
        { error: 'Données JSON invalides', details: parseError instanceof Error ? parseError.message : 'Erreur inconnue' },
        { status: 400 }
      );
    }

    const { productId, marque, prix, client } = body;
    console.log('📦 Données extraites:', { productId, marque, prix, hasClient: !!client });

    if (!productId || !marque || !prix || !client) {
      return NextResponse.json(
        { error: 'Données manquantes', details: { productId: !!productId, marque: !!marque, prix: !!prix, client: !!client } },
        { status: 400 }
      );
    }

    // Vérifier que le produit existe et n'est pas vendu
    try {
      console.log('🔌 Connexion à MongoDB...');
      await dbConnect();
      console.log('✅ MongoDB connecté');
    } catch (dbError: any) {
      console.error('❌ Erreur connexion MongoDB:', dbError);
      return NextResponse.json(
        { error: 'Erreur de connexion à la base de données', details: dbError.message },
        { status: 500 }
      );
    }

    let product;
    try {
      console.log('🔍 Recherche produit ID:', productId);
      product = await Product.findById(productId);
      console.log('✅ Produit trouvé:', product ? { marque: product.marque, etat: product.etat } : 'null');
    } catch (productError: any) {
      console.error('❌ Erreur recherche produit:', productError);
      return NextResponse.json(
        { error: 'Erreur lors de la recherche du produit', details: productError.message },
        { status: 500 }
      );
    }
    
    if (!product) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      );
    }

    if (product.etat === 'Vendu') {
      return NextResponse.json(
        { error: 'Ce véhicule a déjà été vendu et n\'est plus disponible' },
        { status: 400 }
      );
    }

    // Validation du prix
    if (typeof prix !== 'number' || prix <= 0) {
      return NextResponse.json(
        { error: 'Prix invalide', details: { prix } },
        { status: 400 }
      );
    }

    // Convertir le prix en centimes (Stripe utilise les centimes)
    const amountInCents = Math.round(prix * 100);
    
    if (amountInCents < 50) {
      return NextResponse.json(
        { error: 'Le montant minimum est de 0.50€' },
        { status: 400 }
      );
    }

    // Créer une session Stripe Checkout
    let session;
    try {
      console.log('💳 Création session Stripe Checkout...');
      console.log('📋 Paramètres:', {
        amountInCents,
        currency: 'eur',
        customerEmail: client.email,
        productId
      });
      
      session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: marque,
                description: `Achat du véhicule ${marque}`,
              },
              unit_amount: amountInCents,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        customer_email: client.email,
        metadata: {
          productId: productId,
          clientNom: `${client.prenom || ''} ${client.nom || ''}`.trim(),
          clientEmail: client.email,
          clientTelephone: client.telephone || '',
          clientAdresse: client.adresse || '',
          clientVille: client.ville || '',
          clientCodePostal: client.codePostal || '',
        },
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/commande/${productId}?canceled=true`,
      });
      
      console.log('✅ Session Stripe créée:', { sessionId: session.id, hasUrl: !!session.url });
    } catch (stripeError: any) {
      console.error('❌ Erreur Stripe API:', {
        message: stripeError.message,
        type: stripeError.type,
        code: stripeError.code,
        statusCode: stripeError.statusCode,
        stack: stripeError.stack
      });
      return NextResponse.json(
        { 
          error: 'Erreur lors de la création de la session Stripe', 
          details: stripeError.message || 'Erreur inconnue Stripe',
          type: stripeError.type || 'unknown',
          code: stripeError.code || 'unknown'
        },
        { status: 500 }
      );
    }

    if (!session || !session.url) {
      console.error('❌ Session Stripe créée mais URL manquante:', session);
      return NextResponse.json(
        { error: 'Session créée mais URL de paiement manquante', sessionData: session ? { id: session.id, hasUrl: !!session.url } : 'null' },
        { status: 500 }
      );
    }

    console.log('✅ Réponse finale - Session ID:', session.id, 'URL:', session.url);
    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error: any) {
    console.error('❌ Erreur générale création session Stripe:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    return NextResponse.json(
      { 
        error: 'Erreur lors de la création de la session de paiement', 
        details: error.message || 'Erreur inconnue',
        name: error.name || 'UnknownError',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

