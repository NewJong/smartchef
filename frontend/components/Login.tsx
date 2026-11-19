import React from 'react';
import {
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
export default function Login() {
  const {
    isLoggedIn,
    username,
    email,
    profileImage,
    modalVisible,
    isSignIn,
    setModalVisible,
    setIsSignIn,
    setPassword,
    setUsername,
    setEmail,
    handleSignUp,
    handleSignIn,
    handleLogout,
    pickImage,
  } = useAuth();

  return (
    <View>
      <View style={styles.userCard}>
        {isLoggedIn ? (
          <>
            <Image
              style={styles.avatar}
              source={
                profileImage
                  ? { uri: profileImage }
                  : require('./../assets/images/monkey.png')
              }
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{username}</Text>
              <Text style={styles.userRole}>{email}</Text>
            </View>
            <TouchableOpacity style={styles.authButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="#0A2533" />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Image
              source={require('./../assets/images/noneuser.png')}
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Log in to your account</Text>
            </View>
            <TouchableOpacity
              style={styles.authButton}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="log-in-outline" size={20} color="#0A2533" />
            </TouchableOpacity>
          </>
        )}
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <ImageBackground
          source={require('./../assets/images/bglogin.jpg')}
          style={styles.modalBackground}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.switchButtons}>
                <TouchableOpacity
                  onPress={() => setIsSignIn(true)}
                  style={isSignIn ? styles.activeTab : styles.inactiveTab}
                >
                  <Text
                    style={isSignIn ? styles.activeText : styles.inactiveText}
                  >
                    Sign In
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setIsSignIn(false)}
                  style={!isSignIn ? styles.activeTab : styles.inactiveTab}
                >
                  <Text
                    style={!isSignIn ? styles.activeText : styles.inactiveText}
                  >
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>

              {isSignIn ? (
                <>
                  <TextInput
                    placeholder="Email"
                    style={styles.input}
                    onChangeText={setEmail}
                  />
                  <TextInput
                    placeholder="Password"
                    secureTextEntry
                    style={styles.input}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity
                    style={styles.authSubmitButton}
                    onPress={handleSignIn}
                  >
                    <Text style={styles.authSubmitText}>Sign In</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.avatarPicker}
                    onPress={pickImage}
                  >
                    {profileImage ? (
                      <Image
                        source={{
                          uri: `data:image/png;base64,${profileImage}`,
                        }}
                        style={styles.avatar}
                      />
                    ) : (
                      <Ionicons
                        name="camera-outline"
                        size={40}
                        color="#70B9BE"
                      />
                    )}
                  </TouchableOpacity>
                  <TextInput
                    placeholder="Username"
                    style={styles.input}
                    onChangeText={setUsername}
                  />
                  <TextInput
                    placeholder="Email"
                    style={styles.input}
                    onChangeText={setEmail}
                  />
                  <TextInput
                    placeholder="Password"
                    secureTextEntry
                    style={styles.input}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity
                    style={styles.authSubmitButton}
                    onPress={handleSignUp}
                  >
                    <Text style={styles.authSubmitText}>Sign Up</Text>
                  </TouchableOpacity>
                </>
              )}

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 20,
    marginVertical: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 6,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userRole: {
    fontSize: 14,
    color: '#777',
  },
  authButton: {
    padding: 8,
    backgroundColor: '#eee',
    borderRadius: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    alignItems: 'center',
  },
  switchButtons: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  activeTab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#70B9BE',
    borderRadius: 6,
    marginHorizontal: 5,
  },
  inactiveTab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#70B9BE',
    marginHorizontal: 5,
  },
  activeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  inactiveText: {
    color: '#70B9BE',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#70B9BE',
    marginBottom: 10,
  },
  authSubmitButton: {
    backgroundColor: '#70B9BE',
    padding: 10,
    borderRadius: 6,
    width: '100%',
    alignItems: 'center',
  },
  authSubmitText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 12,
  },
  closeText: {
    color: '#0A2533',
    fontWeight: 'bold',
    fontSize: 18,
  },
  avatarPicker: {
    width: 60,
    height: 60,
    borderRadius: 40,
    backgroundColor: '#E0F0F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
});
