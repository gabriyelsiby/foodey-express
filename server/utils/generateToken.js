import jwt from "jsonwebtoken";

/**
 * Generate and set a JWT token cookie
 * @param {Object} res - Express response object
 * @param {String} userId - User's MongoDB _id
 * @param {String} role - User role ('user', 'admin', 'restaurant', 'delivery-partner')
 */
export const generateToken = (res, userId, role) => {
  // Sign token with id and role
  const token = jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" }
  );

  // Set cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use HTTPS in production
    sameSite: "strict", // Prevent CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};
