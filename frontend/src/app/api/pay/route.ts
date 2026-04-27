import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { productId } = await request.json();

    // Appel à ton backend Flask pour créer le paiement ou récupérer l'URL Stripe
    const flaskResponse = await fetch("http://127.0.0.1:5000/pay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId }),
    });

    if (!flaskResponse.ok) {
      return NextResponse.json(
        { error: "Erreur lors de la communication avec Flask" },
        { status: 500 }
      );
    }

    const data = await flaskResponse.json();

    // Retourner la réponse au frontend
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Erreur Next.js -> Flask :", error);
    return NextResponse.json(
      { error: "Erreur serveur", details: error.message },
      { status: 500 }
    );
  }
}
