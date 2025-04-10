// File: routes/apiRouter.js
import express from "express";
import adminRoutes from "./adminRoutes.js";
import userRoutes from "./userRoutes.js";
import restaurantRoutes from "./restaurantRoutes.js";
import deliveryPartnerRoutes from "./deliveryPartnerRoutes.js";

const router = express.Router();

// Mount each module's routes
router.use("/admin", adminRoutes);
router.use("/user", userRoutes);
router.use("/restaurant", restaurantRoutes);
router.use("/delivery", deliveryPartnerRoutes);

export default router;
