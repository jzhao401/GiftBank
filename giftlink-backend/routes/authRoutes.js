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
dotenv.config({ path: "./envs" });

//Step 1 - Task 4: Create JWT secret
const JWT_SECRET = process.env.JWT_SECRET;
router.post("/register", async (req, res) => {
  try {
    // console.log("Register endpoint hit");
    // console.log("Body:", req.body);
    // console.log("JWT_SECRET:", JWT_SECRET);

    // Task 1: Connect to `giftsdb` in MongoDB through `connectToDatabase` in `db.js`
    const db = await connectToDatabase();
    // const db = client.db("giftsdb");
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
    // Create JWT authentication with user._id as payload
    // const payload = { user: { id: userId } };
    // const authtoken = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

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
    console.log("User inserted, ID:", userId);

    // {{insert code here}} //Task 4: Save user details in database
    // {{insert code here}} //Task 5: Create JWT authentication with user._id as payload
    const payload = { user: { id: userId } };
    const authtoken = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
    console.log("Token signed");
    logger.info("User registered successfully");
    res.json({ authtoken, email: req.body.email });
  } catch (e) {
    console.error("Error in register:", e);
    return res.status(500).send("Internal server error");
  }
});

router.post("/login", async (req, res) => {
  try {
    // Task 1: Connect to `giftsdb` in MongoDB through `connectToDatabase` in `db.js`.
    const db = await connectToDatabase();
    // const db = client.db("giftsdb");
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
    logger.error("Profile update error:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// {Insert it along with other imports} Task 1: Use the `body`,`validationResult` from `express-validator` for input validation

// GET /profile - Fetch user profile from database
router.get("/profile", async (req, res) => {
  try {
    const authtoken = req.headers.authorization?.replace('Bearer ', '');
    const email = req.headers.email;
    
    if (!authtoken || !email) {
      logger.error("Missing auth credentials for profile fetch");
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Verify JWT token
    try {
      jwt.verify(authtoken, JWT_SECRET);
    } catch (err) {
      logger.error("Invalid token");
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    
    // Connect to database
    const db = await connectToDatabase();
    const collection = db.collection("users");
    
    // Find user
    const user = await collection.findOne({ email });
    
    if (!user) {
      logger.error("User not found in database");
      return res.status(404).json({ error: "User not found" });
    }

    // Return user profile
    logger.info("Profile fetched successfully for user: " + email);
    res.json({
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    });
    
  } catch (error) {
    logger.error("Profile fetch error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/update", async (req, res) => {
  // Task 2: Validate the input using `validationResult` and return approiate message if there is an error.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error("Validation errors in update request", errors.array());
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    // Task 3: Check if `email` and `authorization` are present in headers
    const authtoken = req.headers.authorization?.replace('Bearer ', '');
    const emailHeader = req.headers["email"];
    
    if (!authtoken || !emailHeader) {
      logger.error("Missing auth credentials");
      return res.status(401).json({ error: "Unauthorized - Missing token or email" });
    }

    // Verify JWT token
    try {
      jwt.verify(authtoken, JWT_SECRET);
    } catch (err) {
      logger.error("Invalid or expired token");
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    
    // Task 4: Connect to MongoDB
    const db = await connectToDatabase();
    // const db = client.db("giftsdb");
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
    const updateResult = await collection.updateOne(
      { email: emailHeader },
      { $set: updateFields }
    );
    
    // Get the updated user for creating new token
    const updatedUser = await collection.findOne({ email: emailHeader });
    const payload = { user: { id: updatedUser._id.toString() } };
    const newAuthtoken = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
    // Task 5: find user credentials in database

    // Task 6: update user credentials in database
    // Task 7: create JWT authentication using secret key from .env file
    res.json({ authtoken: newAuthtoken });
  } catch (e) {
    logger.error("Profile update error:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
