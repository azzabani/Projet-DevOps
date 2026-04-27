import { NextResponse } from "next/server";
import Product from "@/models/Product";
import Commande from "@/models/Commande";
import { dbConnect } from "@/lib/mongodb"; // Assure-toi d'avoir un fichier pour connecter MongoDB

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

export async function GET() {
  await dbConnect();
  
  // Synchroniser les statuts avant de retourner les produits
  await syncProductStatuses();
  
  const products = await Product.find();
  console.log(products); // affiche dans la console du serveur
  return NextResponse.json(products); // doit retourner un tableau
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    console.log("Corps reçu :", body); // <- Vérifie ce qui arrive
    
    // S'assurer que le statut est "Disponible" par défaut si non spécifié ou si le produit n'a pas de commande
    if (!body.etat) {
      body.etat = "Disponible";
    }
    
    const newProduct = await Product.create(body);
    console.log("Produit créé :", newProduct); // <- Vérifie le produit créé
    return NextResponse.json(newProduct, { status: 201 });
  } catch (err: any) {
    console.error("Erreur création produit :", err); // <- Affiche l'erreur exacte
    return NextResponse.json({ error: err.message || "Impossible de créer le produit" }, { status: 500 });
  }
}

