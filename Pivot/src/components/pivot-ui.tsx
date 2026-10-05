import { router } from 'expo-router';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import type { Product } from '@/constants/products';
import { useShop } from '@/state/shop-store';

export const palette = {
  ink: '#20241E',
  muted: '#777C73',
  olive: '#53634C',
  oliveDark: '#394735',
  sage: '#E4E9DF',
  cream: '#F6F3EB',
  paper: '#FFFEFA',
  line: '#E8E6DE',
  terracotta: '#B66D51',
};

export function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <Text style={[styles.brand, light && styles.brandLight]}>
      pivot<Text style={[styles.brandDot, light && styles.brandLight]}>.</Text>
    </Text>
  );
}

export function Eyebrow({ children, light = false }: { children: string; light?: boolean }) {
  return <Text style={[styles.eyebrow, light && styles.lightText]}>{children.toUpperCase()}</Text>;
}

export function Pill({
  children,
  selected = false,
  onPress,
  style,
}: {
  children: string;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.pill, selected && styles.pillSelected, style]}>
      <Text style={[styles.pillText, selected && styles.pillTextSelected]}>{children}</Text>
    </Pressable>
  );
}

export function ActionButton({
  label,
  onPress,
  secondary = false,
  disabled = false,
  style,
}: {
  label: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionButton,
        secondary && styles.actionButtonSecondary,
        disabled && styles.actionButtonDisabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}>
      <Text style={[styles.actionText, secondary && styles.actionTextSecondary]}>{label}</Text>
    </Pressable>
  );
}

export function SearchField({
  value,
  onChangeText,
  placeholder = 'Search pre-loved pieces',
}: Pick<TextInputProps, 'value' | 'onChangeText' | 'placeholder'>) {
  return (
    <View style={styles.searchField}>
      <Text style={styles.searchIcon}>⌕</Text>
      <TextInput
        accessibilityLabel="Search"
        placeholder={placeholder}
        placeholderTextColor={palette.muted}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        style={styles.searchInput}
      />
      <Text style={styles.searchTune}>☷</Text>
    </View>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const { savedIds, toggleSaved } = useShop();
  const isSaved = savedIds.includes(product.id);

  return (
    <View style={styles.productCard}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`View ${product.name}`}
        onPress={() => router.push({ pathname: '/product/[id]', params: { id: product.id } })}>
        <View style={styles.productImageWrap}>
          <Image source={{ uri: product.image }} style={styles.productImage} resizeMode="cover" />
          <View style={styles.conditionTag}>
            <Text style={styles.conditionTagText}>{product.condition}</Text>
          </View>
        </View>
        <Text style={styles.productBrand}>{product.brand}</Text>
        <Text numberOfLines={1} style={styles.productName}>
          {product.name}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.productPrice}>${product.price}</Text>
          <Text style={styles.originalPrice}>${product.originalPrice}</Text>
        </View>
        <View style={styles.scoreRow}>
          <Text style={styles.leaf}>✳</Text>
          <Text style={styles.scoreText}>{product.sustainability} sustainability score</Text>
        </View>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={isSaved ? `Remove ${product.name} from saved` : `Save ${product.name}`}
        accessibilityState={{ selected: isSaved }}
        onPress={() => toggleSaved(product.id)}
        style={styles.saveButton}>
        <Text style={[styles.heart, isSaved && styles.heartSelected]}>{isSaved ? '♥' : '♡'}</Text>
      </Pressable>
    </View>
  );
}

export function ProductGrid({ items }: { items: Product[] }) {
  if (items.length === 0) {
    return (
      <View style={styles.emptyProducts}>
        <Text style={styles.emptyIcon}>♡</Text>
        <Text style={styles.emptyTitle}>No pieces match just yet</Text>
        <Text style={styles.emptyBody}>Try another search or broaden your filters.</Text>
      </View>
    );
  }
  return (
    <View style={styles.productGrid}>
      {items.map((product) => (
        <View key={product.id} style={styles.productColumn}>
          <ProductCard product={product} />
        </View>
      ))}
    </View>
  );
}

