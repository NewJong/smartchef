import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#70B9BE', 
        tabBarInactiveTintColor: '#828282',
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {
            height: 60,
            paddingTop: 10,
          },
        }),
        tabBarLabel: () => null,
      }}>
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color }: { color: string }) => <Ionicons size={28} name="home" color={color} />,
          }}
        />
          <Tabs.Screen
            name="search"
            options={{
              tabBarIcon: ({ color }: { color: string }) => <Ionicons size={28} name="search" color={color} />,
            }}
          />
        <Tabs.Screen
          name="account"
          options={{
            tabBarIcon: ({ color }: { color: string }) => <Ionicons size={28} name="person" color={color} />,
          }}
        />
      
     
    </Tabs>
  );
}
