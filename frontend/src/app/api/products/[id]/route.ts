// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/Product";
import Commande from "@/models/Commande";
import { dbConnect } from "@/lib/mongodb";

// Fonction pour synchroniser le statut d'un produit selon les commandes
async function syncProductStatus(productId: string) {
  await dbConnect();
  
  // Vérifier si ce produit a une commande
  const commande = await Commande.findOne({ produitId: productId });
  const produit = await Product.findById(productId);
  
  if (!produit) return;
  
  if (commande && produit.etat !== 'Vendu') {
    // Le produit a une commande mais n'est pas marqué comme "Vendu"
    await Product.findByIdAndUpdate(productId, {
      etat: 'Vendu'
    });
  } else if (!commande && produit.etat !== 'Disponible') {
    // Le produit n'a pas de commande mais n'est pas marqué comme "Disponible"
    await Product.findByIdAndUpdate(productId, {
      etat: 'Disponible',
      $unset: { commandeId: "" }
    });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    
    console.log("🔍 Recherche produit ID:", id);
    
    // Synchroniser le statut avant de récupérer le produit
    await syncProductStatus(id);
    
    const product = await Product.findById(id);
    
    if (!product) {
      console.log("❌ Produit non trouvé");
      return NextResponse.json(
        { error: "Produit non trouvé" },
        { status: 404 }
      );
    }
    
    // Si le produit n'a pas d'images supplémentaires, en générer selon la marque
    const productData = product.toObject();
    
    if (!productData.images || productData.images.length === 0) {
      const marque = productData.marque.toLowerCase();
      
      // Définir les images par marque
      const brandImages: Record<string, string[]> = {
        'lamborghini': ['/assets/lab.jpg', '/assets/ferrai.jpg', '/assets/mc.jpg'],
        'ferrari': ['/assets/ferrai.jpg', '/assets/lab.jpg', '/assets/mc.jpg'],
        'porsche': ['/assets/porshe.jpg', '/assets/aud.jpg', '/assets/merce.jpg'],
        'audi': ['/assets/aud.jpg', '/assets/merce.jpg', '/assets/porshe.jpg'],
        'mercedes': ['/assets/merce.jpg', '/assets/aud.jpg', '/assets/porshe.jpg'],
        'mclaren': ['/assets/mc.jpg', '/assets/ferrai.jpg', '/assets/lab.jpg'],
        'rolls': ['/assets/Rolls.jpg', '/assets/merce.jpg', '/assets/aud.jpg'],
        'bugatti': ['/assets/lego.jpg', '/assets/ferrai.jpg', '/assets/lab.jpg']
      };
      
      // Trouver les images correspondantes
      for (const [key, images] of Object.entries(brandImages)) {
        if (marque.includes(key)) {
          productData.images = images;
          break;
        }
      }
      
      // Images par défaut
      if (!productData.images) {
        productData.images = ['/assets/1.png', '/assets/aud.jpg', '/assets/merce.jpg'];
      }
    }
    
    console.log("✅ Produit trouvé:", productData.marque);
    console.log("📸 Images:", productData.images);
    
    return NextResponse.json(productData);
    
  } catch (err) {
    console.error("❌ Erreur GET produit:", err);
    return NextResponse.json(
      { error: "Impossible de récupérer le produit" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    
    console.log("🔄 Mise à jour produit:", id);
    
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );
    
    if (!updatedProduct) {
      return NextResponse.json(
        { error: "Produit non trouvé" },
        { status: 404 }
      );
    }
    
    console.log("✅ Produit mis à jour:", updatedProduct._id);
    return NextResponse.json(updatedProduct);
    
  } catch (err) {
    console.error("❌ Erreur PUT produit:", err);
    return NextResponse.json(
      { error: "Impossible de mettre à jour le produit" },
      { status: 500 }
    );
  }
}