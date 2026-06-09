import express from "express";
const router = express.Router();

import {
  register,
  login,
  logout,
  updatePassword,
  getMe,
} from "../controller/authController.js";

import { protect } from "../middleware/authMiddleware.js";

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-password", protect, updatePassword);
router.get("/me", protect, getMe);

export default router;