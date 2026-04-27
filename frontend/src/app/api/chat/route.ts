import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    // Appel à ton backend Flask
    const flaskResponse = await fetch("http://127.0.0.1:5000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const data = await flaskResponse.json();

    // data devrait contenir { reply: "..." } ou { error: "..." }
    if (data.reply) {
      return NextResponse.json({ reply: data.reply });
    } else {
      return NextResponse.json({ reply: "Erreur backend Flask : " + (data.error || "inconnue") });
    }
  } catch (error) {
    console.error("Erreur Next.js -> Flask :", error);
    return NextResponse.json({ reply: "Erreur serveur Next.js." });
  }
}
