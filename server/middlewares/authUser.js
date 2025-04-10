import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Admin from "../models/Admin.js";
import Restaurant from "../models/Restaurant.js";
import DeliveryPartner from "../models/DeliveryPartner.js";

export const authUser = async (req, res, next) => {
  try {
    // Extract token
    const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];
    console.log("Token:", token);

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Decoded JWT:", decoded);

    let user;

    // Identify user by role
    switch (decoded.role) {
      case "user":
        user = await User.findById(decoded.id);
        break;
      case "admin":
        user = await Admin.findById(decoded.id);
        break;
      case "restaurant":
        user = await Restaurant.findById(decoded.id);
        break;
      case "delivery-partner":
        user = await DeliveryPartner.findById(decoded.id);
        break;
      default:
        return res.status(403).json({ message: "Invalid role in token" });
    }

    console.log("User Found:", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.userId = user._id;
    req.role = decoded.role;

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(401).json({ message: "Token is not valid or expired" });
  }
};
