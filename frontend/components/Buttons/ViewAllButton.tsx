import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import ViewAllModal from '../Modals/ViewAllModal';
import { Sort } from '@/interfaces/allInterfaces';

const ViewAllButton: React.FC<Sort> = ({ sort }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <ThemedText type="viewAll">View all</ThemedText>
      </TouchableOpacity>

      <ViewAllModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        sort={sort}
      />
    </View>
  );
};

export default ViewAllButton;
