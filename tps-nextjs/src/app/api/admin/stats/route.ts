import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import Product from "@/models/Product";
import Commande from "@/models/Commande";

export async function GET() {
  try {
    await dbConnect();

    // Stats clients - compter TOUS les utilisateurs
    const totalClients = await User.countDocuments();

    // Stats voitures / annonces
    const totalAnnonces = await Product.countDocuments();
    const annoncesDisponibles = await Product.countDocuments({ etat: { $ne: "Vendu" } });
    const annoncesVendues = await Product.countDocuments({ etat: "Vendu" });

    // Stats ventes (commandes)
    const totalVentes = await Commande.countDocuments();
    const totalRevenue = await Commande.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$prix" }
        }
      }
    ]);

    return NextResponse.json({
      totalClients,
      totalAnnonces,
      annoncesDisponibles,
      annoncesVendues,
      totalVentes,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    console.error("Erreur stats:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des statistiques" },
      { status: 500 }
    );
  }
}
