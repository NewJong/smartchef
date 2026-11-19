import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useFavoriteDishes } from '@/hooks/useFavoriteDishes';
import useDishes from '@/hooks/useDishes';
import { useDishModal } from '@/hooks/useDishModal';
import CategorySelectorButtons from '@/components/Buttons/CategorySelectorButtons';
import DishCard4 from '@/components/DishesCards/DishCard4';
import DishModal from '@/components/Modals/DishModal';
import DishCard5 from '@/components/DishesCards/DishCard5';
import CartModal from '@/components/Modals/CartModal';
import ViewAllButton from '@/components/Buttons/ViewAllButton';

export default function HomeScreen() {
  const { email, isLoggedIn, username, userId } = useAuth();
  const { dishes } = useDishes();
  const { favoriteDishes } = useFavoriteDishes(email, isLoggedIn);
  const { modalVisible, selected, openModal, closeModal } = useDishModal();
  const [cartVisible, setCartVisible] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState('Dessert');
  const categories = [...new Set(dishes.map(dish => dish.dish.category))];
  const filteredDishes = useMemo(() => {
    return dishes.filter(dish => dish.dish.category === selectedCategory);
  }, [dishes, selectedCategory]);

  const numberDishes = dishes.slice(0, 5);

  const newDishes = [...filteredDishes].sort(
    (a, b) =>
      new Date(b.dish.created_at).getTime() -
      new Date(a.dish.created_at).getTime(),
  );
  const numberNewDishes = newDishes.slice(0, 5);

  const currentHour = new Date().getHours();
  let greeting = '';
  let iconName: 'sunny-outline' | 'moon-outline' = 'sunny-outline';

  if (currentHour >= 5 && currentHour < 12) {
    greeting = 'Good Morning';
    iconName = 'sunny-outline';
  } else if (currentHour >= 12 && currentHour < 18) {
    greeting = 'Good Afternoon';
    iconName = 'sunny-outline';
  } else {
    greeting = 'Good Evening';
    iconName = 'moon-outline';
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons
            name={iconName}
            size={28}
            color="#4D8194"
            style={styles.icon}
          />
          <View>
            <ThemedText>{greeting}</ThemedText>
          </View>
        </View>
        <TouchableOpacity onPress={() => setCartVisible(true)}>
          <Ionicons name="cart-outline" size={24} color="#0A2533" />
        </TouchableOpacity>
        <CartModal
          visible={cartVisible}
          onClose={() => setCartVisible(false)}
        />
      </View>

      <ThemedText type="subtitle" style={styles.userName}>
        {username}
      </ThemedText>

      <View style={styles.featuredDishes}>
        <ThemedText type="title">Featured</ThemedText>
        {/* <ViewAllButton sort="calories_asc" /> */}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.featuredContainer}
      >
        {numberDishes.map(item => (
          <DishCard4
            key={item.dish.id}
            dish={item.dish}
            onPress={() => openModal(item.dish, item.ingredients)}
          />
        ))}
      </ScrollView>

      <View style={styles.category}>
        <ThemedText type="title">Category</ThemedText>
        <ViewAllButton></ViewAllButton>
      </View>

      <View style={styles.categoryContainer}>
        <CategorySelectorButtons
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      </View>
      <View style={styles.textNewDishes}>
        <ThemedText type="title">New Dishes</ThemedText>
        <ViewAllButton sort="created_asc" />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.newDishesContainer}
      >
        {numberNewDishes.map(item => {
          const isFavorite = favoriteDishes.some(
            fav => fav.dish.id === item.dish.id,
          );
          return (
            <DishCard5
              key={item.dish.id}
              dish={item.dish}
              onPress={() => openModal(item.dish, item.ingredients)}
              initiallyFavorite={isFavorite}
            />
          );
        })}
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
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#f0f8ff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    paddingHorizontal: 28,
  },
  icon: {
    marginRight: 4,
  },
  categoryContainer: {
    paddingLeft: 28,
    paddingVertical: 4
  },
  featuredContainer: {
    paddingLeft: 28,
    marginTop: 8,
    paddingTop: 8
  },
  featuredText: {
    marginBottom: 16,
  },
  category: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 28,
    marginTop: 8,
  },
  textNewDishes: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    marginBottom: 12,
    marginTop: 24,
  },
  newDishesContainer: {
    paddingHorizontal: 28,
    paddingVertical: 8,
  },
  featuredDishes: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingTop: 16,
  },
});
