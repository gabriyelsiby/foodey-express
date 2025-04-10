import express from "express";
import { authUser } from "../middlewares/authUser.js";
import { isUser } from "../middlewares/roleMiddleware.js";

// 🧑‍💻 User Controller
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";

// 🛒 Cart Controller
import {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
} from "../controllers/cartController.js";

// 📦 Order Controller
import {
  createOrder,
  getUserOrders,
  getOrderDetails,
  cancelOrder,
} from "../controllers/orderController.js";

// 🎟️ Coupon Controller
import {
  getCouponByCode,
} from "../controllers/couponController.js";

// ⭐ Review Controller
import {
  createReview,
  getReviewsByFoodItem,
} from "../controllers/reviewController.js";

const router = express.Router();

// ------------------ Auth Routes ------------------
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// ------------------ Profile Routes ------------------
router.get("/profile", authUser, getUserProfile);
router.put("/profile", authUser, updateUserProfile);

// ------------------ Cart Routes ------------------
router.get("/cart", authUser, getCart);
router.post("/cart", authUser, addToCart);
router.put("/cart", authUser, updateCartItem);
router.delete("/cart/:foodItemId", authUser, removeFromCart);
router.delete("/cart", authUser, clearCart);

// ------------------ Order Routes ------------------
router.post("/orders", authUser, isUser, createOrder);
router.get("/orders", authUser, isUser, getUserOrders);
router.get("/orders/:id", authUser, isUser, getOrderDetails);
router.put("/orders/:id/cancel", authUser, isUser, cancelOrder);

// ------------------ Coupon Routes ------------------
router.get("/coupon/:code", authUser, getCouponByCode);

// ------------------ Review Routes ------------------
router.post("/reviews", authUser, isUser, createReview);           // Create review
router.get("/reviews/:foodItemId", getReviewsByFoodItem);         // Get reviews for a food item

export default router;
