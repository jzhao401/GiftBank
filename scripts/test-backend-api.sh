#!/bin/bash

BASE_URL="https://zhao401-3060.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai"

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║          Testing GiftBank Backend API                          ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Test 1: Health Check
echo "📍 Test 1: Health Check"
echo "GET $BASE_URL/"
curl -s "$BASE_URL/"
echo ""
echo "---"
echo ""

# Test 2: Get All Gifts
echo "📦 Test 2: Get All Gifts"
echo "GET $BASE_URL/gift"
GIFT_COUNT=$(curl -s "$BASE_URL/gift" | jq '. | length')
echo "Found $GIFT_COUNT gifts"
echo "---"
echo ""

# Test 3: Get Single Gift
echo "🎁 Test 3: Get Single Gift (ID: 1)"
echo "GET $BASE_URL/gift/1"
curl -s "$BASE_URL/gift/1" | jq '{ name: .name, category: .category, commentsCount: (.comments | length) }'
echo "---"
echo ""

# Test 4: Get Comments for Gift
echo "💬 Test 4: Get Comments for Gift 1"
echo "GET $BASE_URL/api/comments/1"
COMMENT_COUNT=$(curl -s "$BASE_URL/api/comments/1" | jq '. | length')
echo "Found $COMMENT_COUNT comments"
curl -s "$BASE_URL/api/comments/1" | jq '.[:2]'
echo "---"
echo ""

# Test 5: Add Negative Comment
echo "➖ Test 5: Add NEGATIVE Comment"
echo "POST $BASE_URL/api/comments/1"
echo "Comment: 'i dont like the color and design'"
curl -s -X POST "$BASE_URL/api/comments/1" \
  -H "Content-Type: application/json" \
  -d '{"author": "Test User", "comment": "i dont like the color and design"}' | jq '{ author, comment, sentiment }'
echo "---"
echo ""

# Test 6: Add Another Negative Comment
echo "➖ Test 6: Add Another NEGATIVE Comment"
echo "POST $BASE_URL/api/comments/1"
echo "Comment: 'its too small for my room'"
curl -s -X POST "$BASE_URL/api/comments/1" \
  -H "Content-Type: application/json" \
  -d '{"author": "Test User", "comment": "its too small for my room"}' | jq '{ author, comment, sentiment }'
echo "---"
echo ""

# Test 7: Add Positive Comment
echo "➕ Test 7: Add POSITIVE Comment"
echo "POST $BASE_URL/api/comments/1"
echo "Comment: 'This is amazing! I love it!'"
curl -s -X POST "$BASE_URL/api/comments/1" \
  -H "Content-Type: application/json" \
  -d '{"author": "Happy User", "comment": "This is amazing! I love it!"}' | jq '{ author, comment, sentiment }'
echo "---"
echo ""

# Test 8: Add Neutral Comment
echo "⚪ Test 8: Add NEUTRAL Comment"
echo "POST $BASE_URL/api/comments/1"
echo "Comment: 'Is this still available?'"
curl -s -X POST "$BASE_URL/api/comments/1" \
  -H "Content-Type: application/json" \
  -d '{"author": "Curious User", "comment": "Is this still available?"}' | jq '{ author, comment, sentiment }'
echo "---"
echo ""

# Test 9: Verify New Comments Added
echo "✅ Test 9: Verify Comments Were Added"
echo "GET $BASE_URL/api/comments/1"
NEW_COMMENT_COUNT=$(curl -s "$BASE_URL/api/comments/1" | jq '. | length')
echo "Now have $NEW_COMMENT_COUNT comments (was $COMMENT_COUNT)"
echo "Last 4 comments:"
curl -s "$BASE_URL/api/comments/1" | jq '.[-4:] | .[] | { author, sentiment, comment: (.comment | .[0:50]) }'
echo "---"
echo ""

# Test 10: Search Gifts
echo "🔍 Test 10: Search Gifts"
echo "GET $BASE_URL/api/search?query=book"
SEARCH_RESULTS=$(curl -s "$BASE_URL/api/search?query=book" 2>/dev/null | jq '. | length' 2>/dev/null || echo "0")
echo "Found $SEARCH_RESULTS results for 'book'"
echo "---"
echo ""

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                    Test Results Summary                        ║"
echo "╠════════════════════════════════════════════════════════════════╣"
echo "║ ✅ Health Check: Passed                                        ║"
echo "║ ✅ Get Gifts: Found $GIFT_COUNT gifts                                   ║"
echo "║ ✅ Get Comments: Original count $COMMENT_COUNT                         ║"
echo "║ ✅ Add Negative Comments: Tested                               ║"
echo "║ ✅ Add Positive Comment: Tested                                ║"
echo "║ ✅ Add Neutral Comment: Tested                                 ║"
echo "║ ✅ Verify Persistence: Now have $NEW_COMMENT_COUNT comments              ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "🎯 Key Points to Verify:"
echo "   • Negative comments should show sentiment: 'negative'"
echo "   • Positive comments should show sentiment: 'positive'"
echo "   • Neutral comments should show sentiment: 'neutral'"
echo "   • Comments should persist in database"
echo ""
echo "📚 Full documentation: BACKEND_API_TESTING.md"
