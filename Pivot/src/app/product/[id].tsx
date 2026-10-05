import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActionButton, IconButton, palette } from '@/components/pivot-ui';
import { getProduct } from '@/constants/products';
import { useShop } from '@/state/shop-store';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = getProduct(id);
  const { savedIds, toggleSaved, addToBag } = useShop();
  const [offerOpen, setOfferOpen] = useState(false);
  const [offer, setOffer] = useState('');
  const [message, setMessage] = useState('');
  if (!product) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.unavailable}>
          <Text style={styles.unavailableTitle}>This piece has moved on.</Text>
          <Text style={styles.unavailableBody}>Let’s find you another good one.</Text>
          <ActionButton label="Back to shopping" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }
  const isSaved = savedIds.includes(product.id);

  const addProductToBag = () => {
    addToBag(product.id);
    setMessage('A lovely choice. This piece is in your bag.');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.imageWrap}>
          <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
          <View style={styles.topActions}>
            <IconButton label="Go back" onPress={() => router.back()}>‹</IconButton>
            <IconButton
              label={isSaved ? 'Remove from saved' : 'Save item'}
              onPress={() => toggleSaved(product.id)}>
              {isSaved ? '♥' : '♡'}
            </IconButton>
          </View>
          <View style={styles.condition}>
            <Text style={styles.conditionText}>✳  {product.condition.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.details}>
          <View style={styles.brandRow}>
            <Text style={styles.brand}>{product.brand.toUpperCase()}</Text>
            <Text style={styles.listingNote}>ONE OF ONE</Text>
          </View>
          <Text style={styles.name}>{product.name}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>${product.price}</Text>
            <Text style={styles.original}>${product.originalPrice} new</Text>
            <View style={styles.saving}>
              <Text style={styles.savingText}>
                {Math.round((1 - product.price / product.originalPrice) * 100)}% less
              </Text>
            </View>
          </View>

          <View style={styles.rule} />
          <View style={styles.sellerRow}>
            <View style={styles.sellerAvatar}><Text style={styles.sellerInitial}>{product.seller[0]}</Text></View>
            <View style={styles.sellerCopy}>
              <Text style={styles.sellerTitle}>A lovely find from {product.seller}</Text>
              <Text style={styles.sellerSub}>★ 4.9 · Thoughtful seller · Ships in 1–2 days</Text>
            </View>
            <Text style={styles.sellerArrow}>›</Text>
          </View>

          <View style={styles.impactCard}>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreValue}>{product.sustainability}</Text>
              <Text style={styles.scoreSmall}>SCORE</Text>
            </View>
            <View style={styles.impactCopy}>
              <Text style={styles.impactTitle}>A good choice, made better.</Text>
              <Text style={styles.impactText}>
                This pre-loved piece has a {product.sustainability}/100 sustainability score.
                Giving it another life helps reduce fashion waste.
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>The details</Text>
          <View style={styles.detailList}>
            <DetailRow label="Condition" value={product.condition} />
            <DetailRow label="Size" value="M · Fits true to size" />
            <DetailRow label="Materials" value="Natural, long-wearing fibers" />
            <DetailRow label="Seller" value={product.seller} />
          </View>

          {offerOpen && (
            <View style={styles.offerPanel}>
              <Text style={styles.offerTitle}>Make a thoughtful offer</Text>
              <Text style={styles.offerHelp}>The listed price is ${product.price}.</Text>
              <View style={styles.offerInputWrap}>
                <Text style={styles.currency}>$</Text>
                <TextInput
                  accessibilityLabel="Offer amount"
                  keyboardType="decimal-pad"
                  placeholder="Your offer"
                  placeholderTextColor={palette.muted}
                  value={offer}
                  onChangeText={setOffer}
                  style={styles.offerInput}
                />
              </View>
              <ActionButton
                label="Send offer"
                disabled={!offer.trim() || Number(offer) <= 0}
                onPress={() => {
                  setOfferOpen(false);
                  setMessage(`Your $${offer} offer is ready for ${product.seller}.`);
                }}
              />
            </View>
          )}
          {message !== '' && <Text style={styles.message}>{message}</Text>}
          <View style={styles.buyActions}>
            <ActionButton label="Add to bag" onPress={addProductToBag} style={styles.buyButton} />
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setMessage('');
                setOfferOpen((value) => !value);
              }}
              style={styles.offerButton}>
              <Text style={styles.offerButtonText}>{offerOpen ? 'Cancel offer' : 'Make an offer'}</Text>
            </Pressable>
          </View>
          <Text style={styles.shippingNote}>A little treasure, on its way to a new home.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.paper },
  content: { paddingBottom: 24 },
  unavailable: { flex: 1, justifyContent: 'center', paddingHorizontal: 24, gap: 12 },
  unavailableTitle: { color: palette.ink, fontSize: 23, fontWeight: '700', textAlign: 'center' },
  unavailableBody: { color: palette.muted, fontSize: 14, textAlign: 'center' },
  imageWrap: { position: 'relative', width: '100%', aspectRatio: 0.91, backgroundColor: '#E9E6DE' },
  image: { width: '100%', height: '100%' },
  topActions: { position: 'absolute', top: 8, left: 17, right: 17, flexDirection: 'row', justifyContent: 'space-between' },
  condition: { position: 'absolute', left: 18, bottom: 15, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: 'rgba(255,254,250,0.94)' },
  conditionText: { color: palette.oliveDark, fontSize: 9, fontWeight: '700', letterSpacing: 0.7 },
  details: { paddingHorizontal: 20, paddingTop: 20 },
  brandRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { color: palette.olive, fontSize: 10, fontWeight: '700', letterSpacing: 1.1 },
  listingNote: { color: palette.terracotta, fontSize: 8, fontWeight: '700', letterSpacing: 1.2 },
  name: { marginTop: 5, color: palette.ink, fontSize: 26, lineHeight: 31, fontWeight: '700', letterSpacing: -0.7 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 7 },
  price: { color: palette.ink, fontSize: 20, fontWeight: '700' },
  original: { color: palette.muted, fontSize: 12, textDecorationLine: 'line-through' },
  saving: { paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8, backgroundColor: '#E9EDE4' },
  savingText: { color: palette.olive, fontSize: 10, fontWeight: '700' },
  rule: { height: 1, marginVertical: 17, backgroundColor: palette.line },
  sellerRow: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  sellerAvatar: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 22, backgroundColor: '#E5D7C3' },
  sellerInitial: { color: palette.oliveDark, fontSize: 16, fontWeight: '700' },
  sellerCopy: { flex: 1 },
  sellerTitle: { color: palette.ink, fontSize: 11, fontWeight: '700' },
  sellerSub: { marginTop: 4, color: palette.muted, fontSize: 9 },
  sellerArrow: { color: palette.muted, fontSize: 23 },
  impactCard: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 19, padding: 14, borderRadius: 16, backgroundColor: '#EDF0E8' },
  scoreCircle: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center', borderRadius: 30, borderWidth: 1, borderColor: '#AEB9A4' },
  scoreValue: { color: palette.oliveDark, fontSize: 17, fontWeight: '700', lineHeight: 19 },
  scoreSmall: { color: palette.olive, fontSize: 6, fontWeight: '700', letterSpacing: 0.8 },
  impactCopy: { flex: 1 },
  impactTitle: { color: palette.oliveDark, fontSize: 11, fontWeight: '700' },
  impactText: { marginTop: 4, color: '#697365', fontSize: 10, lineHeight: 15 },
  sectionTitle: { marginTop: 20, marginBottom: 9, color: palette.ink, fontSize: 16, fontWeight: '700' },
  detailList: { paddingHorizontal: 13, borderRadius: 14, borderWidth: 1, borderColor: palette.line },
  detailRow: { minHeight: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: palette.line },
  detailLabel: { color: palette.muted, fontSize: 10 },
  detailValue: { color: palette.ink, fontSize: 10, fontWeight: '600' },
  offerPanel: { gap: 9, marginTop: 18, padding: 14, borderRadius: 15, backgroundColor: palette.cream },
  offerTitle: { color: palette.ink, fontSize: 14, fontWeight: '700' },
  offerHelp: { color: palette.muted, fontSize: 11 },
  offerInputWrap: { height: 46, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, borderRadius: 11, backgroundColor: palette.paper },
  currency: { color: palette.olive, fontSize: 16, fontWeight: '700' },
  offerInput: { flex: 1, color: palette.ink, fontSize: 14 },
  message: { marginTop: 13, color: palette.olive, fontSize: 12, fontWeight: '600', textAlign: 'center' },
  buyActions: { flexDirection: 'row', gap: 10, marginTop: 18 },
  buyButton: { flex: 1 },
  offerButton: { minHeight: 54, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, borderRadius: 14, borderWidth: 1, borderColor: palette.line, backgroundColor: palette.paper },
  offerButtonText: { color: palette.ink, fontSize: 12, fontWeight: '700' },
  shippingNote: { marginTop: 12, color: palette.muted, fontSize: 10, textAlign: 'center' },
});
