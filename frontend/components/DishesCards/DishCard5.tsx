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
  const { id, name, preparation_time, calories, image } = dish;
  const { userId } = useAuth();
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Image
        source={{ uri: convertBase64ToImage(image) }}
        style={styles.cardImage}
      />
      <View style={styles.cardTextContainer}>
        <Text style={styles.cardTitle}>
        {name.length > 40 ? name.substring(0, 40).trim() + '...' : name}
        </Text>
        <View style={styles.cardFooter}>
          <View style={styles.cardInfo}>
            <Ionicons name="flame-outline" size={16} color="gray" />
            <Text style={styles.cardText}>{calories} Kcal</Text>
          </View>
          <View style={styles.circle}></View>
          <View style={styles.cardInfo}>
            <Ionicons name="time-outline" size={16} color="gray" />
            <Text style={styles.cardText}>{preparation_time} Min</Text>
          </View>
        </View>
      </View>
      {userId !== null && (
        <FavoriteButton
          dishId={id}
          userId={userId}
          initiallyFavorite={initiallyFavorite}
          buttonStyle="quaternary"
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    width: 220,
    height: 280,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 8,
    elevation: 4,
  },
  cardImage: {
    width: '100%',
    height: 168,
    borderRadius: 12,
  },
  cardTextContainer: {
    marginTop: 12,
    alignItems: 'center',
    textAlign: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cardText: {
    marginLeft: 4,
    fontSize: 14,
    color: 'gray',
  },
  circle: {
    width: 8,
    height: 8,
    marginHorizontal: 6,
    borderRadius: 50,
    backgroundColor: '#97a2b0',
  },
});

export default DishCard3;
