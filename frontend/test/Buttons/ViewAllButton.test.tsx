import { render, fireEvent } from '@testing-library/react-native';
import ViewAllButton from '@/components/Buttons/ViewAllButton';
import { SortOption } from '@/interfaces/allInterfaces';

jest.mock('@/components/Modals/ViewAllModal', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return ({ visible }: { visible: boolean }) =>
    visible ? <Text>Modal is visible</Text> : null;
});
jest.mock('@/components/ThemedText', () => {
  const { Text } = require('react-native');
  return {
    ThemedText: ({ children }: { children: React.ReactNode }) => (
      <Text>{children}</Text>
    ),
  };
});

describe('ViewAllButton', () => {
  const mockSort: SortOption = 'calories_asc';

  it('renders the button', () => {
    const { getByText } = render(<ViewAllButton sort={mockSort} />);
    expect(getByText('View all')).toBeTruthy();
  });

  it('shows modal on press', () => {
    const { getByText, queryByText } = render(
      <ViewAllButton sort={mockSort} />,
    );

    expect(queryByText('Modal is visible')).toBeNull();

    fireEvent.press(getByText('View all'));

    expect(getByText('Modal is visible')).toBeTruthy();
  });
});
