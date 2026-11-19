import React from 'react';
import {
  FlatList,
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { convertBase64ToImage } from '@/constants/convertB64Image';
import { CartIngredients } from '@/interfaces/CartIngredients';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

interface Props {
  pages: CartIngredients[][];
  selectedIngredients: CartIngredients[];
  onSelectIngredient: (ingredient: CartIngredients) => void;
  onUpdateQuantity: (ingredient: CartIngredients, delta: number) => void;
}

const CartIngredientsSlider: React.FC<Props> = ({
  pages,
  selectedIngredients,
  onSelectIngredient,
  onUpdateQuantity,
}) => {
  return (
    <FlatList
      data={pages}
      horizontal
      pagingEnabled
      keyExtractor={(_, index) => `page-${index}`}
      showsHorizontalScrollIndicator={false}
      snapToInterval={screenWidth}
      decelerationRate="fast"
      style={{ flexGrow: 0 }}
      renderItem={({ item }) => (
        <View style={styles.page}>
          {item.map(ingredient => {
            const isSelected = selectedIngredients.some(
              selectedItem =>
                selectedItem.ingredient.id === ingredient.ingredient.id,
            );
            return (
              <TouchableOpacity
                key={ingredient.ingredient.id}
                onPress={() => onSelectIngredient(ingredient)}
                activeOpacity={0.8}
                style={[
                  styles.ingredientCardSlider,
                  isSelected ? styles.selectedCard : styles.unselectedCard,
                ]}
              >
                <View style={styles.imageWrapper}>
                  <Image
                    source={{
                      uri: convertBase64ToImage(ingredient.ingredient.image),
                    }}
                    style={styles.ingredientImage}
                  />
                </View>
                <Text style={styles.ingredientName}>
                  {ingredient.ingredient.name}
                </Text>
                <View style={styles.quantityWrapper}>
                  <View style={styles.quantityButtonContainer}>
                    <TouchableOpacity
                      onPress={() => onUpdateQuantity(ingredient, -1)}
                      style={styles.iconButton}
                    >
                      <Ionicons name="remove" size={16} color="#0A2533" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.quantityTextContainer}>
                    <Text style={styles.quantityText}>
                      {ingredient.quantity}
                    </Text>
                  </View>
                  <View style={styles.quantityButtonContainer}>
                    <TouchableOpacity
                      onPress={() => onUpdateQuantity(ingredient, 1)}
                      style={styles.iconButton}
                    >
                      <Ionicons name="add" size={16} color="#0A2533" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    />
  );
};

export default CartIngredientsSlider;

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 24,
  },
  ingredientCardSlider: {
    width: 280,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginVertical: 8,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 8,
  },
  unselectedCard: {
    backgroundColor: '#ffffff',
  },
  selectedCard: {
    backgroundColor: '#e9e9e9',
  },
  imageWrapper: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#e6ebf2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  ingredientImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  ingredientName: {
    flex: 1,
    fontSize: 18,
    color: '#0A2533',
    fontWeight: 'bold',
  },
  quantityWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  quantityButtonContainer: {
    marginHorizontal: 4,
  },
  quantityTextContainer: {
    marginHorizontal: 4,
  },
  quantityText: {
    fontSize: 18,
    color: '#0A2533',
    fontWeight: '600',
  },
  iconButton: {
    padding: 4,
  },
});
