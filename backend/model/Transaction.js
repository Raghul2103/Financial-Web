import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["income", "expense", "transfer"],
      required: true,
    },

    amount: { type: Number, required: true },

    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },

    fromAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },

    toAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },

    category: String,
    note: String,
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);