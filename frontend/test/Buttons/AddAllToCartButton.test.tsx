import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import AddAllToCartButton from '@/components/Buttons/AddAllToCartButton';
import { fetchData } from '@/constants/fetchData';

jest.mock('@/constants/fetchData', () => ({
  fetchData: jest.fn(),
}));

describe('AddAllToCartButton Component', () => {
  const userId = 2;
  const ingredients = [
    { id: 1, name: 'Ingredient1', image: 'a', quantity: 2 },
    { id: 2, name: 'Ingredient2', image: 'a', quantity: 1 },
    { id: 3, name: 'Ingredient3', image: 'a', quantity: 5 },
  ];

  beforeEach(() => {
    jest.useFakeTimers();
    (fetchData as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders initial button text', () => {
    const { getByText } = render(
      <AddAllToCartButton userId={userId} ingredients={ingredients} />,
    );
    expect(getByText('Add All to Cart')).toBeTruthy();
  });

  it('calls fetchData for each ingredient and resets text on success', async () => {
    (fetchData as jest.Mock).mockResolvedValue(true);
    const { getByText } = render(
      <AddAllToCartButton userId={userId} ingredients={ingredients} />,
    );
    const buttonText = getByText('Add All to Cart');
    const button = buttonText.parent!;
    if (!button) {
      throw new Error('Button parent is null');
    }

    await act(async () => {
      fireEvent.press(button);
    });
    expect(fetchData).toHaveBeenCalledTimes(ingredients.length);
    ingredients.forEach((ingredient, idx) => {
      expect(fetchData).toHaveBeenNthCalledWith(
        idx + 1,
        'cart/add-ingredients',
        'POST',
        {
          user_id: userId,
          ingredient_id: ingredient.id,
          quantity: ingredient.quantity,
        },
      );
    });

    act(() => jest.advanceTimersByTime(500));
    await waitFor(() => expect(getByText('Add All to Cart')).toBeTruthy());
  });

  it('logs error and resets text on failure', async () => {
    const error = new Error('Failed');
    (fetchData as jest.Mock).mockRejectedValue(error);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const { getByText } = render(
      <AddAllToCartButton userId={userId} ingredients={ingredients} />,
    );
    const buttonText = getByText('Add All to Cart');
    const button = buttonText.parent!;
    if (!button) {
      throw new Error('Button parent is null');
    }

    await act(async () => {
      fireEvent.press(button);
    });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error adding ingredients to cart:',
        error,
      );
    });

    act(() => jest.advanceTimersByTime(500));
    await waitFor(() => expect(getByText('Add All to Cart')).toBeTruthy());

    consoleSpy.mockRestore();
  });
});
