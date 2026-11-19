import { convertBase64ToImage } from '@/constants/convertB64Image';
import { CardProps } from '@/interfaces/allInterfaces';
import { TouchableOpacity, Text, Image, StyleSheet } from 'react-native';

const DishCard2: React.FC<CardProps> = ({ dish, onPress }) => {
  const { name, image } = dish;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={{ uri: convertBase64ToImage(image) }}
        style={styles.cardImage}
      />
      <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">
        {name}
      </Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  card: {
    width: 105,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    padding: 8,
    marginRight: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 8,
    elevation: 4,
  },
  cardImage: {
    width: 84,
    height: 84,
    borderRadius: 12,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#0a2533',
    marginLeft: 8,
    marginRight: 8,
    textAlign: 'left',
    alignSelf: 'flex-start',
    width: '95%',
  },
});

export default DishCard2;
