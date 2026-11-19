import { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchData } from '@/constants/fetchData';
type Props = {
  dishId: number;
  userId: number;
  initiallyFavorite?: boolean;
  buttonStyle?: 'primary' | 'secondary' | 'tertiary' | 'quaternary';
};

const FavoriteButton: React.FC<Props> = ({
  dishId,
  userId,
  initiallyFavorite = false,
  buttonStyle = 'primary',
}) => {
  const [isFavorite, setIsFavorite] = useState(initiallyFavorite);

  const toggleFavorite = async () => {
    const url = isFavorite ? 'favorites-dishes/delete' : 'favorites-dishes/add';
    const method = isFavorite ? 'DELETE' : 'POST';
    const success = await fetchData(url, method, {
      dish_id: dishId,
      user_id: userId,
    });
    if (success) setIsFavorite(!isFavorite);
  };

  const buttonStyleVariant = styles[buttonStyle] || styles.primary;
  const iconSize =
    buttonStyle === 'primary'
      ? 20
      : buttonStyle === 'secondary'
        ? 24
        : buttonStyle === 'tertiary'
          ? 16
          : buttonStyle === 'quaternary'
            ? 24
            : 20;
  return (
    <TouchableOpacity
      onPress={toggleFavorite}
      style={[styles.favoriteButton, buttonStyleVariant]}
    >
      <Ionicons
        name={isFavorite ? 'heart' : 'heart-outline'}
        size={iconSize}
        color={isFavorite ? '#70B9BE' : '#70B9BE'}
      />
    </TouchableOpacity>
  );
};

export default FavoriteButton;

const styles = StyleSheet.create({
  favoriteButton: {
    position: 'absolute',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    top: 20,
    right: 20,
    padding: 4,
    width: 32,
    height: 32,
    borderRadius: 12,
  },
  secondary: {
    top: 20,
    right: 20,
    padding: 8,
    width: 40,
    height: 40,
    borderRadius: 12,
  },
  tertiary: {
    top: 36,
    right: 20,
    backgroundColor: '#0A2533',
    width: 32,
    height: 32,
    borderRadius: 12,
  },
  quaternary: {
    top: 24,
    right: 24,
    width: 36,
    height: 36,
    borderRadius: 10,
  },
});
