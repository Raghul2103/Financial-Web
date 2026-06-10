import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

// ✅ CORS (DEV + PROD)
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

if (process.env.FRONTEND_URL) {
  // Normalize by stripping any trailing slash
  const cleanUrl = process.env.FRONTEND_URL.replace(/\/$/, "");
  allowedOrigins.push(cleanUrl);
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or postman)
      if (!origin) {
        return callback(null, true);
      }

      // Check if origin matches allowedOrigins or is a Vercel deployment URL
      const isAllowed = allowedOrigins.includes(origin) || 
        (origin.startsWith("https://") && origin.endsWith(".vercel.app"));

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
    credentials: true,
  })
);

// ✅ COOKIE
app.use(cookieParser());

// ✅ BODY
app.use(express.json());

// DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });

// Routes
import authRoutes from "./routes/authRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/accounts", accountRoutes);
app.use("/api/v1/transactions", transactionRoutes);
app.use("/api/v1/transactions/expense", expenseRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));