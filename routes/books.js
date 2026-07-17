import express from "express";
import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// GET /api/books
router.get("/", async (req, res) => {
  const { q, type, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (q) filter.$text = { $search: q };
  if (type) filter.type = type;

  const skip = (Number(page) - 1) * Number(limit);
  const db = getDB();
  const [books, total] = await Promise.all([
    db
      .collection("books")
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .toArray(),
    db.collection("books").countDocuments(filter),
  ]);

  const userIds = [
    ...new Set(books.filter((b) => b.submittedBy).map((b) => b.submittedBy)),
  ];
  const submitters =
    userIds.length > 0
      ? await db
          .collection("users")
          .find({ _id: { $in: userIds } }, { projection: { username: 1 } })
          .toArray()
      : [];
  const submitterMap = Object.fromEntries(
    submitters.map((u) => [u._id.toString(), u]),
  );

  const populated = books.map((b) => ({
    ...b,
    submittedBy: b.submittedBy
      ? (submitterMap[b.submittedBy.toString()] ?? null)
      : null,
  }));

  res.json({
    books: populated,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
  });
});

// GET /api/books/:id
router.get("/:id", async (req, res) => {
  const db = getDB();
  let bookId;
  try {
    bookId = new ObjectId(req.params.id);
  } catch {
    return res.status(404).json({ message: "Book not found" });
  }

  const book = await db.collection("books").findOne({ _id: bookId });
  if (!book) return res.status(404).json({ message: "Book not found" });

  let submittedBy = null;
  if (book.submittedBy) {
    submittedBy = await db
      .collection("users")
      .findOne({ _id: book.submittedBy }, { projection: { username: 1 } });
  }
  res.json({ ...book, submittedBy });
});

// POST /api/books (auth required)
router.post("/", auth, async (req, res) => {
  const { title, author, type, description, coverImage, links } = req.body;
  if (!title) return res.status(400).json({ message: "title is required" });
  const now = new Date();
  const db = getDB();
  const { insertedId } = await db.collection("books").insertOne({
    title,
    author,
    type: type || "book",
    description,
    coverImage,
    links: links || [],
    submittedBy: req.user._id,
    createdAt: now,
    updatedAt: now,
  });
  const book = await db.collection("books").findOne({ _id: insertedId });
  res.status(201).json(book);
});

// PUT /api/books/:id (auth required)
router.put("/:id", auth, async (req, res) => {
  const db = getDB();
  let bookId;
  try {
    bookId = new ObjectId(req.params.id);
  } catch {
    return res.status(404).json({ message: "Book not found" });
  }

  const book = await db.collection("books").findOne({ _id: bookId });
  if (!book) return res.status(404).json({ message: "Book not found" });

  const update = { updatedAt: new Date() };
  for (const f of [
    "title",
    "author",
    "type",
    "description",
    "coverImage",
    "links",
  ]) {
    if (req.body[f] !== undefined) update[f] = req.body[f];
  }
  await db.collection("books").updateOne({ _id: bookId }, { $set: update });
  const updated = await db.collection("books").findOne({ _id: bookId });
  res.json(updated);
});

// DELETE /api/books/:id (auth required)
router.delete("/:id", auth, async (req, res) => {
  const db = getDB();
  let bookId;
  try {
    bookId = new ObjectId(req.params.id);
  } catch {
    return res.status(404).json({ message: "Book not found" });
  }

  const book = await db.collection("books").findOne({ _id: bookId });
  if (!book) return res.status(404).json({ message: "Book not found" });
  if (book.submittedBy?.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }
  await db.collection("books").deleteOne({ _id: bookId });
  res.json({ message: "Book deleted" });
});

export default router;
