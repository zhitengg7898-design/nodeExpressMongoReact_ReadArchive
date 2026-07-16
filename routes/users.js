import express from "express";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

// GET /api/users/me
router.get("/me", (req, res) => res.json(req.user));

// GET /api/users/favorites
router.get("/favorites", async (req, res) => {
  const user = await User.findById(req.user._id).populate("favorites");
  res.json(user.favorites);
});

// POST /api/users/favorites  { bookId }
router.post("/favorites", async (req, res) => {
  const { bookId } = req.body;
  if (!bookId) return res.status(400).json({ message: "bookId is required" });
  const user = await User.findById(req.user._id);
  if (user.favorites.includes(bookId)) {
    return res.status(409).json({ message: "Already in favorites" });
  }
  user.favorites.push(bookId);
  await user.save();
  res.status(201).json({ message: "Added to favorites" });
});

// DELETE /api/users/favorites/:bookId
router.delete("/favorites/:bookId", async (req, res) => {
  const user = await User.findById(req.user._id);
  user.favorites = user.favorites.filter(
    (id) => id.toString() !== req.params.bookId,
  );
  await user.save();
  res.json({ message: "Removed from favorites" });
});

// GET /api/users/collections
router.get("/collections", async (req, res) => {
  const user = await User.findById(req.user._id).populate("collections.books");
  res.json(user.collections);
});

// POST /api/users/collections  { name }
router.post("/collections", async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "name is required" });
  const user = await User.findById(req.user._id);
  user.collections.push({ name, books: [] });
  await user.save();
  const created = user.collections[user.collections.length - 1];
  res.status(201).json(created);
});

// PUT /api/users/collections/:colId  { name?, addBook?, removeBook? }
router.put("/collections/:colId", async (req, res) => {
  const user = await User.findById(req.user._id);
  const col = user.collections.id(req.params.colId);
  if (!col) return res.status(404).json({ message: "Collection not found" });

  if (req.body.name) col.name = req.body.name;
  if (req.body.addBook && !col.books.includes(req.body.addBook)) {
    col.books.push(req.body.addBook);
  }
  if (req.body.removeBook) {
    col.books = col.books.filter((id) => id.toString() !== req.body.removeBook);
  }
  await user.save();
  res.json(col);
});

// DELETE /api/users/collections/:colId
router.delete("/collections/:colId", async (req, res) => {
  const user = await User.findById(req.user._id);
  user.collections = user.collections.filter(
    (c) => c._id.toString() !== req.params.colId,
  );
  await user.save();
  res.json({ message: "Collection deleted" });
});

export default router;
