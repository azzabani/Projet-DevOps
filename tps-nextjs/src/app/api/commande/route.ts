import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from "@/lib/mongodb";
import Commande from '@/models/Commande';

export async function POST(request: NextRequest) {
  console.log('🟡 API Commande appelée');
  
  try {
    await dbConnect();
    const body = await request.json();
    
    console.log('📝 Données commande:', {
      produitId: body.produitId,
      marque: body.marque,
      prix: body.prix,
      clientNom: body.client?.nom
    });

    const { produitId, marque, prix, client } = body;

    // Validation simple
    if (!produitId || !marque || !prix || !client) {
      return NextResponse.json(
        { 
          success: false,
          message: "Données manquantes",
          details: { produitId, marque, prix, hasClient: !!client }
        },
        { status: 400 }
      );
    }

    // Créer la commande
    const nouvelleCommande = new Commande({
      produitId,
      marque,
      prix,
      client: {
        nom: client.nom || '',
        prenom: client.prenom || '',
        email: client.email || '',
        telephone: client.telephone || '',
        adresse: client.adresse || '',
        ville: client.ville || '',
        codePostal: client.codePostal || '',
      },
      statut: 'en_attente'
    });

    await nouvelleCommande.save();
    
    console.log('✅ Commande créée:', nouvelleCommande._id);

    return NextResponse.json({
      success: true,
      message: "Commande créée avec succès",
      commande: {
        _id: nouvelleCommande._id,
        marque: nouvelleCommande.marque,
        prix: nouvelleCommande.prix,
        client: nouvelleCommande.client,
        statut: nouvelleCommande.statut,
        dateCommande: nouvelleCommande.dateCommande
      }
    });

  } catch (error: any) {
    console.error('❌ Erreur création commande:', error);
    
    return NextResponse.json(
      { 
        success: false,
        message: "Erreur lors de la création de la commande",
        error: error.message,
        details: error.errors || 'Pas de détails'
      },
      { status: 500 }
    );
  }
}

/* ----------------------- GET : Récupérer les commandes par email ----------------------- */
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Récupérer l'email depuis les paramètres de requête
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email requis" },
        { status: 400 }
      );
    }

    // Récupérer toutes les commandes pour cet email (l'email est dans client.email)
    const commandes = await Commande.find({ "client.email": email }).sort({ dateCommande: -1 });

    return NextResponse.json(commandes);
  } catch (error) {
    console.error("Erreur API commandes:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des commandes" },
      { status: 500 }
    );
  }
}