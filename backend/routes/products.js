import express from "express";
import {
  canUserReview,
  createProduct,
  createProductReview,
  deleteProduct,
  deleteProductImage,
  deleteProductReview,
  getProductById,
  getProductReview,
  getProducts,
  getProductsByAdmin,
  updateProduct,
  uploadProductImages,
} from "../controllers/productControllers.js";
import { authorizeRoles, isAuthenticatedUser } from "../middleware/auth.js";

const router = express.Router();

// Public Route
router.route("/products").get(getProducts);
router.route("/products/:id").get(getProductById);

// Admin Route
router
  .route("/admin/products")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createProduct)
  .get(isAuthenticatedUser, authorizeRoles("admin"), getProductsByAdmin);

router
  .route("/admin/products/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

router
  .route("/admin/products/:id/upload_images")
  .put(isAuthenticatedUser, authorizeRoles("admin"), uploadProductImages);
router
  .route("/admin/products/:id/delete_image")
  .put(isAuthenticatedUser, authorizeRoles("admin"), deleteProductImage);

router
  .route("/admin/reviews")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProductReview);

// Product review
router
  .route("/reviews")
  .get(isAuthenticatedUser, getProductReview)
  .put(isAuthenticatedUser, createProductReview);

router.route("/can_review").get(isAuthenticatedUser, canUserReview);

export default router;
