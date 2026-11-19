import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';

import { SortOption } from '@/interfaces/allInterfaces';

export type SortDropdownProps = {
  visible: boolean;
  sortOption: SortOption;
  onChange: (option: SortOption) => void;
  onToggle: () => void;
  style?: StyleProp<Pick<ViewStyle, 'top' | 'left' | 'right' | 'bottom'>>;
};

const sortOptions: { label: string; value: SortOption }[] = [
  { label: 'Calories ↓', value: 'calories_desc' },
  { label: 'Calories ↑', value: 'calories_asc' },
  { label: 'Cooking time ↓', value: 'time_desc' },
  { label: 'Cooking time ↑', value: 'time_asc' },
  { label: 'New dishes', value: 'created_asc' },
  { label: 'Old dishes', value: 'created_desc' },
];

const SortDropdown: React.FC<SortDropdownProps> = ({
  visible,
  sortOption,
  onChange,
  onToggle,
  style,
}) => {
  if (!visible) return null;

  return (
    <View style={[styles.dropdownOverlay, style]}>
      <View style={styles.dropdownMenu}>
        {sortOptions.map(option => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.dropdownOption,
              sortOption === option.value && styles.selectedOption,
            ]}
            onPress={() => {
              onChange(option.value);
              onToggle();
            }}
          >
            <Text style={styles.dropdownOptionText}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownOverlay: {
    position: 'absolute',
    zIndex: 100,
    width: 140,
    backgroundColor: 'transparent',
  },
  dropdownMenu: {
    backgroundColor: '#e6f0fa',
    borderRadius: 8,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  selectedOption: {
    backgroundColor: '#cce0f7',
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#0A2533',
  },
});

export default SortDropdown;
