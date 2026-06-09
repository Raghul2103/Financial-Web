import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    password: { type: String, required: true },

    // 🔒 Fixed role
    role: {
      type: String,
      default: "admin",
      immutable: true, // cannot be changed
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;