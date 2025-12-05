# GiftBank Testing Suite

This directory contains all tests for the GiftBank application, organized by test type and component.

## Directory Structure

```
testing/
├── backend/           # Backend tests (Node.js/Express)
│   ├── unit/         # Unit tests (80% coverage target)
│   ├── integration/  # Integration tests (20% coverage)
│   └── api/          # API endpoint tests
├── frontend/         # Frontend tests (React)
│   ├── unit/         # Component unit tests (80% coverage target)
│   └── integration/  # User flow integration tests (20% coverage)
└── ui/               # UI/E2E tests (Playwright)
    └── e2e/          # End-to-end browser tests
```

## Test Categories

### Unit Tests (80% Coverage)
- **Backend**: Route handlers, utility functions, business logic
- **Frontend**: React components, hooks, utility functions
- Focus on testing individual units in isolation with mocked dependencies

### Integration Tests (20% Coverage)
- **Backend**: Multi-route flows, database interactions
- **Frontend**: User journeys across multiple components
- Focus on testing how units work together

### API Tests
- HTTP endpoint testing
- Request/response validation
- Status code verification
- Authentication flows

### UI Tests
- End-to-end browser automation
- Complete user workflows
- Cross-browser compatibility

## Running Tests

### Backend Tests
```bash
cd giftlink-backend

# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run API tests only
npm run test:api

# Run with coverage
npm run test:coverage
```

### Frontend Tests
```bash
cd giftlink-frontend

# Run all tests
npm test

# Run unit tests with coverage
npm run test:unit -- --coverage

# Run integration tests
npm run test:integration

# Run in watch mode
npm test -- --watch
```

### UI Tests
```bash
cd testing/ui

# Install dependencies (first time only)
npm install
npx playwright install

# Run all UI tests
npx playwright test

# Run in headed mode (see browser)
npx playwright test --headed

# Run specific test file
npx playwright test e2e/auth-flow.spec.js

# Generate test report
npx playwright show-report
```

## Coverage Requirements

- **Unit Tests**: Minimum 80% code coverage
- **Integration Tests**: Cover 20% of critical user flows
- **API Tests**: 100% endpoint coverage
- **UI Tests**: Cover all critical user journeys

## Writing Tests

### Backend Unit Test Example
```javascript
const { expect } = require('chai');
const sinon = require('sinon');

describe('Gift Routes', () => {
  it('should return all gifts', async () => {
    // Test implementation
  });
});
```

### Frontend Unit Test Example
```javascript
import { render, screen } from '@testing-library/react';
import MainPage from './MainPage';

test('renders main page', () => {
  render(<MainPage />);
  expect(screen.getByText(/welcome/i)).toBeInTheDocument();
});
```

### UI Test Example
```javascript
import { test, expect } from '@playwright/test';

test('user can login', async ({ page }) => {
  await page.goto('http://localhost:3000');
  // Test implementation
});
```

## CI/CD Integration

Tests can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Run Backend Tests
  run: |
    cd giftlink-backend
    npm install
    npm run test:coverage

- name: Run Frontend Tests
  run: |
    cd giftlink-frontend
    npm install
    npm test -- --coverage --watchAll=false

- name: Run UI Tests
  run: |
    cd testing/ui
    npm install
    npx playwright install
    npx playwright test
```

## Best Practices

1. **Write tests first** (TDD approach when possible)
2. **Keep tests isolated** - no dependencies between tests
3. **Use descriptive test names** - clearly state what is being tested
4. **Mock external dependencies** - databases, APIs, third-party services
5. **Test edge cases** - not just happy paths
6. **Maintain test data** - use fixtures and factories
7. **Keep tests fast** - unit tests should run in milliseconds
8. **Review coverage reports** - identify untested code paths

## Troubleshooting

### Backend Tests Failing
- Ensure MongoDB test database is running
- Check environment variables in `.env` file
- Verify all dependencies are installed

### Frontend Tests Failing
- Clear Jest cache: `npm test -- --clearCache`
- Check for async issues - use `waitFor` from testing-library
- Verify mock data matches expected structure

### UI Tests Failing
- Ensure both backend and frontend servers are running
- Check browser installation: `npx playwright install`
- Review screenshots in `test-results` directory
- Use `--headed` mode to debug visually

## Resources

- [Mocha Documentation](https://mochajs.org/)
- [Chai Assertion Library](https://www.chaijs.com/)
- [Supertest](https://github.com/visionmedia/supertest)
- [React Testing Library](https://testing-library.com/react)
- [Jest Documentation](https://jestjs.io/)
- [Playwright Documentation](https://playwright.dev/)
