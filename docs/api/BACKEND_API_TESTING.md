# Backend API Testing Guide

Base URL: https://zhao401-3060.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai

## 📋 All Available Endpoints

### 1. Health Check
```bash
GET /
```
**Expected Response:** "Inside the server"

**Test with curl:**
```bash
curl https://zhao401-3060.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/
```

---

### 2. Gift Endpoints

#### Get All Gifts
```bash
GET /gift
```
**Expected Response:** Array of all gifts with their comments

**Test with curl:**
```bash
curl https://zhao401-3060.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/gift
```

#### Get Single Gift by ID
```bash
GET /gift/:id
```
**Example:** `/gift/1` (use actual gift ID from your database)

**Test with curl:**
```bash
curl https://zhao401-3060.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/gift/1
```

#### Add New Gift
```bash
POST /gift
Content-Type: application/json

{
  "name": "Test Gift",
  "category": "Electronics",
  "condition": "New",
  "age_years": 0,
  "description": "Test description"
}
```

**Test with curl:**
```bash
curl -X POST https://zhao401-3060.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/gift \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Gift",
    "category": "Electronics",
    "condition": "New",
    "age_years": 0,
    "description": "Test description"
  }'
```

---

### 3. Comment Endpoints (NEW!)

#### Get Comments for a Gift
```bash
GET /api/comments/:giftId
```
**Example:** `/api/comments/1`

**Test with curl:**
```bash
curl https://zhao401-3060.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/api/comments/1
```

**Expected Response:**
```json
[
  {
    "author": "John Doe",
    "comment": "I would like this!",
    "sentiment": "positive",
    "createdAt": "2024-11-01T10:30:00.000Z"
  }
]
```

#### Add Comment to a Gift
```bash
POST /api/comments/:giftId
Content-Type: application/json

{
  "author": "Test User",
  "comment": "This is a test comment"
}
```

**Test POSITIVE sentiment:**
```bash
curl -X POST https://zhao401-3060.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/api/comments/1 \
  -H "Content-Type: application/json" \
  -d '{
    "author": "Test User",
    "comment": "This is amazing! I love it!"
  }'
```

**Expected Response:**
```json
{
  "author": "Test User",
  "comment": "This is amazing! I love it!",
  "sentiment": "positive",
  "createdAt": "2024-12-06T05:30:00.000Z"
}
```

**Test NEGATIVE sentiment (your examples):**
```bash
curl -X POST https://zhao401-3060.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/api/comments/1 \
  -H "Content-Type: application/json" \
  -d '{
    "author": "Test User",
    "comment": "i dont like the color and design"
  }'
```

**Expected Response:**
```json
{
  "author": "Test User",
  "comment": "i dont like the color and design",
  "sentiment": "negative",
  "createdAt": "2024-12-06T05:31:00.000Z"
}
```

**Test NEUTRAL sentiment:**
```bash
curl -X POST https://zhao401-3060.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/api/comments/1 \
  -H "Content-Type: application/json" \
  -d '{
    "author": "Test User",
    "comment": "Is this still available?"
  }'
```

---

### 4. Authentication Endpoints

