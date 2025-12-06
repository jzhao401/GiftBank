// Frontend tests for Comments feature
// Location: /testing/frontend/DetailsPage.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DetailsPage from '../../giftlink-frontend/src/components/DetailsPage/DetailsPage';

// Mock fetch API
global.fetch = jest.fn();

// Mock sessionStorage
const mockSessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
global.sessionStorage = mockSessionStorage;

// Mock useNavigate and useParams
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ productId: 'test_gift_001' })
}));

describe('DetailsPage - Comments Feature', () => {
  const mockGift = {
    id: 'test_gift_001',
    name: 'Test Gift',
    category: 'Test Category',
    condition: 'Good',
    dateAdded: '2024-01-01',
    age_years: 2,
    description: 'Test description',
    image: 'test.jpg'
  };

  const mockComments = [
    {
      author: 'John Doe',
      comment: 'This is amazing!',
      sentiment: 'positive',
      createdAt: '2024-11-01T10:30:00.000Z'
    },
    {
      author: 'Jane Smith',
      comment: 'Is this available?',
      sentiment: 'neutral',
      createdAt: '2024-11-02T14:20:00.000Z'
    },
    {
      author: 'Bob Johnson',
      comment: 'Not great condition.',
      sentiment: 'negative',
      createdAt: '2024-11-03T09:15:00.000Z'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockSessionStorage.getItem.mockReturnValue('testuser');
    
    // Mock fetch for gift details
    fetch.mockImplementation((url) => {
      if (url.includes('/gift/')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockGift)
        });
      }
      if (url.includes('/api/comments/')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockComments)
        });
      }
    });
  });

  test('should render gift details and comments', async () => {
    render(
      <BrowserRouter>
        <DetailsPage />
      </BrowserRouter>
    );

    // Wait for gift details to load
    await waitFor(() => {
      expect(screen.getByText('Test Gift')).toBeInTheDocument();
    });

    // Check if comments are displayed
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('This is amazing!')).toBeInTheDocument();
    });
  });

  test('should display sentiment badges correctly', async () => {
    render(
      <BrowserRouter>
        <DetailsPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      const positiveBadge = screen.getByText('positive');
      const neutralBadge = screen.getByText('neutral');
      const negativeBadge = screen.getByText('negative');

      expect(positiveBadge).toBeInTheDocument();
      expect(neutralBadge).toBeInTheDocument();
      expect(negativeBadge).toBeInTheDocument();
    });
  });

  test('should display correct CSS classes for sentiment', async () => {
    const { container } = render(
      <BrowserRouter>
        <DetailsPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      const positiveComment = container.querySelector('.comment-positive');
      const neutralComment = container.querySelector('.comment-neutral');
      const negativeComment = container.querySelector('.comment-negative');

      expect(positiveComment).toBeInTheDocument();
      expect(neutralComment).toBeInTheDocument();
      expect(negativeComment).toBeInTheDocument();
    });
  });

  test('should show empty state when no comments exist', async () => {
    fetch.mockImplementation((url) => {
      if (url.includes('/gift/')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockGift)
        });
      }
      if (url.includes('/api/comments/')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([])
        });
      }
    });

    render(
      <BrowserRouter>
        <DetailsPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/No comments yet/i)).toBeInTheDocument();
    });
  });

  test('should render comment submission form', async () => {
    render(
      <BrowserRouter>
        <DetailsPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/Add a comment/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Submit Comment/i })).toBeInTheDocument();
    });
  });

  test('should submit a new comment', async () => {
    const newComment = {
      author: 'testuser',
      comment: 'This is my test comment!',
      sentiment: 'positive',
      createdAt: new Date().toISOString()
    };

    fetch.mockImplementation((url, options) => {
      if (url.includes('/gift/')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockGift)
        });
      }
      if (url.includes('/api/comments/') && options?.method === 'GET') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockComments)
        });
      }
      if (url.includes('/api/comments/') && options?.method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(newComment)
        });
      }
    });

    render(
      <BrowserRouter>
        <DetailsPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/Add a comment/i)).toBeInTheDocument();
    });

    const textarea = screen.getByLabelText(/Add a comment/i);
    const submitButton = screen.getByRole('button', { name: /Submit Comment/i });

    // Type comment
    fireEvent.change(textarea, { target: { value: 'This is my test comment!' } });
    
    // Submit
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/comments/'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            author: 'testuser',
            comment: 'This is my test comment!'
          })
        })
      );
    });

    // New comment should appear
    await waitFor(() => {
      expect(screen.getByText('This is my test comment!')).toBeInTheDocument();
    });

    // Textarea should be cleared
    expect(textarea.value).toBe('');
  });

  test('should disable submit button when comment is empty', async () => {
    render(
      <BrowserRouter>
        <DetailsPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /Submit Comment/i });
      expect(submitButton).toBeDisabled();
    });
  });

  test('should enable submit button when comment has text', async () => {
    render(
      <BrowserRouter>
        <DetailsPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/Add a comment/i)).toBeInTheDocument();
    });

    const textarea = screen.getByLabelText(/Add a comment/i);
    const submitButton = screen.getByRole('button', { name: /Submit Comment/i });

    // Initially disabled
    expect(submitButton).toBeDisabled();

    // Type text
    fireEvent.change(textarea, { target: { value: 'Test' } });

    // Should be enabled
    expect(submitButton).not.toBeDisabled();
  });

  test('should show submitting state when posting comment', async () => {
    // Mock delayed response
    fetch.mockImplementation((url, options) => {
      if (url.includes('/gift/')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockGift)
        });
      }
      if (url.includes('/api/comments/') && options?.method === 'GET') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockComments)
        });
      }
      if (url.includes('/api/comments/') && options?.method === 'POST') {
        return new Promise(resolve => 
          setTimeout(() => resolve({
            ok: true,
            json: () => Promise.resolve({
              author: 'testuser',
              comment: 'Test',
              sentiment: 'neutral',
              createdAt: new Date().toISOString()
            })
          }), 100)
        );
      }
    });

    render(
      <BrowserRouter>
        <DetailsPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/Add a comment/i)).toBeInTheDocument();
    });

    const textarea = screen.getByLabelText(/Add a comment/i);
    fireEvent.change(textarea, { target: { value: 'Test' } });

    const submitButton = screen.getByRole('button', { name: /Submit Comment/i });
    fireEvent.click(submitButton);

    // Should show submitting state
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Submitting/i })).toBeInTheDocument();
    });
  });

  test('should handle comment submission error', async () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation();

    fetch.mockImplementation((url, options) => {
      if (url.includes('/gift/')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockGift)
        });
      }
      if (url.includes('/api/comments/') && options?.method === 'GET') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockComments)
        });
      }
      if (url.includes('/api/comments/') && options?.method === 'POST') {
        return Promise.resolve({
          ok: false,
          statusText: 'Server Error'
        });
      }
    });

    render(
      <BrowserRouter>
        <DetailsPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/Add a comment/i)).toBeInTheDocument();
    });

    const textarea = screen.getByLabelText(/Add a comment/i);
    fireEvent.change(textarea, { target: { value: 'Test comment' } });

    const submitButton = screen.getByRole('button', { name: /Submit Comment/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Failed to submit comment. Please try again.');
    });

    alertMock.mockRestore();
  });

  test('should format dates correctly', async () => {
    render(
      <BrowserRouter>
        <DetailsPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      // Check if dates are formatted
      const dates = screen.getAllByText(/\d{1,2}\/\d{1,2}\/\d{4}/);
      expect(dates.length).toBeGreaterThan(0);
    });
  });

  test('should redirect to login if not authenticated', () => {
    mockSessionStorage.getItem.mockReturnValue(null);

    render(
      <BrowserRouter>
        <DetailsPage />
      </BrowserRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});

// Export for test runner
export default {};
