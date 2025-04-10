import mongoose from "mongoose";

const foodItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String }, // Cloudinary URL
  category: { type: String, required: true },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

const FoodItem = mongoose.model("FoodItem", foodItemSchema);
export default FoodItem;
