import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from '../contexts/AppContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { theme } from '../constants/theme';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <StatusBar style="dark" backgroundColor={theme.background} />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen 
              name="property/[id]" 
              options={{ 
                headerShown: false,
                animation: 'slide_from_right',
              }} 
            />
            <Stack.Screen 
              name="agent/[id]" 
              options={{ 
                headerShown: false,
                animation: 'slide_from_right',
              }} 
            />
            <Stack.Screen 
              name="login" 
              options={{ 
                headerShown: false,
                animation: 'fade',
              }} 
            />
            <Stack.Screen 
              name="chat/[id]" 
              options={{ 
                headerShown: false,
                animation: 'slide_from_right',
              }} 
            />
          </Stack>
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
