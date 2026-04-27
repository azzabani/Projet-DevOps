import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Product from "@/models/Product";
import Commande from "@/models/Commande";

// Fonction pour synchroniser les statuts des produits selon les commandes
async function syncProductStatuses() {
  await dbConnect();
  
  // Récupérer toutes les commandes
  const commandes = await Commande.find({});
  const produitsAvecCommandes = new Set(commandes.map(c => c.produitId.toString()));

  // Récupérer tous les produits
  const produits = await Product.find({});

  // Mettre à jour chaque produit selon s'il a une commande ou non
  for (const produit of produits) {
    const produitId = produit._id.toString();
    const aUneCommande = produitsAvecCommandes.has(produitId);

    if (aUneCommande && produit.etat !== 'Vendu') {
      // Le produit a une commande mais n'est pas marqué comme "Vendu"
      await Product.findByIdAndUpdate(produitId, {
        etat: 'Vendu'
      });
    } else if (!aUneCommande && produit.etat !== 'Disponible') {
      // Le produit n'a pas de commande mais n'est pas marqué comme "Disponible"
      await Product.findByIdAndUpdate(produitId, {
        etat: 'Disponible',
        $unset: { commandeId: "" }
      });
    }
  }
}

// GET : récupérer toutes les voitures
export async function GET() {
  try {
    await dbConnect();
    
    // Synchroniser les statuts avant de retourner les produits
    await syncProductStatuses();
    
    const products = await Product.find(); // utiliser Product ici
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur serveur lors de la récupération des produits." },
      { status: 500 }
    );
  }
}

// POST : ajouter une nouvelle voiture
export async function POST(req: Request) {
  try {
    await dbConnect();

    const { marque, description, prix, etat, kilometrage, carburant, image } = await req.json();

    if (!marque || !description || !prix || !kilometrage || !image) {
      return NextResponse.json(
        { error: "Tous les champs obligatoires doivent être remplis." },
        { status: 400 }
      );
    }

    const newProduct = await Product.create({
      marque,
      description,
      prix,
      etat: etat || "neuf",
      kilometrage,
      carburant: carburant || "essence",
      image,
      sold: false, // par défaut la voiture n'est pas vendue
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur serveur lors de la création du produit." },
      { status: 500 }
    );
  }
}
