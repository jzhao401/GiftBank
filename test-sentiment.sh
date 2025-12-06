#!/bin/bash

# Test script for sentiment analysis
# Run this after starting the sentiment service

echo "=== Testing Sentiment Analysis ==="
echo ""

# Test positive comments
echo "Testing POSITIVE comments:"
echo "---"

curl -s -X POST http://localhost:3000/sentiment \
  -H "Content-Type: application/json" \
  -d '{"sentence": "This is amazing! I love it!"}' | jq .

echo ""

curl -s -X POST http://localhost:3000/sentiment \
  -H "Content-Type: application/json" \
  -d '{"sentence": "Perfect condition! Exactly what I needed!"}' | jq .

echo ""
echo "---"
echo ""

# Test negative comments (your examples)
echo "Testing NEGATIVE comments (your examples):"
echo "---"

curl -s -X POST http://localhost:3000/sentiment \
  -H "Content-Type: application/json" \
  -d '{"sentence": "it'\''s too small for my room"}' | jq .

echo ""

curl -s -X POST http://localhost:3000/sentiment \
  -H "Content-Type: application/json" \
  -d '{"sentence": "i don'\''t like the color and design"}' | jq .

echo ""

curl -s -X POST http://localhost:3000/sentiment \
  -H "Content-Type: application/json" \
  -d '{"sentence": "This is terrible and broken."}' | jq .

echo ""
echo "---"
echo ""

# Test neutral comments
echo "Testing NEUTRAL comments:"
echo "---"

curl -s -X POST http://localhost:3000/sentiment \
  -H "Content-Type: application/json" \
  -d '{"sentence": "Is this still available?"}' | jq .

echo ""

curl -s -X POST http://localhost:3000/sentiment \
  -H "Content-Type: application/json" \
  -d '{"sentence": "What are the dimensions?"}' | jq .

echo ""
echo "---"
echo ""

# Use test endpoint for detailed analysis
echo "Detailed analysis of your negative comments:"
echo "---"

echo "1. 'it's too small for my room'"
curl -s -X POST http://localhost:3000/sentiment/test \
  -H "Content-Type: application/json" \
  -d '{"sentence": "it'\''s too small for my room"}' | jq .

echo ""

echo "2. 'i don't like the color and design'"
curl -s -X POST http://localhost:3000/sentiment/test \
  -H "Content-Type: application/json" \
  -d '{"sentence": "i don'\''t like the color and design"}' | jq .

echo ""
echo "=== Test Complete ==="
