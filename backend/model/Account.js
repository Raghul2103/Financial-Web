import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["bank", "cash"], required: true },
    balance: { type: Number, default: 0 },
    note: String,
  },
  { timestamps: true }
);

export default mongoose.model("Account", accountSchema);