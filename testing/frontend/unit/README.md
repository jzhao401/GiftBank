# Frontend Unit Tests

This directory contains unit tests for React components and utilities in the GiftBank frontend.

## Coverage Target
**80% code coverage** for all frontend code.

## Structure
```
unit/
└── components/           # Component tests
    ├── MainPage.test.js
    ├── LoginPage.test.js
    ├── RegisterPage.test.js
    ├── Navbar.test.js
    ├── DetailsPage.test.js
    ├── SearchPage.test.js
    └── Profile.test.js
```

## Running Unit Tests
```bash
cd giftlink-frontend
npm run test:unit -- --coverage
```

## Writing Component Tests

### Key Principles
1. **Test user behavior** - Focus on what users see and do
2. **Avoid implementation details** - Don't test internal state or methods
3. **Use accessible queries** - Query by role, label, text (not test IDs)
4. **Test interactions** - Simulate user clicks, typing, navigation
5. **Mock API calls** - Don't make real network requests

### Example Test Structure
```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MainPage from './MainPage';

describe('MainPage Component', () => {
  it('renders welcome message', () => {
    render(
      <BrowserRouter>
        <MainPage />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
  });
  
  it('displays list of gifts', async () => {
    render(
      <BrowserRouter>
        <MainPage />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Gift 1')).toBeInTheDocument();
    });
  });
  
  it('navigates to details page when gift is clicked', () => {
    render(
      <BrowserRouter>
        <MainPage />
      </BrowserRouter>
    );
    
    const giftLink = screen.getByRole('link', { name: /gift 1/i });
    fireEvent.click(giftLink);
    
    // Verify navigation occurred
  });
});
```

## Testing Patterns

### Testing Form Components
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from './LoginPage';

describe('LoginPage', () => {
  it('validates email format', async () => {
    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText(/email/i);
    await userEvent.type(emailInput, 'invalid-email');
    
    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);
    
    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
  });
  
  it('submits form with valid data', async () => {
    const mockSubmit = jest.fn();
    render(<LoginPage onSubmit={mockSubmit} />);
    
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });
});
```

### Testing Conditional Rendering
```javascript
describe('Navbar', () => {
  it('shows login link when user is not authenticated', () => {
    render(<Navbar isAuthenticated={false} />);
    
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /logout/i })).not.toBeInTheDocument();
  });
  
  it('shows logout button when user is authenticated', () => {
    render(<Navbar isAuthenticated={true} />);
    
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /login/i })).not.toBeInTheDocument();
  });
});
```

### Mocking API Calls
```javascript
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
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

describe('MainPage with API', () => {
  it('fetches and displays gifts', async () => {
    render(<MainPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Gift 1')).toBeInTheDocument();
      expect(screen.getByText('Gift 2')).toBeInTheDocument();
    });
  });
  
  it('handles API errors', async () => {
    server.use(
      rest.get('/api/gifts', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );
    
    render(<MainPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/error loading gifts/i)).toBeInTheDocument();
    });
  });
});
```

## React Testing Library Queries

### Query Priority (use in this order)
1. **getByRole** - Most accessible, preferred
2. **getByLabelText** - Good for form fields
3. **getByPlaceholderText** - For inputs without labels
4. **getByText** - For non-interactive elements
5. **getByTestId** - Last resort only

### Query Variants
- **getBy** - Throws error if not found (use for elements that should exist)
- **queryBy** - Returns null if not found (use for elements that shouldn't exist)
- **findBy** - Async, waits for element (use for elements that appear after async operation)

## Best Practices

1. **Wrap with Router** - Components using routing need `<BrowserRouter>`
2. **Use userEvent** - Prefer `userEvent` over `fireEvent` for realistic interactions
3. **Wait for async** - Use `waitFor` for async operations
4. **Clean up** - React Testing Library auto-cleans, but clean up timers/subscriptions
5. **Test accessibility** - Use semantic queries (role, label)
6. **Mock sparingly** - Only mock what's necessary
7. **Test user perspective** - What users see and do, not implementation

## Coverage Reports

View coverage report:
```bash
npm test -- --coverage --watchAll=false
open coverage/lcov-report/index.html
```

## Common Issues

### Issue: "Not wrapped in act(...)"
**Solution**: Use `waitFor` or `findBy` for async operations

### Issue: "Unable to find element"
**Solution**: Check if element is rendered, use correct query, wait for async

### Issue: "Router context error"
**Solution**: Wrap component in `<BrowserRouter>` or `<MemoryRouter>`
