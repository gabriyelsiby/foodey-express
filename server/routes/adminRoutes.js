import express from "express";
import { authUser } from "../middlewares/authUser.js";
import { isAdmin } from "../middlewares/roleMiddleware.js";

import {
  signupAdmin,
  loginAdmin,
  logoutAdmin,
} from "../controllers/adminController.js";

import {
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  getCouponByCode,
} from "../controllers/couponController.js";

import {
  getAllOrders,
  getOrderDetails,
  updateOrderStatus,
  assignDeliveryPartner,
  cancelOrder,
} from "../controllers/orderController.js";

import {
  getAllRestaurants,
  deleteRestaurantByAdmin,
} from "../controllers/restaurantController.js";

const router = express.Router();

// ---------------------- Auth Routes ----------------------
router.post("/signup", signupAdmin);
router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);

// ---------------------- Coupon Routes ----------------------
router.post("/coupon", authUser, isAdmin, createCoupon);
router.delete("/coupon/:id", authUser, isAdmin, deleteCoupon);
router.get("/coupons", authUser, isAdmin, getAllCoupons);
router.get("/coupon/:code", authUser, isAdmin, getCouponByCode);

// ---------------------- Order Routes ----------------------
router.get("/orders", authUser, isAdmin, getAllOrders);
router.get("/orders/:id", authUser, isAdmin, getOrderDetails);
router.put("/orders/:id/status", authUser, isAdmin, updateOrderStatus);
router.put("/orders/:id/assign-delivery", authUser, isAdmin, assignDeliveryPartner);
router.put("/orders/:id/cancel", authUser, isAdmin, cancelOrder);

// ---------------------- Restaurant Routes ----------------------
router.get("/restaurants", authUser, isAdmin, getAllRestaurants);
router.delete("/restaurants/:id", authUser, isAdmin, deleteRestaurantByAdmin);

export default router;
