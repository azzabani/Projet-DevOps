import { NextResponse } from "next/server";
import Sale from "@/models/Sale";
import { dbConnect } from "@/lib/mongodb";

export async function GET() {
  await dbConnect();
  const sales = await Sale.find().populate("carId"); // Inclure les infos de la voiture
  return NextResponse.json(sales);
}

export async function POST(req: Request) {
  await dbConnect();
  const data = await req.json();
  const newSale = await Sale.create(data);
  return NextResponse.json(newSale, { status: 201 });
}
