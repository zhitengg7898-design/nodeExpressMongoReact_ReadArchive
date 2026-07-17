import { getDB } from "../config/db.js";

export const users = () => getDB().collection("users");
