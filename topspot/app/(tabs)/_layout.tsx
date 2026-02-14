import {  Tabs } from 'expo-router';
import React from 'react';
import { Platform,View} from 'react-native';

import { HapticTab } from '@/components/HapticTab';

import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

import { CircleUserRound, Compass, Home } from 'lucide-react-native';


// add the whole solid icon set to the library

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    
      <Tabs
        
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#000000', // Black tab bar
            borderTopWidth: 0, // Remove top border
            elevation: 0, // Remove shadow on Android
          },
          tabBarActiveTintColor: '#ffffff',
          tabBarInactiveTintColor: '#666666',
        }}>
        
          <Tabs.Screen
            
            name="home"
            options={{
              title: '',
              tabBarIcon: ({ color }) =><Home size={30} color={color}
               />,
            }}
          />

          <Tabs.Screen
            name="search"
            options={{
              title: '',
              tabBarIcon: ({ color }) => <Compass size={30} color={color} />,
            }}
          /> 

          <Tabs.Screen
            name="Profile"
            options={{
              title: '',
              tabBarIcon: ({ color }) => <CircleUserRound size={30} color={color} />,
            }}
          /> 
       
        
        
      </Tabs>
      
    
    
    
  );
}
