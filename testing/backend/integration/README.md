# Backend Integration Tests

This directory contains integration tests for the GiftBank backend. Integration tests verify that multiple components work together correctly.

## Coverage Target
**20% of critical user flows** should be covered by integration tests.

## Structure
```
integration/
└── api.test.js      # Complete API flow tests
```

## Running Integration Tests
```bash
cd giftlink-backend
npm run test:integration
```

## What to Test

Integration tests should cover:
1. **Multi-route workflows** - User registration → Login → Create gift → Search
2. **Database interactions** - Real database operations (use test database)
3. **Authentication flows** - Token generation and validation across requests
4. **Error propagation** - How errors flow through the system
5. **Data consistency** - Verify data integrity across operations

## Writing Integration Tests

### Key Principles
1. **Test realistic scenarios** - Simulate actual user workflows
2. **Use test database** - Connect to a separate test database
3. **Clean up after tests** - Reset database state between tests
4. **Test the full stack** - Don't mock database or major components

### Example Test Structure
```javascript
const request = require('supertest');
const { expect } = require('chai');
const app = require('../../app');
const { connectToDatabase } = require('../../models/db');

describe('API Integration Tests', () => {
  let authToken;
  
  before(async () => {
    // Connect to test database
    await connectToDatabase(process.env.TEST_DB_URI);
  });
  
  beforeEach(async () => {
    // Clear test data before each test
    await clearTestData();
  });
  
  after(async () => {
    // Cleanup after all tests
    await closeDatabase();
  });
  
  describe('Complete User Flow', () => {
    it('should allow user to register, login, and create a gift', async () => {
      // Step 1: Register
      const registerRes = await request(app)
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });
      
      expect(registerRes.status).to.equal(201);
      
      // Step 2: Login
      const loginRes = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });
      
      expect(loginRes.status).to.equal(200);
      authToken = loginRes.body.token;
      
      // Step 3: Create gift
      const giftRes = await request(app)
        .post('/gift')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Gift',
          description: 'A test gift'
        });
      
      expect(giftRes.status).to.equal(201);
      expect(giftRes.body).to.have.property('id');
    });
  });
});
```

## Test Database Setup

### Environment Configuration
Create a `.env.test` file:
```
TEST_DB_URI=mongodb://localhost:27017/giftbank_test
NODE_ENV=test
```

### Database Helpers
```javascript
const { MongoClient } = require('mongodb');

async function clearTestData() {
  const client = await MongoClient.connect(process.env.TEST_DB_URI);
  const db = client.db();
  
  await db.collection('users').deleteMany({});
  await db.collection('gifts').deleteMany({});
  
  await client.close();
}
```

## Best Practices

1. **Use test database** - Never run integration tests against production
2. **Isolate test data** - Each test should create its own data
3. **Clean up thoroughly** - Remove all test data after tests
4. **Test critical paths** - Focus on the most important user workflows
5. **Keep tests independent** - Tests should not depend on execution order
6. **Use realistic data** - Test with data that resembles production
7. **Test error scenarios** - Verify error handling in multi-step flows

## Common Patterns

### Authentication Flow Testing
```javascript
describe('Authentication Flow', () => {
  it('should reject requests without valid token', async () => {
    const res = await request(app)
      .get('/gift')
      .set('Authorization', 'Bearer invalid_token');
    
    expect(res.status).to.equal(401);
  });
});
```

### Data Consistency Testing
```javascript
describe('Data Consistency', () => {
  it('should maintain referential integrity', async () => {
    // Create user
    // Create gift linked to user
    // Delete user
    // Verify gift handling (cascade delete or orphan handling)
  });
});
```
