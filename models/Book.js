import mongoose from "mongoose";

const linkSchema = new mongoose.Schema({
  label: { type: String, required: true, trim: true },
  url: { type: String, required: true, trim: true },
});

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, trim: true },
    type: { type: String, enum: ["book", "article", "pdf"], default: "book" },
    description: { type: String, trim: true },
    coverImage: { type: String, trim: true },
    links: [linkSchema],
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

bookSchema.index({ title: "text", author: "text", description: "text" });

export default mongoose.model("Book", bookSchema);
