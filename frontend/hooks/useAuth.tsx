import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchData } from '@/constants/fetchData';
import { convertBase64ToImage } from '@/constants/convertB64Image';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

interface AuthContextProps {
  isLoggedIn: boolean;
  username: string;
  email: string;
  profileImage: string | null;
  modalVisible: boolean;
  isSignIn: boolean;
  userId: number | null;
  setModalVisible: (visible: boolean) => void;
  setIsSignIn: (value: boolean) => void;
  setPassword: (value: string) => void;
  setUsername: (value: string) => void;
  setEmail: (value: string) => void;
  handleSignUp: () => Promise<void>;
  handleSignIn: () => Promise<void>;
  handleLogout: () => Promise<void>;
  pickImage: () => Promise<void>;
  deleteUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSignIn, setIsSignIn] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      const user = await AsyncStorage.getItem('user');

      if (storedToken && user) {
        setToken(storedToken);
        setIsLoggedIn(true);
        try {
          const parsedUser = JSON.parse(user);
          setUsername(parsedUser.user_name);
          setEmail(parsedUser.email);
          setUserId(parsedUser.id);
          if (parsedUser.profile_image) {
            setProfileImage(convertBase64ToImage(parsedUser.profile_image));
          }
        } catch (error) {
          console.error('Ошибка парсинга user:', error);
        }
      }
    };
    loadUserData();
  }, []);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Access Denied', 'Permission required to access the gallery');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      base64: true,
    });

    if (!result.canceled) {
      const base64Image = `${result.assets[0].base64}`;
      setProfileImage(base64Image);
    }
  };

  const handleSignUp = async () => {
    const response = await fetchData('users/register', 'POST', {
      email,
      password,
      user_name: username,
      image: profileImage,
    });
    if (response) {
      await handleSignIn();
      setModalVisible(false);
    } else {
      alert('Mail already exists');
    }
  };

  const handleSignIn = async () => {
    const response = await fetchData('users/login', 'POST', {
      email,
      password,
    });
    if (response && response.token) {
      await AsyncStorage.setItem('token', response.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
      setUsername(response.user.user_name);
      setEmail(response.user.email);
      if (response.user.profile_image) {
        setProfileImage(convertBase64ToImage(response.user.profile_image));
      }
      setIsLoggedIn(true);
      setModalVisible(false);
    } else {
      alert('Incorrect email or password');
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    setIsLoggedIn(false);
    setEmail('');
    setProfileImage(null);
  };

  const deleteUser = async () => {
    if (!userId) return;

    const response = await fetchData(`users/delete/${userId}`, 'DELETE', {});

    if (response) {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      setIsLoggedIn(false);
      setEmail('');
      setUsername('');
      setProfileImage(null);
      setUserId(null);
      Alert.alert(
        'Account Deleted',
        'Your account has been deleted successfully.',
      );
    } else {
      Alert.alert('Error', 'Failed to delete account.');
    }
  };


  return (
    <AuthContext.Provider
      value={{
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
        deleteUser,
        userId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
