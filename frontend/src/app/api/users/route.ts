import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";

/* ----------------------- GET : Liste des utilisateurs ----------------------- */
export async function GET() {
  await dbConnect();
  try {
    const users = await User.find(); // tous les utilisateurs
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Erreur de chargement" }, { status: 500 });
  }
}

/* ----------------------- POST : Ajouter un utilisateur ---------------------- */
export async function POST(req: Request) {
  await dbConnect();
  try {
    const body = await req.json();

    const user = await User.create(body);

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erreur d’ajout" }, { status: 500 });
  }
}

/* ----------------------- PUT : Modifier un utilisateur ---------------------- */
export async function PUT(req: Request) {
  await dbConnect();
  try {
    const { id, ...updateData } = await req.json();

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: "Erreur de modification" }, { status: 500 });
  }
}

/* ----------------------- DELETE : Supprimer un utilisateur ------------------ */
export async function DELETE(req: Request) {
  await dbConnect();
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID manquant" }, { status: 400 });

    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });

    return NextResponse.json({ message: "Utilisateur supprimé" });
  } catch (error) {
    return NextResponse.json({ error: "Erreur suppression" }, { status: 500 });
  }
}
