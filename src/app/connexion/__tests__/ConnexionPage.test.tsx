import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ConnexionPage from '../page';
import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

// Mocks
jest.mock('@/utils/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signInWithOAuth: jest.fn(),
    },
  },
}));
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

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

    signInWithPasswordMock = supabase.auth.signInWithPassword as jest.Mock;
    signUpMock = supabase.auth.signUp as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('handles successful login', async () => {
    signInWithPasswordMock.mockResolvedValue({ error: null });

    render(<ConnexionPage />);
    
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /connexion/i }));

    await waitFor(() => {
      expect(signInWithPasswordMock).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
      expect(pushMock).toHaveBeenCalledWith('/');
    });
  });
});
