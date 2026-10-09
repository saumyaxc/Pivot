import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandMark, ProductGrid, palette } from '@/components/pivot-ui';
import { products } from '@/constants/products';
import { useShop } from '@/state/shop-store';

export default function SavedScreen() {
  const { savedIds } = useShop();
  const savedProducts = useMemo(
    () => products.filter((product) => savedIds.includes(product.id)),
    [savedIds],
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.back}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>
          <BrandMark />
          <Text style={styles.count}>{savedProducts.length.toString().padStart(2, '0')}</Text>
        </View>
        <Text style={styles.title}>Saved for{'\n'}a little later.</Text>
        <Text style={styles.subtitle}>Your good finds, all in one place.</Text>
        {savedProducts.length > 0 ? (
          <ProductGrid items={savedProducts} />
        ) : (
          <View style={styles.emptyCard}>
            <View style={styles.emptyHeart}>
              <Text style={styles.heart}>♡</Text>
            </View>
            <Text style={styles.emptyTitle}>Keep the good ones close.</Text>
            <Text style={styles.emptyCopy}>
              Tap the heart on anything you love. We’ll keep it safe right here.
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.back()}
              style={styles.exploreButton}>
              <Text style={styles.exploreButtonText}>Back to Home  →</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.paper },
  content: { paddingHorizontal: 20, paddingBottom: 30, gap: 15 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  back: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 22, backgroundColor: palette.cream },
  backText: { color: palette.olive, fontSize: 26, lineHeight: 30 },
  count: { color: palette.terracotta, fontSize: 14, fontWeight: '700' },
  title: { color: palette.olive, fontSize: 36, lineHeight: 38, letterSpacing: -1.2, fontWeight: '700' },
  subtitle: { marginTop: -9, marginBottom: 6, color: palette.olive, fontSize: 13 },
  emptyCard: { alignItems: 'center', paddingHorizontal: 25, paddingVertical: 32, backgroundColor: palette.cream, borderRadius: 20 },
  emptyHeart: { width: 70, height: 70, alignItems: 'center', justifyContent: 'center', borderRadius: 38, backgroundColor: palette.beige },
  heart: { color: palette.olive, fontSize: 35, lineHeight: 42 },
  emptyTitle: { marginTop: 17, color: palette.olive, fontSize: 18, fontWeight: '700', textAlign: 'center' },
  emptyCopy: { maxWidth: 250, marginTop: 8, color: palette.olive, fontSize: 13, lineHeight: 19, textAlign: 'center' },
  exploreButton: { marginTop: 20, paddingHorizontal: 18, paddingVertical: 13, borderRadius: 13, backgroundColor: palette.olive },
  exploreButtonText: { color: palette.paper, fontSize: 12, fontWeight: '700' },
});
