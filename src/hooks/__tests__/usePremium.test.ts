import { renderHook, waitFor } from '@testing-library/react';
import { usePremium } from '../usePremium';
import { createClient } from '@/utils/supabase/client';

// Mock dependencies
jest.mock('@/utils/supabase/client');

describe('usePremium Hook', () => {
  let getUserMock: jest.Mock;
  let fromMock: jest.Mock;
  let selectMock: jest.Mock;
  let eqMock: jest.Mock;
  let singleMock: jest.Mock;

  beforeEach(() => {
    getUserMock = jest.fn();
    singleMock = jest.fn();
    eqMock = jest.fn().mockReturnValue({ single: singleMock });
    selectMock = jest.fn().mockReturnValue({ eq: eqMock });
    fromMock = jest.fn().mockReturnValue({ select: selectMock });

    (createClient as jest.Mock).mockReturnValue({
      auth: {
        getUser: getUserMock,
      },
      from: fromMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return isPremium: true for a premium user', async () => {
    // Arrange
    getUserMock.mockResolvedValue({ data: { user: { id: '123' } } });
    singleMock.mockResolvedValue({ data: { plan: 'premium' }, error: null });

    // Act
    const { result } = renderHook(() => usePremium());

    // Assert
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.isPremium).toBe(true);
  });

  it('should return isPremium: false for a free user', async () => {
    // Arrange
    getUserMock.mockResolvedValue({ data: { user: { id: '123' } } });
    singleMock.mockResolvedValue({ data: { plan: 'free' }, error: null });

    // Act
    const { result } = renderHook(() => usePremium());

    // Assert
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.isPremium).toBe(false);
  });

  it('should return isPremium: false if there is no user', async () => {
    // Arrange
    getUserMock.mockResolvedValue({ data: { user: null } });

    // Act
    const { result } = renderHook(() => usePremium());

    // Assert
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.isPremium).toBe(false);
    expect(fromMock).not.toHaveBeenCalled();
  });
});
