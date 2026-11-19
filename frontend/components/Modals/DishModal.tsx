import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Dish } from '@/interfaces/Dish';
import { convertBase64ToImage } from '@/constants/convertB64Image';
import FavoriteButton from '@/components/Buttons/FavoriteButton';
import { ThemedText } from '@/components/ThemedText';
import NutrientItem from '@/components/NutrientItem';
import { Ingredient } from '@/interfaces/Ingredient';
import AddAllToCartButton from '../Buttons/AddAllToCartButton';
import AddToStatisticsButton from '@/components/Buttons/AddToStatisticsButton';

interface Props {
  visible: boolean;
  onClose: () => void;
  dish: Dish;
  ingredients: Ingredient[];
  userId: number;
  initiallyFavorite: boolean;
}

const DishModal: React.FC<Props> = ({
  visible,
  onClose,
  dish,
  ingredients,
  userId,
  initiallyFavorite,
}) => {
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions'>(
    'ingredients',
  );
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView>
            <Image
              source={{ uri: convertBase64ToImage(dish.image) }}
              style={styles.dishImage}
            />

            <FavoriteButton
              dishId={dish.id}
              userId={userId}
              initiallyFavorite={initiallyFavorite}
              buttonStyle="secondary"
            />
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={28} color="#0A2533" />
            </TouchableOpacity>

            <View style={styles.infoDishes}>
              <View style={styles.titleContainer}>
                <ThemedText type="title">{dish.name}</ThemedText>
                <View style={styles.timeContainer}>
                  <Ionicons name="time-outline" size={20} color={'gray'} />
                  <Text style={styles.time}> {dish.preparation_time} Min</Text>
                </View>
              </View>

              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionText}>{dish.category}</Text>
              </View>

              <NutrientItem dish={dish} />

              <View style={styles.tabContainer}>
                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    activeTab === 'ingredients' && styles.activeTabButton,
                  ]}
                  onPress={() => setActiveTab('ingredients')}
                >
                  <Text
                    style={[
                      styles.tabButtonText,
                      activeTab === 'ingredients' && styles.activeTabButtonText,
                    ]}
                  >
                    Ingredients
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    activeTab === 'instructions' && styles.activeTabButton,
                  ]}
                  onPress={() => setActiveTab('instructions')}
                >
                  <Text
                    style={[
                      styles.tabButtonText,
                      activeTab === 'instructions' &&
                        styles.activeTabButtonText,
                    ]}
                  >
                    Instructions
                  </Text>
                </TouchableOpacity>
              </View>

              {activeTab === 'ingredients' ? (
                <>
                  <View style={styles.ingredients}>
                    <ThemedText type="subtitle">Ingredients</ThemedText>

                    <AddToStatisticsButton userId={userId} dishId={dish.id} />
                  </View>
                  <Text style={styles.itemCountText}>
                    {Array.isArray(ingredients) ? ingredients.length : 0}{' '}
                    {ingredients?.length === 1 ? 'item' : 'items'}
                  </Text>
                  {ingredients && ingredients.length > 0 ? (
                    <>
                      {ingredients.map(item => (
                        <View key={item.id} style={styles.ingredientCard}>
                          <View style={styles.imageWrapper}>
                            <Image
                              source={{ uri: convertBase64ToImage(item.image) }}
                              style={styles.ingredientImage}
                            />
                          </View>
                          <Text style={styles.ingredientName}>{item.name}</Text>
                          <View style={styles.quantityWrapper}>
                            <Text style={styles.quantityText}>
                              {item.quantity}
                            </Text>
                          </View>
                        </View>
                      ))}

                      <AddAllToCartButton
                        userId={userId}
                        ingredients={ingredients}
                      />
                    </>
                  ) : (
                    <ThemedText type="link">
                      No ingredients available.
                    </ThemedText>
                  )}
                </>
              ) : (
                <>
                  <ThemedText type="subtitle">Instructions</ThemedText>
                  <Text style={styles.instructionsText}>
                    {dish.instruction}
                  </Text>
                </>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default DishModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    height: '100%',
  },
  infoDishes: {
    paddingTop: 28,
    paddingLeft: 24,
    paddingRight: 24,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: '#ffffff',
    marginTop: -32,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'white',
    padding: 6,
    borderRadius: 12,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dishImage: {
    width: '100%',
    height: 300,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  time: {
    color: 'gray',
    fontSize: 16,
  },
  descriptionContainer: {
    marginTop: 4,
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 16,
    color: '#748189',
  },

  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#E6EBF2',
    borderRadius: 12,
    padding: 4,
    marginTop: 24,
    marginBottom: 28,
  },
  tabButton: {
    flex: 1,
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: 12,
  },
  tabButtonText: {
    color: '#0A2533',
    fontSize: 16,
    fontWeight: '500',
  },
  activeTabButton: {
    backgroundColor: '#0A2533',
  },
  activeTabButtonText: {
    color: '#ffffff',
  },
  ingredients: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },

  itemCountText: {
    fontSize: 16,
    color: '#748189',
    fontWeight: '400',
    marginBottom: 12,
  },

  ingredientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginVertical: 8,
    shadowOpacity: 0.24,
    shadowRadius: 6,
    elevation: 6,
  },

  imageWrapper: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#e6ebf2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  ingredientImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },

  ingredientName: {
    flex: 1,
    fontSize: 18,
    color: '#0A2533',
    fontWeight: 'bold',
  },

  quantityWrapper: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  quantityText: {
    fontSize: 18,
    color: '#0A2533',
    fontWeight: '600',
  },

  instructionsText: {
    fontSize: 16,
    color: '#748189',
    marginVertical: 16,
    lineHeight: 24,
  },
});
