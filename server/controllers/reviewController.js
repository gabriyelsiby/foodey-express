import Review from "../models/Review.js";
import Order from "../models/Order.js";
import FoodItem from "../models/FoodItem.js";

// Create a new review
export const createReview = async (req, res) => {
  try {
    const userId = req.user._id;
    const { foodItemId, rating, comment } = req.body;

    // Check if the user has ordered this food item
    const hasOrdered = await Order.exists({
      user: userId,
      "items.foodItem": foodItemId,
    });

    if (!hasOrdered) {
      return res.status(403).json({ message: "You can only review food items you have ordered." });
    }

    // Check if already reviewed
    const alreadyReviewed = await Review.findOne({ user: userId, foodItem: foodItemId });
    if (alreadyReviewed) {
      return res.status(400).json({ message: "You have already reviewed this item." });
    }

    // Create review
    const review = await Review.create({
      user: userId,
      foodItem: foodItemId,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Something went wrong while creating review." });
  }
};

// Get reviews for a food item
export const getReviewsByFoodItem = async (req, res) => {
  try {
    const foodItemId = req.params.foodItemId;

    const reviews = await Review.find({ foodItem: foodItemId })
      .populate("user", "name") // Show reviewer's name
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Failed to fetch reviews." });
  }
};
