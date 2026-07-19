import express from "express";
import bcrypt from "bcryptjs";
import passport from "../config/passport.js";
import { getDB } from "../config/db.js";
 
const router = express.Router();

// POST /api/auth/register
router.post("/register", async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "username, email, and password are required" });
  }
  const db = getDB();
  const existing = await db
    .collection("users")
    .findOne({ $or: [{ email }, { username }] });
  if (existing) {
    return res
      .status(409)
      .json({ message: "Username or email already in use" });
  }
  const hashed = await bcrypt.hash(password, 12);
  const now = new Date();
  const { insertedId } = await db.collection("users").insertOne({
    username,
    email,
    password: hashed,
    favorites: [],
    collections: [],
    createdAt: now,
    updatedAt: now,
  });
  const user = {
    _id: insertedId,
    username,
    email,
    favorites: [],
    collections: [],
  };
  req.login(user, (err) => {
    if (err) return next(err);
    res.status(201).json({ user });
  });
});

// POST /api/auth/login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user)
      return res
        .status(401)
        .json({ message: info?.message || "Invalid credentials" });
    req.login(user, (err) => {
      if (err) return next(err);
      const safeUser = { ...user };
      delete safeUser.password;
      res.json({ user: safeUser });
    });
  })(req, res, next);
});

// POST /api/auth/logout
router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ message: "Logged out" });
  });
});

export default router;
