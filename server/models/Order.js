// File: models/Order.js
import mongoose from "mongoose";

// Order Schema
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
  foodItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "FoodItem" }],
  status: { type: String, default: "pending" },  // Can be "pending", "completed", "in-progress", etc.
  totalPrice: { type: Number, required: true },
  orderDate: { type: Date, default: Date.now },
  deliveryPartner: { type: mongoose.Schema.Types.ObjectId, ref: "DeliveryPartner" },
});

// Export Order model
const Order = mongoose.model("Order", orderSchema);

export default Order;  // Correctly exporting the Order model as default
