import Order from "../models/Order.js";
import User from "../models/User.js";
import Restaurant from "../models/Restaurant.js";
import DeliveryPartner from "../models/DeliveryPartner.js";

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const { user, restaurant, foodItems, totalAmount, address } = req.body;

    const foundUser = await User.findById(user);
    if (!foundUser) return res.status(404).json({ message: "User not found" });

    const foundRestaurant = await Restaurant.findById(restaurant);
    if (!foundRestaurant)
      return res.status(404).json({ message: "Restaurant not found" });

    const order = new Order({
      user,
      restaurant,
      foodItems,
      totalAmount,
      address,
    });

    await order.save();
    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders for a specific user
export const getUserOrders = async (req, res) => {
  try {
    if (req.role !== "user") {
      return res.status(403).json({ message: "Not authorized as user" });
    }

    const orders = await Order.find({ user: req.userId })
      .populate("restaurant", "name")
      .populate("foodItems.food", "name price");

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders for a specific restaurant
export const getRestaurantOrders = async (req, res) => {
  try {
    if (req.role !== "restaurant") {
      return res.status(403).json({ message: "Not authorized as restaurant" });
    }

    const orders = await Order.find({ restaurant: req.restaurantId })
      .populate("user", "name email")
      .populate("foodItems.food", "name price");

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders (admin)
export const getAllOrders = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res.status(403).json({ message: "Not authorized as admin" });
    }

    const orders = await Order.find()
      .populate("user", "name email")
      .populate("restaurant", "name")
      .populate("foodItems.food", "name price");

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get details of a single order
export const getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("restaurant", "name")
      .populate("foodItems.food", "name price")
      .populate("deliveryPartner", "name");

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status (restaurant/admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (req.role !== "admin" && req.role !== "restaurant") {
      return res.status(403).json({ message: "Not authorized" });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Assign delivery partner (admin only)
export const assignDeliveryPartner = async (req, res) => {
  try {
    const { deliveryPartnerId } = req.body;

    if (req.role !== "admin") {
      return res.status(403).json({ message: "Not authorized as admin" });
    }

    const foundDeliveryPartner = await DeliveryPartner.findById(deliveryPartnerId);
    if (!foundDeliveryPartner) {
      return res.status(404).json({ message: "Delivery partner not found" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.deliveryPartner = deliveryPartnerId;
    order.status = "in-progress";
    await order.save();

    res.status(200).json({ message: "Delivery partner assigned", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel an order (user/admin)
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const isUser = req.role === "user" && order.user.toString() === req.userId;
    const isAdmin = req.role === "admin";

    if (!isUser && !isAdmin) {
      return res.status(403).json({ message: "You do not have permission to cancel this order" });
    }

    order.status = "cancelled";
    await order.save();

    res.status(200).json({ message: "Order cancelled successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
