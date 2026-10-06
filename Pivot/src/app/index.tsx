import { router } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActionButton, BrandMark, Eyebrow, IconButton, LeafIcon, Pill, palette } from '@/components/pivot-ui';
import { useShop } from '@/state/shop-store';

const styleOptions = ['Minimal', 'Vintage', 'Soft & natural', 'Streetwear', 'Classic', 'Playful'];
const sizeOptions = ['XS', 'S', 'M', 'L', 'XL'];
const budgetOptions = ['$25–50', '$50–100', '$100–200', 'No limit'];

export default function WelcomeScreen() {
  const [step, setStep] = useState(0);
  const [styles, setStyles] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [budget, setBudget] = useState('$50–100');
  const [signUpMethod, setSignUpMethod] = useState('');
  const { setPreferences } = useShop();

  const toggle = (values: string[], value: string, setValues: (next: string[]) => void) => {
    setValues(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  };

  return (
    <SafeAreaView style={screen.safe} edges={['top', 'bottom']}>
      {step === 0 ? (
        <View style={screen.welcome}>
          <View style={screen.heroBackdrop}>
            <View style={screen.orbitOne} />
            <View style={screen.orbitTwo} />
            <View style={screen.wardrobeArt}>
              <View style={[screen.hanger, screen.hangerFirst]} />
              <View style={[screen.hanger, screen.hangerSecond]} />
              <View style={[screen.hanger, screen.hangerThird]} />
              <View style={screen.rail} />
            </View>
            <View style={screen.heroStamp}>
              <Text style={screen.stampText}>GIVE GOOD{'\n'}CLOTHES{'\n'}ANOTHER LIFE</Text>
              <LeafIcon color={palette.beige} size={19} />
            </View>
            <View style={screen.heroTop}>
              <BrandMark light />
              <Text style={screen.topNote}>PRE-LOVED, WELL-LOVED</Text>
            </View>
          </View>

          <View style={screen.welcomeContent}>
            <Eyebrow>Good finds. Lighter footprint.</Eyebrow>
            <Text style={screen.heroTitle}>Affordable fashion{'\n'}that’s better for{'\n'}the planet.</Text>
            <Text style={screen.heroCopy}>
              Buy pre-loved pieces, discover sustainable brands, and earn rewards for making better
              choices.
            </Text>
            <ActionButton label="Find your next favorite  →" onPress={() => setStep(1)} />
            <View style={screen.signInRow}>
              <Text style={screen.signInCopy}>Already part of the loop?</Text>
              <Pressable onPress={() => setStep(1)} accessibilityRole="button">
                <Text style={screen.signInLink}>Sign in</Text>
              </Pressable>
            </View>
            <Text style={screen.terms}>By continuing, you agree to our Terms & Privacy Policy.</Text>
          </View>
        </View>
      ) : step === 1 ? (
        <ScrollView contentContainerStyle={screen.setupScroll} showsVerticalScrollIndicator={false}>
          <View style={screen.setupHeader}>
            <IconButton label="Back" onPress={() => setStep(0)}>
              ‹
            </IconButton>
            <BrandMark />
            <Text style={screen.stepLabel}>01 / 02</Text>
          </View>
          <View style={screen.progressTrack}>
            <View style={[screen.progressFill, screen.halfProgress]} />
          </View>
          <Eyebrow>Join the loop</Eyebrow>
          <Text style={screen.setupTitle}>A thoughtful{'\n'}closet starts here.</Text>
          <Text style={screen.setupCopy}>
            Choose how you’d like to continue. This preview keeps your choices on your device.
          </Text>
          <View style={screen.authOptions}>
            <ActionButton
              label="Continue with Apple"
              secondary
              onPress={() => {
                setSignUpMethod('Apple');
                setStep(2);
              }}
            />
            <ActionButton
              label="Continue with Google"
              secondary
              onPress={() => {
                setSignUpMethod('Google');
                setStep(2);
              }}
            />
            <ActionButton
              label="Continue with email  →"
              onPress={() => {
                setSignUpMethod('email');
                setStep(2);
              }}
            />
          </View>
          <View style={screen.authNote}>
            <LeafIcon color={palette.olive} size={17} />
            <Text style={screen.tipText}>
              No account or password is created in this visual prototype.
            </Text>
          </View>
          <Pressable onPress={() => setStep(2)} accessibilityRole="button" style={screen.skipAuth}>
            <Text style={screen.signInLink}>Just browsing? Set up my edit</Text>
          </Pressable>
        </ScrollView>
      ) : (
        <ScrollView
          contentContainerStyle={screen.setupScroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={screen.setupHeader}>
            <IconButton label="Back" onPress={() => setStep(1)}>
              ‹
            </IconButton>
            <BrandMark />
            <Text style={screen.stepLabel}>02 / 02</Text>
          </View>
          <View style={screen.progressTrack}>
            <View style={[screen.progressFill, screen.fullProgress]} />
          </View>

          <Eyebrow>Let’s make it yours</Eyebrow>
          <Text style={screen.setupTitle}>A little about{'\n'}your style.</Text>
          <Text style={screen.setupCopy}>
            Pick a few favorites. We’ll find pieces that feel like you.
          </Text>

          <Text style={screen.sectionLabel}>YOUR STYLE</Text>
          <View style={screen.optionWrap}>
            {styleOptions.map((option) => (
              <Pill
                key={option}
                selected={styles.includes(option)}
                onPress={() => toggle(styles, option, setStyles)}>
                {option}
              </Pill>
            ))}
          </View>

          <Text style={screen.sectionLabel}>YOUR SIZE</Text>
          <View style={screen.optionWrap}>
            {sizeOptions.map((option) => (
              <Pill
                key={option}
                selected={sizes.includes(option)}
                onPress={() => toggle(sizes, option, setSizes)}
                style={screen.sizePill}>
                {option}
              </Pill>
            ))}
          </View>

          <Text style={screen.sectionLabel}>YOUR USUAL SPEND</Text>
          <View style={screen.optionWrap}>
            {budgetOptions.map((option) => (
              <Pill key={option} selected={budget === option} onPress={() => setBudget(option)}>
                {option}
              </Pill>
            ))}
          </View>

          <View style={screen.setupTip}>
            <LeafIcon color={palette.olive} size={17} />
            <Text style={screen.tipText}>No pressure—your preferences can always change.</Text>
          </View>
          <ActionButton
            label="Show me my finds  →"
            onPress={() => {
              setPreferences({ styles, sizes, budget });
              router.replace('/(tabs)');
            }}
            style={screen.continueButton}
          />
          <Text style={screen.localNote}>
            Preview only{signUpMethod ? ` · continued with ${signUpMethod}` : ' · no account needed'}.
          </Text>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const screen = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: palette.paper,
  },
  welcome: {
    flex: 1,
  },
  heroBackdrop: {
    height: '43%',
    minHeight: 265,
    maxHeight: 410,
    overflow: 'hidden',
    backgroundColor: palette.oliveDark,
  },
  heroTop: {
    position: 'absolute',
    top: 8,
    left: 25,
    right: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topNote: {
    color: palette.beige,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
  orbitOne: {
    position: 'absolute',
    width: 300,
    height: 300,
    right: -100,
    top: 10,
    borderRadius: 160,
    borderWidth: 1,
    borderColor: 'rgba(239,237,216,0.18)',
  },
  orbitTwo: {
    position: 'absolute',
    width: 230,
    height: 230,
    right: -55,
    top: 45,
    borderRadius: 120,
    borderWidth: 1,
    borderColor: 'rgba(239,237,216,0.15)',
  },
  wardrobeArt: {
    position: 'absolute',
    width: 210,
    height: 210,
    right: 25,
    bottom: -14,
    alignItems: 'center',
  },
  rail: {
    position: 'absolute',
    top: 64,
    left: 5,
    right: 5,
    height: 2,
    backgroundColor: palette.beige,
    transform: [{ rotate: '-6deg' }],
  },
  hanger: {
    position: 'absolute',
    top: 68,
    width: 77,
    height: 118,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: palette.beige,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  hangerFirst: {
    left: 25,
    backgroundColor: 'rgba(190,154,116,0.34)',
    transform: [{ rotate: '5deg' }],
  },
  hangerSecond: {
    left: 76,
    top: 58,
    height: 137,
    backgroundColor: 'rgba(226,222,201,0.24)',
  },
  hangerThird: {
    right: 0,
    backgroundColor: 'rgba(172,112,83,0.33)',
    transform: [{ rotate: '-5deg' }],
  },
  heroStamp: {
    position: 'absolute',
    left: 26,
    bottom: 34,
    transform: [{ rotate: '-8deg' }],
  },
  stampText: {
    color: palette.beige,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2.4,
    lineHeight: 17,
  },
  welcomeContent: {
    flex: 1,
    paddingHorizontal: 26,
    paddingTop: 23,
    paddingBottom: 12,
  },
  heroTitle: {
    marginTop: 9,
    color: palette.ink,
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -1.4,
    lineHeight: 37,
  },
  heroCopy: {
    marginTop: 11,
    marginBottom: 17,
    color: palette.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  signInRow: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },
  signInCopy: {
    color: palette.muted,
    fontSize: 12,
  },
  signInLink: {
    color: palette.olive,
    fontSize: 12,
    fontWeight: '700',
  },
  terms: {
    marginTop: 12,
    color: palette.olive,
    fontSize: 10,
    textAlign: 'center',
  },
  setupScroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 7,
    paddingBottom: 24,
  },
  setupHeader: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  stepLabel: {
    color: palette.muted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  progressTrack: {
    height: 3,
    overflow: 'hidden',
    borderRadius: 2,
    backgroundColor: palette.line,
    marginBottom: 28,
  },
  progressFill: {
    width: '35%',
    height: '100%',
    backgroundColor: palette.olive,
  },
  halfProgress: {
    width: '50%',
  },
  fullProgress: {
    width: '100%',
  },
  setupTitle: {
    marginTop: 9,
    color: palette.ink,
    fontSize: 36,
    lineHeight: 39,
    fontWeight: '700',
    letterSpacing: -1.3,
  },
  setupCopy: {
    marginTop: 9,
    marginBottom: 22,
    color: palette.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  authOptions: {
    gap: 10,
    marginTop: 8,
  },
  authNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 24,
    padding: 13,
    borderRadius: 12,
    backgroundColor: palette.cream,
  },
  skipAuth: {
    alignItems: 'center',
    marginTop: 20,
  },
  sectionLabel: {
    color: palette.ink,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginTop: 17,
    marginBottom: 11,
  },
  optionWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sizePill: {
    minWidth: 52,
    alignItems: 'center',
  },
  setupTip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 26,
    marginBottom: 14,
    padding: 13,
    borderRadius: 12,
    backgroundColor: palette.cream,
  },
  tipText: {
    flex: 1,
    color: palette.muted,
    fontSize: 12,
  },
  continueButton: {
    marginTop: 3,
  },
  localNote: {
    marginTop: 11,
    color: palette.muted,
    fontSize: 11,
    textAlign: 'center',
  },
});
