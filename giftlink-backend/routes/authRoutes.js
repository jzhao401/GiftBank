//Step 1 - Task 2: Import necessary packages
const express = require("express");
const app = express();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const connectToDatabase = require("../models/db");
const router = express.Router();
const dotenv = require("dotenv");
const pino = require("pino"); // Import Pino logger
//Step 1 - Task 3: Create a Pino logger instance
const logger = pino(); // Create a Pino logger instance
dotenv.config();

//Step 1 - Task 4: Create JWT secret
const JWT_SECRET = process.env.JWT_SECRET;
router.post("/register", async (req, res) => {
  try {
    // Task 1: Connect to `giftsdb` in MongoDB through `connectToDatabase` in `db.js`
    const client = await connectToDatabase();
    const db = client.db("giftsdb");
    const collection = db.collection("users");

    // Task 2: Access MongoDB collection

    //Task 3: Check for existing email
    // Check if user already exists
    const existingUser = await collection.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Save user details in database
    const user = { email: req.body.email, password: req.body.password };

    // Create JWT authentication with user._id as payload
    const payload = { user: { id: userId } };
    const authtoken = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    const salt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(req.body.password, salt);

    const result = await collection.insertOne({
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: hash,
      createdAt: new Date(),
    });
    const userId = result.insertedId;

    // {{insert code here}} //Task 4: Save user details in database
    // {{insert code here}} //Task 5: Create JWT authentication with user._id as payload
    const payload = { user: { id: userId } };
    const authtoken = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
    logger.info("User registered successfully");
    res.json({ authtoken, email });
  } catch (e) {
    return res.status(500).send("Internal server error");
  }
});
module.exports = router;
