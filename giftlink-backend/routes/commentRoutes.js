const express = require("express");
const router = express.Router();
const connectToDatabase = require("../models/db.js");
const axios = require("axios");
const logger = require("../logger");

// Get sentiment service URL from environment
const SENTIMENT_SERVICE_URL = process.env.SENTIMENT_SERVICE_URL || "http://localhost:3000";

// Helper function to analyze sentiment
async function analyzeSentiment(text) {
  try {
    const response = await axios.post(`${SENTIMENT_SERVICE_URL}/sentiment`, {
      sentence: text
    });
    return response.data.sentiment; // returns 'positive', 'negative', or 'neutral'
  } catch (error) {
    logger.error("Error analyzing sentiment:", error.message);
    return "neutral"; // Default to neutral if sentiment analysis fails
  }
}

// Get comments for a specific gift
router.get("/:giftId", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("gifts");
    const giftId = req.params.giftId;

    const gift = await collection.findOne({ id: giftId });

    if (!gift) {
      return res.status(404).json({ message: "Gift not found" });
    }

    // Return comments or empty array if no comments exist
    res.json(gift.comments || []);
  } catch (error) {
    logger.error("Error fetching comments:", error);
    res.status(500).json({ message: "Error fetching comments" });
  }
});

// Add a comment to a gift
router.post("/:giftId", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("gifts");
    const giftId = req.params.giftId;
    const { author, comment } = req.body;

    if (!author || !comment) {
      return res.status(400).json({ message: "Author and comment are required" });
    }

    // Analyze sentiment of the comment
    const sentiment = await analyzeSentiment(comment);

    const newComment = {
      author,
      comment,
      sentiment,
      createdAt: new Date().toISOString()
    };

    // Add comment to the gift's comments array
    const result = await collection.updateOne(
      { id: giftId },
      { $push: { comments: newComment } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Gift not found" });
    }

    res.status(201).json(newComment);
  } catch (error) {
    logger.error("Error adding comment:", error);
    res.status(500).json({ message: "Error adding comment" });
  }
});

module.exports = router;
