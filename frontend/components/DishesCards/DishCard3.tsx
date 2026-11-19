import { convertBase64ToImage } from '@/constants/convertB64Image';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, Text, Image, StyleSheet, View } from 'react-native';
import FavoriteButton from '../Buttons/FavoriteButton';
import { useAuth } from '@/hooks/useAuth';
import { CardProps } from '@/interfaces/allInterfaces';

const DishCard3: React.FC<CardProps> = ({
  dish,
  onPress,
  initiallyFavorite = false,
}) => {
  const { id, name, preparation_time, image } = dish;

  const { userId } = useAuth();
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={{ uri: convertBase64ToImage(image) }}
        style={styles.cardImage}
      />
      <View style={styles.cardTextContainer}>
        <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">{name}</Text>
        <View style={styles.cardInfo}>
          <Ionicons name="time-outline" size={16} color="gray" />
          <Text style={styles.cardText}>{preparation_time} Min</Text>
        </View>
      </View>
      {userId !== null && (
        <FavoriteButton
          dishId={id}
          userId={userId}
          initiallyFavorite={initiallyFavorite}
          buttonStyle="tertiary"
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 8,
    elevation: 4,
  },
  cardImage: {
    width: 100,
    height: 84,
    borderRadius: 8,
    marginRight: 12,
  },
  cardTextContainer: {
    flex: 1,
    justifyContent: 'center',
    maxWidth: '50%',
    marginRight: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },

  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardText: {
    marginLeft: 4,
    fontSize: 14,
    color: 'gray',
  },
});

export default DishCard3;
