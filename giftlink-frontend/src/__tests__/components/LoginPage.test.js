import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../../components/LoginPage/LoginPage';

// Mock the modules that LoginPage depends on
jest.mock('../../config.js', () => ({
    urlConfig: {
        backendUrl: 'http://localhost:3060'
    }
}));

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

// Mock fetch
global.fetch = jest.fn();

/**
 * Unit Tests for LoginPage Component
 */

describe('LoginPage Component', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        sessionStorage.clear();
    });

    const renderLoginPage = () => {
        return render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );
    };

    it('renders login form', () => {
        renderLoginPage();

        expect(screen.getByText('Login')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    it('displays register link', () => {
        renderLoginPage();

        const registerLink = screen.getByText('Register Here');
        expect(registerLink).toBeInTheDocument();
        expect(registerLink.closest('a')).toHaveAttribute('href', '/app/register');
    });

    it('allows user to type email and password', async () => {
        renderLoginPage();

        const emailInput = screen.getByPlaceholderText('Email');
        const passwordInput = screen.getByPlaceholderText('Password');

        await userEvent.type(emailInput, 'test@example.com');
        await userEvent.type(passwordInput, 'password123');

        expect(emailInput).toHaveValue('test@example.com');
        expect(passwordInput).toHaveValue('password123');
    });

    it('has email input with correct type', () => {
        renderLoginPage();

        const emailInput = screen.getByPlaceholderText('Email');
        expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('has password input with correct type', () => {
        renderLoginPage();

        const passwordInput = screen.getByPlaceholderText('Password');
        expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('login button is clickable', () => {
        renderLoginPage();

        const loginButton = screen.getByRole('button', { name: /login/i });
        expect(loginButton).not.toBeDisabled();
    });

    it('has correct Bootstrap styling', () => {
        renderLoginPage();

        const emailInput = screen.getByPlaceholderText('Email');
        const passwordInput = screen.getByPlaceholderText('Password');
        const loginButton = screen.getByRole('button', { name: /login/i });

        expect(emailInput).toHaveClass('form-control');
        expect(passwordInput).toHaveClass('form-control');
        expect(loginButton).toHaveClass('btn', 'btn-primary');
    });
});
