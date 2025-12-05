# Backend Unit Tests

This directory contains unit tests for the GiftBank backend. Unit tests focus on testing individual functions and route handlers in isolation with mocked dependencies.

## Coverage Target
**80% code coverage** for all backend code.

## Structure
```
unit/
├── routes/           # Route handler tests
│   ├── giftRoutes.test.js
│   ├── searchRoutes.test.js
│   └── authRoutes.test.js
└── util/            # Utility function tests
    └── helpers.test.js
```

## Running Unit Tests
```bash
cd giftlink-backend
npm run test:unit
npm run test:coverage
```

## Writing Unit Tests

### Key Principles
1. **Isolate the unit** - Mock all external dependencies (database, other modules)
2. **Test one thing** - Each test should verify a single behavior
3. **Use descriptive names** - Test names should clearly state what is being tested
4. **Cover edge cases** - Test error conditions, boundary values, and edge cases

### Example Test Structure
```javascript
const { expect } = require('chai');
const sinon = require('sinon');

describe('Gift Routes Unit Tests', () => {
  let req, res, next;
  
  beforeEach(() => {
    // Setup mocks before each test
    req = { body: {}, params: {}, query: {} };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
      send: sinon.stub().returnsThis()
    };
    next = sinon.stub();
  });
  
  afterEach(() => {
    // Clean up after each test
    sinon.restore();
  });
  
  describe('GET /gift', () => {
    it('should return all gifts', async () => {
      // Arrange
      const mockGifts = [{ id: 1, name: 'Gift 1' }];
      
      // Act
      // Call the route handler
      
      // Assert
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(mockGifts)).to.be.true;
    });
    
    it('should handle database errors', async () => {
      // Test error handling
    });
  });
});
```

## Mocking Strategies

### Mocking Database
```javascript
const sinon = require('sinon');
const db = require('../models/db');

// Stub database methods
sinon.stub(db, 'collection').returns({
  find: sinon.stub().resolves([]),
  findOne: sinon.stub().resolves(null),
  insertOne: sinon.stub().resolves({ insertedId: '123' })
});
```

### Mocking External Modules
```javascript
const proxyquire = require('proxyquire');

const routeHandler = proxyquire('../routes/giftRoutes', {
  '../models/db': mockDb,
  'jsonwebtoken': mockJwt
});
```

## Coverage Reports

After running tests with coverage, view the HTML report:
```bash
open coverage/index.html
```

Coverage reports show:
- **Statements**: Percentage of code statements executed
- **Branches**: Percentage of conditional branches tested
- **Functions**: Percentage of functions called
- **Lines**: Percentage of code lines executed

## Best Practices

1. **Fast execution** - Unit tests should run in milliseconds
2. **No external dependencies** - Don't connect to real databases or APIs
3. **Deterministic** - Tests should produce the same result every time
4. **Independent** - Tests should not depend on each other
5. **Clear assertions** - Use specific, meaningful assertions
6. **Test behavior, not implementation** - Focus on what the code does, not how
