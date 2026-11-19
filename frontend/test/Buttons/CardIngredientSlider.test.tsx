import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CartIngredientsSlider from '@/components/DishesCards/CardIngredientSlider';
import { convertBase64ToImage } from '@/constants/convertB64Image';
import { CartIngredients } from '@/interfaces/CartIngredients';

jest.mock('@/constants/convertB64Image', () => ({
  convertBase64ToImage: jest.fn(
    (b64: string) => `data:image/png;base64,${b64}`,
  ),
}));

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    Ionicons: ({ name }: { name: string }) => <Text>{name}</Text>,
  };
});

describe('CartIngredientsSlider', () => {
  const ingredientA: CartIngredients = {
    ingredient: { id: 1, name: 'A', image: 'imgA' },
    quantity: 1,
  };
  const ingredientB: CartIngredients = {
    ingredient: { id: 2, name: 'B', image: 'imgB' },
    quantity: 2,
  };
  const pages = [[ingredientA], [ingredientB]];

  it('renders ingredient names on their respective pages', () => {
    const { getByText } = render(
      <CartIngredientsSlider
        pages={pages}
        selectedIngredients={[]}
        onSelectIngredient={() => {}}
        onUpdateQuantity={() => {}}
      />,
    );

    expect(getByText('A')).toBeTruthy();
    expect(getByText('B')).toBeTruthy();

    expect(convertBase64ToImage).toHaveBeenCalledWith('imgA');
    expect(convertBase64ToImage).toHaveBeenCalledWith('imgB');
  });

  it('calls onSelectIngredient when ingredient card is pressed', () => {
    const mockSelect = jest.fn();
    const { getByText } = render(
      <CartIngredientsSlider
        pages={pages}
        selectedIngredients={[]}
        onSelectIngredient={mockSelect}
        onUpdateQuantity={() => {}}
      />,
    );

    fireEvent.press(getByText('A'));
    expect(mockSelect).toHaveBeenCalledWith(ingredientA);
  });

  it('calls onUpdateQuantity with -1 when remove icon is pressed', () => {
    const mockUpdate = jest.fn();
    const { getAllByText } = render(
      <CartIngredientsSlider
        pages={pages}
        selectedIngredients={[]}
        onSelectIngredient={() => {}}
        onUpdateQuantity={mockUpdate}
      />,
    );

    const removeButtons = getAllByText('remove');
    fireEvent.press(removeButtons[0]);
    expect(mockUpdate).toHaveBeenCalledWith(ingredientA, -1);
  });

  it('calls onUpdateQuantity with +1 when add icon is pressed', () => {
    const mockUpdate = jest.fn();
    const { getAllByText } = render(
      <CartIngredientsSlider
        pages={pages}
        selectedIngredients={[]}
        onSelectIngredient={() => {}}
        onUpdateQuantity={mockUpdate}
      />,
    );

    const addButtons = getAllByText('add');
    fireEvent.press(addButtons[0]);
    expect(mockUpdate).toHaveBeenCalledWith(ingredientA, 1);
  });
});
