import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';

import { palette } from '@/components/pivot-ui';
import { ShopProvider } from '@/state/shop-store';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ShopProvider>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: palette.paper } }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="search" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
          <Stack.Screen name="saved" options={{ presentation: 'modal' }} />
          <Stack.Screen name="product/[id]" options={{ presentation: 'modal' }} />
        </Stack>
      </ShopProvider>
    </ThemeProvider>
  );
}
