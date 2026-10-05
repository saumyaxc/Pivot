import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  BrandMark,
  IconButton,
  Pill,
  ProductGrid,
  SearchField,
  palette,
} from '@/components/pivot-ui';
import { categories, products } from '@/constants/products';
import { useShop } from '@/state/shop-store';

export default function DiscoverScreen() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [onlySustainable, setOnlySustainable] = useState(false);
  const { bagCount } = useShop();

  const visibleProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesQuery = `${product.name} ${product.brand} ${product.category}`
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesCategory = category === 'All' || product.category === category;
        const matchesScore = !onlySustainable || product.sustainability >= 92;
        return matchesQuery && matchesCategory && matchesScore;
      }),
    [category, onlySustainable, query],
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View>
            <Text style={styles.kicker}>A WORLD OF SECOND CHANCES</Text>
            <BrandMark />
          </View>
          <IconButton label={`Bag, ${bagCount} items`} onPress={() => router.push('/(tabs)/profile')}>
            ▱
          </IconButton>
        </View>

        <Text style={styles.title}>Find your{'\n'}kind of good.</Text>
        <Text style={styles.subtitle}>Pieces with a past, ready for your next.</Text>
        <SearchField value={query} onChangeText={setQuery} placeholder="Try “linen” or “vintage”" />

        <View style={styles.editCard}>
          <View style={styles.editText}>
            <Text style={styles.editLabel}>THE CONSIDERED EDIT</Text>
            <Text style={styles.editTitle}>Made to be{'\n'}worn again.</Text>
            <Text style={styles.editBody}>Thoughtful fabrics. Better stories.</Text>
          </View>
          <View style={styles.editSeal}>
            <Text style={styles.editSealFlower}>✳</Text>
            <Text style={styles.editSealText}>LESS NEW{'\n'}MORE YOU</Text>
          </View>
          <View style={styles.editRings} />
        </View>

        <View style={styles.rowHeading}>
          <Text style={styles.sectionTitle}>Shop by feeling</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setCategory('All');
              setQuery('');
            }}>
            <Text style={styles.resetText}>Reset</Text>
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryList}>
          {categories.map((item) => (
            <Pill key={item} selected={category === item} onPress={() => setCategory(item)}>
              {item}
            </Pill>
          ))}
        </ScrollView>

        <View style={styles.rowHeading}>
          <View>
            <Text style={styles.sectionEyebrow}>SECONDHAND, FIRST CHOICE</Text>
            <Text style={styles.sectionTitle}>The good stuff</Text>
          </View>
          <Pill selected={onlySustainable} onPress={() => setOnlySustainable((value) => !value)}>
            ✳  Good impact
          </Pill>
        </View>
        <ProductGrid items={visibleProducts} />
        <View style={styles.footerNote}>
          <Text style={styles.footerStar}>✳</Text>
          <Text style={styles.footerText}>Every pre-loved piece is one less new thing made.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.paper },
  content: { paddingHorizontal: 20, paddingBottom: 28, gap: 17 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  kicker: { marginBottom: 2, color: palette.muted, fontSize: 8, fontWeight: '700', letterSpacing: 1.1 },
  title: { color: palette.ink, fontSize: 36, lineHeight: 37, letterSpacing: -1.2, fontWeight: '700' },
  subtitle: { marginTop: -11, color: palette.muted, fontSize: 13 },
  editCard: { height: 162, overflow: 'hidden', flexDirection: 'row', alignItems: 'center', padding: 18, borderRadius: 18, backgroundColor: '#E9E4D6' },
  editText: { zIndex: 1 },
  editLabel: { color: palette.olive, fontSize: 8, fontWeight: '700', letterSpacing: 1.1 },
  editTitle: { marginTop: 8, color: palette.oliveDark, fontSize: 24, fontWeight: '700', lineHeight: 26, letterSpacing: -0.7 },
  editBody: { marginTop: 5, color: '#696E60', fontSize: 10 },
  editSeal: { position: 'absolute', right: 20, top: 28, width: 86, height: 102, justifyContent: 'center', alignItems: 'center', borderRadius: 45, borderWidth: 1, borderColor: '#B4B8A4', transform: [{ rotate: '10deg' }] },
  editSealFlower: { color: palette.olive, fontSize: 25 },
  editSealText: { marginTop: 4, color: palette.oliveDark, fontSize: 8, fontWeight: '700', letterSpacing: 1, textAlign: 'center', lineHeight: 11 },
  editRings: { position: 'absolute', right: -100, bottom: -150, width: 270, height: 270, borderRadius: 140, borderWidth: 1, borderColor: '#D1C7B1' },
  rowHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 3 },
  sectionEyebrow: { color: palette.olive, fontSize: 8, fontWeight: '700', letterSpacing: 1.1 },
  sectionTitle: { marginTop: 3, color: palette.ink, fontSize: 19, fontWeight: '700', letterSpacing: -0.4 },
  resetText: { color: palette.olive, fontSize: 11, fontWeight: '600' },
  categoryList: { gap: 8, paddingRight: 20 },
  footerNote: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 6, padding: 15, backgroundColor: palette.cream, borderRadius: 13 },
  footerStar: { color: palette.olive, fontSize: 18 },
  footerText: { color: palette.muted, fontSize: 11 },
});
