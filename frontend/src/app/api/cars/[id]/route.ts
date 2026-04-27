import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Product from "@/models/Product";

interface Params {
  params: { id: string };
}

// GET : récupérer une voiture par ID
export async function GET(req: Request, { params }: Params) {
  try {
    await dbConnect();
    const product = await Product.findById(params.id);
    if (!product) {
      return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PUT : mettre à jour une voiture (ex: sold = true après achat)
export async function PUT(req: Request, { params }: Params) {
  try {
    await dbConnect();
    const data = await req.json();
    const updatedProduct = await Product.findByIdAndUpdate(params.id, data, { new: true });
    if (!updatedProduct) {
      return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 });
    }
    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE : supprimer une voiture
export async function DELETE(req: Request, { params }: Params) {
  try {
    await dbConnect();
    const deletedProduct = await Product.findByIdAndDelete(params.id);
    if (!deletedProduct) {
      return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 });
    }
    return NextResponse.json({ message: "Voiture supprimée avec succès" });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
