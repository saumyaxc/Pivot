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
          <View>
            <Text style={styles.kicker}>THE ONES YOU LOVE</Text>
            <BrandMark />
          </View>
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
              onPress={() => router.push('/(tabs)/explore')}
              style={styles.exploreButton}>
              <Text style={styles.exploreButtonText}>Find something lovely  →</Text>
            </Pressable>
          </View>
        )}
        <View style={styles.tip}>
          <Text style={styles.tipStar}>✳</Text>
          <Text style={styles.tipText}>One saved piece today can be a favorite for years.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.paper },
  content: { paddingHorizontal: 20, paddingBottom: 30, gap: 15 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  kicker: { marginBottom: 2, color: palette.muted, fontSize: 8, fontWeight: '700', letterSpacing: 1.1 },
  count: { color: palette.olive, fontSize: 14, fontWeight: '700' },
  title: { color: palette.ink, fontSize: 36, lineHeight: 38, letterSpacing: -1.2, fontWeight: '700' },
  subtitle: { marginTop: -9, marginBottom: 6, color: palette.muted, fontSize: 13 },
  emptyCard: { alignItems: 'center', paddingHorizontal: 25, paddingVertical: 32, backgroundColor: palette.cream, borderRadius: 20 },
  emptyHeart: { width: 70, height: 70, alignItems: 'center', justifyContent: 'center', borderRadius: 38, backgroundColor: '#E5E9DF' },
  heart: { color: palette.olive, fontSize: 35, lineHeight: 42 },
  emptyTitle: { marginTop: 17, color: palette.ink, fontSize: 18, fontWeight: '700', textAlign: 'center' },
  emptyCopy: { maxWidth: 250, marginTop: 8, color: palette.muted, fontSize: 13, lineHeight: 19, textAlign: 'center' },
  exploreButton: { marginTop: 20, paddingHorizontal: 18, paddingVertical: 13, borderRadius: 13, backgroundColor: palette.olive },
  exploreButtonText: { color: palette.paper, fontSize: 12, fontWeight: '700' },
  tip: { flexDirection: 'row', alignItems: 'center', gap: 9, padding: 13, borderRadius: 13, backgroundColor: '#F1EEE5' },
  tipStar: { color: palette.olive, fontSize: 17 },
  tipText: { flex: 1, color: palette.muted, fontSize: 11 },
});
