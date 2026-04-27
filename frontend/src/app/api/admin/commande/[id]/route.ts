import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from "@/lib/mongodb";
import Commande from '@/models/Commande';

// PUT : Mettre à jour le statut d'une commande
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = params;
    const body = await request.json();
    const { statut } = body;

    if (!statut) {
      return NextResponse.json(
        { success: false, message: "Statut requis" },
        { status: 400 }
      );
    }

    // Valider que le statut est valide
    const statutsValides = ['confirmée', 'en cours de livraison', 'livré'];
    if (!statutsValides.includes(statut)) {
      return NextResponse.json(
        { success: false, message: `Statut invalide. Statuts autorisés: ${statutsValides.join(', ')}` },
        { status: 400 }
      );
    }

    const commande = await Commande.findByIdAndUpdate(
      id,
      { statut },
      { new: true }
    );

    if (!commande) {
      return NextResponse.json(
        { success: false, message: "Commande non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Statut mis à jour avec succès",
      commande: {
        _id: commande._id,
        statut: commande.statut
      }
    });

  } catch (error: any) {
    console.error('❌ Erreur mise à jour statut commande:', error);
    
    return NextResponse.json(
      { 
        success: false,
        message: "Erreur lors de la mise à jour du statut",
        error: error.message
      },
      { status: 500 }
    );
  }
}

