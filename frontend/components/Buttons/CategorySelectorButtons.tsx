import React from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  ViewStyle,
  StyleProp,
} from 'react-native';

interface CategorySelectorButtonsProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  style?: StyleProp<Pick<ViewStyle, 'paddingLeft'>>;
}

const CategorySelectorButtonsButtons: React.FC<
  CategorySelectorButtonsProps
> = ({ categories, selectedCategory, setSelectedCategory }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.buttonsContainer}
      style={[{ flexGrow: 0 }]}
    >
      {categories.map(item => (
        <TouchableOpacity
          key={item}
          style={[
            styles.button,
            selectedCategory === item && styles.selectedButton,
          ]}
          onPress={() => setSelectedCategory(item)}
        >
          <Text
            style={[
              styles.buttonText,
              selectedCategory === item && styles.selectedText,
            ]}
          >
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default CategorySelectorButtonsButtons;

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 0,
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 40,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginRight: 12,
  },
  selectedButton: {
    backgroundColor: '#70B9BE',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  selectedText: {
    color: 'white',
  },
});
