import React, { useMemo, useState } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ThemedText } from '@/components/ThemedText';
import CategorySelectorButtons from '@/components/Buttons/CategorySelectorButtons';
import useDishes from '@/hooks/useDishes';

import DishCard1 from '@/components/DishesCards/DishCard1';
import { useDishModal } from '@/hooks/useDishModal';
import DishModal from './DishModal';
import { useAuth } from '@/hooks/useAuth';
import { useFavoriteDishes } from '@/hooks/useFavoriteDishes';
import { useSortedDishes } from '@/hooks/useSortedDishes';
import SortDropdown from '../SortDropdown';
import { SortOption } from '@/interfaces/allInterfaces';
import { ModalProps } from '@/interfaces/allInterfaces';

const ViewAllModal: React.FC<ModalProps> = ({
  visible,
  onClose,
  sort = 'calories_asc',
}) => {
  const { isLoggedIn, email, userId } = useAuth();
  const { dishes } = useDishes();
  const { modalVisible, selected, openModal, closeModal } = useDishModal();
  const { favoriteDishes } = useFavoriteDishes(email, isLoggedIn);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = [
    'All',
    ...new Set(dishes.map(dish => dish.dish.category)),
  ];

  const [filtersVisible, setFiltersVisible] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>(sort);
  const filteredDishes = useMemo(() => {
    if (selectedCategory === 'All') return dishes;
    return dishes.filter(dish => dish.dish.category === selectedCategory);
  }, [dishes, selectedCategory]);
  const sortedDishes = useSortedDishes(filteredDishes, sortOption);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setFiltersVisible(prev => !prev)}
            >
              <Ionicons name="filter-sharp" size={28} color="#0A2533" />
            </TouchableOpacity>

            <ThemedText type="title">All dishes</ThemedText>
            <TouchableOpacity onPress={onClose} style={styles.iconButton}>
              <Ionicons name="close" size={32} color="#0A2533" />
            </TouchableOpacity>
          </View>

          <SortDropdown
            visible={filtersVisible}
            sortOption={sortOption}
            onChange={(option: SortOption) => setSortOption(option)}
            onToggle={() => setFiltersVisible(prev => !prev)}
            style={{ top: 68, left: 20 }}
          />

          <View style={styles.categoryContainer}>
            <CategorySelectorButtons
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </View>
          <ScrollView>
            <View style={styles.cardsContainer}>
              {sortedDishes.map(item => {
                const isFavorite = favoriteDishes.some(
                  fav => fav.dish.id === item.dish.id,
                );
                return (
                  <DishCard1
                    key={item.dish.id}
                    dish={item.dish}
                    onPress={() => openModal(item.dish, item.ingredients)}
                    initiallyFavorite={isFavorite}
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
    </Modal>
  );
};

export default ViewAllModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    paddingTop: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 28,
  },
  iconButton: {
    padding: 6,
    borderRadius: 12,
  },
  cardsContainer: {
    flexDirection: 'row',
    paddingTop: 16,
    paddingHorizontal: 28,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryContainer: {
    paddingLeft: 28,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
