// Role-Based Authorization Middleware

export const isAdmin = (req, res, next) => {
  if (req.role !== "admin") {
    return res.status(403).json({ message: "Not authorized as admin" });
  }
  next();
};

export const isRestaurant = (req, res, next) => {
  if (req.role !== "restaurant") {
    return res.status(403).json({ message: "Not authorized as restaurant" });
  }
  next();
};

export const isDeliveryPartner = (req, res, next) => {
  if (req.role !== "delivery-partner") { // ✅ fixed role string
    return res.status(403).json({ message: "Not authorized as delivery partner" });
  }
  next();
};

export const isUser = (req, res, next) => {
  if (req.role !== "user") {
    return res.status(403).json({ message: "Not authorized as user" });
  }
  next();
};
