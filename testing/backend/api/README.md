# Backend API Tests

This directory contains API tests for the GiftBank backend. API tests verify HTTP endpoints, request/response formats, status codes, and data validation.

## Coverage Target
**100% endpoint coverage** - Every API endpoint should have tests.

## Structure
```
api/
├── gift-api.test.js      # Gift endpoint tests
├── search-api.test.js    # Search endpoint tests
└── auth-api.test.js      # Authentication endpoint tests
```

## Running API Tests
```bash
cd giftlink-backend
npm run test:api
```

## What to Test

API tests should verify:
1. **HTTP Status Codes** - 200, 201, 400, 401, 404, 500, etc.
2. **Response Format** - JSON structure, required fields
3. **Request Validation** - Invalid inputs, missing fields
4. **Authentication** - Protected endpoints require valid tokens
5. **Error Messages** - Meaningful error responses
6. **Data Types** - Correct data types in responses

## Writing API Tests

### Key Principles
1. **Test the HTTP interface** - Focus on request/response, not implementation
2. **Verify status codes** - Ensure correct HTTP status for each scenario
3. **Validate response structure** - Check JSON schema and required fields
4. **Test all endpoints** - GET, POST, PUT, DELETE, PATCH
5. **Test edge cases** - Empty data, invalid formats, boundary values

### Example Test Structure
```javascript
const request = require('supertest');
const { expect } = require('chai');
const app = require('../../app');

describe('Gift API Tests', () => {
  describe('GET /gift', () => {
    it('should return 200 and array of gifts', async () => {
      const res = await request(app)
        .get('/gift')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(res.body).to.be.an('array');
    });
    
    it('should return gifts with correct structure', async () => {
      const res = await request(app).get('/gift');
      
      if (res.body.length > 0) {
        const gift = res.body[0];
        expect(gift).to.have.property('id');
        expect(gift).to.have.property('name');
        expect(gift).to.have.property('description');
      }
    });
  });
  
  describe('POST /gift', () => {
    it('should return 401 without authentication', async () => {
      await request(app)
        .post('/gift')
        .send({ name: 'Test Gift' })
        .expect(401);
    });
    
    it('should return 400 with invalid data', async () => {
      const res = await request(app)
        .post('/gift')
        .set('Authorization', 'Bearer valid_token')
        .send({ invalid: 'data' })
        .expect(400);
      
      expect(res.body).to.have.property('error');
    });
    
    it('should create gift with valid data', async () => {
      const res = await request(app)
        .post('/gift')
        .set('Authorization', 'Bearer valid_token')
        .send({
          name: 'Test Gift',
          description: 'A test gift',
          price: 29.99
        })
        .expect(201);
      
      expect(res.body).to.have.property('id');
      expect(res.body.name).to.equal('Test Gift');
    });
  });
  
  describe('GET /gift/:id', () => {
    it('should return 404 for non-existent gift', async () => {
      await request(app)
        .get('/gift/nonexistent123')
        .expect(404);
    });
    
    it('should return gift by id', async () => {
      const res = await request(app)
        .get('/gift/existing_id')
        .expect(200);
      
      expect(res.body).to.have.property('id');
    });
  });
});
```

## Testing Patterns

### Authentication Testing
```javascript
describe('Authentication', () => {
  it('should reject requests without token', async () => {
    await request(app)
      .get('/gift/protected')
      .expect(401);
  });
  
  it('should reject requests with invalid token', async () => {
    await request(app)
      .get('/gift/protected')
      .set('Authorization', 'Bearer invalid_token')
      .expect(401);
  });
  
  it('should accept requests with valid token', async () => {
    await request(app)
      .get('/gift/protected')
      .set('Authorization', 'Bearer valid_token')
      .expect(200);
  });
});
```

### Request Validation Testing
```javascript
describe('Request Validation', () => {
  it('should reject missing required fields', async () => {
    const res = await request(app)
      .post('/gift')
      .send({})
      .expect(400);
    
    expect(res.body.error).to.include('name is required');
  });
  
  it('should reject invalid data types', async () => {
    const res = await request(app)
      .post('/gift')
      .send({ name: 123, price: 'invalid' })
      .expect(400);
  });
  
  it('should accept valid data', async () => {
    await request(app)
      .post('/gift')
      .send({ name: 'Valid Gift', price: 29.99 })
      .expect(201);
  });
});
```

### Error Response Testing
```javascript
describe('Error Responses', () => {
  it('should return meaningful error messages', async () => {
    const res = await request(app)
      .post('/gift')
      .send({ invalid: 'data' })
      .expect(400);
    
    expect(res.body).to.have.property('error');
    expect(res.body.error).to.be.a('string');
    expect(res.body.error.length).to.be.greaterThan(0);
  });
  
  it('should handle server errors gracefully', async () => {
    // Simulate server error condition
    const res = await request(app)
      .get('/gift/cause_error')
      .expect(500);
    
    expect(res.body).to.have.property('error');
  });
});
```

## Response Schema Validation

### Using Chai for Schema Validation
```javascript
const { expect } = require('chai');

describe('Response Schema', () => {
  it('should match expected gift schema', async () => {
    const res = await request(app).get('/gift/123');
    
    expect(res.body).to.have.all.keys(
      'id', 'name', 'description', 'price', 'createdAt'
    );
    expect(res.body.id).to.be.a('string');
    expect(res.body.name).to.be.a('string');
    expect(res.body.price).to.be.a('number');
  });
});
```

## Best Practices

1. **Test all HTTP methods** - GET, POST, PUT, DELETE, PATCH
2. **Test all status codes** - Success and error cases
3. **Validate response structure** - Check JSON schema
4. **Test authentication** - Protected vs public endpoints
5. **Test edge cases** - Empty arrays, null values, large payloads
6. **Use descriptive test names** - Clearly state what is being tested
7. **Keep tests independent** - Each test should work in isolation
8. **Mock external services** - Don't depend on third-party APIs

## Common HTTP Status Codes

- **200 OK** - Successful GET, PUT, PATCH
- **201 Created** - Successful POST
- **204 No Content** - Successful DELETE
- **400 Bad Request** - Invalid request data
- **401 Unauthorized** - Missing or invalid authentication
- **403 Forbidden** - Authenticated but not authorized
- **404 Not Found** - Resource doesn't exist
- **500 Internal Server Error** - Server error
