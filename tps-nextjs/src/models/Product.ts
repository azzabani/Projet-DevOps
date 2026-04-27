import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  _id: string;
  marque: string;
  description: string;
  prix: number;
  etat: string;
  kilometrage: number;
  carburant: string;
  image: string; // Image principale
  images?: string[]; // Tableau d'images supplémentaires
  annee?: number;
  couleur?: string;
  transmission?: string;
  puissance?: number;
  portes?: number;
  siege?: number;
}

const ProductSchema = new Schema<IProduct>({
  marque: { type: String, required: true },
  description: { type: String, required: true },
  prix: { type: Number, required: true },
  etat: { type: String, required: true },
  kilometrage: { type: Number, required: true },
  carburant: { type: String, required: true },
  image: { type: String, required: true }, // Image principale
  images: { type: [String], default: [] }, // Images supplémentaires
  annee: { type: Number },
  couleur: { type: String },
  transmission: { type: String },
  puissance: { type: Number },
  portes: { type: Number },
  siege: { type: Number }
}, {
  timestamps: true
});

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);