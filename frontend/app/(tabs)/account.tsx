import { StyleSheet, ScrollView, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import Login from '@/components/Login';
import DishCard1 from '@/components/DishesCards/DishCard1';
import { useAuth } from '@/hooks/useAuth';
import DishModal from '@/components/Modals/DishModal';
import { useDishModal } from '@/hooks/useDishModal';
import { useFavoriteDishes } from '@/hooks/useFavoriteDishes';
import SortDropdown from '@/components/SortDropdown';
import { useState } from 'react';
import { useSortedDishes } from '@/hooks/useSortedDishes';
import StatisticsModal from '@/components/Modals/StatisticsModal';
import { SortOption } from '@/interfaces/allInterfaces';
import { useIsFocused } from '@react-navigation/native';
import SettingsModal from '@/components/Modals/SettingsModal';

export default function AccountScreen() {
  const isFocused = useIsFocused();
  const { isLoggedIn, email, userId } = useAuth();
  const { favoriteDishes } = useFavoriteDishes(email, isLoggedIn, isFocused);
  const { modalVisible, selected, openModal, closeModal } = useDishModal();

  const [statisticsVisible, setStatisticsVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('calories_desc');
  const sortedDishes = useSortedDishes(favoriteDishes, sortOption);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setStatisticsVisible(true)}>
          <Ionicons name="stats-chart-outline" size={24} color="black" />
        </TouchableOpacity>
        <ThemedText type="title">Account</ThemedText>
        <TouchableOpacity onPress={() => setSettingsVisible(true)}>
          <Ionicons name="settings-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <Login></Login>
        <View style={styles.sectionHeader}>
          <ThemedText type="title">My Favorites Dishes</ThemedText>
          <TouchableOpacity
            style={styles.filtersButton}
            onPress={() => setFiltersVisible(prev => !prev)}
          >
            <Ionicons name="filter-sharp" size={24} color="#0A2533" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.container}>
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
      <SortDropdown
        visible={filtersVisible}
        sortOption={sortOption}
        onChange={(option: SortOption) => setSortOption(option)}
        onToggle={() => setFiltersVisible(prev => !prev)}
        style={{ top: 120, left: 220 }}
      />
      <StatisticsModal
        visible={statisticsVisible}
        onClose={() => setStatisticsVisible(false)}
      />
      <SettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
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
  container: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc', 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  filtersButton: {
    position: 'absolute',
    right: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
