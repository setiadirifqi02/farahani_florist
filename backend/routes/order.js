import express from "express";
import {
  confirmedOrderByUser,
  createNewOrder,
  deleteOrderByAdmin,
  getAllOrdersByAdmin,
  getCurrentUserOrder,
  getOrderDetails,
  getSalesByAdmin,
  getUnconfirmUserOrder,
  updateOrderByAdmin,
} from "../controllers/orderContollers.js";
import { authorizeRoles, isAuthenticatedUser } from "../middleware/auth.js";

const router = express.Router();

router.route("/orders/new").post(isAuthenticatedUser, createNewOrder);
router.route("/orders/:id").get(isAuthenticatedUser, getOrderDetails);
router.route("/me/orders").get(isAuthenticatedUser, getCurrentUserOrder);
router
  .route("/me/orders_confirmation")
  .get(isAuthenticatedUser, getUnconfirmUserOrder);
router
  .route("/me/orders_confirmation/:id")
  .put(isAuthenticatedUser, confirmedOrderByUser);

router
  .route("/admin/get_sales")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getSalesByAdmin);

router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrdersByAdmin);
router
  .route("/admin/orders/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrderByAdmin)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrderByAdmin);

export default router;
