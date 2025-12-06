#!/usr/bin/env node

// Test script for sentiment analysis
const axios = require('axios');

const SENTIMENT_URL = 'http://localhost:3000/sentiment/test';

const testCases = [
  // Your examples
  "it's too small for my room",
  "i don't like the color and design",
  
  // Clearly negative
  "This is terrible and broken",
  "I hate this, very disappointed",
  "Awful quality, don't buy",
  "Bad condition, not worth it",
  
  // Clearly positive
  "This is amazing! I love it!",
  "Excellent quality, very happy",
  "Great item! Highly recommend!",
  "Perfect! Exactly what I wanted!",
  
  // Neutral
  "Is this still available?",
  "What are the dimensions?",
  "Can you ship to New York?",
];

async function testSentiment() {
  console.log('🧪 Testing Sentiment Analysis\n');
  console.log('=' .repeat(80));
  
  for (const sentence of testCases) {
    try {
      const response = await axios.post(SENTIMENT_URL, { sentence });
      const { sentimentScore, sentiment } = response.data;
      
      // Color code based on sentiment
      let color = '\x1b[37m'; // white (neutral)
      let emoji = '⚪';
      if (sentiment === 'positive') {
        color = '\x1b[32m'; // green
        emoji = '🟢';
      } else if (sentiment === 'negative') {
        color = '\x1b[31m'; // red
        emoji = '🔴';
      }
      
      console.log(`\n${emoji} ${color}${sentiment.toUpperCase()}\x1b[0m (score: ${sentimentScore.toFixed(4)})`);
      console.log(`   "${sentence}"`);
      
    } catch (error) {
      console.error(`\n❌ Error testing: "${sentence}"`);
      if (error.code === 'ECONNREFUSED') {
        console.error('   ⚠️  Sentiment service is not running on port 3000');
        console.error('   Please start it with: cd sentiment && npm start');
        break;
      } else {
        console.error(`   ${error.message}`);
      }
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('\n✅ Testing complete!\n');
}

// Check if sentiment service is running
async function checkService() {
  try {
    await axios.post('http://localhost:3000/sentiment', { sentence: 'test' });
    return true;
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Sentiment service is not running!');
      console.error('\nPlease start it first:');
      console.error('  cd sentiment');
      console.error('  npm start\n');
      return false;
    }
    return true; // Service is running, just returned an error
  }
}

// Run the test
(async () => {
  const serviceRunning = await checkService();
  if (serviceRunning) {
    await testSentiment();
  }
})();
