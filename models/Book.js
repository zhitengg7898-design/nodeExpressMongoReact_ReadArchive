import { getDB } from "../config/db.js";

export const books = () => getDB().collection("books");
