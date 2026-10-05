import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActionButton, BrandMark, IconButton, Pill, ProductGrid, SearchField, palette } from '@/components/pivot-ui';
import { products } from '@/constants/products';
import { useShop } from '@/state/shop-store';

const filters = ['For you', 'Just in', 'Under $50', 'Sustainable'];

export default function HomeScreen() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState(filters[0]);
  const { bagCount, preferences } = useShop();

  const visibleProducts = useMemo(() => {
    let items = products.filter((product) =>
      `${product.name} ${product.brand} ${product.category}`.toLowerCase().includes(query.toLowerCase()),
    );
    if (preferences?.styles.length) {
      const selectedStyles = preferences.styles.map((style) => style.toLowerCase());
      items = items.filter((product) =>
        product.styleTags.some((style) => selectedStyles.includes(style)),
      );
    }
    if (preferences?.budget === '$25–50') items = items.filter((product) => product.price <= 50);
    if (preferences?.budget === '$50–100') items = items.filter((product) => product.price <= 100);
    if (preferences?.budget === '$100–200') items = items.filter((product) => product.price <= 200);
    if (filter === 'Under $50') items = items.filter((product) => product.price < 50);
    if (filter === 'Sustainable') items = items.filter((product) => product.sustainability >= 92);
    if (filter === 'Just in') items = [...items].reverse();
    return items;
  }, [filter, preferences, query]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>MONDAY, OCTOBER 5</Text>
            <BrandMark />
          </View>
          <View style={styles.headerActions}>
            <IconButton label="Open saved pieces" onPress={() => router.push('/(tabs)/saved')}>
              ♡
            </IconButton>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Shopping bag with ${bagCount} items`}
              onPress={() => router.push('/(tabs)/profile')}
              style={styles.bagButton}>
              <Text style={styles.bagIcon}>▱</Text>
              {bagCount > 0 && <View style={styles.bagCount}><Text style={styles.bagCountText}>{bagCount}</Text></View>}
            </Pressable>
          </View>
        </View>

        <SearchField value={query} onChangeText={setQuery} />

        <View style={styles.welcomeCard}>
          <View style={styles.welcomeCopy}>
            <Text style={styles.cardEyebrow}>A BETTER KIND OF CLOSET</Text>
            <Text style={styles.welcomeTitle}>Wear the good.{'\n'}Pass it on.</Text>
            <Text style={styles.welcomeBody}>One-of-a-kind finds, with a lighter footprint.</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/(tabs)/explore')}
              style={styles.discoverLink}>
              <Text style={styles.discoverLinkText}>Explore the edit  ↗</Text>
            </Pressable>
          </View>
          <View style={styles.seal}>
            <Text style={styles.sealFlower}>✳</Text>
            <Text style={styles.sealText}>SECOND{'\n'}LIFE{'\n'}STYLE</Text>
          </View>
          <View style={styles.cardArc} />
        </View>

        <View style={styles.storyRow}>
          {[
            ['New', '✳'],
            ['Under $50', '$'],
            ['Good denim', '◌'],
            ['Made well', '↗'],
          ].map(([label, icon], index) => (
            <Pressable
              key={label}
              accessibilityRole="button"
              onPress={() => {
                setFilter(label === 'Under $50' ? 'Under $50' : label === 'New' ? 'Just in' : 'Sustainable');
              }}
              style={styles.storyItem}>
              <View style={[styles.storyCircle, index % 2 === 1 && styles.storyCircleAlt]}>
                <Text style={styles.storyIcon}>{icon}</Text>
              </View>
              <Text style={styles.storyLabel}>{label}</Text>
            </Pressable>
          ))}
        </View>

        {preferences && (
          <View style={styles.personalizedNote}>
            <Text style={styles.personalizedMark}>✳</Text>
            <Text style={styles.personalizedText}>
              YOUR EDIT
              {preferences.styles.length > 0 ? `  ·  ${preferences.styles.join(' + ')}` : ''}
              {preferences.sizes.length > 0 ? `  ·  Size ${preferences.sizes.join('/')}` : ''}
              {`  ·  ${preferences.budget}`}
            </Text>
          </View>
        )}

        <View style={styles.sectionHeading}>
          <View>
            <Text style={styles.sectionEyebrow}>CURATED FOR YOU</Text>
            <Text style={styles.sectionTitle}>Good things, found.</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/(tabs)/explore')}>
            <Text style={styles.seeAll}>See all  →</Text>
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {filters.map((item) => (
            <Pill key={item} selected={filter === item} onPress={() => setFilter(item)}>
              {item}
            </Pill>
          ))}
        </ScrollView>

        <ProductGrid items={visibleProducts} />
        <View style={styles.impactCard}>
          <Text style={styles.impactMark}>✳</Text>
          <View style={styles.impactCopy}>
            <Text style={styles.impactTitle}>Small choice. Big impact.</Text>
            <Text style={styles.impactBody}>Buying pre-loved saves an average of 8.2 lbs of CO₂.</Text>
          </View>
          <ActionButton label="Our impact" secondary onPress={() => router.push('/(tabs)/profile')} style={styles.impactButton} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.paper },
  content: { paddingHorizontal: 20, paddingBottom: 28, gap: 19 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  greeting: { color: palette.muted, fontSize: 9, fontWeight: '700', letterSpacing: 1.1, marginBottom: 1 },
  headerActions: { flexDirection: 'row', gap: 8 },
  bagButton: { width: 42, height: 42, borderRadius: 22, backgroundColor: palette.cream, alignItems: 'center', justifyContent: 'center' },
  bagIcon: { color: palette.ink, fontSize: 24 },
  bagCount: { position: 'absolute', top: -1, right: -1, minWidth: 17, height: 17, borderRadius: 9, backgroundColor: palette.terracotta, alignItems: 'center', justifyContent: 'center' },
  bagCountText: { color: palette.paper, fontSize: 9, fontWeight: '700' },
  welcomeCard: { position: 'relative', minHeight: 175, overflow: 'hidden', flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: palette.oliveDark, borderRadius: 19 },
  welcomeCopy: { flex: 1, zIndex: 1 },
  cardEyebrow: { color: '#D8DFD0', fontSize: 8, fontWeight: '700', letterSpacing: 1.3 },
  welcomeTitle: { marginTop: 9, color: palette.paper, fontSize: 26, fontWeight: '700', lineHeight: 28, letterSpacing: -0.8 },
  welcomeBody: { width: 225, maxWidth: '100%', marginTop: 7, color: '#E0E3DA', fontSize: 11, lineHeight: 16 },
  discoverLink: { alignSelf: 'flex-start', marginTop: 10 },
  discoverLinkText: { color: '#F2DFC0', fontSize: 11, fontWeight: '700' },
  seal: { position: 'absolute', right: 19, top: 27, width: 92, height: 108, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(246,243,235,0.36)', borderRadius: 48, transform: [{ rotate: '8deg' }] },
  sealFlower: { color: '#D8C59D', fontSize: 23, lineHeight: 25 },
  sealText: { marginTop: 4, color: '#E4D7B8', fontSize: 8, fontWeight: '700', letterSpacing: 1.4, textAlign: 'center', lineHeight: 11 },
  cardArc: { position: 'absolute', right: -65, bottom: -100, width: 210, height: 210, borderRadius: 110, borderWidth: 1, borderColor: 'rgba(246,243,235,0.16)' },
  storyRow: { flexDirection: 'row', justifyContent: 'space-between' },
  storyItem: { width: '23%', alignItems: 'center', gap: 6 },
  storyCircle: { width: 58, height: 58, alignItems: 'center', justifyContent: 'center', borderRadius: 31, backgroundColor: '#ECEDE5', borderWidth: 1, borderColor: '#D9DED2' },
  storyCircleAlt: { backgroundColor: '#F1E7DB', borderColor: '#E5D4C1' },
  storyIcon: { color: palette.olive, fontSize: 22 },
  storyLabel: { color: palette.ink, fontSize: 10, fontWeight: '600' },
  personalizedNote: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: -5, padding: 11, borderRadius: 12, backgroundColor: '#EDF0E8' },
  personalizedMark: { color: palette.olive, fontSize: 14 },
  personalizedText: { flex: 1, color: palette.oliveDark, fontSize: 9, fontWeight: '700', letterSpacing: 0.4 },
  sectionHeading: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 2 },
  sectionEyebrow: { color: palette.olive, fontSize: 9, fontWeight: '700', letterSpacing: 1.1 },
  sectionTitle: { marginTop: 4, color: palette.ink, fontSize: 21, fontWeight: '700', letterSpacing: -0.5 },
  seeAll: { paddingBottom: 3, color: palette.olive, fontSize: 11, fontWeight: '700' },
  filters: { gap: 8, paddingRight: 20 },
  impactCard: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 7, padding: 14, borderRadius: 16, backgroundColor: palette.cream },
  impactMark: { color: palette.olive, fontSize: 21 },
  impactCopy: { flex: 1 },
  impactTitle: { color: palette.ink, fontSize: 12, fontWeight: '700' },
  impactBody: { marginTop: 3, color: palette.muted, fontSize: 10, lineHeight: 14 },
  impactButton: { minHeight: 37, paddingHorizontal: 12, borderRadius: 11 },
});
