import jwt from "jsonwebtoken";
import User from "../model/User.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Admin only access" });
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};