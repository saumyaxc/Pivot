import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandMark, palette } from '@/components/pivot-ui';
import { useShop } from '@/state/shop-store';

const profileLinks = [
  ['My style & sizes', 'Your fit, your way', '›'],
  ['Orders & returns', 'Your pieces in motion', '›'],
  ['Impact so far', 'Good things add up', '›'],
  ['Help & how it works', 'We’re here for you', '›'],
];

export default function ProfileScreen() {
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const { bagCount, savedIds } = useShop();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.kicker}>A CLOSET THAT FEELS LIKE YOU</Text>
            <BrandMark />
          </View>
          <Pressable accessibilityRole="button" onPress={() => setActiveLink('Settings')} style={styles.settings}>
            <Text style={styles.settingsText}>⚙</Text>
          </Pressable>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatar}><Text style={styles.avatarText}>K</Text></View>
          <View style={styles.profileInfo}>
            <Text style={styles.memberLabel}>PIVOT MEMBER</Text>
            <Text style={styles.memberName}>Your next chapter.</Text>
            <Text style={styles.memberSub}>A lighter closet starts here.</Text>
          </View>
          <Text style={styles.profileFlower}>✳</Text>
        </View>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{savedIds.length.toString().padStart(2, '0')}</Text>
            <Text style={styles.statLabel}>saved finds</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{bagCount.toString().padStart(2, '0')}</Text>
            <Text style={styles.statLabel}>in your bag</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>0.0</Text>
            <Text style={styles.statLabel}>lbs CO₂ saved</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Your corner of Pivot</Text>
        <View style={styles.linkGroup}>
          {profileLinks.map(([title, description, icon]) => (
            <Pressable
              accessibilityRole="button"
              key={title}
              onPress={() => setActiveLink(title)}
              style={styles.linkRow}>
              <View style={styles.linkIcon}><Text style={styles.linkIconText}>{title === 'Impact so far' ? '✳' : '◦'}</Text></View>
              <View style={styles.linkCopy}>
                <Text style={styles.linkTitle}>{title}</Text>
                <Text style={styles.linkDescription}>{description}</Text>
              </View>
              <Text style={styles.chevron}>{icon}</Text>
            </Pressable>
          ))}
        </View>

        {activeLink && (
          <View style={styles.inlineMessage}>
            <Text style={styles.inlineMessageTitle}>{activeLink}</Text>
            <Text style={styles.inlineMessageBody}>
              This preview keeps everything on your device. Your {activeLink.toLowerCase()} details
              will be ready when you are.
            </Text>
            <Pressable accessibilityRole="button" onPress={() => setActiveLink(null)}>
              <Text style={styles.dismiss}>Got it</Text>
            </Pressable>
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
  content: { paddingHorizontal: 20, paddingBottom: 32, gap: 17 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  kicker: { marginBottom: 2, color: palette.muted, fontSize: 8, fontWeight: '700', letterSpacing: 1.1 },
  settings: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 22, backgroundColor: palette.cream },
  settingsText: { color: palette.oliveDark, fontSize: 18 },
  profileCard: { position: 'relative', minHeight: 136, overflow: 'hidden', flexDirection: 'row', alignItems: 'center', gap: 15, padding: 18, borderRadius: 18, backgroundColor: palette.oliveDark },
  avatar: { width: 57, height: 57, alignItems: 'center', justifyContent: 'center', borderRadius: 30, backgroundColor: '#E2D6BC' },
  avatarText: { color: palette.oliveDark, fontSize: 21, fontWeight: '700' },
  profileInfo: { zIndex: 1 },
  memberLabel: { color: '#D5DEC9', fontSize: 8, fontWeight: '700', letterSpacing: 1.2 },
  memberName: { marginTop: 5, color: palette.paper, fontSize: 19, fontWeight: '700', letterSpacing: -0.4 },
  memberSub: { marginTop: 4, color: '#D5D8CE', fontSize: 11 },
  profileFlower: { position: 'absolute', right: 17, top: 4, color: 'rgba(226,214,188,0.25)', fontSize: 84 },
  stats: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 17, paddingHorizontal: 10, borderRadius: 16, backgroundColor: palette.cream },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { color: palette.oliveDark, fontSize: 20, fontWeight: '700' },
  statLabel: { marginTop: 3, color: palette.muted, fontSize: 9 },
  statDivider: { width: 1, height: 28, backgroundColor: '#DCD9CE' },
  sectionTitle: { color: palette.ink, fontSize: 18, fontWeight: '700' },
  linkGroup: { overflow: 'hidden', borderRadius: 16, borderWidth: 1, borderColor: palette.line },
  linkRow: { minHeight: 68, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 13, borderBottomWidth: 1, borderBottomColor: palette.line },
  linkIcon: { width: 37, height: 37, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: '#EDF0E8' },
  linkIconText: { color: palette.olive, fontSize: 22 },
  linkCopy: { flex: 1 },
  linkTitle: { color: palette.ink, fontSize: 12, fontWeight: '700' },
  linkDescription: { marginTop: 3, color: palette.muted, fontSize: 10 },
  chevron: { color: palette.muted, fontSize: 23 },
  inlineMessage: { padding: 15, borderRadius: 15, backgroundColor: palette.cream },
  inlineMessageTitle: { color: palette.ink, fontSize: 13, fontWeight: '700' },
  inlineMessageBody: { marginTop: 5, color: palette.muted, fontSize: 11, lineHeight: 16 },
  dismiss: { alignSelf: 'flex-end', marginTop: 9, color: palette.olive, fontSize: 12, fontWeight: '700' },
  logout: { alignItems: 'center', padding: 13 },
  logoutText: { color: palette.olive, fontSize: 11, fontWeight: '700' },
  version: { color: '#A0A098', fontSize: 9, textAlign: 'center' },
});
