import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActionButton, LeafIcon, palette } from '@/components/pivot-ui';
import { products } from '@/constants/products';
import { useShop } from '@/state/shop-store';

export default function CartScreen() {
  const { cartItems, addToBag, removeFromBag } = useShop();
  const items = cartItems.flatMap((cartItem) => {
    const product = products.find((item) => item.id === cartItem.productId);
    return product ? [{ product, quantity: cartItem.quantity }] : [];
  });
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const [checkoutMessage, setCheckoutMessage] = useState(false);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>GOOD THINGS, GATHERED</Text>
        <Text style={styles.title}>Your cart.</Text>
        <Text style={styles.subtitle}>
          {items.length === 0
            ? 'A little space for something lovely.'
            : `${itemCount} ${itemCount === 1 ? 'good find' : 'good finds'} in your bag.`}
        </Text>

        {items.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>▱</Text>
            <Text style={styles.emptyTitle}>Your next favorite is out there.</Text>
            <Text style={styles.emptyBody}>Explore the pre-loved pieces waiting for a new home.</Text>
          </View>
        ) : (
          <>
            <View style={styles.items}>
              {items.map(({ product, quantity }) => (
                <View key={product.id} style={styles.itemRow}>
                  <Image source={{ uri: product.image }} style={styles.image} />
                  <View style={styles.itemDetails}>
                    <Text style={styles.brand}>{product.brand}</Text>
                    <Text style={styles.name}>{product.name}</Text>
                    <Text style={styles.condition}>
                      {product.condition} · {product.sizes[0]}
                    </Text>
                    <View style={styles.quantityRow}>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Add another ${product.name}`}
                        onPress={() => addToBag(product.id)}
                        style={styles.quantityButton}>
                        <Text style={styles.quantityButtonText}>+</Text>
                      </Pressable>
                      <Text style={styles.quantity}>Qty {quantity}</Text>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Remove ${product.name} from cart`}
                        onPress={() => removeFromBag(product.id)}
                        style={styles.removeButton}>
                        <Text style={styles.removeText}>Remove</Text>
                      </Pressable>
                    </View>
                  </View>
                  <Text style={styles.price}>${product.price * quantity}</Text>
                </View>
              ))}
            </View>

            <View style={styles.summary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>${subtotal}</Text>
              </View>
              <Text style={styles.shipping}>Shipping calculated at checkout.</Text>
              <ActionButton label="Continue to checkout" onPress={() => setCheckoutMessage(true)} />
              {checkoutMessage && (
                <Text style={styles.checkoutMessage}>
                  Checkout is a preview interaction. Your cart is saved while you browse.
                </Text>
              )}
            </View>
          </>
        )}

        <View style={styles.impact}>
          <LeafIcon color={palette.olive} size={17} />
          <Text style={styles.impactText}>Every pre-loved piece is one less new thing made.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.paper },
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 32, gap: 13 },
  eyebrow: { color: palette.terracotta, fontSize: 9, fontWeight: '700', letterSpacing: 1.2 },
  title: { marginTop: -4, color: palette.olive, fontSize: 34, lineHeight: 38, fontWeight: '700' },
  subtitle: { marginTop: -9, marginBottom: 8, color: palette.olive, fontSize: 13 },
  emptyCard: { alignItems: 'center', paddingHorizontal: 25, paddingVertical: 36, borderRadius: 19, backgroundColor: palette.cream },
  emptyIcon: { color: palette.terracotta, fontSize: 38 },
  emptyTitle: { marginTop: 12, color: palette.olive, fontSize: 17, fontWeight: '700', textAlign: 'center' },
  emptyBody: { marginTop: 6, color: palette.olive, fontSize: 12, lineHeight: 18, textAlign: 'center' },
  items: { gap: 13 },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 11, padding: 10, borderRadius: 15, borderWidth: 1, borderColor: palette.beige },
  image: { width: 78, height: 94, borderRadius: 11, backgroundColor: palette.cream },
  itemDetails: { flex: 1, gap: 4 },
  brand: { color: palette.terracotta, fontSize: 9, fontWeight: '700', letterSpacing: 0.6 },
  name: { color: palette.olive, fontSize: 12, fontWeight: '700' },
  condition: { color: palette.olive, fontSize: 10 },
  quantityRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 3 },
  quantityButton: { width: 25, height: 25, alignItems: 'center', justifyContent: 'center', borderRadius: 13, backgroundColor: palette.cream },
  quantityButtonText: { color: palette.terracotta, fontSize: 16, fontWeight: '700' },
  quantity: { color: palette.olive, fontSize: 10 },
  removeButton: { marginLeft: 'auto', padding: 4 },
  removeText: { color: palette.terracotta, fontSize: 10, fontWeight: '600' },
  price: { alignSelf: 'flex-start', color: palette.olive, fontSize: 13, fontWeight: '700' },
  summary: { gap: 10, padding: 15, borderRadius: 16, backgroundColor: palette.cream },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { color: palette.olive, fontSize: 14, fontWeight: '700' },
  summaryValue: { color: palette.olive, fontSize: 14, fontWeight: '700' },
  shipping: { color: palette.olive, fontSize: 10 },
  checkoutMessage: { color: palette.olive, fontSize: 11, lineHeight: 16, textAlign: 'center' },
  impact: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 7, padding: 13, borderRadius: 13, backgroundColor: palette.cream },
  impactText: { color: palette.olive, fontSize: 11 },
});
