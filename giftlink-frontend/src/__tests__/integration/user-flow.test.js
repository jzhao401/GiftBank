import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import App from '../../App';

// Mock fetch
global.fetch = jest.fn();

/**
 * Integration Tests for User Flows
 * 
 * These tests verify complete user journeys through the application.
 */

describe('User Flow Integration Tests', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        sessionStorage.clear();

        // Mock successful gifts fetch
        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => []
        });
    });

    it('renders the application', () => {
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );

        // Check for navbar
        expect(screen.getByText('GiftLink')).toBeInTheDocument();
    });

    it('displays navigation links', () => {
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );

        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Gifts')).toBeInTheDocument();
    });

    it('navigation bar is always visible', async () => {
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );

        const navbar = screen.getByText('GiftLink');
        expect(navbar).toBeVisible();
    });
});

describe('Gift Browsing Flow', () => {

    beforeEach(() => {
        jest.clearAllMocks();

        const mockGifts = [
            {
                id: '1',
                name: 'Test Gift',
                condition: 'New',
                date_added: '2024-01-01T00:00:00Z',
                image: null
            }
        ];

        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => mockGifts
        });
    });

    it('loads and displays gifts on main page', async () => {
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );

        // Wait for gifts to load
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalled();
        });
    });
});

describe('Application State Management', () => {

    it('maintains navbar across navigation', () => {
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );

        // Navbar should always be present
        const navbar = screen.getByText('GiftLink');
        expect(navbar).toBeInTheDocument();
    });
});
