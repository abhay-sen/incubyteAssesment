

import mongoose, { Document } from "mongoose";

export interface ISweet extends Document {
  name: string;
  category: string;
  price: number;
  quantity_in_stock: number;
  createdBy: Record<string, any>; // store user info from JWT as JSON
}

const sweetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    quantity_in_stock: { type: Number, required: true },
    createdBy: { type: Object, required: true }, // store JSON
  },
  { timestamps: true }
);


const Sweet = mongoose.model<ISweet>("Sweet",sweetSchema);
export default Sweet;