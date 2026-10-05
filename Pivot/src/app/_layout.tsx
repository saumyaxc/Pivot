import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';

import { ShopProvider } from '@/state/shop-store';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ShopProvider>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#FFFEFA' } }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="product/[id]" options={{ presentation: 'modal' }} />
        </Stack>
      </ShopProvider>
    </ThemeProvider>
  );
}
