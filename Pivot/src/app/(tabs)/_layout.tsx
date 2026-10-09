import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { palette } from '@/components/pivot-ui';

export default function ShopTabsLayout() {
  return (
    <NativeTabs
      backgroundColor={palette.paper}
      indicatorColor={palette.sage}
      tintColor={palette.olive}
      labelStyle={{ selected: { color: palette.olive } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'house', selected: 'house.fill' }}
          md={{ default: 'home', selected: 'home_filled' }}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="messages">
        <NativeTabs.Trigger.Label>Messages</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'bubble.left.and.bubble.right', selected: 'bubble.left.and.bubble.right.fill' }}
          md={{ default: 'chat_bubble', selected: 'chat_bubble' }}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="sell">
        <NativeTabs.Trigger.Label>Sell</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'plus.app', selected: 'plus.app.fill' }}
          md={{ default: 'add_box', selected: 'add_box' }}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="cart">
        <NativeTabs.Trigger.Label>Cart</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'bag', selected: 'bag.fill' }}
          md={{ default: 'shopping_bag', selected: 'shopping_bag' }}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'person.crop.circle', selected: 'person.crop.circle.fill' }}
          md={{ default: 'person', selected: 'person' }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
