import express from "express";
import {
  createPayment,
  transactionNotif,
} from "../controllers/paymentController.js";
import { isAuthenticatedUser } from "../middleware/auth.js";
const router = express.Router();

router.route("/payment/checkout").post(isAuthenticatedUser, createPayment);
router.route("/payment/notification").post(transactionNotif);

export default router;
