import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

type ShopContextValue = {
  savedIds: string[];
  bagCount: number;
  preferences: StylePreferences | null;
  toggleSaved: (id: string) => void;
  addToBag: (id: string) => void;
  setPreferences: (preferences: StylePreferences) => void;
};

export type StylePreferences = {
  styles: string[];
  sizes: string[];
  budget: string;
};

const ShopContext = createContext<ShopContextValue | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [bagIds, setBagIds] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<StylePreferences | null>(null);

  const value = useMemo(
    () => ({
      savedIds,
      bagCount: bagIds.length,
      preferences,
      toggleSaved: (id: string) => {
        setSavedIds((current) =>
          current.includes(id) ? current.filter((savedId) => savedId !== id) : [...current, id],
        );
      },
      addToBag: (id: string) => setBagIds((current) => [...current, id]),
      setPreferences,
    }),
    [bagIds.length, preferences, savedIds],
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
