import express from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
  forgotUser,
  resetPassword,
  getUserProfile,
  updatePasswordUser,
  updaUserProfile,
  getAllUsers,
  getUserById,
  updateUserProfileByAdmin,
  deleteUserByAdmin,
  uploadAvatar,
} from "../controllers/authControllers.js";
import { authorizeRoles, isAuthenticatedUser } from "../middleware/auth.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);

router.route("/password/forgot").post(forgotUser);
router.route("/password/reset/:token").put(resetPassword);

router.route("/me").get(isAuthenticatedUser, getUserProfile);
router.route("/password/update").put(isAuthenticatedUser, updatePasswordUser);
router.route("/me/update").put(isAuthenticatedUser, updaUserProfile);
router.route("/me/upload_avatar").put(isAuthenticatedUser, uploadAvatar);

router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);
router
  .route("/admin/users/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getUserById)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserProfileByAdmin)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUserByAdmin);

export default router;
