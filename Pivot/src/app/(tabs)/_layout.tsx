import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { palette } from '@/components/pivot-ui';

export default function ShopTabsLayout() {
  return (
    <NativeTabs
      backgroundColor={palette.paper}
      indicatorColor={palette.sage}
      labelStyle={{ selected: { color: palette.oliveDark } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="explore">
        <NativeTabs.Trigger.Label>Discover</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="saved">
        <NativeTabs.Trigger.Label>Saved</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>You</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
