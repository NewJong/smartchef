import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CategorySelectorButtons from '@/components/Buttons/CategorySelectorButtons';

describe('CategorySelectorButtonsButtons Component', () => {
  const categories = ['All', 'Breakfast', 'Lunch', 'Dinner'];
  let selectedCategory: string;
  const setSelectedCategory = jest.fn((category: string) => {
    selectedCategory = category;
  });

  beforeEach(() => {
    selectedCategory = 'All';
    setSelectedCategory.mockClear();
  });

  it('renders all categories as buttons', () => {
    const { getByText } = render(
      <CategorySelectorButtons
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
    );

    categories.forEach(category => {
      expect(getByText(category)).toBeTruthy();
    });
  });

  it('highlights the selected category', () => {
    const { getByText } = render(
      <CategorySelectorButtons
        categories={categories}
        selectedCategory="Lunch"
        setSelectedCategory={setSelectedCategory}
      />
    );
    const selectedButton = getByText('Lunch');
    expect(selectedButton.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ color: 'white' }),
      ])
    );
  });

  it('calls setSelectedCategory on button press', () => {
    const { getByText } = render(
      <CategorySelectorButtons
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
    );
    const button = getByText('Dinner');

    fireEvent.press(button);

    expect(setSelectedCategory).toHaveBeenCalledWith('Dinner');
  });
});
