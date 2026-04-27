import mongoose, { Schema, model, models } from "mongoose";

const SaleSchema = new Schema({
  carId: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true },
  price: { type: Number, required: true },
  soldAt: { type: Date, default: Date.now },
});

const Sale = models.Sale || model("Sale", SaleSchema);
export default Sale;