#### Register New User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Test with curl:**
```bash
curl -X POST https://zhao401-3060.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Expected Response:**
```json
{
  "authtoken": "jwt_token_here",
  "email": "test@example.com"
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

**Test with curl:**
```bash
curl -X POST https://zhao401-3060.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "authtoken": "jwt_token_here",
  "userName": "John Doe",
  "userEmail": "test@example.com"
}
```

#### Get User Profile
```bash
GET /api/auth/profile
Headers:
  authorization: Bearer <token>
  email: test@example.com
```

**Test with curl:**
```bash
curl https://zhao401-3060.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/api/auth/profile \
  -H "authorization: Bearer YOUR_TOKEN_HERE" \
  -H "email: test@example.com"
```

#### Update User Profile
```bash
PUT /api/auth/update
Headers:
  authorization: Bearer <token>
  email: test@example.com
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith"
}
```

**Test with curl:**
```bash
curl -X PUT https://zhao401-3060.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/api/auth/update \
  -H "authorization: Bearer YOUR_TOKEN_HERE" \
  -H "email: test@example.com" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith"
  }'
```

---

### 5. Search Endpoint

#### Search Gifts
```bash
GET /api/search?query=searchterm
```

**Test with curl:**
```bash
curl "https://zhao401-3060.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/api/search?query=book"
```

---

## 🧪 Testing Priority Order

### Essential Tests (Do These First):

1. **Health Check**
```bash
curl https://zhao401-3060.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/
```

2. **Get All Gifts**
```bash
curl https://zhao401-3060.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/gift
```

3. **Get Comments for First Gift** (use ID from step 2)
```bash
curl https://zhao401-3060.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/api/comments/1
```

4. **Add a Negative Comment** (test sentiment analysis)
```bash
curl -X POST https://zhao401-3060.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/api/comments/1 \
  -H "Content-Type: application/json" \
  -d '{"author": "Test User", "comment": "i dont like this, too small"}'
```

5. **Verify Negative Sentiment** - Check the response has `"sentiment": "negative"`

---

## 📝 Quick Test Script

Save this as `test-backend.sh`:

```bash
#!/bin/bash

BASE_URL="https://zhao401-3060.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai"

echo "=== Testing GiftBank Backend API ==="
echo ""

echo "1. Health Check:"
curl -s "$BASE_URL/" | jq .
echo ""

echo "2. Get All Gifts:"
curl -s "$BASE_URL/gift" | jq '. | length'
echo ""

echo "3. Get Comments for Gift 1:"
curl -s "$BASE_URL/api/comments/1" | jq .
echo ""

echo "4. Add Negative Comment:"
curl -s -X POST "$BASE_URL/api/comments/1" \
  -H "Content-Type: application/json" \
  -d '{"author": "Test User", "comment": "i dont like the color"}' | jq .
echo ""

echo "5. Add Positive Comment:"
curl -s -X POST "$BASE_URL/api/comments/1" \
  -H "Content-Type: application/json" \
  -d '{"author": "Happy User", "comment": "This is amazing! I love it!"}' | jq .
echo ""

echo "6. Add Neutral Comment:"
curl -s -X POST "$BASE_URL/api/comments/1" \
  -H "Content-Type: application/json" \
  -d '{"author": "Curious User", "comment": "Is this still available?"}' | jq .
echo ""

echo "=== Tests Complete ==="
```

Make executable and run:
```bash
chmod +x test-backend.sh
./test-backend.sh
```

---

## 🎯 Key Endpoints to Test for Comments Feature

### Test 1: Verify Comments Exist
```bash
curl https://zhao401-3060.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/api/comments/1
```
✅ Should return array of comments

### Test 2: Add Negative Comment
```bash
curl -X POST https://zhao401-3060.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/api/comments/1 \
  -H "Content-Type: application/json" \
  -d '{"author": "Test", "comment": "its too small for my room"}'
```
✅ Should return `"sentiment": "negative"`

### Test 3: Add Positive Comment
```bash
curl -X POST https://zhao401-3060.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/api/comments/1 \
  -H "Content-Type: application/json" \
  -d '{"author": "Test", "comment": "I love this! Perfect!"}'
```
✅ Should return `"sentiment": "positive"`

---

## 🔍 Troubleshooting

### If you get CORS errors:
Your backend has CORS enabled with `app.use("*", cors())`, so this should work.

### If sentiment is always "neutral":
Make sure:
1. Sentiment service is running and accessible
2. Backend can reach sentiment service URL
3. Check backend logs for sentiment service connection errors

### If you get 404 errors:
1. Verify MongoDB is running
2. Check that collections exist and have data
3. Run the sample data script: `node util/add-sample-comments.js`

---

## 📊 Expected Results Summary

| Endpoint | Method | Expected Status | Expected Response |
|----------|--------|----------------|-------------------|
| `/` | GET | 200 | "Inside the server" |
| `/gift` | GET | 200 | Array of gifts |
| `/gift/:id` | GET | 200 | Single gift object |
| `/api/comments/:giftId` | GET | 200 | Array of comments |
| `/api/comments/:giftId` | POST | 201 | New comment with sentiment |
| `/api/auth/register` | POST | 200 | Auth token + email |
| `/api/auth/login` | POST | 200 | Auth token + user info |
| `/api/search` | GET | 200 | Array of matching gifts |

---

## 🎉 Success Criteria

Your backend is working correctly if:
- ✅ Health check returns "Inside the server"
- ✅ `/gift` returns array of gifts with embedded comments
- ✅ `/api/comments/:id` returns comments for specific gift
- ✅ POST to `/api/comments/:id` with "i don't like" returns `sentiment: "negative"`
- ✅ POST to `/api/comments/:id` with "I love it" returns `sentiment: "positive"`
- ✅ Comments are persisted in MongoDB
