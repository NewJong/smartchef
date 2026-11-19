import React from 'react';
import { TouchableOpacity } from 'react-native';
import { fetchData } from '@/constants/fetchData';
import { ThemedText } from '@/components/ThemedText';
import { AddToStatisticsButtonProps } from '@/interfaces/allInterfaces';

const AddToStatisticsButton: React.FC<AddToStatisticsButtonProps> = ({
  userId,
  dishId,
}) => {
  const handleAddToStatistics = async () => {
    try {
      const body = {
        user_id: userId,
        dish_id: dishId,
      };
      const response = await fetchData('statistics/add', 'POST', body);
    } catch (error) {
      console.error('Error adding ingredients to cart:', error);
    }
  };

  return (
    <TouchableOpacity onPress={handleAddToStatistics}>
      <ThemedText type="viewAll">Add to Statistics</ThemedText>
    </TouchableOpacity>
  );
};

export default AddToStatisticsButton;
