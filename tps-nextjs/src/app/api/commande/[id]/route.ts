import { NextResponse } from "next/server";
import Commande from "@/models/Commande";
import { dbConnect } from "@/lib/mongodb";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const commande = await Commande.findById(params.id);
    
    if (!commande) {
      return NextResponse.json({ error: "Commande non trouvée" }, { status: 404 });
    }

    return NextResponse.json(commande);
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
