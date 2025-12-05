# Frontend Integration Tests

This directory contains integration tests for user flows across multiple components in the GiftBank frontend.

## Coverage Target
**20% of critical user flows** should be covered by integration tests.

## Structure
```
integration/
└── user-flow.test.js    # Complete user journey tests
```

## Running Integration Tests
```bash
cd giftlink-frontend
npm run test:integration
```

## What to Test

Integration tests should cover:
1. **Multi-page workflows** - Login → Browse → View Details → Add to Cart
2. **State management** - Data flow between components
3. **Navigation** - Routing between pages
4. **Context/Props** - Shared state across component tree
5. **Complete user journeys** - Realistic end-to-end scenarios

## Writing Integration Tests

### Key Principles
1. **Test complete workflows** - Multiple components working together
2. **Simulate real user behavior** - Click, type, navigate as users would
3. **Verify state changes** - Check that data flows correctly
4. **Test navigation** - Ensure routing works properly
5. **Keep tests realistic** - Mirror actual user journeys

### Example Test Structure
```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

describe('User Flow Integration Tests', () => {
  it('complete authentication and gift browsing flow', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    // Step 1: Navigate to login page
    const loginLink = screen.getByRole('link', { name: /login/i });
    fireEvent.click(loginLink);
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    });
    
    // Step 2: Fill in login form
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    
    // Step 3: Submit login
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    // Step 4: Verify redirect to main page
    await waitFor(() => {
      expect(screen.getByText(/welcome/i)).toBeInTheDocument();
    });
    
    // Step 5: Browse gifts
    const giftLink = screen.getByRole('link', { name: /gift 1/i });
    fireEvent.click(giftLink);
    
    // Step 6: Verify details page
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /gift 1/i })).toBeInTheDocument();
    });
  });
});
```

## Testing Patterns

### Authentication Flow
```javascript
describe('Authentication Flow', () => {
  it('allows user to register and login', async () => {
    render(<App />);
    
    // Navigate to register
    fireEvent.click(screen.getByRole('link', { name: /register/i }));
    
    // Fill registration form
    await userEvent.type(screen.getByLabelText(/email/i), 'newuser@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'password123');
    
    // Submit registration
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    
    // Verify redirect to login
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    });
    
    // Login with new credentials
    await userEvent.type(screen.getByLabelText(/email/i), 'newuser@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    // Verify successful login
    await waitFor(() => {
      expect(screen.getByText(/welcome/i)).toBeInTheDocument();
    });
  });
});
```

### Search and Filter Flow
```javascript
describe('Search Flow', () => {
  it('allows user to search and view results', async () => {
    render(<App />);
    
    // Navigate to search page
    fireEvent.click(screen.getByRole('link', { name: /search/i }));
    
    // Enter search query
    const searchInput = screen.getByPlaceholderText(/search gifts/i);
    await userEvent.type(searchInput, 'birthday');
    
    // Submit search
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    
    // Verify results
    await waitFor(() => {
      expect(screen.getByText(/search results/i)).toBeInTheDocument();
    });
    
    // Click on a result
    const resultLink = screen.getByRole('link', { name: /birthday gift/i });
    fireEvent.click(resultLink);
    
    // Verify details page
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /birthday gift/i })).toBeInTheDocument();
    });
  });
});
```

### State Management Flow
```javascript
describe('State Management', () => {
  it('maintains user state across navigation', async () => {
    render(<App />);
    
    // Login
    fireEvent.click(screen.getByRole('link', { name: /login/i }));
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    // Navigate to profile
    await waitFor(() => {
      fireEvent.click(screen.getByRole('link', { name: /profile/i }));
    });
    
    // Verify user data is displayed
    await waitFor(() => {
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });
    
    // Navigate to main page
    fireEvent.click(screen.getByRole('link', { name: /home/i }));
    
    // Verify user is still logged in
    expect(screen.getByRole('link', { name: /profile/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /login/i })).not.toBeInTheDocument();
  });
});
```

## Mocking for Integration Tests

### Mock API with MSW
```javascript
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.post('/api/auth/login', (req, res, ctx) => {
    return res(ctx.json({ token: 'fake-token', user: { email: 'test@example.com' } }));
  }),
  rest.get('/api/gifts', (req, res, ctx) => {
    return res(ctx.json([
      { id: 1, name: 'Gift 1' },
      { id: 2, name: 'Gift 2' }
    ]));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### Mock Router
```javascript
import { MemoryRouter } from 'react-router-dom';

render(
  <MemoryRouter initialEntries={['/login']}>
    <App />
  </MemoryRouter>
);
```

## Best Practices

1. **Test realistic flows** - Mirror actual user behavior
2. **Use MemoryRouter** - Better control over routing in tests
3. **Mock API calls** - Use MSW for realistic mocking
4. **Test error paths** - Verify error handling in flows
5. **Keep tests focused** - One flow per test
6. **Clean up state** - Reset between tests
7. **Test critical paths** - Focus on most important user journeys

## Common User Flows to Test

1. **Registration → Login → Browse**
2. **Search → View Details → Back to Search**
3. **Login → Create Gift → View Gift**
4. **Browse → Filter → Sort → View Details**
5. **Login → Profile → Edit → Save**
6. **Logout → Verify Protected Routes**

## Debugging Tips

1. **Use screen.debug()** - Print current DOM
2. **Check async timing** - Use `waitFor` appropriately
3. **Verify routing** - Check URL changes
4. **Inspect state** - Use React DevTools
5. **Check console** - Look for warnings/errors
