import { NextResponse } from "next/server";
import Sale from "@/models/Sale";
import { dbConnect } from "@/lib/mongodb";

interface Params {
  params: { id: string };
}

export async function GET(req: Request, { params }: Params) {
  await dbConnect();
  const sale = await Sale.findById(params.id).populate("carId");
  if (!sale) return NextResponse.json({ error: "Vente non trouvée" }, { status: 404 });
  return NextResponse.json(sale);
}

export async function PUT(req: Request, { params }: Params) {
  await dbConnect();
  const data = await req.json();
  const updatedSale = await Sale.findByIdAndUpdate(params.id, data, { new: true });
  if (!updatedSale) return NextResponse.json({ error: "Vente non trouvée" }, { status: 404 });
  return NextResponse.json(updatedSale);
}

export async function DELETE(req: Request, { params }: Params) {
  await dbConnect();
  const deletedSale = await Sale.findByIdAndDelete(params.id);
  if (!deletedSale) return NextResponse.json({ error: "Vente non trouvée" }, { status: 404 });
  return NextResponse.json({ message: "Vente supprimée avec succès" });
}
