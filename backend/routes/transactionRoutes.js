import express from "express";
import {
  addIncome,
  getIncome,
  updateIncome,
  deleteIncome,
  transferAmount,
} from "../controller/transactionController.js";

const router = express.Router();

router.post("/income", addIncome);
router.get("/income", getIncome);

router.put("/:id", updateIncome);
router.delete("/:id", deleteIncome);

router.post("/transfer", transferAmount);

export default router;