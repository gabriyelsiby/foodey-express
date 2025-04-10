import express from "express";
import { authUser } from "../middlewares/authUser.js";
import { isRestaurant } from "../middlewares/roleMiddleware.js";
import { fileUpload } from "../middlewares/fileUpload.js"; // ✅ Correct named import

import {
  registerRestaurant,
  loginRestaurant,
  logoutRestaurant,
  getRestaurantProfile,
  updateRestaurantProfile,
  createFoodItem,
  updateFoodItem,
  deleteFoodItem,
} from "../controllers/restaurantController.js";

import {
  getRestaurantOrders,
  updateOrderStatus,
  cancelOrder,
} from "../controllers/orderController.js";

const router = express.Router();

// ------------------ Auth Routes ------------------
router.post("/register", registerRestaurant);               // Restaurant Register
router.post("/login", loginRestaurant);                     // Restaurant Login
router.post("/logout", authUser, isRestaurant, logoutRestaurant); // Logout

// ------------------ Profile Routes ------------------
router.get("/profile", authUser, isRestaurant, getRestaurantProfile);          // Get profile
router.put("/profile", authUser, isRestaurant, updateRestaurantProfile);       // Update profile

// ------------------ Food Item Management ------------------
router.post("/food", authUser, isRestaurant, fileUpload, createFoodItem);      // Create food item (with image upload)
router.put("/food/:id", authUser, isRestaurant, fileUpload, updateFoodItem);   // Update food item (with image upload)
router.delete("/food/:id", authUser, isRestaurant, deleteFoodItem);            // Delete food item

// ------------------ Order Management ------------------
router.get("/orders", authUser, isRestaurant, getRestaurantOrders);                 // All orders to restaurant
router.put("/orders/:id/status", authUser, isRestaurant, updateOrderStatus);        // Update order status
router.put("/orders/:id/cancel", authUser, isRestaurant, cancelOrder);              // Cancel order

export default router;
