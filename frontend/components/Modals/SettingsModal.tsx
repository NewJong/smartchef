import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Modal, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/hooks/useAuth';
import { ModalProps } from '@/interfaces/allInterfaces';

import { AntDesign } from '@expo/vector-icons';

const SettingsModal: React.FC<ModalProps> = ({ visible, onClose }) => {
  const { profileImage, pickImage, deleteUser } = useAuth();

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <ThemedText type="title">Settings</ThemedText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color="#0A2533" />
            </TouchableOpacity>
          </View>

          <View style={styles.cardsContainer}>
            <TouchableOpacity
              style={[styles.card, { backgroundColor: '#ffe0e0' }]}
              onPress={async () => {
                if (confirm('Are you sure you want to delete your account?')) {
                  await deleteUser();
                  onClose();
                }
              }}
            >
              <AntDesign name="deleteuser" size={28} color="#ff3333" />
              <ThemedText type="subtitle" style={{ color: '#ff3333' }}>
                Delete Account
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SettingsModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    justifyContent: 'flex-end',
    paddingTop: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 28,
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 8,
  },
  cardsContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: '#E0F0F5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    width: 360,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  avatarPicker: {
    width: 60,
    height: 60,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
});
