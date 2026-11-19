import React, { useMemo, useState } from 'react';
import { StyleSheet, ScrollView, View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useFavoriteDishes } from '@/hooks/useFavoriteDishes';
import { useDishModal } from '@/hooks/useDishModal';
import { useAuth } from '@/hooks/useAuth';
import DishModal from '@/components/Modals/DishModal';
import DishCard2 from '@/components/DishesCards/DishCard2';
import DishCard3 from '@/components/DishesCards/DishCard3';
import useDishes from '@/hooks/useDishes';
import CategorySelectorButtons from '@/components/Buttons/CategorySelectorButtons';
import ViewAllButton from '@/components/Buttons/ViewAllButton';
import SearchResultsModal from '@/components/Modals/SearchResultsModal';
import { fetchData } from '@/constants/fetchData';
import { DishWithIngredients } from '@/interfaces/DishWithIngredients';

export default function SearchScreen() {
  const { isLoggedIn, email, userId } = useAuth();
  const { modalVisible, selected, openModal, closeModal } = useDishModal();
  const { dishes } = useDishes();
  const { favoriteDishes } = useFavoriteDishes(email, isLoggedIn);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<DishWithIngredients[]>([]);
  const [searchModalVisible, setSearchModalVisible] = useState<boolean>(false);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const categories = [
    'All',
    ...new Set(dishes.map(dish => dish.dish.category)),
  ];

  const filteredDishes = useMemo(() => {
    if (selectedCategory === 'All') return dishes;
    return dishes.filter(dish => dish.dish.category === selectedCategory);
  }, [dishes, selectedCategory]);

  const dishesSortedByCalories = [...filteredDishes].sort(
    (a, b) => a.dish.calories - b.dish.calories,
  );
  const dishesSortedByTime = [...filteredDishes].sort(
    (a, b) => a.dish.preparation_time - b.dish.preparation_time,
  );

  const topDishesByCalories = dishesSortedByCalories.slice(0, 5);
  const topDishesByTime = dishesSortedByTime.slice(0, 5);

  const handleSearch = async () => {
    try {
      const data = await fetchData(
        `dishes/search?q=${encodeURIComponent(searchQuery)}`,
      );
      if (!data || data.length === 0) {
        setSearchResults([]);
        setSearchError(`No recipes found for "${searchQuery}"`);
      } else {
        setSearchResults(data);
        setSearchError(null);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setSearchError('An error occurred during search. Please try again.');
    } finally {
      setSearchModalVisible(true);
    }
  };

  const closeSearchModal = () => {
    setSearchModalVisible(false);
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={24}
          color="#0A2533"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#97A2B0"
          returnKeyType="search"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
      </View>
      <View style={styles.categoryContainer}>
        <CategorySelectorButtons
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      </View>
      <ScrollView>
        <View style={styles.lowCaloriesDishes}>
          <ThemedText type="title">Low calorie dishes</ThemedText>
          <ViewAllButton sort="calories_asc" />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsContainer}
        >
          {topDishesByCalories.map(item => (
            <DishCard2
              key={item.dish.id}
              dish={item.dish}
              onPress={() => openModal(item.dish, item.ingredients)}
            />
          ))}
        </ScrollView>

        <View style={styles.quickCookingDishes}>
          <ThemedText type="title">Quick Cooking</ThemedText>
          <ViewAllButton sort="time_asc" />
        </View>

        <View style={styles.cardsContainer}>
          {topDishesByTime.map(item => {
            const isFavorite = favoriteDishes.some(
              fav => fav.dish.id === item.dish.id,
            );
            return (
              <DishCard3
                key={item.dish.id}
                dish={item.dish}
                onPress={() => openModal(item.dish, item.ingredients)}
                initiallyFavorite={isFavorite}
              />
            );
          })}
        </View>
      </ScrollView>

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

      <SearchResultsModal
        visible={searchModalVisible}
        onClose={closeSearchModal}
        results={searchResults}
        errorMessage={searchError}
        query={searchQuery}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#f0f8ff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 28,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 8,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    color: '#0A2533',
  },
  categoryContainer: {
    paddingBottom: 12,
    paddingLeft: 28,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc', 
  },
  lowCaloriesDishes: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    marginTop: 12,
  },
  cardsContainer: {
    paddingHorizontal: 28,
    paddingTop: 16,
  },
  quickCookingDishes: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    marginTop: 12,
  },
});
