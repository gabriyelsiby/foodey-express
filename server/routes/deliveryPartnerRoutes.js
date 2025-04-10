import express from "express";
import { authUser } from "../middlewares/authUser.js";
import { isDeliveryPartner } from "../middlewares/roleMiddleware.js";
import {
  signupDeliveryPartner, // ✅ added
  loginDeliveryPartner,
  logoutDeliveryPartner,
  getDeliveryPartnerProfile,
  updateDeliveryPartnerProfile,
  getAssignedOrders,
  updateOrderStatusByDelivery,
} from "../controllers/deliveryPartnerController.js";

const router = express.Router();

// Public routes
router.post("/signup", signupDeliveryPartner); // ✅ NEW signup route
router.post("/login", loginDeliveryPartner);

// Protected routes
router.post("/logout", authUser, isDeliveryPartner, logoutDeliveryPartner);
router.get("/profile", authUser, isDeliveryPartner, getDeliveryPartnerProfile);
router.put("/profile", authUser, isDeliveryPartner, updateDeliveryPartnerProfile);

// Order management
router.get("/assigned-orders", authUser, isDeliveryPartner, getAssignedOrders);
router.put("/order/:id/status", authUser, isDeliveryPartner, updateOrderStatusByDelivery);

export default router;
