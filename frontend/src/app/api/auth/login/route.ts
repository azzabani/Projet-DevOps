import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { dbConnect } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // -------------------------
    
    // 🔐 ADMIN FIXE (hardcoded)
    // -------------------------
    const ADMIN_EMAIL = "admin@admin.com";
    const ADMIN_PASSWORD = "admin123";

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = jwt.sign(
        { role: "admin", email: ADMIN_EMAIL },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );

      return NextResponse.json(
        { token, role: "admin" },
        { status: 200 }
      );
    }

    // -------------------------
    // 🔐 LOGIN NORMAL (users DB)
    // -------------------------
    await dbConnect();

    const user = await User.findOne({ email });
    if (!user)
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect" },
        { status: 400 }
      );

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid)
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect" },
        { status: 400 }
      );

    const token = jwt.sign(
      { id: user._id, email: user.email, role: "user" },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return NextResponse.json({ token, role: "user" }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
