import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import type { Product } from '@/constants/products';

type ShopContextValue = {
  savedIds: string[];
  cartItems: CartItem[];
  bagCount: number;
  preferences: StylePreferences | null;
  followedBrands: string[];
  followedSellers: string[];
  listings: UserListing[];
  threads: MessageThread[];
  toggleSaved: (id: string) => void;
  addToBag: (id: string) => void;
  removeFromBag: (id: string) => void;
  toggleFollowBrand: (brand: string) => void;
  toggleFollowSeller: (seller: string) => void;
  setPreferences: (preferences: StylePreferences) => void;
  addListing: (listing: UserListing) => void;
  setListingStatus: (id: string, status: 'open' | 'sold') => void;
  sendBid: (product: Product, amount: number) => void;
  sendMessage: (threadId: string, text: string) => void;
};

export type UserListing = Product & { createdAt: string };
export type ChatMessage = {
  id: string;
  text: string;
  createdAt: string;
  isMine: boolean;
  bidAmount?: number;
  bidStatus?: 'pending' | 'accepted' | 'declined';
};
export type MessageThread = {
  id: string;
  seller: string;
  productId: string;
  productName: string;
  image: string;
  messages: ChatMessage[];
};

export type CartItem = {
  productId: string;
  quantity: number;
};

export type StylePreferences = {
  styles: string[];
  sizes: string[];
  budget: string;
};

const ShopContext = createContext<ShopContextValue | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [preferences, setPreferences] = useState<StylePreferences | null>(null);
  const [followedBrands, setFollowedBrands] = useState(['Éthique Studio', 'Reformation']);
  const [followedSellers, setFollowedSellers] = useState(['Maya R.', 'Claire D.']);
  const [listings, setListings] = useState<UserListing[]>([]);
  const [threads, setThreads] = useState<MessageThread[]>([]);

  const value = useMemo(
    () => ({
      savedIds,
      cartItems,
      bagCount: cartItems.reduce((total, item) => total + item.quantity, 0),
      preferences,
      followedBrands,
      followedSellers,
      listings,
      threads,
      toggleSaved: (id: string) => {
        setSavedIds((current) =>
          current.includes(id) ? current.filter((savedId) => savedId !== id) : [...current, id],
        );
      },
      addToBag: (id: string) =>
        setCartItems((current) => {
          const existing = current.find((item) => item.productId === id);
          return existing
            ? current.map((item) =>
                item.productId === id ? { ...item, quantity: item.quantity + 1 } : item,
              )
            : [...current, { productId: id, quantity: 1 }];
        }),
      removeFromBag: (id: string) =>
        setCartItems((current) => current.filter((item) => item.productId !== id)),
      toggleFollowBrand: (brand: string) =>
        setFollowedBrands((current) =>
          current.includes(brand) ? current.filter((item) => item !== brand) : [...current, brand],
        ),
      toggleFollowSeller: (seller: string) =>
        setFollowedSellers((current) =>
          current.includes(seller) ? current.filter((item) => item !== seller) : [...current, seller],
        ),
      setPreferences,
      addListing: (listing: UserListing) => setListings((current) => [listing, ...current]),
      setListingStatus: (id: string, status: 'open' | 'sold') =>
        setListings((current) =>
          current.map((listing) =>
            listing.id === id ? { ...listing, listingStatus: status } : listing,
          ),
        ),
      sendBid: (product: Product, amount: number) =>
        setThreads((current) => {
          const threadId = `${product.id}-${product.seller}`;
          const bidMessage: ChatMessage = {
            id: `bid-${Date.now()}`,
            text: `You offered $${amount.toFixed(2)} for ${product.name}.`,
            createdAt: new Date().toISOString(),
            isMine: true,
            bidAmount: amount,
            bidStatus: 'pending',
          };
          const existing = current.find((thread) => thread.id === threadId);
          return existing
            ? current.map((thread) =>
                thread.id === threadId
                  ? { ...thread, messages: [...thread.messages, bidMessage] }
                  : thread,
              )
            : [
                {
                  id: threadId,
                  seller: product.seller,
                  productId: product.id,
                  productName: product.name,
                  image: product.image,
                  messages: [bidMessage],
                },
                ...current,
              ];
        }),
      sendMessage: (threadId: string, text: string) =>
        setThreads((current) =>
          current.map((thread) =>
            thread.id === threadId
              ? {
                  ...thread,
                  messages: [
                    ...thread.messages,
                    {
                      id: `message-${Date.now()}`,
                      text,
                      createdAt: new Date().toISOString(),
                      isMine: true,
                    },
                  ],
                }
              : thread,
          ),
        ),
    }),
    [cartItems, followedBrands, followedSellers, listings, preferences, savedIds, threads],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within ShopProvider');
  }
  return context;
}
