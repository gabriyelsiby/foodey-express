import DeliveryPartner from "../models/DeliveryPartner.js";
import Order from "../models/Order.js";
import { generateToken } from "../utils/generateToken.js";

// ✅ Signup - Delivery Partner
export const signupDeliveryPartner = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await DeliveryPartner.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Delivery partner already exists" });
    }

    const deliveryPartner = await DeliveryPartner.create({
      name,
      email,
      password,
      role: "delivery-partner",
    });

    generateToken(res, deliveryPartner._id, deliveryPartner.role);

    res.status(201).json({
      message: "Delivery partner registered successfully",
      deliveryPartner: {
        id: deliveryPartner._id,
        name: deliveryPartner.name,
        email: deliveryPartner.email,
        role: deliveryPartner.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Login - Delivery Partner
export const loginDeliveryPartner = async (req, res) => {
  try {
    const { email, password } = req.body;

    const deliveryPartner = await DeliveryPartner.findOne({ email });
    if (!deliveryPartner || !(await deliveryPartner.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    generateToken(res, deliveryPartner._id, deliveryPartner.role);

    res.status(200).json({
      message: "Login successful",
      deliveryPartner: {
        id: deliveryPartner._id,
        name: deliveryPartner.name,
        email: deliveryPartner.email,
        role: deliveryPartner.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Logout
export const logoutDeliveryPartner = (req, res) => {
  res.clearCookie("jwt");
  res.json({ message: "Logout successful" });
};

// ✅ Get Profile
export const getDeliveryPartnerProfile = async (req, res) => {
  try {
    const deliveryPartner = await DeliveryPartner.findById(req.userId).select("-password");
    if (!deliveryPartner) {
      return res.status(404).json({ message: "Delivery partner not found" });
    }

    res.json({ deliveryPartner });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update Profile
export const updateDeliveryPartnerProfile = async (req, res) => {
  try {
    const deliveryPartner = await DeliveryPartner.findById(req.userId);
    if (!deliveryPartner) {
      return res.status(404).json({ message: "Delivery partner not found" });
    }

    deliveryPartner.name = req.body.name || deliveryPartner.name;
    deliveryPartner.email = req.body.email || deliveryPartner.email;

    if (req.body.password) {
      deliveryPartner.password = req.body.password; // Will be hashed by pre-save
    }

    await deliveryPartner.save();

    res.json({
      message: "Profile updated successfully",
      deliveryPartner: {
        id: deliveryPartner._id,
        name: deliveryPartner.name,
        email: deliveryPartner.email,
        role: deliveryPartner.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Assigned Orders
export const getAssignedOrders = async (req, res) => {
  try {
    const deliveryPartnerId = req.userId;

    const orders = await Order.find({ deliveryPartner: deliveryPartnerId })
      .populate("restaurant", "name")
      .populate("user", "name email");

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No assigned orders found" });
    }

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update Order Status by Delivery Partner
export const updateOrderStatusByDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.deliveryPartner.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    order.status = status;
    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
