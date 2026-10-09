import { router } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  BrandMark,
  IconButton,
  LeafIcon,
  Pill,
  ProductGrid,
  SearchBarButton,
  palette,
} from '@/components/pivot-ui';
import { products } from '@/constants/products';
import { useShop } from '@/state/shop-store';

export default function HomeScreen() {
  const { preferences, followedBrands, followedSellers } = useShop();
  const followedProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          followedBrands.includes(product.brand) || followedSellers.includes(product.seller),
      ),
    [followedBrands, followedSellers],
  );
  const recommendedProducts = useMemo(() => {
    let items = products.filter((product) => !followedProducts.includes(product));
    if (preferences?.styles.length) {
      const selectedStyles = preferences.styles.map((style) => style.toLowerCase());
      items = items.filter((product) =>
        product.styleTags.some((style) => selectedStyles.includes(style)),
      );
    }
    if (preferences?.budget === '$25–50') items = items.filter((product) => product.price <= 50);
    if (preferences?.budget === '$50–100') items = items.filter((product) => product.price <= 100);
    if (preferences?.budget === '$100–200') items = items.filter((product) => product.price <= 200);
    return items;
  }, [followedProducts, preferences]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>GOOD FINDS, GOOD FEELING</Text>
            <BrandMark />
          </View>
          <IconButton label="View saved pieces" onPress={() => router.push('/saved')}>
            ♡
          </IconButton>
        </View>

        <SearchBarButton onPress={() => router.push('/search')} />

        <View style={styles.welcomeCard}>
          <View style={styles.welcomeCopy}>
            <Text style={styles.cardEyebrow}>A BETTER KIND OF CLOSET</Text>
            <Text style={styles.welcomeTitle}>Wear the good.{'\n'}Pass it on.</Text>
            <Text style={styles.welcomeBody}>
              One-of-a-kind finds from people and brands you love.
            </Text>
          </View>
          <View style={styles.seal}>
            <LeafIcon color={palette.beige} size={22} />
            <Text style={styles.sealText}>SECOND{'\n'}LIFE{'\n'}STYLE</Text>
          </View>
          <View style={styles.cardArc} />
        </View>

        <View style={styles.sectionHeading}>
          <View>
            <Text style={styles.sectionEyebrow}>YOUR PEOPLE & BRANDS</Text>
            <Text style={styles.sectionTitle}>In your loop</Text>
          </View>
          <Text style={styles.followingCount}>{followedProducts.length} finds</Text>
        </View>
        <View style={styles.followingChips}>
          {followedBrands.map((brand) => (
            <Pill key={brand} selected>
              {brand}
            </Pill>
          ))}
          {followedSellers.map((seller) => (
            <Pill key={seller}>{seller}</Pill>
          ))}
        </View>
        <ProductGrid items={followedProducts} />

        <View style={styles.sectionHeading}>
          <View>
            <Text style={styles.sectionEyebrow}>A LITTLE MORE TO LOVE</Text>
            <Text style={styles.sectionTitle}>Picked for you</Text>
          </View>
          <Text style={styles.searchLink}>Based on your style</Text>
        </View>
        {preferences && (
          <View style={styles.personalizedNote}>
            <LeafIcon color={palette.olive} size={14} />
            <Text style={styles.personalizedText}>
              {preferences.styles.length > 0 ? preferences.styles.join(' · ') : 'Your style'}
              {preferences.sizes.length > 0 ? `  ·  Size ${preferences.sizes.join('/')}` : ''}
              {`  ·  ${preferences.budget}`}
            </Text>
          </View>
        )}
        <ProductGrid items={recommendedProducts} />

        <View style={styles.impactCard}>
          <LeafIcon color={palette.olive} size={21} />
          <View style={styles.impactCopy}>
            <Text style={styles.impactTitle}>Small choice. Big impact.</Text>
            <Text style={styles.impactBody}>
              Buying pre-loved saves an average of 8.2 lbs of CO₂.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.paper },
  content: { paddingHorizontal: 20, paddingBottom: 28, gap: 18 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  greeting: {
    color: palette.olive,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.1,
    marginBottom: 1,
  },
  welcomeCard: {
    position: 'relative',
    minHeight: 175,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: palette.olive,
    borderRadius: 19,
  },
  welcomeCopy: { flex: 1, zIndex: 1 },
  cardEyebrow: { color: palette.beige, fontSize: 8, fontWeight: '700', letterSpacing: 1.3 },
  welcomeTitle: {
    marginTop: 9,
    color: palette.paper,
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 28,
    letterSpacing: -0.8,
  },
  welcomeBody: { width: 225, maxWidth: '100%', marginTop: 7, color: palette.beige, fontSize: 11, lineHeight: 16 },
  seal: {
    position: 'absolute',
    right: 19,
    top: 27,
    width: 92,
    height: 108,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.beige,
    borderRadius: 48,
    transform: [{ rotate: '8deg' }],
  },
  sealText: {
    color: palette.beige,
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1.4,
    textAlign: 'center',
    lineHeight: 11,
  },
  cardArc: {
    position: 'absolute',
    right: -65,
    bottom: -100,
    width: 210,
    height: 210,
    borderRadius: 110,
    borderWidth: 1,
    borderColor: palette.beige,
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  sectionEyebrow: { color: palette.terracotta, fontSize: 9, fontWeight: '700', letterSpacing: 1.1 },
  sectionTitle: { marginTop: 4, color: palette.olive, fontSize: 21, fontWeight: '700', letterSpacing: -0.5 },
  followingCount: { color: palette.olive, fontSize: 11 },
  followingChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  searchLink: { paddingBottom: 3, color: palette.terracotta, fontSize: 11, fontWeight: '700' },
  personalizedNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: -8,
    padding: 11,
    borderRadius: 12,
    backgroundColor: palette.cream,
  },
  personalizedText: { flex: 1, color: palette.olive, fontSize: 9, fontWeight: '700', letterSpacing: 0.4 },
  impactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 7,
    padding: 14,
    borderRadius: 16,
    backgroundColor: palette.cream,
  },
  impactCopy: { flex: 1 },
  impactTitle: { color: palette.olive, fontSize: 12, fontWeight: '700' },
  impactBody: { marginTop: 3, color: palette.olive, fontSize: 10, lineHeight: 14 },
});
