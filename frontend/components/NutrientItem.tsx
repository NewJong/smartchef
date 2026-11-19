import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Dish } from '@/interfaces/Dish';
import { Nutrient } from '@/interfaces/Nutrient';

interface Props {
  dish: Dish;
  showTime?: boolean;
}

const NutrientItem: React.FC<Props> = ({ dish, showTime = false }) => {
  const nutrientData: Nutrient[] = [
    {
      key: 'carbs',
      id: 1,
      icon: 'leaf-outline',
      value: dish.carbs,
      unit: 'g',
      label: 'carbs',
    },
    {
      key: 'proteins',
      id: 2,
      icon: 'nutrition-outline',
      value: dish.proteins,
      unit: 'g',
      label: 'proteins',
    },
    {
      key: 'calories',
      id: 3,
      icon: 'flame-outline',
      value: dish.calories,
      unit: '',
      label: 'Kcal',
    },
    {
      key: 'fats',
      id: 4,
      icon: 'pizza-outline',
      value: dish.fats,
      unit: 'g',
      label: 'fats',
    },
  ];
  if (showTime) {
    nutrientData.push({
      id: 5,
      icon: 'time-outline',
      value: dish.preparation_time,
      unit: '',
      label: 'Min',
      key: 'preparation_time',
    });
  }

  return (
    <View style={styles.nutrientsContainer}>
      {nutrientData.map(nutrient => (
        <View key={nutrient.key} style={styles.nutrientBox}>
          <View style={styles.iconWrapper}>
            <Ionicons name={nutrient.icon} size={24} color="#0A2533" />
          </View>
          <Text style={styles.nutrientText}>
            {nutrient.value}
            {nutrient.unit} {nutrient.label}
          </Text>
        </View>
      ))}
    </View>
  );
};
export default NutrientItem;

const styles = StyleSheet.create({
  nutrientsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  nutrientBox: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    gap: 12,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#E6EBF2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nutrientText: {
    fontSize: 16,
    color: '#0A2533',
    fontWeight: '500',
  },
});
