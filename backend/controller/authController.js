import User from "../model/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// 🔑 Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// 🍪 Send Token in Cookie
const sendToken = (user, res) => {
  const token = generateToken(user._id);

 res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // ✅ auto switch
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // ✅ key fix
  maxAge: 7 * 24 * 60 * 60 * 1000,
});


  res.json({
    message: "Success",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};

// 📝 Register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 🚫 Check if admin already exists
    const existingAdmin = await User.findOne();
    if (existingAdmin) {
      return res.status(400).json({
        message: "Admin already exists",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: "admin",
    });

    sendToken(user, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔑 Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    sendToken(user, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🚪 Logout
export const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    expires: new Date(0),
  });

  res.json({ message: "Logged out" });
};

// 👤 Get current logged-in admin
export const getMe = async (req, res) => {
  try {
    // req.user comes from middleware
    res.json({
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔄 Update Password
export const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Old password incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};