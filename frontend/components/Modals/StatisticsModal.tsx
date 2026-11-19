import React, { useEffect, useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useDishModal } from '@/hooks/useDishModal';
import DishCard1 from '../DishesCards/DishCard1';
import DishModal from './DishModal';
import { useAuth } from '@/hooks/useAuth';
import { useFavoriteDishes } from '@/hooks/useFavoriteDishes';
import useStatisticsDishes from '@/hooks/useStatisticsDishes';
import CategorySelectorButtons from '@/components/Buttons/CategorySelectorButtons';
import { fetchData } from '@/constants/fetchData';
import { ModalProps } from '@/interfaces/allInterfaces';
import NutrientItem from '../NutrientItem';
import DateRangeCalendar from '../DateRangeCalendar';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const StatisticsModal: React.FC<ModalProps> = ({ visible, onClose }) => {
  const { isLoggedIn, email, userId } = useAuth();
  const { statisticsDishes } = useStatisticsDishes(userId!, visible);
  const { modalVisible, selected, openModal, closeModal } = useDishModal();
  const { favoriteDishes } = useFavoriteDishes(email, isLoggedIn);

  const [localDishes, setLocalDishes] = useState(statisticsDishes);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = [
    'All',
    ...new Set(localDishes.map(d => d.dish_ingredient.dish.category)),
  ];

  const [dateRange, setDateRange] = useState<{
    startDate: string | null;
    endDate: string | null;
  }>({ startDate: null, endDate: null });
  const [markedDates, setMarkedDates] = useState<{ [key: string]: any }>({});
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    setLocalDishes(statisticsDishes);
  }, [statisticsDishes]);

  const filteredDishes = useMemo(() => {
    return localDishes.filter(dish => {
      const inCategory =
        selectedCategory === 'All' ||
        dish.dish_ingredient.dish.category === selectedCategory;
      const createdAt = dish.created_at.split('T')[0];

      const inDateRange =
        !dateRange.startDate ||
        !dateRange.endDate ||
        (createdAt >= dateRange.startDate && createdAt <= dateRange.endDate);

      return inCategory && inDateRange;
    });
  }, [localDishes, selectedCategory, dateRange]);

  const totalStats = useMemo(() => {
    const initial = {
      preparation_time: 0,
      calories: 0,
      fats: 0,
      carbs: 0,
      proteins: 0,
    };

    return filteredDishes.reduce((acc, item) => {
      const dish = item.dish_ingredient.dish;
      acc.preparation_time += dish.preparation_time || 0;
      acc.calories += dish.calories || 0;
      acc.fats += dish.fats || 0;
      acc.carbs += dish.carbs || 0;
      acc.proteins += dish.proteins || 0;
      return acc;
    }, initial);
  }, [filteredDishes]);

  const handleRemoveFromStatistics = async (id: number) => {
    await fetchData('statistics/remove', 'DELETE', {
      user_id: userId,
      id,
    });
    setLocalDishes(prev => prev.filter(dish => dish.id !== id));
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCalendar(v => !v)}>
              <Ionicons name="calendar-outline" size={28} color="#0A2533" />
            </TouchableOpacity>
            <ThemedText type="title">Statistics</ThemedText>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="#0A2533" />
            </TouchableOpacity>
          </View>

          <View style={styles.categoryContainer}>
            <CategorySelectorButtons
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </View>

          <View style={styles.nutrientContainer}>
            <PieChart
              data={[
                {
                  name: 'Fats',
                  population: totalStats.fats,
                  color: '#CF9FFF',
                  legendFontColor: '#333',
                  legendFontSize: 14,
                },
                {
                  name: 'Carbs',
                  population: totalStats.carbs,
                  color: '#0984E3',
                  legendFontColor: '#333',
                  legendFontSize: 14,
                },
                {
                  name: 'Proteins',
                  population: totalStats.proteins,
                  color: '#eee880',
                  legendFontColor: '#333',
                  legendFontSize: 14,
                },
                {
                  name: 'Calories',
                  population: totalStats.calories,
                  color: '#90EE90',
                  legendFontColor: '#333',
                  legendFontSize: 14,
                },
                {
                  name: 'Minutes',
                  population: totalStats.preparation_time,
                  color: '#FFDBBB',
                  legendFontColor: '#333',
                  legendFontSize: 14,
                },
              ]}
              width={screenWidth - 40}
              height={220}
              chartConfig={{
                backgroundColor: 'transparent',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(10, 37, 51, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(10, 37, 51, ${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="0"
              absolute
            />
            {/* <BarChart
              data={{
                labels: ['Calories', 'Fats', 'Carbs', 'Proteins'],
                datasets: [
                  {
                    data: [
                      totalStats.calories || 0,
                      totalStats.fats || 0,
                      totalStats.carbs || 0,
                      totalStats.proteins || 0,
                    ],
                  },
                ],
              }}
              width={screenWidth - 40}
              height={260}
              yAxisLabel=""
              yAxisSuffix="g"
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#f0f8ff',
                backgroundGradientTo: '#f0f8ff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(10, 37, 51, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(10, 37, 51, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForBackgroundLines: {
                  strokeWidth: 1,
                  stroke: '#e3e3e3',
                  strokeDasharray: '0',
                },
              }}
              verticalLabelRotation={24}
              fromZero
              showBarTops
              withInnerLines={false}
            /> */}
          </View>

          <ScrollView>
            <View style={styles.cardsContainer}>
              {filteredDishes.map(item => {
                const dish = item.dish_ingredient.dish;
                const isFavorite = favoriteDishes.some(
                  fav => fav.dish.id === dish.id,
                );
                return (
                  <DishCard1
                    key={item.id}
                    dish={dish}
                    onPress={() =>
                      openModal(dish, item.dish_ingredient.ingredients)
                    }
                    initiallyFavorite={isFavorite}
                    onLongDelete={() => handleRemoveFromStatistics(item.id)}
                  />
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>

      {selected && (
        <DishModal
          visible={modalVisible}
          onClose={closeModal}
          dish={selected.dish}
          ingredients={selected.ingredients}
          userId={userId!}
          initiallyFavorite={favoriteDishes.some(
            fav => fav.dish.id === selected.dish.id,
          )}
        />
      )}
      {showCalendar && (
        <View style={styles.calendarDropdown}>
          <DateRangeCalendar
            onChange={(range, marked) => {
              setDateRange(range);
              setMarkedDates(marked);
            }}
          />
        </View>
      )}
    </Modal>
  );
};

export default StatisticsModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    justifyContent: 'flex-end',
    paddingTop: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 28,
  },
  calendarDropdown: {
    position: 'absolute',
    top: 72,
    left: 20,
    right: 20,
    zIndex: 1000,
    elevation: 10,
    backgroundColor: 'white',
    padding: 0,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryContainer: {
    marginVertical: 12,
    paddingLeft: 28,
  },
  nutrientContainer: {
    paddingLeft: 28,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cardsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 28,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
});
