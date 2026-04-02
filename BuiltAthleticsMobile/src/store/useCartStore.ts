import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Product } from '../api/types';

interface CartItem {
  product: Product;
  quantity: number;
}

interface ShippingAddress {
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface CartState {
  items: CartItem[];
  shippingAddress: ShippingAddress | null;

  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setShippingAddress: (address: ShippingAddress) => void;
  getTotal: () => number;
  getItemCount: () => number;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      shippingAddress: null,

      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i,
              ),
            };
          }
          return { items: [...state.items, { product, quantity }] };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.product.id !== productId)
              : state.items.map((i) =>
                  i.product.id === productId ? { ...i, quantity } : i,
                ),
        })),

      setShippingAddress: (address) => set({ shippingAddress: address }),

      getTotal: () =>
        get().items.reduce(
          (sum, i) => sum + (i.product.price ?? 0) * i.quantity,
          0,
        ),

      getItemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),

      clear: () => set({ items: [], shippingAddress: null }),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
