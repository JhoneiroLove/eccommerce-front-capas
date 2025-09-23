import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Cart, CartItem, Product } from '../../types';
import { STORAGE_KEYS } from '../../shared/constants';
import { generateId } from '../../shared/utils';

interface CartState {
  cart: Cart;
  isLoading: boolean;
  error: string | null;
}

interface CartActions {
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getCartTotal: () => number;
  getItem: (productId: string) => CartItem | undefined;
}

type CartStore = CartState & CartActions;

const initialCart: Cart = {
  id: generateId(),
  items: [],
  total: 0,
  itemCount: 0,
};

const calculateCartTotals = (items: CartItem[]): { total: number; itemCount: number } => {
  const total = items.reduce((sum, item) => sum + item.subtotal, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { total, itemCount };
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: initialCart,
      isLoading: false,
      error: null,

      addItem: (product: Product, quantity = 1) => {
        set((state) => {
          const existingItem = state.cart.items.find(item => item.productId === product.id);
          let newItems: CartItem[];

          if (existingItem) {
            // Update existing item
            newItems = state.cart.items.map(item =>
              item.productId === product.id
                ? {
                    ...item,
                    quantity: item.quantity + quantity,
                    subtotal: (item.quantity + quantity) * item.product.price,
                  }
                : item
            );
          } else {
            // Add new item
            const newItem: CartItem = {
              id: generateId(),
              productId: product.id,
              product,
              quantity,
              subtotal: product.price * quantity,
            };
            newItems = [...state.cart.items, newItem];
          }

          const { total, itemCount } = calculateCartTotals(newItems);

          return {
            cart: {
              ...state.cart,
              items: newItems,
              total,
              itemCount,
            },
            error: null,
          };
        });
      },

      removeItem: (itemId: string) => {
        set((state) => {
          const newItems = state.cart.items.filter(item => item.id !== itemId);
          const { total, itemCount } = calculateCartTotals(newItems);

          return {
            cart: {
              ...state.cart,
              items: newItems,
              total,
              itemCount,
            },
            error: null,
          };
        });
      },

      updateQuantity: (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }

        set((state) => {
          const newItems = state.cart.items.map(item =>
            item.id === itemId
              ? {
                  ...item,
                  quantity,
                  subtotal: item.product.price * quantity,
                }
              : item
          );

          const { total, itemCount } = calculateCartTotals(newItems);

          return {
            cart: {
              ...state.cart,
              items: newItems,
              total,
              itemCount,
            },
            error: null,
          };
        });
      },

      clearCart: () => {
        set({
          cart: initialCart,
          error: null,
        });
      },

      getItemCount: () => {
        return get().cart.itemCount;
      },

      getCartTotal: () => {
        return get().cart.total;
      },

      getItem: (productId: string) => {
        return get().cart.items.find(item => item.productId === productId);
      },
    }),
    {
      name: STORAGE_KEYS.CART,
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);