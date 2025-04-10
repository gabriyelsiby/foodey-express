import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  foodItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FoodItem",
    required: true,
  },
  quantity: { type: Number, default: 1 },
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [cartItemSchema],
  coupon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coupon",
  },
  totalPrice: { type: Number, default: 0 },
  discountedPrice: { type: Number, default: 0 },
}, { timestamps: true });

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
