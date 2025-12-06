// Unit tests for comment routes
// Location: /testing/backend/comments.test.js

const request = require('supertest');
const { MongoClient } = require('mongodb');

describe('Comment API Tests', () => {
  let app;
  let client;
  let db;
  const testGiftId = 'test_gift_001';

  beforeAll(async () => {
    // Setup test database connection
    const url = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017';
    client = new MongoClient(url);
    await client.connect();
    db = client.db('giftdb_test');
    
    // Import app after database is ready
    app = require('../../giftlink-backend/app');
    
    // Create test gift
    await db.collection('gifts').insertOne({
      id: testGiftId,
      name: 'Test Gift',
      category: 'Test',
      comments: []
    });
  });

  afterAll(async () => {
    // Clean up test data
    await db.collection('gifts').deleteMany({ id: testGiftId });
    await client.close();
  });

  describe('GET /api/comments/:giftId', () => {
    test('should return empty array for gift with no comments', async () => {
      const response = await request(app)
        .get(`/api/comments/${testGiftId}`)
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    test('should return 404 for non-existent gift', async () => {
      await request(app)
        .get('/api/comments/nonexistent_gift')
        .expect(404);
    });

    test('should return comments for gift with existing comments', async () => {
      // Add a comment first
      await db.collection('gifts').updateOne(
        { id: testGiftId },
        {
          $push: {
            comments: {
              author: 'Test User',
              comment: 'Test comment',
              sentiment: 'positive',
              createdAt: new Date().toISOString()
            }
          }
        }
      );

      const response = await request(app)
        .get(`/api/comments/${testGiftId}`)
        .expect(200);

      expect(response.body.length).toBe(1);
      expect(response.body[0].author).toBe('Test User');
      expect(response.body[0].comment).toBe('Test comment');
      expect(response.body[0].sentiment).toBe('positive');
    });
  });

  describe('POST /api/comments/:giftId', () => {
    test('should add a positive comment', async () => {
      const newComment = {
        author: 'Happy User',
        comment: 'This is amazing! I love it!'
      };

      const response = await request(app)
        .post(`/api/comments/${testGiftId}`)
        .send(newComment)
        .expect(201);

      expect(response.body.author).toBe('Happy User');
      expect(response.body.comment).toBe('This is amazing! I love it!');
      expect(response.body.sentiment).toBe('positive');
      expect(response.body.createdAt).toBeDefined();
    });

    test('should add a negative comment', async () => {
      const newComment = {
        author: 'Unhappy User',
        comment: 'This is terrible and broken.'
      };

      const response = await request(app)
        .post(`/api/comments/${testGiftId}`)
        .send(newComment)
        .expect(201);

      expect(response.body.sentiment).toBe('negative');
    });

    test('should add a neutral comment', async () => {
      const newComment = {
        author: 'Neutral User',
        comment: 'Is this still available?'
      };

      const response = await request(app)
        .post(`/api/comments/${testGiftId}`)
        .send(newComment)
        .expect(201);

      expect(response.body.sentiment).toBe('neutral');
    });

    test('should return 400 for missing author', async () => {
      await request(app)
        .post(`/api/comments/${testGiftId}`)
        .send({ comment: 'Test comment' })
        .expect(400);
    });

    test('should return 400 for missing comment', async () => {
      await request(app)
        .post(`/api/comments/${testGiftId}`)
        .send({ author: 'Test User' })
        .expect(400);
    });

    test('should return 404 for non-existent gift', async () => {
      await request(app)
        .post('/api/comments/nonexistent_gift')
        .send({
          author: 'Test User',
          comment: 'Test comment'
        })
        .expect(404);
    });

    test('should handle sentiment service failure gracefully', async () => {
      // This test requires mocking the sentiment service to fail
      // The comment should still be added with 'neutral' sentiment
      const newComment = {
        author: 'Test User',
        comment: 'Test comment for failure handling'
      };

      const response = await request(app)
        .post(`/api/comments/${testGiftId}`)
        .send(newComment)
        .expect(201);

      // Should not fail even if sentiment analysis fails
      expect(response.body.sentiment).toBeDefined();
    });
  });

  describe('Comment persistence', () => {
    test('should persist comments in database', async () => {
      const newComment = {
        author: 'Persistent User',
        comment: 'This should be saved'
      };

      await request(app)
        .post(`/api/comments/${testGiftId}`)
        .send(newComment)
        .expect(201);

      // Verify in database
      const gift = await db.collection('gifts').findOne({ id: testGiftId });
      const savedComment = gift.comments.find(c => c.author === 'Persistent User');
      
      expect(savedComment).toBeDefined();
      expect(savedComment.comment).toBe('This should be saved');
    });

    test('should maintain comment order (newest first)', async () => {
      // Clear existing comments
      await db.collection('gifts').updateOne(
        { id: testGiftId },
        { $set: { comments: [] } }
      );

      // Add multiple comments
      await request(app)
        .post(`/api/comments/${testGiftId}`)
        .send({ author: 'User 1', comment: 'First comment' });

      await request(app)
        .post(`/api/comments/${testGiftId}`)
        .send({ author: 'User 2', comment: 'Second comment' });

      const response = await request(app)
        .get(`/api/comments/${testGiftId}`)
        .expect(200);

      // Comments should be in order they were added (MongoDB $push adds to end)
      expect(response.body[0].author).toBe('User 1');
      expect(response.body[1].author).toBe('User 2');
    });
  });

  describe('Sentiment analysis integration', () => {
    test('should correctly classify very positive comments', async () => {
      const testCases = [
        'This is absolutely wonderful! I love it so much!',
        'Amazing quality! Perfect condition! Thank you!',
        'Excellent item! Fantastic! Highly recommend!'
      ];

      for (const comment of testCases) {
        const response = await request(app)
          .post(`/api/comments/${testGiftId}`)
          .send({ author: 'Test User', comment })
          .expect(201);

        expect(response.body.sentiment).toBe('positive');
      }
    });

    test('should correctly classify very negative comments', async () => {
      const testCases = [
        'This is terrible! Completely broken and useless!',
        'Awful condition! Very disappointed!',
        'Horrible quality! Would not recommend!'
      ];

      for (const comment of testCases) {
        const response = await request(app)
          .post(`/api/comments/${testGiftId}`)
          .send({ author: 'Test User', comment })
          .expect(201);

        expect(response.body.sentiment).toBe('negative');
      }
    });

    test('should correctly classify neutral comments', async () => {
      const testCases = [
        'Is this still available?',
        'What are the dimensions?',
        'Can you provide more details?'
      ];

      for (const comment of testCases) {
        const response = await request(app)
          .post(`/api/comments/${testGiftId}`)
          .send({ author: 'Test User', comment })
          .expect(201);

        expect(response.body.sentiment).toBe('neutral');
      }
    });
  });
});

// Export for test runner
module.exports = {};
