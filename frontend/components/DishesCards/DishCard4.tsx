import { convertBase64ToImage } from '@/constants/convertB64Image';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, Text, Image, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CardProps } from '@/interfaces/allInterfaces';

const DishCard4: React.FC<CardProps> = ({ dish, onPress }) => {
  const { id, name, preparation_time, calories, image } = dish;

  return (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient
        key={id}
        colors={['#70B9BE', '#4AA7AC', '#1F7A7A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.card}
      >
        <Image
          source={{ uri: convertBase64ToImage(image) }}
          style={styles.cardImage}
        />
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">{name}</Text>
          <View style={styles.cardFooter}>
            <View style={styles.cardInfo}>
              <Ionicons name="flame-outline" size={16} color="white" />
              <Text style={styles.cardText}>{calories} Kcal</Text>
            </View>
            <View style={styles.cardInfo}>
              <Ionicons name="time-outline" size={16} color="white" />
              <Text style={styles.cardText}>{preparation_time} Min</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 310,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 8,
    elevation: 4,
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'white',
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  cardText: {
    color: 'white',
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default DishCard4;
