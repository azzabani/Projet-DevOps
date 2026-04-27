import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Commande from "@/models/Commande";

export async function GET() {
  try {
    await dbConnect();

    // Récupérer toutes les commandes (pas de limite pour le dashboard admin)
    const commandes = await Commande.find()
      .sort({ dateCommande: -1 })
      .lean();

    return NextResponse.json(commandes);
  } catch (error) {
    console.error("Erreur ventes récentes:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des ventes" },
      { status: 500 }
    );
  }
}
