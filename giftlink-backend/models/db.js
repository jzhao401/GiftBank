// db.js
require("dotenv").config({ path: "./envs" });
const MongoClient = require("mongodb").MongoClient;

// MongoDB connection URL with authentication options
let url = `${process.env.MONGO_URL}`;

let dbInstance = null;
const dbName = "giftdb";

async function connectToDatabase() {
  if (dbInstance) {
    return dbInstance;
  }

  const client = new MongoClient(url);

  console.log("Connecting to MongoDB...");
  await client.connect();
  console.log("Connected to MongoDB client");
  dbInstance = client.db(dbName);
  console.log("Database instance created");

  // Task 3: Return database instance
  return dbInstance;
}

module.exports = connectToDatabase;
