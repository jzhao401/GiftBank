# Comments Feature Implementation

This document describes the implementation of the comments feature for the GiftBank project.

## Overview

The comments feature allows users to:
1. View comments on gift items with sentiment analysis (positive, negative, neutral)
2. Submit new comments which are automatically analyzed for sentiment
3. See visual indicators for comment sentiment

## Components

### Backend Components

1. **Comment Routes** (`giftlink-backend/routes/commentRoutes.js`)
   - `GET /api/comments/:giftId` - Fetch comments for a specific gift
   - `POST /api/comments/:giftId` - Add a new comment to a gift
   - Integrates with sentiment analysis service

2. **Database Structure**
   - Comments are stored as an array within each gift document
   - Each comment contains:
     - `author`: Username of the commenter
     - `comment`: The comment text
     - `sentiment`: Sentiment analysis result (positive/negative/neutral)
     - `createdAt`: ISO timestamp of when the comment was created

3. **Sentiment Service Integration**
   - Backend connects to sentiment service at `http://localhost:3000`
   - Analyzes comment text and returns sentiment classification
   - Falls back to "neutral" if sentiment analysis fails

### Frontend Components

1. **DetailsPage Component** (`giftlink-frontend/src/components/DetailsPage/DetailsPage.js`)
   - Fetches and displays comments from MongoDB
   - Includes comment submission form
   - Real-time comment updates after submission
   - Displays username from session storage

2. **Styling** (`giftlink-frontend/src/components/DetailsPage/DetailsPage.css`)
   - Sentiment-based color coding:
     - Positive: Green border (#28a745) and light green background
     - Negative: Red border (#dc3545) and light red background
     - Neutral: Gray border (#6c757d) and light gray background
   - Sentiment badges for visual identification
   - Hover effects on comment cards
   - Responsive design for mobile devices

## Setup Instructions

### 1. Add Sample Comments to MongoDB

Run the following script to populate your existing gift items with sample comments:

```bash
cd giftlink-backend
node util/add-sample-comments.js
```

This will add 3-5 randomly selected comments to each gift in your database.

### 2. Environment Configuration

The sentiment service URL is already configured in `giftlink-backend/envs`:

```
SENTIMENT_SERVICE_URL="http://localhost:3000"
```

### 3. Start Services

Make sure all services are running:

```bash
# Terminal 1: Start MongoDB
mongod --dbpath=/path/to/GiftBank/db

# Terminal 2: Start sentiment service
cd sentiment
npm install
npm start

# Terminal 3: Start backend
cd giftlink-backend
npm install
npm start

# Terminal 4: Start frontend
cd giftlink-frontend
npm install
npm start
```

## API Endpoints

### Get Comments
```
GET /api/comments/:giftId
```

**Response:**
```json
[
  {
    "author": "John Doe",
    "comment": "I would like this! This looks amazing!",
    "sentiment": "positive",
    "createdAt": "2024-11-01T10:30:00.000Z"
  }
]
```

### Add Comment
```
POST /api/comments/:giftId
Content-Type: application/json

{
  "author": "Jane Smith",
  "comment": "This is exactly what I need!"
}
```

**Response:**
```json
{
  "author": "Jane Smith",
  "comment": "This is exactly what I need!",
  "sentiment": "positive",
  "createdAt": "2024-11-15T14:23:45.678Z"
}
```

## Sample Comments Data

The sample comments include various sentiments:

**Positive Examples:**
- "I would like this! This looks amazing!"
- "This is a good one! Perfect for my needs."
- "Great item! Exactly what I've been looking for!"

**Negative Examples:**
- "Condition doesn't look great from the photos."

**Neutral Examples:**
- "Just DMed you. Hope it's still available."
- "Is this still available? Would love to have it."

## Testing

### Manual Testing

1. Navigate to any gift details page
2. Verify existing comments are displayed with correct sentiment styling
3. Submit a new comment and verify it appears with the correct sentiment
4. Check that positive comments have green styling
5. Check that negative comments have red styling
6. Check that neutral comments have gray styling

### Unit Tests

You can add tests in the `/testing` directory:

```javascript
// Test comment submission
describe('Comment API', () => {
  it('should add a comment with sentiment analysis', async () => {
    // Test implementation
  });
});
```

## Troubleshooting

### Comments not loading
- Check that MongoDB is running
- Verify the gift exists in the database
- Check browser console for error messages

### Sentiment analysis failing
- Ensure sentiment service is running on port 3000
- Check backend logs for sentiment service connection errors
- Comments will default to "neutral" if sentiment analysis fails

### Username showing as "Anonymous"
- Ensure user is logged in
- Check that username is stored in sessionStorage after login

## Future Enhancements

1. **Comment Editing/Deletion**: Allow users to edit or delete their own comments
2. **Reply Threading**: Add ability to reply to specific comments
3. **Like/Upvote System**: Allow users to like or upvote comments
4. **Comment Moderation**: Add admin tools for moderating inappropriate comments
5. **Real-time Updates**: Implement WebSocket for real-time comment updates
6. **Pagination**: Add pagination for gifts with many comments
7. **Rich Text Editing**: Support markdown or rich text in comments
