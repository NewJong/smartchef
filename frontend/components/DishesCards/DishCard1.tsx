import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { convertBase64ToImage } from '@/constants/convertB64Image';
import { useAuth } from '@/hooks/useAuth';
import FavoriteButton from '../Buttons/FavoriteButton';
import { CardProps } from '@/interfaces/allInterfaces';

const DishCard1: React.FC<CardProps> = ({
  dish,
  onPress,
  initiallyFavorite = false,
  onLongDelete,
}) => {
  const { id, name, preparation_time, calories, image } = dish;
  const { userId } = useAuth();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      onLongPress={onLongDelete}
    >
      <Image
        source={{ uri: convertBase64ToImage(image) }}
        style={styles.cardImage}
      />
      {userId !== null && (
        <FavoriteButton
          dishId={id}
          userId={userId}
          initiallyFavorite={initiallyFavorite}
          buttonStyle="primary"
        />
      )}
      <Text style={styles.cardTitle} numberOfLines={1}>
        {name}
      </Text>
      <View style={styles.cardInfo}>
        <Ionicons name="flame-outline" size={16} color="gray" />
        <Text style={styles.cardText}>{calories} Kcal</Text>
        <Ionicons
          name="time-outline"
          size={16}
          color="gray"
          style={styles.icon}
        />
        <Text style={styles.cardText}>{preparation_time} Min</Text>
      </View>
    </TouchableOpacity>
  );
};

export default DishCard1;

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 8,
    elevation: 4,
  },
  cardImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  favoriteButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'white',
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 6,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#0A2533',
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  cardText: {
    marginLeft: 4,
    fontSize: 12,
    color: 'gray',
  },
  icon: {
    marginLeft: 8,
  },
});
