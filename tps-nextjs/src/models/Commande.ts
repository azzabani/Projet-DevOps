import mongoose, { Schema } from "mongoose";

const CommandeSchema = new Schema({
  produitId: { type: String, required: true },
  marque: { type: String, required: true },
  prix: { type: Number, required: true },

  client: {
    nom: { type: String, required: true },
    prenom: { type: String },
    email: { type: String, required: true },
    telephone: { type: String, required: true },
    adresse: { type: String },
    ville: { type: String },
    codePostal: { type: String }
  },

  statut: { 
    type: String, 
    default: "confirmée",
    enum: ["confirmée", "en cours de livraison", "livré"]
  },
  dateCommande: { type: Date, default: Date.now },
  paymentId: { type: String },
  paymentStatus: { type: String },
  paidAt: { type: Date }
});

export default mongoose.models.Commande || mongoose.model("Commande", CommandeSchema);
