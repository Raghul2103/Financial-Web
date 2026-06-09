import express from "express";
import {
  addExpense,
  getExpense,
  updateExpense,
  deleteExpense,
} from "../controller/expenseController.js";

const router = express.Router();

router.post("/", addExpense);
router.get("/", getExpense);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

export default router;