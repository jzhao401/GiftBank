require("dotenv").config();
const express = require("express");
const axios = require("axios");
const logger = require("./logger");
const expressPino = require("express-pino-logger")({ logger });
// Task 1: import the natural library
const natural = require("natural");

// Task 2: initialize the express server
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(expressPino);

// Enhanced sentiment analysis with custom negative patterns
function enhancedSentimentAnalysis(sentence) {
  const Analyzer = natural.SentimentAnalyzer;
  const stemmer = natural.PorterStemmer;
  const analyzer = new Analyzer("English", stemmer, "afinn");
  
  // Get base AFINN score
  const words = sentence.split(" ");
  let baseScore = analyzer.getSentiment(words);
  
  // Enhance detection with common negative patterns
  const lowerSentence = sentence.toLowerCase();
  
  // Negative patterns that AFINN might miss
  const negativePatterns = [
    /don't like/i,
    /do not like/i,
    /doesn't fit/i,
    /does not fit/i,
    /too small/i,
    /too large/i,
    /too big/i,
    /not good/i,
    /not great/i,
    /not interested/i,
    /not what/i,
    /disappointed/i,
    /don't want/i,
    /do not want/i,
    /not happy/i,
    /not satisfied/i,
    /waste/i,
    /terrible/i,
    /horrible/i,
    /awful/i,
    /poor quality/i,
    /bad condition/i,
    /damaged/i,
    /broken/i,
    /ugly/i,
    /hate/i,
    /worst/i,
    /useless/i
  ];
  
  // Positive patterns to boost positive detection
  const positivePatterns = [
    /love it/i,
    /i love/i,
    /so good/i,
    /very good/i,
    /excellent/i,
    /amazing/i,
    /wonderful/i,
    /fantastic/i,
    /perfect/i,
    /exactly what/i,
    /just what/i,
    /thank you/i,
    /thanks/i,
    /appreciate/i,
    /great/i,
    /awesome/i,
    /beautiful/i
  ];
  
  // Check for negative patterns and apply penalty
  let patternAdjustment = 0;
  for (const pattern of negativePatterns) {
    if (pattern.test(lowerSentence)) {
      patternAdjustment -= 0.5; // Significant negative boost
      logger.info(`Negative pattern detected: ${pattern}`);
    }
  }
  
  // Check for positive patterns and apply boost
  for (const pattern of positivePatterns) {
    if (pattern.test(lowerSentence)) {
      patternAdjustment += 0.5; // Significant positive boost
      logger.info(`Positive pattern detected: ${pattern}`);
    }
  }
  
  // Adjusted score
  const adjustedScore = baseScore + patternAdjustment;
  
  return {
    baseScore,
    patternAdjustment,
    finalScore: adjustedScore
  };
}

// Define the sentiment analysis route
// Task 3: create the POST /sentiment analysis
app.post("/sentiment", async (req, res) => {
  // Task 4: extract the sentence parameter
  const { sentence } = req.body;

  if (!sentence) {
    logger.error("No sentence provided");
    return res.status(400).json({ error: "No sentence provided" });
  }

  // Perform sentiment analysis
  try {
    const analysis = enhancedSentimentAnalysis(sentence);
    const analysisResult = analysis.finalScore;

    let sentiment = "neutral";

    // Improved thresholds - more sensitive detection
    if (analysisResult < 0) {
      // Any negative score is considered negative
      sentiment = "negative";
    } else if (analysisResult > 0.2) {
      // Need stronger positive signal for positive classification
      sentiment = "positive";
    } else {
      // Between 0 and 0.2 is neutral
      sentiment = "neutral";
    }

    // Enhanced logging for debugging
    logger.info(`Analyzing: "${sentence}"`);
    logger.info(`Base score: ${analysis.baseScore}, Pattern adjustment: ${analysis.patternAdjustment}`);
    logger.info(`Final score: ${analysisResult}, Sentiment: ${sentiment}`);

    // Task 6: send a status code of 200 with both sentiment score and the sentiment txt in the format { sentimentScore: analysisResult, sentiment: sentiment }
    res
      .status(200)
      .json({ 
        sentimentScore: analysisResult, 
        sentiment: sentiment,
        debug: {
          baseScore: analysis.baseScore,
          patternAdjustment: analysis.patternAdjustment
        }
      });
  } catch (error) {
    logger.error(`Error performing sentiment analysis: ${error}`);
    // Task 7: if there is an error, return a HTTP code of 500 and the json {'message': 'Error performing sentiment analysis'}
    return res
      .status(500)
      .json({ message: "Error performing sentiment analysis" });
  }
});

// Add a test endpoint to help debug sentiment analysis
app.post("/sentiment/test", async (req, res) => {
  const { sentence } = req.body;
  
  if (!sentence) {
    return res.status(400).json({ error: "No sentence provided" });
  }

  try {
    const analysis = enhancedSentimentAnalysis(sentence);
    
    let sentiment = "neutral";
    if (analysis.finalScore < 0) {
      sentiment = "negative";
    } else if (analysis.finalScore > 0.2) {
      sentiment = "positive";
    }

    res.json({
      sentence,
      baseScore: analysis.baseScore,
      patternAdjustment: analysis.patternAdjustment,
      finalScore: analysis.finalScore,
      sentiment,
      threshold: {
        negative: "< 0",
        neutral: "0 to 0.2",
        positive: "> 0.2"
      }
    });
  } catch (error) {
    logger.error(`Error in test endpoint: ${error}`);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});
