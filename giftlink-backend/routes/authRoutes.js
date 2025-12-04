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
dotenv.config({ path: "../envs" });

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

router.post("/login", async (req, res) => {
  try {
    // Task 1: Connect to `giftsdb` in MongoDB through `connectToDatabase` in `db.js`.
    const client = await connectToDatabase();
    const db = client.db("giftsdb");
    const collection = db.collection("users");
    const user = await collection.findOne({ email: req.body.email });
    if (!user) {
      logger.error("user not found");
      return res.status(400).json({ error: "User not found" });
    }
    const isMatch = await bcryptjs.compare(req.body.password, user.password);
    if (!isMatch) {
      logger.error("Passwords do not match");
      return res.status(404).json({ error: "Invalid credentials" });
    }
    const payload = { user: { id: user._id.toString() } };
    const authtoken = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
    const userName = `${user.firstName} ${user.lastName}`;
    const userEmail = user.email;
    // Task 2: Access MongoDB `users` collection
    // Task 3: Check for user credentials in database
    // Task 4: Task 4: Check if the password matches the encrypyted password and send appropriate message on mismatch
    // Task 5: Fetch user details from database
    // Task 6: Create JWT authentication if passwords match with user._id as payload
    res.json({ authtoken, userName, userEmail });
    // Task 7: Send appropriate message if user not found
  } catch (e) {
    return res.status(500).send("Internal server error");
  }
});

// {Insert it along with other imports} Task 1: Use the `body`,`validationResult` from `express-validator` for input validation

router.put("/update", async (req, res) => {
  // Task 2: Validate the input using `validationResult` and return approiate message if there is an error.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error("Validation errors in update request", errors.array());
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    // Task 3: Check if `email` is present in the header and throw an appropriate error message if not present.
    // const emailHeader = req.headers['email'];
    const emailHeader = req.headers["email"];
    if (!emailHeader) {
      logger.error("Email header missing");
      return res.status(400).json({ error: "Email header is required" });
    }
    // Task 4: Connect to MongoDB
    const client = await connectToDatabase();
    const db = client.db("giftsdb");
    const collection = db.collection("users");
    const existingUser = await collection.findOne({ email: emailHeader });
    if (!existingUser) {
      logger.error("User not found for update");
      return res.status(404).json({ error: "User not found" });
    }
    const updateFields = {};
    if (req.body.firstName) updateFields.firstName = req.body.firstName;
    if (req.body.lastName) updateFields.lastName = req.body.lastName;
    if (req.body.password) {
      const salt = await bcryptjs.genSalt(10);
      const hash = await bcryptjs.hash(req.body.password, salt);
      updateFields.password = hash;
    }
    updateFields.updatedAt = new Date();
    updateUser = await collection.updateOne(
      { email: emailHeader },
      { $set: updateFields },
      { returnDocument: "after" },
    );
    const payload = { user: { id: updateUser._id.toString() } };
    const authtoken = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
    // Task 5: find user credentials in database

    // Task 6: update user credentials in database
    // Task 7: create JWT authentication using secret key from .env file
    res.json({ authtoken });
  } catch (e) {
    return res.status(500).send("Internal server error");
  }
});

module.exports = router;
