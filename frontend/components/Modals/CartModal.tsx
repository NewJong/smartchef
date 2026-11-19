import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '@/hooks/useAuth';
import { fetchData } from '@/constants/fetchData';
import { CartIngredients } from '@/interfaces/CartIngredients';
import CardIngredientSlider from '@/components/DishesCards/CardIngredientSlider';
import RecipeGenerator from '@/components/RecipeGenerator';
import { ModalProps } from '@/interfaces/allInterfaces';

const CartModal: React.FC<ModalProps> = ({ visible, onClose }) => {
  const { email, userId } = useAuth();
  const [ingredients, setIngredients] = useState<CartIngredients[]>([]);
  const [pages, setPages] = useState<CartIngredients[][]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<
    CartIngredients[]
  >([]);

  useEffect(() => {
    const fetchIngredients = async () => {
      if (email) {
        try {
          const data = await fetchData(`cart/get?email=${email}`);
          const safeData = Array.isArray(data) ? data : [];
          setIngredients(safeData);
          setPages(chunkArray(safeData, 3));
        } catch (err) {
          console.error('Error fetching cart ingredients:', err);
        }
      }
    };

    if (visible) fetchIngredients();
  }, [visible, email]);

  const chunkArray = (array: CartIngredients[], size: number) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  };

  const onSelectIngredient = (ingredient: CartIngredients) => {
    setSelectedIngredients(prev => {
      if (prev.some(item => item.ingredient.id === ingredient.ingredient.id)) {
        return prev.filter(
          item => item.ingredient.id !== ingredient.ingredient.id,
        );
      } else {
        return [...prev, ingredient];
      }
    });
  };

  const updateIngredientQuantity = async (
    ingredient: CartIngredients,
    delta: number,
  ) => {
    if (!userId) {
      console.error('User id is missing');
      return;
    }
    try {
      const response = await fetchData('cart/update-quantity', 'PUT', {
        user_id: userId,
        ingredient_id: ingredient.ingredient.id,
        quantity: delta,
      });
      if (
        response.message === 'Cart updated successfully' ||
        response.message === 'Ingredient removed from cart'
      ) {
        setIngredients(prev => {
          const updatedIngredients = prev
            .map(item => {
              if (item.ingredient.id === ingredient.ingredient.id) {
                const newQuantity = item.quantity + delta;
                if (newQuantity < 1) {
                  return null;
                }
                return { ...item, quantity: newQuantity };
              }
              return item;
            })
            .filter(item => item !== null) as CartIngredients[];
          setPages(chunkArray(updatedIngredients, 3));
          return updatedIngredients;
        });
      } else {
        console.error('Failed to update cart:', response);
      }
    } catch (err) {
      console.error('Error updating ingredient quantity:', err);
    }
  };

  const handleClearCart = async () => {
    try {
      const response = await fetchData('cart/remove-all-ingredients', 'DELETE');
      if (response.message === 'Deleted successfully') {
        setIngredients([]);
        setPages([]);
        setSelectedIngredients([]);
      } else {
        console.error('Error:', response);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const clearSelectedIngredients = () => {
    setSelectedIngredients([]);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.cartTitle}>Cart</Text>
              <TouchableOpacity
                style={styles.iconButtonClose}
                onPress={onClose}
              >
                <Ionicons name="close" size={28} color="#0A2533" />
              </TouchableOpacity>
            </View>

            <View style={styles.itemCounterContainer}>
              <Text style={styles.itemCountText}>
                {ingredients.length}{' '}
                {ingredients.length === 1 ? 'item' : 'items'}
              </Text>
              <TouchableOpacity
                style={styles.iconButtonTrash}
                onPress={handleClearCart}
              >
                <Ionicons name="trash-bin-outline" size={20} color="#0A2533" />
              </TouchableOpacity>
            </View>

            <View style={styles.cardIngredientSlider}>
              <CardIngredientSlider
                pages={pages}
                selectedIngredients={selectedIngredients}
                onSelectIngredient={onSelectIngredient}
                onUpdateQuantity={updateIngredientQuantity}
              />
            </View>
            <View style={styles.recipeSection}>
              <RecipeGenerator
                ingredients={
                  selectedIngredients.length > 0
                    ? selectedIngredients
                    : ingredients
                }
                onRequestSent={clearSelectedIngredients}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
};

export default CartModal;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#f0f8ff',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#f0f8ff',
  },
  modalContent: {
    height: '100%',
    backgroundColor: '#f0f8ff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 28,
  },
  cardIngredientSlider: {
    marginTop: 8,
    paddingLeft: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 12,
  },
  cartTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0A2533',
    flex: 1,
    textAlign: 'center',
  },
  recipeSection: {
    marginTop: 0,
    paddingHorizontal: 28,
    marginBottom: 20,
  },
  iconButtonClose: {
    padding: 6,
    position: 'absolute',
    right: 20,
  },
  itemCounterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 22,
    paddingHorizontal: 28,
  },
  itemCountText: {
    fontSize: 16,
    color: '#0A2533',
    fontWeight: '400',
    marginRight: 8,
  },
  iconButtonTrash: {
    padding: 0,
  },
});
