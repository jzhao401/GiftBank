import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Profile from '../../components/Profile/Profile';

// Mock the AuthContext
jest.mock('../../context/AuthContext', () => ({
    useAppContext: () => ({
        setUserName: jest.fn()
    })
}));

// Mock sessionStorage
const mockSessionStorage = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => {
            store[key] = value.toString();
        },
        clear: () => {
            store = {};
        }
    };
})();

Object.defineProperty(window, 'sessionStorage', {
    value: mockSessionStorage
});

/**
 * Unit Tests for Profile Component
 */

describe('Profile Component', () => {

    beforeEach(() => {
        mockSessionStorage.clear();
    });

    const renderProfile = () => {
        return render(
            <BrowserRouter>
                <Profile />
            </BrowserRouter>
        );
    };

    it('renders profile component', () => {
        // Set up session storage
        mockSessionStorage.setItem('auth-token', 'test-token');
        mockSessionStorage.setItem('name', 'John Doe');
        mockSessionStorage.setItem('email', 'john@example.com');

        renderProfile();

        // Component should render
        expect(true).toBe(true);
    });

    it('displays user name when logged in', async () => {
        mockSessionStorage.setItem('auth-token', 'test-token');
        mockSessionStorage.setItem('name', 'John Doe');
        mockSessionStorage.setItem('email', 'john@example.com');

        renderProfile();

        // Wait for profile to load
        const greeting = await screen.findByText(/Hi, John Doe/);
        expect(greeting).toBeInTheDocument();
    });

    it('displays user email', async () => {
        mockSessionStorage.setItem('auth-token', 'test-token');
        mockSessionStorage.setItem('name', 'John Doe');
        mockSessionStorage.setItem('email', 'john@example.com');

        renderProfile();

        const email = await screen.findByText(/john@example.com/);
        expect(email).toBeInTheDocument();
    });

    it('displays edit button', async () => {
        mockSessionStorage.setItem('auth-token', 'test-token');
        mockSessionStorage.setItem('name', 'John Doe');
        mockSessionStorage.setItem('email', 'john@example.com');

        renderProfile();

        const editButton = await screen.findByRole('button', { name: /edit/i });
        expect(editButton).toBeInTheDocument();
    });
});
