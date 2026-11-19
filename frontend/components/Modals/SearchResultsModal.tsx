import React, { FC, useState, useMemo } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import SortDropdown from '@/components/SortDropdown';
import { useSortedDishes } from '@/hooks/useSortedDishes';
import DishCard1 from '@/components/DishesCards/DishCard1';
import DishModal from '@/components/Modals/DishModal';
import { useAuth } from '@/hooks/useAuth';
import { useDishModal } from '@/hooks/useDishModal';
import CategorySelectorButtons from '@/components/Buttons/CategorySelectorButtons';
import { SortOption } from '@/interfaces/allInterfaces';
import { DishWithIngredients } from '@/interfaces/DishWithIngredients';
import { useFavoriteDishes } from '@/hooks/useFavoriteDishes';

interface SearchResultsModalProps {
  visible: boolean;
  onClose: () => void;
  results: DishWithIngredients[];
  errorMessage: string | null;
  query: string;
}

const SearchResultsModal: FC<SearchResultsModalProps> = ({
  visible,
  onClose,
  results,
  errorMessage,
}) => {
  const { userId, email, isLoggedIn } = useAuth();
  const { modalVisible, selected, openModal, closeModal } = useDishModal();
  const { favoriteDishes } = useFavoriteDishes(email, isLoggedIn); 
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const categories = [
    'All',
    ...new Set(results.map(dish => dish.dish.category)),
  ];

  const filteredResults = useMemo(() => {
    if (selectedCategory === 'All') return results;
    return results.filter(dish => dish.dish.category === selectedCategory);
  }, [results, selectedCategory]);

  const [filtersVisible, setFiltersVisible] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('calories_desc');
  const sortedResults = useSortedDishes(filteredResults, sortOption);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setFiltersVisible(prev => !prev)}
            >
              <Ionicons name="filter-sharp" size={24} color="#0A2533" />
            </TouchableOpacity>
            <ThemedText type="title">Search Results</ThemedText>
            <TouchableOpacity style={styles.iconButton} onPress={onClose}>
              <Ionicons name="close" size={28} color="#0A2533" />
            </TouchableOpacity>
          </View>

          <SortDropdown
            visible={filtersVisible}
            sortOption={sortOption}
            onChange={option => setSortOption(option)}
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

          {errorMessage ? (
            <View style={styles.errorContainer}>
              <ThemedText type="subtitle" style={styles.errorText}>
                {errorMessage}
              </ThemedText>
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.cardsContainer}>
              {sortedResults.map(item => {
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
            </ScrollView>
          )}
        </View>
      </View>
      {selected && (
        <DishModal
          visible={modalVisible}
          onClose={closeModal}
          dish={selected.dish}
          ingredients={selected.ingredients}
          userId={userId!}
          initiallyFavorite={false}
        />
      )}
    </Modal>
  );
};

export default SearchResultsModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
  },
  modalContainer: {
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
  categoryContainer: {
    paddingLeft: 28,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cardsContainer: {
    paddingHorizontal: 28,
    paddingVertical: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  errorContainer: {
    padding: 20,
  },
  errorText: {
    textAlign: 'center',
  },
});
