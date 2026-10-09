import { router } from 'expo-router';
import { useMemo, useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconButton, Pill, ProductGrid, SearchField, palette } from '@/components/pivot-ui';
import { categories, products } from '@/constants/products';

const priceOptions = ['Any price', 'Under $50', '$50–100', '$100+'];
const colorOptions = [...new Set(products.flatMap((product) => product.colors))];
const sizeOptions = [...new Set(products.flatMap((product) => product.sizes))];
const brandOptions = [...new Set(products.map((product) => product.brand))];
const styleOptions = [...new Set(products.flatMap((product) => product.styleTags))];

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [price, setPrice] = useState('Any price');
  const [category, setCategory] = useState('All');
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [styles, setStyles] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const toggle = (selected: string[], value: string, update: (next: string[]) => void) => {
    update(
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value],
    );
  };

  const clearFilters = () => {
    setQuery('');
    setPrice('Any price');
    setCategory('All');
    setColors([]);
    setSizes([]);
    setBrands([]);
    setStyles([]);
    setMinPrice('');
    setMaxPrice('');
  };

  const activeFilterCount =
    Number(price !== 'Any price') +
    Number(category !== 'All') +
    colors.length +
    sizes.length +
    brands.length +
    styles.length +
    Number(minPrice !== '') +
    Number(maxPrice !== '');

  const visibleProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesQuery = `${product.name} ${product.brand} ${product.category} ${product.styleTags.join(' ')}`
          .toLowerCase()
          .includes(query.trim().toLowerCase());
        const matchesPrice =
          (price === 'Any price' ||
            (price === 'Under $50' && product.price < 50) ||
            (price === '$50–100' && product.price >= 50 && product.price <= 100) ||
            (price === '$100+' && product.price >= 100)) &&
          (minPrice === '' || product.price >= Number(minPrice)) &&
          (maxPrice === '' || product.price <= Number(maxPrice));
        const matchesCategory = category === 'All' || product.category === category;
        const matchesColor =
          colors.length === 0 || product.colors.some((color) => colors.includes(color));
        const matchesSize = sizes.length === 0 || product.sizes.some((size) => sizes.includes(size));
        const matchesBrand = brands.length === 0 || brands.includes(product.brand);
        const matchesStyle =
          styles.length === 0 || product.styleTags.some((style) => styles.includes(style));
        return (
          matchesQuery &&
          matchesPrice &&
          matchesCategory &&
          matchesColor &&
          matchesSize &&
          matchesBrand &&
          matchesStyle
        );
      }),
    [brands, category, colors, maxPrice, minPrice, price, query, sizes, styles],
  );

  return (
    <SafeAreaView style={screen.safe} edges={['top', 'bottom']}>
      <View style={screen.header}>
        <IconButton label="Close search and return home" onPress={() => router.back()}>
          ×
        </IconButton>
        <Text style={screen.headerTitle}>Find your next favorite</Text>
        <Pressable accessibilityRole="button" onPress={clearFilters} style={screen.clearButton}>
          <Text style={screen.clearText}>Clear</Text>
        </Pressable>
      </View>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={screen.content}>
        <SearchField
          value={query}
          onChangeText={setQuery}
          placeholder="Item, brand, color, style…"
          autoFocus
        />

        <FilterSection title="Category">
          {categories.map((item) => (
            <Pill key={item} selected={category === item} onPress={() => setCategory(item)}>
              {item}
            </Pill>
          ))}
        </FilterSection>

        <FilterSection title="Price">
          {priceOptions.map((item) => (
            <Pill key={item} selected={price === item} onPress={() => setPrice(item)}>
              {item}
            </Pill>
          ))}
          <View style={screen.priceRange}>
            <PriceInput label="Min $" value={minPrice} onChangeText={setMinPrice} />
            <Text style={screen.rangeDash}>–</Text>
            <PriceInput label="Max $" value={maxPrice} onChangeText={setMaxPrice} />
          </View>
        </FilterSection>

        <FilterSection title="Color">
          {colorOptions.map((item) => (
            <Pill key={item} selected={colors.includes(item)} onPress={() => toggle(colors, item, setColors)}>
              {item}
            </Pill>
          ))}
        </FilterSection>

        <FilterSection title="Size">
          {sizeOptions.map((item) => (
            <Pill key={item} selected={sizes.includes(item)} onPress={() => toggle(sizes, item, setSizes)}>
              {item}
            </Pill>
          ))}
        </FilterSection>

        <FilterSection title="Brand">
          {brandOptions.map((item) => (
            <Pill key={item} selected={brands.includes(item)} onPress={() => toggle(brands, item, setBrands)}>
              {item}
            </Pill>
          ))}
        </FilterSection>

        <FilterSection title="Style">
          {styleOptions.map((item) => (
            <Pill key={item} selected={styles.includes(item)} onPress={() => toggle(styles, item, setStyles)}>
              {item}
            </Pill>
          ))}
        </FilterSection>

        <View style={screen.resultsHeading}>
          <Text style={screen.resultsTitle}>Pieces for you</Text>
          <Text style={screen.resultCount}>
            {visibleProducts.length} {visibleProducts.length === 1 ? 'find' : 'finds'}
            {activeFilterCount > 0 ? ` · ${activeFilterCount} filters` : ''}
          </Text>
        </View>
        <ProductGrid items={visibleProducts} />
      </ScrollView>
    </SafeAreaView>
  );
}

function FilterSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={screen.filterSection}>
      <Text style={screen.filterTitle}>{title}</Text>
      <View style={screen.options}>{children}</View>
    </View>
  );
}

function PriceInput({
  label,
  value,
  onChangeText,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
}) {
  return (
    <TextInput
      accessibilityLabel={label}
      keyboardType="number-pad"
      placeholder={label}
      placeholderTextColor={palette.olive}
      value={value}
      onChangeText={onChangeText}
      style={screen.priceInput}
    />
  );
}

const screen = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.paper },
  header: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },
  headerTitle: { color: palette.olive, fontSize: 14, fontWeight: '700' },
  clearButton: { padding: 8 },
  clearText: { color: palette.terracotta, fontSize: 12, fontWeight: '700' },
  content: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 32, gap: 16 },
  filterSection: { gap: 9 },
  filterTitle: { color: palette.olive, fontSize: 13, fontWeight: '700' },
  options: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 7 },
  priceRange: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rangeDash: { color: palette.terracotta, fontSize: 16 },
  priceInput: {
    width: 88,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: palette.beige,
    color: palette.olive,
    backgroundColor: palette.paper,
    fontSize: 12,
  },
  resultsHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: 3,
  },
  resultsTitle: { color: palette.olive, fontSize: 20, fontWeight: '700' },
  resultCount: { color: palette.terracotta, fontSize: 11, fontWeight: '600' },
});