export function IconButton({
  label,
  onPress,
  children,
  style,
}: { label: string; children: string; onPress?: () => void; style?: ViewStyle }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.iconButton, pressed && styles.pressed, style]}>
      <Text style={styles.iconButtonText}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  brand: {
    color: palette.oliveDark,
    fontSize: 27,
    fontWeight: '700',
    letterSpacing: -1.2,
  },
  brandDot: {
    color: palette.terracotta,
  },
  brandLight: {
    color: palette.paper,
  },
  eyebrow: {
    color: palette.olive,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  lightText: {
    color: '#E2E8D9',
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: palette.paper,
    borderColor: palette.line,
    borderRadius: 24,
    borderWidth: 1,
  },
  pillSelected: {
    backgroundColor: palette.olive,
    borderColor: palette.olive,
  },
  pillText: {
    color: palette.ink,
    fontSize: 13,
    fontWeight: '600',
  },
  pillTextSelected: {
    color: palette.paper,
  },
  actionButton: {
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
    backgroundColor: palette.olive,
    borderRadius: 14,
  },
  actionButtonSecondary: {
    backgroundColor: palette.paper,
    borderColor: palette.line,
    borderWidth: 1,
  },
  actionButtonDisabled: {
    opacity: 0.45,
  },
  actionText: {
    color: palette.paper,
    fontSize: 15,
    fontWeight: '700',
  },
  actionTextSecondary: {
    color: palette.ink,
  },
  pressed: {
    opacity: 0.72,
  },
  searchField: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: '#F0EFE9',
  },
  searchIcon: {
    color: palette.olive,
    fontSize: 25,
    lineHeight: 28,
  },
  searchInput: {
    flex: 1,
    color: palette.ink,
    fontSize: 14,
    paddingVertical: 0,
  },
  searchTune: {
    color: palette.olive,
    fontSize: 20,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 24,
  },
  productColumn: {
    width: '48.2%',
  },
  productCard: {
    position: 'relative',
  },
  productImageWrap: {
    width: '100%',
    aspectRatio: 0.77,
    overflow: 'hidden',
    borderRadius: 15,
    backgroundColor: '#E9E6DE',
    marginBottom: 10,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  conditionTag: {
    position: 'absolute',
    left: 8,
    bottom: 8,
    paddingHorizontal: 9,
    paddingVertical: 5,
    backgroundColor: 'rgba(255,254,250,0.92)',
    borderRadius: 9,
  },
  conditionTagText: {
    color: palette.ink,
    fontSize: 10,
    fontWeight: '600',
  },
  saveButton: {
    position: 'absolute',
    right: 9,
    top: 9,
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255,254,250,0.94)',
  },
  heart: {
    color: palette.ink,
    fontSize: 19,
    lineHeight: 22,
  },
  heartSelected: {
    color: palette.terracotta,
  },
  productBrand: {
    color: palette.muted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },
  productName: {
    marginTop: 4,
    color: palette.ink,
    fontSize: 13,
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 5,
  },
  productPrice: {
    color: palette.ink,
    fontSize: 14,
    fontWeight: '700',
  },
  originalPrice: {
    color: palette.muted,
    fontSize: 11,
    textDecorationLine: 'line-through',
  },
  scoreRow: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    marginTop: 5,
  },
  leaf: {
    color: palette.olive,
    fontSize: 12,
  },
  scoreText: {
    color: palette.olive,
    fontSize: 10,
    fontWeight: '600',
  },
  emptyProducts: {
    alignItems: 'center',
    paddingHorizontal: 34,
    paddingVertical: 70,
    borderRadius: 20,
    backgroundColor: palette.cream,
  },
  emptyIcon: {
    color: palette.olive,
    fontSize: 36,
  },
  emptyTitle: {
    marginTop: 12,
    color: palette.ink,
    fontSize: 18,
    fontWeight: '700',
  },
  emptyBody: {
    marginTop: 7,
    color: palette.muted,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
  iconButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: palette.paper,
    borderWidth: 1,
    borderColor: palette.line,
  },
  iconButtonText: {
    color: palette.ink,
    fontSize: 19,
  },
});
