import React from 'react';
import { render, screen } from '@testing-library/react';
import Navbar from '../../components/Navbar/Navbar';

/**
 * Unit Tests for Navbar Component
 */

describe('Navbar Component', () => {

    it('renders without crashing', () => {
        render(<Navbar />);
        expect(true).toBe(true);
    });

    it('displays GiftLink brand name', () => {
        render(<Navbar />);
        expect(screen.getByText('GiftLink')).toBeInTheDocument();
    });

    it('displays Home navigation link', () => {
        render(<Navbar />);
        const homeLink = screen.getByText('Home');
        expect(homeLink).toBeInTheDocument();
        expect(homeLink.closest('a')).toHaveAttribute('href', '/');
    });

    it('displays Gifts navigation link', () => {
        render(<Navbar />);
        const giftsLink = screen.getByText('Gifts');
        expect(giftsLink).toBeInTheDocument();
        expect(giftsLink.closest('a')).toHaveAttribute('href', '/gifts');
    });

    it('has correct Bootstrap classes', () => {
        const { container } = render(<Navbar />);
        const nav = container.querySelector('nav');
        expect(nav).toHaveClass('navbar', 'navbar-expand-lg', 'navbar-light', 'bg-light');
    });

    it('brand link navigates to home', () => {
        render(<Navbar />);
        const brandLink = screen.getByText('GiftLink').closest('a');
        expect(brandLink).toHaveAttribute('href', '/');
    });
});
