#!/bin/bash

BASE_URL="https://zhao401-3060.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai"

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     Testing GiftBank Backend API with Auto Gift ID            ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Test 1: Get first gift ID
echo "🔍 Finding first available gift..."
FIRST_GIFT_ID=$(curl -s "$BASE_URL/gift" | jq -r '.[0].id')

if [ -z "$FIRST_GIFT_ID" ] || [ "$FIRST_GIFT_ID" == "null" ]; then
    echo "❌ Error: No gifts found in database!"
    echo "Please run: node giftlink-backend/util/add-sample-comments.js"
    exit 1
fi

echo "✅ Found gift ID: $FIRST_GIFT_ID"
echo ""

# Test 2: Get gift details
echo "📦 Getting gift details..."
GIFT_NAME=$(curl -s "$BASE_URL/gift/$FIRST_GIFT_ID" | jq -r '.name')
echo "Gift Name: $GIFT_NAME"
echo "Gift ID: $FIRST_GIFT_ID"
echo ""
echo "---"
echo ""

# Test 3: Get existing comments
echo "💬 Getting existing comments..."
COMMENT_COUNT=$(curl -s "$BASE_URL/api/comments/$FIRST_GIFT_ID" | jq '. | length')
echo "Existing comments: $COMMENT_COUNT"
echo ""

if [ "$COMMENT_COUNT" -gt 0 ]; then
    echo "Sample existing comments:"
    curl -s "$BASE_URL/api/comments/$FIRST_GIFT_ID" | jq '.[:2] | .[] | { author, sentiment, comment: (.comment | .[0:50]) }'
fi
echo "---"
echo ""

# Test 4: Add Negative Comment #1
echo "➖ Test: Add NEGATIVE Comment #1"
echo "Comment: 'i dont like the color and design'"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/comments/$FIRST_GIFT_ID" \
  -H "Content-Type: application/json" \
  -d '{"author": "Test User", "comment": "i dont like the color and design"}')

echo "$RESPONSE" | jq '{ author, comment, sentiment, createdAt }'

SENTIMENT=$(echo "$RESPONSE" | jq -r '.sentiment')
if [ "$SENTIMENT" == "negative" ]; then
    echo "✅ PASS: Correctly identified as NEGATIVE"
else
    echo "❌ FAIL: Expected 'negative' but got '$SENTIMENT'"
fi
echo ""
echo "---"
echo ""

# Test 5: Add Negative Comment #2
echo "➖ Test: Add NEGATIVE Comment #2"
echo "Comment: 'its too small for my room'"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/comments/$FIRST_GIFT_ID" \
  -H "Content-Type: application/json" \
  -d '{"author": "Test User", "comment": "its too small for my room"}')

echo "$RESPONSE" | jq '{ author, comment, sentiment, createdAt }'

SENTIMENT=$(echo "$RESPONSE" | jq -r '.sentiment')
if [ "$SENTIMENT" == "negative" ]; then
    echo "✅ PASS: Correctly identified as NEGATIVE"
else
    echo "❌ FAIL: Expected 'negative' but got '$SENTIMENT'"
fi
echo ""
echo "---"
echo ""

# Test 6: Add Positive Comment
echo "➕ Test: Add POSITIVE Comment"
echo "Comment: 'This is amazing! I love it!'"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/comments/$FIRST_GIFT_ID" \
  -H "Content-Type: application/json" \
  -d '{"author": "Happy User", "comment": "This is amazing! I love it!"}')

echo "$RESPONSE" | jq '{ author, comment, sentiment, createdAt }'

SENTIMENT=$(echo "$RESPONSE" | jq -r '.sentiment')
if [ "$SENTIMENT" == "positive" ]; then
    echo "✅ PASS: Correctly identified as POSITIVE"
else
    echo "❌ FAIL: Expected 'positive' but got '$SENTIMENT'"
fi
echo ""
echo "---"
echo ""

# Test 7: Add Neutral Comment
echo "⚪ Test: Add NEUTRAL Comment"
echo "Comment: 'Is this still available?'"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/comments/$FIRST_GIFT_ID" \
  -H "Content-Type: application/json" \
  -d '{"author": "Curious User", "comment": "Is this still available?"}')

echo "$RESPONSE" | jq '{ author, comment, sentiment, createdAt }'

SENTIMENT=$(echo "$RESPONSE" | jq -r '.sentiment')
if [ "$SENTIMENT" == "neutral" ]; then
    echo "✅ PASS: Correctly identified as NEUTRAL"
else
    echo "❌ FAIL: Expected 'neutral' but got '$SENTIMENT'"
fi
echo ""
echo "---"
echo ""

# Test 8: Verify all comments
echo "✅ Verification: Get all comments for this gift"
NEW_COMMENT_COUNT=$(curl -s "$BASE_URL/api/comments/$FIRST_GIFT_ID" | jq '. | length')
echo "Total comments now: $NEW_COMMENT_COUNT (was $COMMENT_COUNT)"
echo ""
echo "Last 4 comments:"
curl -s "$BASE_URL/api/comments/$FIRST_GIFT_ID" | jq '.[-4:] | .[] | { author, sentiment, comment: (.comment | .[0:60]) }'
echo ""

# Summary
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                    Test Results Summary                        ║"
echo "╠════════════════════════════════════════════════════════════════╣"
echo "║ Gift ID Used: $FIRST_GIFT_ID"
echo "║ Gift Name: $GIFT_NAME"
echo "║ Original Comments: $COMMENT_COUNT"
echo "║ New Comments: $NEW_COMMENT_COUNT"
echo "║ Added: 4 test comments (2 negative, 1 positive, 1 neutral)"
echo "╠════════════════════════════════════════════════════════════════╣"
echo "║ 🎯 Check that:"
echo "║   • 'i dont like' shows sentiment: 'negative' ✓"
echo "║   • 'too small' shows sentiment: 'negative' ✓"
echo "║   • 'amazing! I love it' shows sentiment: 'positive' ✓"
echo "║   • 'Is this available' shows sentiment: 'neutral' ✓"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "📝 Note: If any tests failed, check:"
echo "   1. Sentiment service is running on port 3000"
echo "   2. Backend can reach sentiment service"
echo "   3. Backend was restarted after sentiment fix"
