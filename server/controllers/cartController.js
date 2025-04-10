import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import FoodItem from "../models/FoodItem.js";

// Get user's cart and calculate total price
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.userId }).populate("items.foodItem");

    if (!cart) {
      // Create empty cart if not exists
      cart = await Cart.create({ user: req.userId, items: [] });
    }

    // Calculate total price
    let totalPrice = 0;
    cart.items.forEach(item => {
      totalPrice += item.foodItem.price * item.quantity;
    });

    res.status(200).json({ cart, totalPrice });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { foodItemId, quantity } = req.body;

    const foodItem = await FoodItem.findById(foodItemId);
    if (!foodItem) return res.status(404).json({ message: "Food item not found" });

    let cart = await Cart.findOne({ user: req.userId });

    if (!cart) {
      cart = new Cart({
        user: req.userId,
        items: [{ foodItem: foodItemId, quantity }],
      });
    } else {
      const existingItem = cart.items.find(item => item.foodItem.toString() === foodItemId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ foodItem: foodItemId, quantity });
      }
    }

    await cart.save();
    await cart.populate("items.foodItem");

    res.status(200).json({ message: "Item added to cart", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { foodItemId } = req.params;

    const cart = await Cart.findOne({ user: req.userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(item => item.foodItem.toString() !== foodItemId);

    await cart.save();
    await cart.populate("items.foodItem");

    res.status(200).json({ message: "Item removed from cart", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update item quantity in cart
export const updateCartItem = async (req, res) => {
  try {
    const { foodItemId, quantity } = req.body;

    const cart = await Cart.findOne({ user: req.userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const cartItem = cart.items.find(item => item.foodItem.toString() === foodItemId);
    if (!cartItem) return res.status(404).json({ message: "Food item not found in cart" });

    cartItem.quantity = Math.max(quantity, 1); // Prevent 0 or negative

    await cart.save();
    await cart.populate("items.foodItem");

    res.status(200).json({ message: "Cart item updated", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clear the cart
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];

    await cart.save();
    await cart.populate("items.foodItem");

    res.status(200).json({ message: "Cart cleared", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
