import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import ConnexionPage from '../page';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// Mock dependencies
jest.mock('@/utils/supabase/client');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('react-hot-toast');

describe('ConnexionPage', () => {
  let pushMock: jest.Mock;
  let refreshMock: jest.Mock;
  let signInWithPasswordMock: jest.Mock;
  let signUpMock: jest.Mock;

  beforeEach(() => {
    pushMock = jest.fn();
    refreshMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
      refresh: refreshMock,
    });

    signInWithPasswordMock = jest.fn().mockResolvedValue({ error: null });
    signUpMock = jest.fn().mockResolvedValue({ error: null });
    (createClient as jest.Mock).mockReturnValue({
      auth: {
        signInWithPassword: signInWithPasswordMock,
        signUp: signUpMock,
        signInWithOAuth: jest.fn().mockResolvedValue({ error: null }),
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the login form by default', () => {
    render(<ConnexionPage />);
    expect(screen.getByRole('heading', { name: /Connectez-vous à votre compte/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mot de passe/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Nom d'utilisateur/i)).not.toBeInTheDocument();
  });

  it('switches to the sign-up form when the tab is clicked', () => {
    render(<ConnexionPage />);
    const signUpTab = screen.getByRole('button', { name: /Inscription/i });
    fireEvent.click(signUpTab);

    expect(screen.getByRole('heading', { name: /Créez votre compte/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Nom d'utilisateur/i)).toBeInTheDocument();
  });

  it('calls signInWithPassword on login form submission', async () => {
    render(<ConnexionPage />);
    
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Mot de passe/i), { target: { value: 'password123' } });
    
    // Find the form, then the submit button within the form
    const form = screen.getByRole('heading', { name: /Connectez-vous à votre compte/i }).closest('form');
    if (!form) throw new Error('Form not found');
    const submitButton = within(form).getByRole('button', { name: /Connexion/i });
    fireEvent.click(submitButton);

    // Wait for the async actions to complete by waiting for the toast message mock to be called
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(signInWithPasswordMock).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(toast.success).toHaveBeenCalledWith('Connexion réussie !');
    expect(pushMock).toHaveBeenCalledWith('/');
  });
});
