import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
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
import Svg, { Path } from 'react-native-svg';

import type { Product } from '@/constants/products';
import { useShop } from '@/state/shop-store';

export const palette = {
  ink: '#4F6B56',
  muted: '#4F6B56',
  olive: '#4F6B56',
  oliveDark: '#4F6B56',
  sage: '#E3C3AF',
  cream: '#E3C3AF',
  paper: '#FFFCF9',
  line: '#E3C3AF',
  terracotta: '#C95B0C',
  beige: '#E3C3AF',
  logoPeach: '#CF9B7A',
  sand: '#E2DDD8',
  stone: '#7C7870',
  charcoal: '#1C1C1A',
};

export function LeafIcon({
  color = palette.olive,
  size = 18,
  opacity = 1,
  style,
}: {
  color?: string;
  size?: number;
  opacity?: number;
  style?: import('react-native').StyleProp<import('react-native').ViewStyle>;
}) {
  return (
    <SymbolView
      name={{ ios: 'leaf.fill', android: 'eco', web: 'eco' }}
      size={size}
      tintColor={color}
      weight="medium"
      style={[style, { opacity }]}
      accessible={false}
    />
  );
}

export function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <Text style={[styles.brand, light && styles.brandLight]}>
      pivot<Text style={[styles.brandDot, light && styles.brandLight]}>.</Text>
    </Text>
  );
}

function PivotLayersIcon({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
        stroke={palette.olive}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function PivotLogo({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  const markSize = compact ? 28 : 36;
  const iconSize = compact ? 14 : 20;
  const radius = compact ? 8 : 10;

  return (
    <View style={[styles.pivotLogoRow, compact && styles.pivotLogoRowCompact]}>
      <View style={[styles.pivotLogoMark, { width: markSize, height: markSize, borderRadius: radius }]}>
        <PivotLayersIcon size={iconSize} />
      </View>
      <Text
        style={[
          styles.pivotLogoText,
          compact && styles.pivotLogoTextCompact,
          light && styles.pivotLogoTextLight,
        ]}>
        Pivot
      </Text>
    </View>
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
  autoFocus = false,
}: Pick<TextInputProps, 'value' | 'onChangeText' | 'placeholder' | 'autoFocus'>) {
  return (
    <View style={styles.searchField}>
      <Text style={styles.searchIcon}>⌕</Text>
      <TextInput
        accessibilityLabel="Search"
        autoFocus={autoFocus}
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
  const { savedIds, toggleSaved, sendBid } = useShop();
  const [bidOpen, setBidOpen] = useState(false);
  const [bid, setBid] = useState('');
  const [bidSent, setBidSent] = useState(false);
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
          {product.originalPrice !== undefined && (
            <Text style={styles.originalPrice}>${product.originalPrice}</Text>
          )}
        </View>
        {product.sustainability !== undefined && (
          <View style={styles.scoreRow}>
            <LeafIcon color={palette.olive} size={12} />
            <Text style={styles.scoreText}>{product.sustainability} sustainability score</Text>
          </View>
        )}
      </Pressable>
      <View style={styles.bidActions}>
        {bidSent ? (
          <Text style={styles.bidSent}>Bid sent to {product.seller}</Text>
        ) : bidOpen ? (
          <View style={styles.bidForm}>
            <TextInput
              accessibilityLabel={`Bid amount for ${product.name}`}
              keyboardType="decimal-pad"
              placeholder="Your bid ($)"
              placeholderTextColor={palette.olive}
              value={bid}
              onChangeText={setBid}
              style={styles.bidInput}
            />
            <Pressable
              accessibilityRole="button"
              disabled={!bid.trim() || Number(bid) <= 0}
              onPress={() => {
                sendBid(product, Number(bid));
                setBidSent(true);
                setBidOpen(false);
              }}
              style={({ pressed }) => [
                styles.bidSend,
                (!bid.trim() || Number(bid) <= 0) && styles.bidDisabled,
                pressed && styles.pressed,
              ]}>
              <Text style={styles.bidSendText}>Send</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            accessibilityRole="button"
            onPress={() => setBidOpen(true)}
            style={({ pressed }) => [styles.makeBid, pressed && styles.pressed]}>
            <Text style={styles.makeBidText}>Make bid</Text>
          </Pressable>
        )}
      </View>
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
  pivotLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pivotLogoRowCompact: {
    gap: 8,
  },
  pivotLogoMark: {
    backgroundColor: palette.logoPeach,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pivotLogoText: {
    color: palette.olive,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  pivotLogoTextCompact: {
    fontSize: 18,
    letterSpacing: -0.4,
  },
  pivotLogoTextLight: {
    color: palette.paper,
  },
  eyebrow: {
    color: palette.terracotta,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  lightText: {
    color: palette.beige,
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
    backgroundColor: palette.cream,
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
  searchPrompt: {
    flex: 1,
    color: palette.olive,
    fontSize: 14,
  },
  searchTune: {
    color: palette.terracotta,
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
    backgroundColor: palette.cream,
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
  scoreText: {
    color: palette.olive,
    fontSize: 10,
    fontWeight: '600',
  },
  bidActions: {
    marginTop: 9,
  },
  makeBid: {
    minHeight: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: palette.cream,
  },
  makeBidText: {
    color: palette.terracotta,
    fontSize: 11,
    fontWeight: '700',
  },
  bidForm: {
    flexDirection: 'row',
    gap: 5,
  },
  bidInput: {
    flex: 1,
    minWidth: 0,
    height: 34,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: palette.beige,
    borderRadius: 9,
    color: palette.olive,
    fontSize: 11,
  },
  bidSend: {
    paddingHorizontal: 10,
    justifyContent: 'center',
    borderRadius: 9,
    backgroundColor: palette.olive,
  },
  bidSendText: {
    color: palette.paper,
    fontSize: 10,
    fontWeight: '700',
  },
  bidDisabled: {
    opacity: 0.45,
  },
  bidSent: {
    color: palette.olive,
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
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

export function SearchBarButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Search items and open filters"
      onPress={onPress}
      style={({ pressed }) => [styles.searchField, pressed && styles.pressed]}>
      <Text style={styles.searchIcon}>⌕</Text>
      <Text style={styles.searchPrompt}>Search items, brands, styles</Text>
      <Text style={styles.searchTune}>☷</Text>
    </Pressable>
  );
}
