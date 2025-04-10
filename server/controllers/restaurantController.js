import Restaurant from "../models/Restaurant.js";
import FoodItem from "../models/FoodItem.js";
import { generateToken } from "../utils/generateToken.js";

// Register a restaurant
export const registerRestaurant = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;
    const exist = await Restaurant.findOne({ email });
    if (exist) return res.status(400).json({ message: "Restaurant already exists" });

    const image = req.file?.path; // from Cloudinary

    const restaurant = await Restaurant.create({
      name,
      email,
      password,
      address,
      image,
    });

    generateToken(res, restaurant._id, restaurant.role);
    res.status(201).json({ message: "Restaurant registered successfully", restaurant });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login a restaurant
export const loginRestaurant = async (req, res) => {
  try {
    const { email, password } = req.body;
    const restaurant = await Restaurant.findOne({ email });
    if (!restaurant || !(await restaurant.comparePassword(password)))
      return res.status(401).json({ message: "Invalid credentials" });

    generateToken(res, restaurant._id, restaurant.role);
    res.json({ message: "Login successful", restaurant });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logout a restaurant
export const logoutRestaurant = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    res.json({ message: "Restaurant logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get restaurant profile
export const getRestaurantProfile = async (req, res) => {
  const restaurant = await Restaurant.findById(req.userId).select("-password");
  if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
  res.json(restaurant);
};

// Update restaurant profile
export const updateRestaurantProfile = async (req, res) => {
  const restaurant = await Restaurant.findById(req.userId);
  if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

  const { name, address } = req.body;
  restaurant.name = name || restaurant.name;
  restaurant.address = address || restaurant.address;

  if (req.file?.path) {
    restaurant.image = req.file.path;
  }

  await restaurant.save();
  res.json({ message: "Profile updated", restaurant });
};

// Create a food item
export const createFoodItem = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const image = req.file?.path;

    const newFoodItem = new FoodItem({
      name,
      description,
      price,
      category,
      image,
      restaurant: req.userId,
    });

    await newFoodItem.save();
    res.status(201).json({ message: "Food item created successfully", newFoodItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a food item
export const updateFoodItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category } = req.body;

    const foodItem = await FoodItem.findById(id);
    if (!foodItem) return res.status(404).json({ message: "Food item not found" });

    foodItem.name = name || foodItem.name;
    foodItem.description = description || foodItem.description;
    foodItem.price = price || foodItem.price;
    foodItem.category = category || foodItem.category;

    if (req.file?.path) {
      foodItem.image = req.file.path;
    }

    await foodItem.save();
    res.json({ message: "Food item updated", foodItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a food item
export const deleteFoodItem = async (req, res) => {
  try {
    const { id } = req.params;

    const foodItem = await FoodItem.findByIdAndDelete(id);
    if (!foodItem) return res.status(404).json({ message: "Food item not found" });

    res.json({ message: "Food item deleted successfully", foodItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Get all restaurants
export const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().select("-password");
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Delete a restaurant by ID
export const deleteRestaurantByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    await restaurant.deleteOne();
    res.json({ message: "Restaurant deleted successfully", restaurant });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
