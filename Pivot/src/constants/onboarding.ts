export type OnboardingStyleOption = {
  id: string;
  label: string;
  emoji: string;
};

export const onboardingStyleOptions: OnboardingStyleOption[] = [
  { id: 'minimal', label: 'Minimal', emoji: '◻️' },
  { id: 'vintage', label: 'Vintage', emoji: '🕰️' },
  { id: 'soft & natural', label: 'Natural', emoji: '🌿' },
  { id: 'streetwear', label: 'Street', emoji: '👟' },
  { id: 'classic', label: 'Classic', emoji: '👔' },
  { id: 'playful', label: 'Playful', emoji: '🎨' },
];

export const onboardingSizes = ['XS', 'S', 'M', 'L', 'XL', '2XL'] as const;

export function budgetFromMonthlyAmount(amount: number): string {
  if (amount <= 50) return '$25–50';
  if (amount <= 100) return '$50–100';
  if (amount <= 200) return '$100–200';
  return 'No limit';
}
