import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import DishCard1 from '@/components/DishesCards/DishCard1';
import { convertBase64ToImage } from '@/constants/convertB64Image';
import { useAuth } from '@/hooks/useAuth';


jest.mock('@/constants/convertB64Image', () => ({
  convertBase64ToImage: jest.fn((b64: string) => `data:image/png;base64,${b64}`),
}));

jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

describe('DishCard1 component', () => {
  const dish = {
    id: 1,
    preparation_time: 2,
    calories: 3,
    fats: 4,
    carbs: 4,
    proteins: 5,
    name: "Test Dish",
    image: "test_image_base64",
    category: "test_category",
    created_at: "2023-10-01T00:00:00Z",
    instruction: "test_instruction",
  };
  const onPressMock = jest.fn();
  const onLongDeleteMock = jest.fn();

  beforeEach(() => {
    (convertBase64ToImage as jest.Mock).mockClear();
    (useAuth as jest.Mock).mockClear();
    onPressMock.mockClear();
    onLongDeleteMock.mockClear();
  });

  it('renders image with correct source, title and info texts', () => {
    (useAuth as jest.Mock).mockReturnValue({ userId: null });

    const { getByTestId, getByText } = render(
      <DishCard1
        dish={dish}
        onPress={onPressMock}
        onLongDelete={onLongDeleteMock}
      />
    );

    // Image source URI
    expect(convertBase64ToImage).toHaveBeenCalledWith(dish.image);
    const image = getByTestId('DishCardImage');
    expect(image.props.source.uri).toBe(`data:image/png;base64,${dish.image}`);

    // Title and info texts
    expect(getByText(dish.name)).toBeTruthy();
    expect(getByText(`${dish.calories} Kcal`)).toBeTruthy();
    expect(getByText(`${dish.preparation_time} Min`)).toBeTruthy();
  });

  it('handles onPress and onLongPress events', () => {
    (useAuth as jest.Mock).mockReturnValue({ userId: null });

    const { getByTestId } = render(
      <DishCard1
        dish={dish}
        onPress={onPressMock}
        onLongDelete={onLongDeleteMock}
      />
    );

    const touchable = getByTestId('DishCardTouchable');
    fireEvent.press(touchable);
    expect(onPressMock).toHaveBeenCalledTimes(1);

    fireEvent(touchable, 'longPress');
    expect(onLongDeleteMock).toHaveBeenCalledTimes(1);
  });
});

