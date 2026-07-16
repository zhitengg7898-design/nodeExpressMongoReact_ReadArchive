import express from "express";
import Book from "../models/Book.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// GET
router.get("/", async (req, res) => {
  const { q, type, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (q) filter.$text = { $search: q };
  if (type) filter.type = type;

  const skip = (Number(page) - 1) * Number(limit);
  const [books, total] = await Promise.all([
    Book.find(filter)
      .populate("submittedBy", "username")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 }),
    Book.countDocuments(filter),
  ]);
  res.json({
    books,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
  });
});

// GET /api/books/:id
router.get("/:id", async (req, res) => {
  const book = await Book.findById(req.params.id).populate(
    "submittedBy",
    "username",
  );
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json(book);
});

// POST /api/books  (auth required)
router.post("/", auth, async (req, res) => {
  const { title, author, type, description, coverImage, links } = req.body;
  if (!title) return res.status(400).json({ message: "title is required" });
  const book = await Book.create({
    title,
    author,
    type,
    description,
    coverImage,
    links,
    submittedBy: req.user._id,
  });
  res.status(201).json(book);
});

// PUT /api/books/:id  (any logged-in user can update)
router.put("/:id", auth, async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: "Book not found" });
  const fields = [
    "title",
    "author",
    "type",
    "description",
    "coverImage",
    "links",
  ];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) book[f] = req.body[f];
  });
  await book.save();
  res.json(book);
});

// DELETE
router.delete("/:id", auth, async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: "Book not found" });
  if (book.submittedBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }
  await book.deleteOne();
  res.json({ message: "Book deleted" });
});

export default router;
