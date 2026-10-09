import Slider from '@react-native-community/slider';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActionButton, PivotLogo, palette } from '@/components/pivot-ui';
import {
  budgetFromMonthlyAmount,
  onboardingSizes,
  onboardingStyleOptions,
} from '@/constants/onboarding';
import { useShop } from '@/state/shop-store';

const welcomeFeatures = [
  { icon: '♻️', label: 'Preloved & sustainable brands' },
  { icon: '🌱', label: 'Track your sustainability impact' },
  { icon: '💰', label: 'Earn rewards on every purchase' },
];

const socialProviders = [
  { icon: '🍎', label: 'Continue with Apple', variant: 'apple' as const },
  { icon: '🔵', label: 'Continue with Google', variant: 'google' as const },
];

export default function WelcomeScreen() {
  const [step, setStep] = useState(0);
  const [prefStep, setPrefStep] = useState(0);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [budget, setBudget] = useState(100);
  const [sustainTrack, setSustainTrack] = useState(true);
  const [dealNotifs, setDealNotifs] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setPreferences } = useShop();

  const toggleStyle = (id: string) => {
    setSelectedStyles((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((current) =>
      current.includes(size) ? current.filter((item) => item !== size) : [...current, size],
    );
  };

  const goToPreferences = () => {
    setPrefStep(0);
    setStep(2);
  };

  return (
    <SafeAreaView
      style={[screen.safe, step === 0 && screen.safeWelcome]}
      edges={['top', 'bottom']}>
      {step === 0 ? (
        <View style={screen.welcome}>
          <View style={screen.welcomeTextureWarm} />
          <View style={screen.welcomeTextureAccent} />
          <View style={screen.welcomeInner}>
            <View style={screen.welcomeTop}>
              <View style={screen.welcomeHeader}>
                <PivotLogo light />
                <Text style={screen.welcomeEyebrow}>Sustainable Fashion</Text>
              </View>
              <Text style={screen.heroTitle}>Affordable fashion that's better for the planet.</Text>
              <Text style={screen.heroCopy}>
                Buy pre-loved pieces, discover sustainable brands, and earn rewards for making better
                choices.
              </Text>
              <View style={screen.featureList}>
                {welcomeFeatures.map((feature) => (
                  <View key={feature.label} style={screen.featureRow}>
                    <Text style={screen.featureIcon}>{feature.icon}</Text>
                    <Text style={screen.featureLabel}>{feature.label}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={screen.welcomeActions}>
              <Pressable
                accessibilityRole="button"
                onPress={() => setStep(1)}
                style={({ pressed }) => [screen.getStartedButton, pressed && screen.pressed]}>
                <Text style={screen.getStartedText}>Get Started</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() => router.replace('/(tabs)')}
                style={({ pressed }) => [screen.signInButton, pressed && screen.pressed]}>
                <Text style={screen.signInButtonText}>Sign in</Text>
              </Pressable>
            </View>
          </View>
        </View>
      ) : step === 1 ? (
        <View style={screen.authScreen}>
          <SafeAreaView style={screen.authHero} edges={['top']}>
            <View style={screen.authHeroGlow} />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Back to welcome screen"
              hitSlop={12}
              onPress={() => setStep(0)}
              style={({ pressed }) => [screen.authBackButton, pressed && screen.pressed]}>
              <Text style={screen.authBackText}>‹ Back</Text>
            </Pressable>
            <PivotLogo light compact />
            <Text style={screen.authTitle}>Create your account</Text>
            <Text style={screen.authSubtitle}>Join 80,000+ conscious shoppers</Text>
          </SafeAreaView>
          <ScrollView
            contentContainerStyle={screen.authFormScroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            {socialProviders.map((provider) => (
              <Pressable
                key={provider.label}
                accessibilityRole="button"
                onPress={goToPreferences}
                style={({ pressed }) => [
                  screen.socialButton,
                  provider.variant === 'apple' ? screen.appleButton : screen.googleButton,
                  pressed && screen.pressed,
                ]}>
                <Text style={screen.socialIcon}>{provider.icon}</Text>
                <Text
                  style={
                    provider.variant === 'apple' ? screen.appleButtonText : screen.googleButtonText
                  }>
                  {provider.label}
                </Text>
              </Pressable>
            ))}
            <View style={screen.authDivider}>
              <View style={screen.authDividerLine} />
              <Text style={screen.authDividerText}>or with email</Text>
              <View style={screen.authDividerLine} />
            </View>
            <TextInput
              accessibilityLabel="Your name"
              placeholder="Your name"
              placeholderTextColor={palette.stone}
              value={name}
              onChangeText={setName}
              style={screen.authInput}
            />
            <TextInput
              accessibilityLabel="Email address"
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Email address"
              placeholderTextColor={palette.stone}
              value={email}
              onChangeText={setEmail}
              style={screen.authInput}
            />
            <TextInput
              accessibilityLabel="Password"
              placeholder="Password"
              placeholderTextColor={palette.stone}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={screen.authInput}
            />
            <ActionButton label="Create account" onPress={goToPreferences} style={screen.createAccountButton} />
            <Text style={screen.authTerms}>
              By signing up you agree to our{' '}
              <Text style={screen.authTermsLink}>Terms</Text> &{' '}
              <Text style={screen.authTermsLink}>Privacy Policy</Text>
            </Text>
          </ScrollView>
        </View>
      ) : prefStep === 0 ? (
        <ScrollView contentContainerStyle={screen.prefScroll} showsVerticalScrollIndicator={false}>
          <Text style={screen.prefStepLabel}>Step 1 of 2</Text>
          <View style={screen.prefProgressTrack}>
            <View style={[screen.prefProgressFill, screen.prefProgressHalf]} />
          </View>
          <Text style={screen.prefTitle}>What's your style?</Text>
          <Text style={screen.prefCopy}>
            Pick the aesthetics you love. We'll curate your feed accordingly.
          </Text>
          <View style={screen.styleGrid}>
            {onboardingStyleOptions.map((option) => {
              const selected = selectedStyles.includes(option.id);
              return (
                <Pressable
                  key={option.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => toggleStyle(option.id)}
                  style={[screen.styleCard, selected && screen.styleCardSelected]}>
                  <Text style={screen.styleEmoji}>{option.emoji}</Text>
                  <Text style={[screen.styleLabel, selected && screen.styleLabelSelected]}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <ActionButton label="Continue" onPress={() => setPrefStep(1)} style={screen.prefPrimaryButton} />
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={screen.prefScroll} showsVerticalScrollIndicator={false}>
          <Text style={screen.prefStepLabel}>Step 2 of 2</Text>
          <View style={screen.prefProgressTrack}>
            <View style={[screen.prefProgressFill, screen.prefProgressFull]} />
          </View>
          <Text style={screen.prefTitle}>Size & budget</Text>
          <Text style={screen.prefCopy}>Help us find the right fit for you.</Text>

          <Text style={screen.prefSectionLabel}>Your sizes</Text>
          <View style={screen.sizeWrap}>
            {onboardingSizes.map((size) => {
              const selected = selectedSizes.includes(size);
              return (
                <Pressable
                  key={size}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => toggleSize(size)}
                  style={[screen.sizeChip, selected && screen.sizeChipSelected]}>
                  <Text style={[screen.sizeChipText, selected && screen.sizeChipTextSelected]}>
                    {size}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={screen.prefSectionLabel}>
            Monthly budget: <Text style={screen.budgetValue}>${budget}</Text>
          </Text>
          <Slider
            accessibilityLabel="Monthly budget"
            minimumValue={20}
            maximumValue={500}
            step={10}
            value={budget}
            onValueChange={setBudget}
            minimumTrackTintColor={palette.olive}
            maximumTrackTintColor={palette.sand}
            thumbTintColor={palette.olive}
            style={screen.budgetSlider}
          />

          <Text style={screen.prefSectionLabel}>Preferences</Text>
          <PreferenceToggle
            label="Sustainability tracking"
            sub="Track your environmental impact"
            value={sustainTrack}
            onValueChange={setSustainTrack}
          />
          <PreferenceToggle
            label="Deal notifications"
            sub="Get alerts on price drops"
            value={dealNotifs}
            onValueChange={setDealNotifs}
          />

          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setPreferences({
                styles: selectedStyles,
                sizes: selectedSizes,
                budget: budgetFromMonthlyAmount(budget),
              });
              router.replace('/(tabs)');
            }}
            style={({ pressed }) => [screen.startShoppingButton, pressed && screen.pressed]}>
            <Text style={screen.startShoppingText}>Start Shopping 🌱</Text>
          </Pressable>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function PreferenceToggle({
  label,
  sub,
  value,
  onValueChange,
}: {
  label: string;
  sub: string;
  value: boolean;
  onValueChange: (next: boolean) => void;
}) {
  return (
    <View style={screen.prefToggleRow}>
      <View style={screen.prefToggleCopy}>
        <Text style={screen.prefToggleLabel}>{label}</Text>
        <Text style={screen.prefToggleSub}>{sub}</Text>
      </View>
      <Switch
        accessibilityLabel={label}
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: palette.sand, true: palette.olive }}
        thumbColor={palette.paper}
      />
    </View>
  );
}

const screen = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: palette.paper,
  },
  safeWelcome: {
    backgroundColor: palette.olive,
  },
  welcome: {
    flex: 1,
    backgroundColor: palette.olive,
    overflow: 'hidden',
  },
  authBackButton: {
  alignSelf: 'flex-start',
  paddingVertical: 8,
  marginBottom: 12,
  },
  authBackText: {
    color: 'rgba(250,248,244,0.85)',
    fontSize: 15,
    fontWeight: '500',
  },
  welcomeTextureWarm: {
    position: 'absolute',
    width: 360,
    height: 360,
    right: -80,
    top: -40,
    borderRadius: 200,
    backgroundColor: 'rgba(207,155,122,0.25)',
  },
  welcomeTextureAccent: {
    position: 'absolute',
    width: 300,
    height: 300,
    left: -100,
    bottom: 80,
    borderRadius: 180,
    backgroundColor: 'rgba(201,91,12,0.15)',
  },
  welcomeInner: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20,
    paddingBottom: 48,
    justifyContent: 'space-between',
  },
  welcomeTop: {
    flex: 1,
  },
  welcomeHeader: {
    marginBottom: 40,
    gap: 16,
  },
  welcomeEyebrow: {
    color: palette.logoPeach,
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: palette.paper,
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: -1.1,
    lineHeight: 40,
  },
  heroCopy: {
    marginTop: 20,
    color: 'rgba(250,248,244,0.7)',
    fontSize: 16,
    lineHeight: 26,
  },
  featureList: {
    marginTop: 40,
    gap: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  featureIcon: {
    fontSize: 18,
  },
  featureLabel: {
    flex: 1,
    color: 'rgba(250,248,244,0.9)',
    fontSize: 14,
    fontWeight: '500',
  },
  welcomeActions: {
    gap: 16,
    marginTop: 56,
  },
  getStartedButton: {
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: palette.terracotta,
  },
  getStartedText: {
    color: palette.paper,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  signInButton: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(250,248,244,0.2)',
  },
  signInButtonText: {
    color: 'rgba(250,248,244,0.7)',
    fontSize: 15,
    fontWeight: '500',
  },
  pressed: {
    opacity: 0.72,
  },
  authScreen: {
    flex: 1,
    backgroundColor: palette.paper,
  },
  authHero: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: palette.olive,
    paddingHorizontal: 24,
    paddingBottom: 28,
    paddingTop: 8,
  },
  authHeroGlow: {
    position: 'absolute',
    width: 180,
    height: 180,
    right: -40,
    top: -40,
    borderRadius: 90,
    backgroundColor: 'rgba(207,155,122,0.2)',
  },
  authTitle: {
    marginTop: 20,
    color: palette.paper,
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  authSubtitle: {
    marginTop: 4,
    color: 'rgba(250,248,244,0.7)',
    fontSize: 14,
    lineHeight: 20,
  },
  authFormScroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 32,
    gap: 12,
  },
  socialButton: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 14,
  },
  socialIcon: {
    fontSize: 18,
  },
  appleButton: {
    backgroundColor: palette.charcoal,
  },
  appleButtonText: {
    color: palette.paper,
    fontSize: 15,
    fontWeight: '600',
  },
  googleButton: {
    backgroundColor: palette.paper,
    borderWidth: 1,
    borderColor: palette.sand,
  },
  googleButtonText: {
    color: palette.charcoal,
    fontSize: 15,
    fontWeight: '600',
  },
  authDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 12,
  },
  authDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: palette.sand,
  },
  authDividerText: {
    color: palette.stone,
    fontSize: 13,
  },
  authInput: {
    minHeight: 50,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F2EDE8',
    color: palette.charcoal,
    fontSize: 15,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  createAccountButton: {
    marginTop: 12,
  },
  authTerms: {
    marginTop: 4,
    color: palette.stone,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  authTermsLink: {
    color: palette.olive,
    fontWeight: '500',
  },
  prefScroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  prefStepLabel: {
    color: palette.olive,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  prefProgressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: palette.sand,
    marginBottom: 24,
    overflow: 'hidden',
  },
  prefProgressFill: {
    height: '100%',
    backgroundColor: palette.olive,
    borderRadius: 2,
  },
  prefProgressHalf: {
    width: '50%',
  },
  prefProgressFull: {
    width: '100%',
  },
  prefTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: palette.charcoal,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  prefCopy: {
    color: palette.stone,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 32,
  },
  styleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  styleCard: {
    width: '30%',
    flexGrow: 1,
    minWidth: '28%',
    maxWidth: '32%',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: palette.sand,
    backgroundColor: palette.paper,
    alignItems: 'center',
    gap: 6,
  },
  styleCardSelected: {
    borderColor: palette.olive,
    backgroundColor: 'rgba(79,107,86,0.08)',
  },
  styleEmoji: {
    fontSize: 24,
  },
  styleLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: palette.charcoal,
    textAlign: 'center',
  },
  styleLabelSelected: {
    color: palette.olive,
  },
  prefPrimaryButton: {
    marginTop: 4,
  },
  prefSectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: palette.charcoal,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  sizeWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 28,
  },
  sizeChip: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: palette.sand,
    backgroundColor: palette.paper,
  },
  sizeChipSelected: {
    borderColor: palette.olive,
    backgroundColor: palette.olive,
  },
  sizeChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.charcoal,
  },
  sizeChipTextSelected: {
    color: palette.paper,
  },
  budgetValue: {
    color: palette.terracotta,
  },
  budgetSlider: {
    width: '100%',
    height: 40,
    marginBottom: 28,
  },
  prefToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: palette.sand,
  },
  prefToggleCopy: {
    flex: 1,
    paddingRight: 12,
  },
  prefToggleLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: palette.charcoal,
    marginBottom: 2,
  },
  prefToggleSub: {
    fontSize: 13,
    color: palette.stone,
  },
  startShoppingButton: {
    marginTop: 28,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: palette.terracotta,
  },
  startShoppingText: {
    color: palette.paper,
    fontSize: 15,
    fontWeight: '700',
  },
});
