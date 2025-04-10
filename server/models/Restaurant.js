import mongoose from "mongoose";
import bcrypt from "bcrypt";

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: String },
  password: { type: String, required: true },
  cuisine: { type: String },
  image: { type: String }, // logo/photo
  address: { type: String },
  role: { type: String, default: "restaurant" },
}, { timestamps: true });

restaurantSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

restaurantSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
export default Restaurant;
