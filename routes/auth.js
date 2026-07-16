import express from "express";
import User from "../models/User.js";

const router = express.Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "username, email, and password are required" });
  }
  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) {
    return res
      .status(409)
      .json({ message: "Username or email already in use" });
  }
  const user = await User.create({ username, email, password });
  req.session.userId = user._id.toString();
  res.status(201).json({ user });
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  req.session.userId = user._id.toString();
  res.json({ user });
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out" });
  });
});

export default router;
