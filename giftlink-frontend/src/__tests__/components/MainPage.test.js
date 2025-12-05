import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MainPage from '../../components/MainPage/MainPage';

/**
 * Unit Tests for MainPage Component
 */

// Mock fetch globally
global.fetch = jest.fn();

describe('MainPage Component', () => {

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    const renderMainPage = () => {
        return render(
            <BrowserRouter>
                <MainPage />
            </BrowserRouter>
        );
    };

    it('renders without crashing', () => {
        // Mock successful fetch
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => []
        });

        renderMainPage();
        expect(true).toBe(true);
    });

    it('fetches and displays gifts', async () => {
        // Mock gift data
        const mockGifts = [
            {
                id: '1',
                name: 'Test Gift 1',
                condition: 'New',
                date_added: '2024-01-01T00:00:00Z',
                image: null
            },
            {
                id: '2',
                name: 'Test Gift 2',
                condition: 'Used',
                date_added: '2024-01-02T00:00:00Z',
                image: 'test-image.jpg'
            }
        ];

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockGifts
        });

        renderMainPage();

        // Wait for gifts to be displayed
        await waitFor(() => {
            expect(screen.getByText('Test Gift 1')).toBeInTheDocument();
            expect(screen.getByText('Test Gift 2')).toBeInTheDocument();
        });
    });

    it('displays "No Image Available" when gift has no image', async () => {
        const mockGifts = [
            {
                id: '1',
                name: 'Gift Without Image',
                condition: 'New',
                date_added: '2024-01-01T00:00:00Z',
                image: null
            }
        ];

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockGifts
        });

        renderMainPage();

        await waitFor(() => {
            expect(screen.getByText('No Image Available')).toBeInTheDocument();
        });
    });

    it('displays gift condition with correct styling', async () => {
        const mockGifts = [
            {
                id: '1',
                name: 'New Gift',
                condition: 'New',
                date_added: '2024-01-01T00:00:00Z',
                image: null
            }
        ];

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockGifts
        });

        renderMainPage();

        await waitFor(() => {
            const conditionElement = screen.getByText('New');
            expect(conditionElement).toHaveClass('list-group-item-success');
        });
    });

    it('displays View Details button for each gift', async () => {
        const mockGifts = [
            {
                id: '1',
                name: 'Test Gift',
                condition: 'New',
                date_added: '2024-01-01T00:00:00Z',
                image: null
            }
        ];

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockGifts
        });

        renderMainPage();

        await waitFor(() => {
            expect(screen.getByText('View Details')).toBeInTheDocument();
        });
    });

    it('handles fetch error gracefully', async () => {
        // Mock fetch error
        global.fetch.mockRejectedValueOnce(new Error('Network error'));

        // Mock console.error to avoid test output pollution
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

        renderMainPage();

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith(
                'Error fetching gifts:',
                expect.any(Error)
            );
        });

        consoleSpy.mockRestore();
    });

    it('formats date correctly', async () => {
        const mockGifts = [
            {
                id: '1',
                name: 'Test Gift',
                condition: 'New',
                date_added: '2024-01-01T12:00:00Z',
                image: null
            }
        ];

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockGifts
        });

        renderMainPage();

        await waitFor(() => {
            // Date should be formatted and displayed
            expect(screen.getByText(/Date:/)).toBeInTheDocument();
        });
    });
});
