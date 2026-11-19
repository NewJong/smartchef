import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AddToStatisticsButton from '@/components/Buttons/AddToStatisticsButton';
import { fetchData } from '@/constants/fetchData';

jest.mock('@/constants/fetchData', () => ({
  fetchData: jest.fn(),
}));

describe('AddToStatisticsButton Component', () => {
  const userId = 123;
  const dishId = 456;

  beforeEach(() => {
    (fetchData as jest.Mock).mockClear();
  });

  it('calls fetchData with correct parameters on press', async () => {
    (fetchData as jest.Mock).mockResolvedValue(true);

    const { getByText } = render(
      <AddToStatisticsButton userId={userId} dishId={dishId} />,
    );
    const button = getByText('Add to Statistics');

    fireEvent.press(button);

    await waitFor(() => {
      expect(fetchData).toHaveBeenCalledWith('statistics/add', 'POST', {
        user_id: userId,
        dish_id: dishId,
      });
    });
  });

  it('logs an error if fetchData rejects', async () => {
    // Mock an error response
    const error = new Error('Network error');
    (fetchData as jest.Mock).mockRejectedValue(error);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const { getByText } = render(
      <AddToStatisticsButton userId={userId} dishId={dishId} />,
    );
    const button = getByText('Add to Statistics');

    fireEvent.press(button);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error adding ingredients to cart:',
        error,
      );
    });

    consoleSpy.mockRestore();
  });
});
