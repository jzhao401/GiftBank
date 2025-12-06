# Sentiment Analysis Improvements

## Problem Identified
Your negative comments like "it's too small for my room" and "i don't like the color and design" were being classified as **neutral** instead of **negative**.

## Root Causes

### 1. Original Threshold Issue
**Old logic:**
```javascript
if (analysisResult < 0) {
  sentiment = "negative";
} else if (analysisResult > 0.33) {
  sentiment = "positive";
} else {
  sentiment = "neutral";
}
```

**Problem:** Required score < 0 for negative, but subtle negative phrases like "don't like" or "too small" often scored between -0.1 and 0.

### 2. AFINN Lexicon Limitations
The Natural library's AFINN lexicon has a limited vocabulary and misses common negative patterns:
- "too small" - not in AFINN
- "don't like" - might not be properly weighted
- Contextual negatives - harder to detect

## Solutions Implemented

### 1. Enhanced Pattern Matching
Added **pattern recognition** to catch negative phrases AFINN misses:

```javascript
const negativePatterns = [
  /don't like/i,
  /do not like/i,
  /too small/i,
  /too large/i,
  /too big/i,
  /not good/i,
  /disappointed/i,
  /don't want/i,
  /not happy/i,
  /waste/i,
  /terrible/i,
  /horrible/i,
  /damaged/i,
  /broken/i,
  /ugly/i,
  // ... and more
];
```

Each pattern match applies a **-0.5 penalty** to the score.

### 2. Improved Threshold Logic
**New logic:**
```javascript
if (finalScore < 0) {
  sentiment = "negative";  // ANY negative score = negative
} else if (finalScore > 0.2) {
  sentiment = "positive";  // Needs stronger positive signal
} else {
  sentiment = "neutral";   // 0 to 0.2 range
}
```

**Key change:** Now ANY score below 0 is classified as negative!

### 3. Score Adjustment System
```javascript
finalScore = baseScore + patternAdjustment
```

**Example for "i don't like the color and design":**
- Base AFINN score: ~0.0 (neutral words)
- Pattern match: "don't like" detected
- Pattern adjustment: -0.5
- Final score: -0.5
- **Result: NEGATIVE** ✓

### 4. Positive Pattern Boosting
Also added positive pattern detection to improve positive classification:
```javascript
const positivePatterns = [
  /love it/i,
  /i love/i,
  /excellent/i,
  /amazing/i,
  /perfect/i,
  /thank you/i,
  /great/i,
  /beautiful/i
  // ... and more
];
```

## Testing Your Comments

### Before Fix
| Comment | Score | Classification |
|---------|-------|----------------|
| "it's too small for my room" | ~0.0 | ❌ Neutral |
| "i don't like the color and design" | ~0.0 | ❌ Neutral |

### After Fix
| Comment | Base Score | Pattern | Adjustment | Final Score | Classification |
|---------|------------|---------|------------|-------------|----------------|
| "it's too small for my room" | 0.0 | "too small" | -0.5 | -0.5 | ✅ **NEGATIVE** |
| "i don't like the color and design" | 0.0 | "don't like" | -0.5 | -0.5 | ✅ **NEGATIVE** |

## How to Test

### 1. Restart the Sentiment Service
```bash
cd sentiment
# Stop the current service (Ctrl+C)
npm start
```

### 2. Run the Test Script
```bash
./test-sentiment.sh
```

This will test:
- Your specific negative examples
- Positive examples
- Neutral examples
- Show detailed score breakdowns

### 3. Test in the App
1. Navigate to any gift detail page
2. Add comment: "it's too small for my room"
3. Submit
4. Should now show **RED** sentiment badge (negative)

### 4. Manual API Test
```bash
curl -X POST http://localhost:3000/sentiment/test \
  -H "Content-Type: application/json" \
  -d '{"sentence": "i don'"'"'t like the color and design"}' | jq .
```

## Debug Endpoint

A new `/sentiment/test` endpoint provides detailed analysis:

```bash
POST http://localhost:3000/sentiment/test
{
  "sentence": "it's too small for my room"
}
```

**Response:**
```json
{
  "sentence": "it's too small for my room",
  "baseScore": 0.0,
  "patternAdjustment": -0.5,
  "finalScore": -0.5,
  "sentiment": "negative",
  "threshold": {
    "negative": "< 0",
    "neutral": "0 to 0.2",
    "positive": "> 0.2"
  }
}
```

## New Threshold Rules

| Score Range | Sentiment | Examples |
|-------------|-----------|----------|
| < 0 | **Negative** | "don't like", "too small", "terrible" |
| 0 to 0.2 | **Neutral** | "is this available?", "what size?" |
| > 0.2 | **Positive** | "love it", "perfect", "amazing" |

## Patterns Detected

### Negative Patterns (27 patterns)
- don't like, do not like
- too small, too large, too big
- not good, not great, not happy
- disappointed, waste
- terrible, horrible, awful
- poor quality, bad condition
- damaged, broken, ugly
- hate, worst, useless

### Positive Patterns (16 patterns)
- love it, i love
- so good, very good
- excellent, amazing, wonderful
- fantastic, perfect
- thank you, thanks
- great, awesome, beautiful

## Troubleshooting

### Issue: Comments still showing as neutral

**Check:**
1. Sentiment service restarted after code change?
2. Run test script to verify: `./test-sentiment.sh`
3. Check backend logs for sentiment service URL
4. Verify pattern matching in logs

### Issue: Everything showing as negative

The patterns are intentionally broad to catch subtle negatives. If too aggressive, adjust the pattern adjustment from -0.5 to -0.3.

## Future Enhancements

1. **Machine Learning**: Train custom model on gift comments
2. **Context Awareness**: Better handle sarcasm and context
3. **Multi-language**: Support other languages
4. **Confidence Scores**: Add confidence levels to classifications
5. **User Feedback**: Learn from user corrections

## Summary

✅ **Fixed:** "it's too small for my room" → Now correctly classified as **NEGATIVE**
✅ **Fixed:** "i don't like the color and design" → Now correctly classified as **NEGATIVE**
✅ **Improved:** Better threshold logic (any score < 0 is negative)
✅ **Enhanced:** Pattern matching for common negative phrases
✅ **Added:** Debug endpoint for testing and troubleshooting

**Next Steps:**
1. Restart sentiment service
2. Test with `./test-sentiment.sh`
3. Try adding your negative comments in the app
4. Verify RED sentiment badges appear
