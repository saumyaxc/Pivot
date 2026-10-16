import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LeafIcon, palette } from '@/components/pivot-ui';
import { products } from '@/constants/products';
import { useShop } from '@/state/shop-store';

const profileTabs = ['activity', 'saved', 'listings'] as const;
type ProfileTab = (typeof profileTabs)[number];

const activities = [
  { title: 'Welcome to Pivot', detail: 'Your profile is ready', icon: '✦', amount: '' },
  { title: 'Your saved finds', detail: 'Pieces you love, all in one place', icon: '♡', amount: '' },
];

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<ProfileTab>('activity');
  const [showSettings, setShowSettings] = useState(false);
  const { savedIds, followedBrands, followedSellers, listings, setListingStatus } = useShop();
  const savedProducts = products.filter((product) => savedIds.includes(product.id));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.identityRow}>
            <View style={styles.avatar}><Text style={styles.avatarText}>A</Text></View>
            <View style={styles.identityCopy}>
              <Text style={styles.memberName}>Alex Chen</Text>
              <Text style={styles.memberHandle}>@alex.conscious</Text>
              <Text style={styles.memberTagline}>Conscious shopper · Pivot member</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Edit profile"
              onPress={() => setShowSettings((visible) => !visible)}
              style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit</Text>
            </Pressable>
          </View>
          <View style={styles.stats}>
            {[
              { value: '0', label: 'Purchases' },
              { value: String(listings.length), label: 'Listings' },
              { value: '0', label: 'Points' },
            ].map((stat, index) => (
              <View key={stat.label} style={[styles.stat, index < 2 && styles.statBorder]}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.rewards}>
          <View style={styles.rewardsCopy}>
            <Text style={styles.rewardsEyebrow}>REWARDS BALANCE</Text>
            <Text style={styles.rewardsValue}>0 pts</Text>
            <Text style={styles.rewardsDetail}>Earn points as you shop and sell</Text>
          </View>
          <Text style={styles.rewardsIcon}>✦</Text>
        </View>

        <View style={styles.impactSection}>
          <View style={styles.impactHeading}>
            <LeafIcon color={palette.olive} size={17} />
            <Text style={styles.impactTitle}>Your total impact</Text>
          </View>
          <View style={styles.impactStats}>
            {[
              { icon: '💧', value: '0L', label: 'Water saved' },
              { icon: '🌿', value: '0kg', label: 'CO₂ avoided' },
              { icon: '♻', value: String(listings.length), label: 'Items listed' },
            ].map((stat) => (
              <View key={stat.label} style={styles.impactStat}>
                <Text style={styles.impactIcon}>{stat.icon}</Text>
                <Text style={styles.impactValue}>{stat.value}</Text>
                <Text style={styles.impactLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.navigate('/(tabs)/sell')}
          style={({ pressed }) => [styles.sellerShortcut, pressed && styles.pressed]}>
          <View style={styles.shortcutIcon}><Text style={styles.shortcutIconText}>↗</Text></View>
          <View style={styles.shortcutCopy}>
            <Text style={styles.shortcutTitle}>Seller dashboard</Text>
            <Text style={styles.shortcutDetail}>Manage your listings and sales</Text>
          </View>
          <Text style={styles.shortcutArrow}>›</Text>
        </Pressable>

        <View style={styles.tabs}>
          {profileTabs.map((tab) => (
            <Pressable
              accessibilityRole="tab"
              accessibilityState={{ selected: activeTab === tab }}
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab && styles.activeTab]}>
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab === 'saved' ? `Saved (${savedIds.length})` : tab[0].toUpperCase() + tab.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        {activeTab === 'activity' && (
          <View style={styles.tabContent}>
            {activities.map((activity, index) => (
              <View key={activity.title} style={[styles.activityRow, index === activities.length - 1 && styles.lastRow]}>
                <View style={styles.activityIcon}><Text style={styles.activityIconText}>{activity.icon}</Text></View>
                <View style={styles.activityCopy}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityDetail}>{activity.detail}</Text>
                </View>
                {activity.amount ? <Text style={styles.activityAmount}>{activity.amount}</Text> : null}
              </View>
            ))}
            <View style={styles.followingSummary}>
              <Text style={styles.followingTitle}>Your people & brands</Text>
              <Text style={styles.followingDetail}>
                {followedBrands.length} brands · {followedSellers.length} sellers
              </Text>
              <Text style={styles.followingNames}>
                {[...followedBrands, ...followedSellers].join(' · ')}
              </Text>
            </View>
          </View>
        )}

        {activeTab === 'saved' && (
          <View style={styles.tabContent}>
            {savedProducts.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>♡</Text>
                <Text style={styles.emptyTitle}>Nothing saved yet</Text>
                <Text style={styles.emptyDetail}>Save a piece you love and find it here.</Text>
              </View>
            ) : (
              <View style={styles.savedGrid}>
                {savedProducts.map((product) => (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`View ${product.name}`}
                    key={product.id}
                    onPress={() => router.push({ pathname: '/product/[id]', params: { id: product.id } })}
                    style={styles.savedCard}>
                    <Image source={{ uri: product.image }} style={styles.savedImage} />
                    <Text numberOfLines={1} style={styles.savedBrand}>{product.brand}</Text>
                    <Text numberOfLines={2} style={styles.savedName}>{product.name}</Text>
                    <Text style={styles.savedPrice}>${product.price}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        )}

        {activeTab === 'listings' && (
          <View style={styles.tabContent}>
            {listings.length === 0 ? (
              <Pressable
                accessibilityRole="button"
                onPress={() => router.navigate('/(tabs)/sell')}
                style={styles.emptyState}>
                <Text style={styles.emptyIcon}>＋</Text>
                <Text style={styles.emptyTitle}>Your next listing starts here</Text>
                <Text style={styles.emptyDetail}>Add a piece to your closet and keep track of it here.</Text>
                <Text style={styles.emptyAction}>Create a listing →</Text>
              </Pressable>
            ) : (
              <View style={styles.myListings}>
                {listings.map((listing) => (
                  <View key={listing.id} style={styles.listingRow}>
                    <Image source={{ uri: listing.image }} style={styles.listingImage} />
                    <View style={styles.listingInfo}>
                      <Text numberOfLines={1} style={styles.listingBrand}>{listing.brand}</Text>
                      <Text numberOfLines={2} style={styles.listingName}>{listing.name}</Text>
                      <Text style={styles.listingMeta}>{listing.category} · ${listing.price}</Text>
                      <View style={styles.listingStatusRow}>
                        <Text style={[styles.listingStatus, listing.listingStatus === 'sold' && styles.soldStatus]}>
                          {listing.listingStatus === 'sold' ? 'SOLD' : 'ACTIVE'}
                        </Text>
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel={listing.listingStatus === 'sold' ? `Reopen ${listing.name}` : `Mark ${listing.name} as sold`}
                          onPress={() => setListingStatus(
                            listing.id,
                            listing.listingStatus === 'sold' ? 'open' : 'sold',
                          )}
                          style={styles.manageListing}>
                          <Text style={styles.manageListingText}>
                            {listing.listingStatus === 'sold' ? 'Reopen' : 'Mark sold'}
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {showSettings && (
          <View style={styles.inlineMessage}>
            <Text style={styles.inlineMessageTitle}>Profile settings</Text>
            <Text style={styles.inlineMessageBody}>Your profile details stay on this device in this preview.</Text>
          </View>
        )}

        <Pressable accessibilityRole="button" onPress={() => router.replace('/')} style={styles.logout}>
          <Text style={styles.logoutText}>Back to the welcome screen  ↗</Text>
        </Pressable>
        <Text style={styles.version}>Made for more wears, fewer worries. · 1.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.paper },
  content: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 36, gap: 16 },
  profileHeader: { marginHorizontal: -20, marginTop: -12, paddingHorizontal: 20, paddingTop: 25, paddingBottom: 18, backgroundColor: palette.oliveDark },
  identityRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  avatar: { width: 58, height: 58, alignItems: 'center', justifyContent: 'center', borderRadius: 29, borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)', backgroundColor: palette.logoPeach },
  avatarText: { color: palette.oliveDark, fontSize: 23, fontWeight: '700' },
  identityCopy: { flex: 1 },
  memberName: { color: palette.paper, fontSize: 19, fontWeight: '700' },
  memberHandle: { marginTop: 2, color: 'rgba(255,252,249,0.76)', fontSize: 12 },
  memberTagline: { marginTop: 4, color: palette.beige, fontSize: 11, fontWeight: '600' },
  editButton: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.15)' },
  editButtonText: { color: palette.paper, fontSize: 12, fontWeight: '600' },
  stats: { flexDirection: 'row', borderRadius: 8, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.1)' },
  stat: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  statBorder: { borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.18)' },
  statValue: { color: palette.beige, fontSize: 19, fontWeight: '700' },
  statLabel: { marginTop: 2, color: 'rgba(255,252,249,0.76)', fontSize: 11 },
  rewards: { minHeight: 116, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingVertical: 15, borderRadius: 8, backgroundColor: palette.terracotta },
  rewardsCopy: { flex: 1 },
  rewardsEyebrow: { color: 'rgba(255,255,255,0.78)', fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  rewardsValue: { marginTop: 5, color: '#FFFFFF', fontSize: 27, fontWeight: '700' },
  rewardsDetail: { marginTop: 3, color: 'rgba(255,255,255,0.82)', fontSize: 11 },
  rewardsIcon: { color: palette.beige, fontSize: 34, paddingHorizontal: 6 },
  impactSection: { padding: 14, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(79,107,86,0.2)', backgroundColor: 'rgba(79,107,86,0.06)' },
  impactHeading: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 12 },
  impactTitle: { color: palette.oliveDark, fontSize: 13, fontWeight: '700' },
  impactStats: { flexDirection: 'row', gap: 8 },
  impactStat: { flex: 1, minHeight: 91, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4, paddingVertical: 8, borderRadius: 6, backgroundColor: palette.paper },
  impactIcon: { fontSize: 17 },
  impactValue: { marginTop: 3, color: palette.charcoal, fontSize: 14, fontWeight: '700' },
  impactLabel: { marginTop: 2, color: palette.stone, fontSize: 9, textAlign: 'center' },
  sellerShortcut: { minHeight: 66, flexDirection: 'row', alignItems: 'center', gap: 11, paddingHorizontal: 14, borderRadius: 8, backgroundColor: palette.charcoal },
  shortcutIcon: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.12)' },
  shortcutIconText: { color: palette.beige, fontSize: 20, fontWeight: '700' },
  shortcutCopy: { flex: 1 },
  shortcutTitle: { color: palette.paper, fontSize: 13, fontWeight: '700' },
  shortcutDetail: { marginTop: 3, color: 'rgba(255,252,249,0.65)', fontSize: 10 },
  shortcutArrow: { color: 'rgba(255,252,249,0.6)', fontSize: 25 },
  pressed: { opacity: 0.82 },
  tabs: { flexDirection: 'row', marginTop: 1, borderBottomWidth: 1, borderBottomColor: palette.line },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 46, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: palette.olive },
  tabText: { color: palette.stone, fontSize: 12 },
  activeTabText: { color: palette.olive, fontWeight: '700' },
  tabContent: { minHeight: 150 },
  activityRow: { minHeight: 66, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: palette.sand },
  lastRow: { borderBottomWidth: 0 },
  activityIcon: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 8, backgroundColor: 'rgba(207,155,122,0.2)' },
  activityIconText: { color: palette.terracotta, fontSize: 20 },
  activityCopy: { flex: 1 },
  activityTitle: { color: palette.charcoal, fontSize: 12, fontWeight: '600' },
  activityDetail: { marginTop: 3, color: palette.stone, fontSize: 10 },
  activityAmount: { color: palette.olive, fontSize: 13, fontWeight: '700' },
  followingSummary: { marginTop: 12, padding: 13, borderRadius: 8, backgroundColor: palette.cream },
  followingTitle: { color: palette.oliveDark, fontSize: 12, fontWeight: '700' },
  followingDetail: { marginTop: 4, color: palette.terracotta, fontSize: 10, fontWeight: '600' },
  followingNames: { marginTop: 4, color: palette.olive, fontSize: 10, lineHeight: 15 },
  emptyState: { alignItems: 'center', paddingHorizontal: 18, paddingVertical: 28, borderRadius: 8, backgroundColor: palette.cream },
  emptyIcon: { color: palette.terracotta, fontSize: 30 },
  emptyTitle: { marginTop: 7, color: palette.charcoal, fontSize: 13, fontWeight: '700', textAlign: 'center' },
  emptyDetail: { marginTop: 5, color: palette.olive, fontSize: 11, textAlign: 'center' },
  emptyAction: { marginTop: 10, color: palette.terracotta, fontSize: 11, fontWeight: '700' },
  savedGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  savedCard: { width: '48%', paddingBottom: 10, overflow: 'hidden', borderRadius: 8, backgroundColor: '#FFFFFF' },
  savedImage: { width: '100%', aspectRatio: 3 / 4, backgroundColor: palette.cream },
  savedBrand: { marginHorizontal: 9, marginTop: 8, color: palette.terracotta, fontSize: 9, fontWeight: '700', textTransform: 'uppercase' },
  savedName: { marginHorizontal: 9, marginTop: 3, color: palette.charcoal, fontSize: 11, fontWeight: '600' },
  savedPrice: { marginHorizontal: 9, marginTop: 5, color: palette.terracotta, fontSize: 13, fontWeight: '700' },
  myListings: { gap: 10 },
  listingRow: { flexDirection: 'row', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: palette.sand },
  listingImage: { width: 70, height: 82, borderRadius: 6, backgroundColor: palette.cream },
  listingInfo: { flex: 1, justifyContent: 'center' },
  listingBrand: { color: palette.terracotta, fontSize: 9, fontWeight: '700', textTransform: 'uppercase' },
  listingName: { marginTop: 3, color: palette.charcoal, fontSize: 12, fontWeight: '600' },
  listingMeta: { marginTop: 4, color: palette.olive, fontSize: 10 },
  listingStatusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  listingStatus: { color: palette.olive, fontSize: 9, fontWeight: '800' },
  soldStatus: { color: palette.terracotta },
  manageListing: { paddingHorizontal: 9, paddingVertical: 6, borderRadius: 6, backgroundColor: palette.cream },
  manageListingText: { color: palette.terracotta, fontSize: 9, fontWeight: '700' },
  inlineMessage: { padding: 14, borderRadius: 8, backgroundColor: palette.cream },
  inlineMessageTitle: { color: palette.charcoal, fontSize: 12, fontWeight: '700' },
  inlineMessageBody: { marginTop: 4, color: palette.stone, fontSize: 10, lineHeight: 15 },
  logout: { alignItems: 'center', padding: 10 },
  logoutText: { color: palette.olive, fontSize: 10, fontWeight: '700' },
  version: { color: palette.olive, fontSize: 9, textAlign: 'center' },
});