import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { useEffect } from 'react';
import * as SystemUI from 'expo-system-ui';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Remove this - it's causing the crash if native module isn't linked
// import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    // Set system background to black to fix white bars
    SystemUI.setBackgroundColorAsync('#000000');
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      {/* Black background fills entire screen including safe area edges */}
      <View style={{ flex: 1, backgroundColor: '#000000' }}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={{ 
            headerShown: false,
            contentStyle: { backgroundColor: '#000000' } // Force black background
          }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="+not-found" />
            <Stack.Screen name="auth" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="light" /> {/* Changed to "light" for dark background */}
        </ThemeProvider>
      </View>
    </SafeAreaProvider>
  );
}