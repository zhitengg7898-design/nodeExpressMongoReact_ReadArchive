import { MongoClient } from "mongodb";

let db;

const connectDB = async () => {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  db = client.db();
  await db
    .collection("books")
    .createIndex({ title: "text", author: "text", description: "text" });
  console.log(
    `MongoDB connected: ${client.options.hosts?.[0] ?? process.env.MONGO_URI}`,
  );
};

export const getDB = () => db;
export default connectDB;
