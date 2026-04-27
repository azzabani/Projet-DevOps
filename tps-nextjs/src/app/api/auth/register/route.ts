import { NextResponse } from "next/server";
import User from "@/models/User";
import { dbConnect } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const { prenom, nom, email, password } = body;

    // Vérifier si user existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return NextResponse.json(
        { message: "Email déjà utilisé !" },
        { status: 400 }
      );

    // Créer user - le hashing du password se fait automatiquement via le pre('save') middleware
    await User.create({
      prenom,
      nom,
      email,
      password, // Le middleware du modèle va hasher automatiquement
    });

    return NextResponse.json({ message: "Utilisateur créé !" }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

