import express from "express";
import {
  createAccount,
  getAccounts,
  getAccount,
  updateAccount,
  deleteAccount,
} from "../controller/accountController.js";

const router = express.Router();

router.route("/").post(createAccount).get(getAccounts);

router
  .route("/:id")
  .get(getAccount)
  .put(updateAccount)
  .delete(deleteAccount);

export default router;