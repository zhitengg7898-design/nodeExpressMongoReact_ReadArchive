import express from "express";
import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

// GET /api/users/me
router.get("/me", (req, res) => res.json(req.user));

// GET /api/users/favorites
router.get("/favorites", async (req, res) => {
  const db = getDB();
  const user = await db.collection("users").findOne({ _id: req.user._id });
  if (!user?.favorites?.length) return res.json([]);
  const books = await db
    .collection("books")
    .find({ _id: { $in: user.favorites } })
    .toArray();
  res.json(books);
});

// POST /api/users/favorites  { bookId }
router.post("/favorites", async (req, res) => {
  const { bookId } = req.body;
  if (!bookId) return res.status(400).json({ message: "bookId is required" });
  let bookObjId;
  try {
    bookObjId = new ObjectId(bookId);
  } catch {
    return res.status(400).json({ message: "Invalid bookId" });
  }
  const db = getDB();
  const user = await db.collection("users").findOne({ _id: req.user._id });
  if (user.favorites.some((id) => id.toString() === bookObjId.toString())) {
    return res.status(409).json({ message: "Already in favorites" });
  }
  await db
    .collection("users")
    .updateOne({ _id: req.user._id }, { $push: { favorites: bookObjId } });
  res.status(201).json({ message: "Added to favorites" });
});

// DELETE /api/users/favorites/:bookId
router.delete("/favorites/:bookId", async (req, res) => {
  let bookObjId;
  try {
    bookObjId = new ObjectId(req.params.bookId);
  } catch {
    return res.status(400).json({ message: "Invalid bookId" });
  }
  await getDB()
    .collection("users")
    .updateOne({ _id: req.user._id }, { $pull: { favorites: bookObjId } });
  res.json({ message: "Removed from favorites" });
});

// GET /api/users/collections
router.get("/collections", async (req, res) => {
  const db = getDB();
  const user = await db.collection("users").findOne({ _id: req.user._id });
  if (!user?.collections?.length) return res.json([]);
  const populated = await Promise.all(
    user.collections.map(async (col) => {
      const books =
        col.books?.length > 0
          ? await db
              .collection("books")
              .find({ _id: { $in: col.books } })
              .toArray()
          : [];
      return { ...col, books };
    }),
  );
  res.json(populated);
});

// POST /api/users/collections  { name }
router.post("/collections", async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "name is required" });
  const colId = new ObjectId();
  await getDB()
    .collection("users")
    .updateOne(
      { _id: req.user._id },
      { $push: { collections: { _id: colId, name, books: [] } } },
    );
  res.status(201).json({ _id: colId, name, books: [] });
});

// PUT /api/users/collections/:colId  { name?, addBook?, removeBook? }
router.put("/collections/:colId", async (req, res) => {
  let colId;
  try {
    colId = new ObjectId(req.params.colId);
  } catch {
    return res.status(404).json({ message: "Collection not found" });
  }
  const db = getDB();
  const user = await db.collection("users").findOne({ _id: req.user._id });
  const col = user?.collections?.find(
    (c) => c._id.toString() === colId.toString(),
  );
  if (!col) return res.status(404).json({ message: "Collection not found" });

  if (req.body.name) {
    await db
      .collection("users")
      .updateOne(
        { _id: req.user._id, "collections._id": colId },
        { $set: { "collections.$.name": req.body.name } },
      );
  }
  if (req.body.addBook) {
    const bookObjId = new ObjectId(req.body.addBook);
    if (!col.books.some((id) => id.toString() === bookObjId.toString())) {
      await db
        .collection("users")
        .updateOne(
          { _id: req.user._id, "collections._id": colId },
          { $push: { "collections.$.books": bookObjId } },
        );
    }
  }
  if (req.body.removeBook) {
    const bookObjId = new ObjectId(req.body.removeBook);
    await db
      .collection("users")
      .updateOne(
        { _id: req.user._id, "collections._id": colId },
        { $pull: { "collections.$.books": bookObjId } },
      );
  }

  const updated = await db.collection("users").findOne({ _id: req.user._id });
  const updatedCol = updated.collections.find(
    (c) => c._id.toString() === colId.toString(),
  );
  res.json(updatedCol);
});

// DELETE /api/users/collections/:colId
router.delete("/collections/:colId", async (req, res) => {
  let colId;
  try {
    colId = new ObjectId(req.params.colId);
  } catch {
    return res.status(404).json({ message: "Collection not found" });
  }
  await getDB()
    .collection("users")
    .updateOne(
      { _id: req.user._id },
      { $pull: { collections: { _id: colId } } },
    );
  res.json({ message: "Collection deleted" });
});

export default router;
