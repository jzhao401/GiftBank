import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import SearchPage from '../../components/SearchPage/SearchPage';

// Mock fetch
global.fetch = jest.fn();

/**
 * Unit Tests for SearchPage Component
 */

describe('SearchPage Component', () => {

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock successful initial fetch
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => []
        });
    });

    const renderSearchPage = () => {
        return render(
            <BrowserRouter>
                <SearchPage />
            </BrowserRouter>
        );
    };

    it('renders search page', () => {
        renderSearchPage();

        expect(screen.getByText('Filters')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Search by name')).toBeInTheDocument();
        expect(screen.getByText('Search')).toBeInTheDocument();
    });

    it('displays category filter dropdown', () => {
        renderSearchPage();

        const categorySelect = screen.getByLabelText('Category');
        expect(categorySelect).toBeInTheDocument();

        // Check for category options
        expect(screen.getByText('Living')).toBeInTheDocument();
        expect(screen.getByText('Bedroom')).toBeInTheDocument();
        expect(screen.getByText('Kitchen')).toBeInTheDocument();
    });

    it('displays condition filter dropdown', () => {
        renderSearchPage();

        const conditionSelect = screen.getByLabelText('Condition');
        expect(conditionSelect).toBeInTheDocument();

        // Check for condition options
        expect(screen.getByText('New')).toBeInTheDocument();
        expect(screen.getByText('Like New')).toBeInTheDocument();
    });

    it('displays age range slider', () => {
        renderSearchPage();

        const ageSlider = screen.getByRole('slider');
        expect(ageSlider).toBeInTheDocument();
        expect(ageSlider).toHaveAttribute('min', '1');
        expect(ageSlider).toHaveAttribute('max', '10');
    });

    it('allows user to type in search input', async () => {
        renderSearchPage();

        const searchInput = screen.getByPlaceholderText('Search by name');
        await userEvent.type(searchInput, 'lamp');

        expect(searchInput).toHaveValue('lamp');
    });

    it('updates age range when slider is moved', async () => {
        renderSearchPage();

        const ageSlider = screen.getByRole('slider');

        fireEvent.change(ageSlider, { target: { value: '8' } });

        await waitFor(() => {
            expect(screen.getByText(/Less than 8 years/)).toBeInTheDocument();
        });
    });

    it('displays no products message when no results', async () => {
        renderSearchPage();

        await waitFor(() => {
            expect(screen.getByText(/No products found/)).toBeInTheDocument();
        });
    });

    it('search button is clickable', () => {
        renderSearchPage();

        const searchButton = screen.getByRole('button', { name: /search/i });
        expect(searchButton).not.toBeDisabled();
    });
});
