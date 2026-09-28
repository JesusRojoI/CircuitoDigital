'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { CartItem } from '@/types';
import { useToast } from './ToastContext';
import { useLanguage } from './LanguageContext';

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  vat: number;
  total: number;
  totalItems: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  lastRemoved: CartItem | null;
  undoRemove: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const VAT_RATE = 0.16;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [lastRemoved, setLastRemoved] = useState<CartItem | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const { showToast, removeToast } = useToast();
  const { t } = useLanguage();
  const lastRemovedToastId = useRef<string | null>(null);

  // Hidratar desde localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('cd_cart');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch (e) {
      console.error('Error loading cart', e);
    }
    setHydrated(true);
  }, []);

  // Persistir
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem('cd_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Error saving cart', e);
    }
  }, [items, hydrated]);

  const addItem = useCallback(
    (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
      const qty = item.quantity ?? 1;
      setItems((prev) => {
        const existing = prev.find((i) => i.id === item.id);
        if (existing) {
          return prev.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + qty } : i
          );
        }
        return [...prev, { ...item, quantity: qty }];
      });
    },
    []
  );

  const removeItem = useCallback(
    (id: string) => {
      const itemToRemove = items.find((i) => i.id === id);
      if (!itemToRemove) return;

      setItems((prev) => prev.filter((i) => i.id !== id));
      setLastRemoved(itemToRemove);

      // Remover toast anterior si existe
      if (lastRemovedToastId.current) {
        removeToast(lastRemovedToastId.current);
      }

      const toastId = showToast({
        type: 'info',
        message: `${t(itemToRemove.nameKey)} ${t('cart.removedItem')}.`,
        actionLabel: t('cart.undo'),
        onAction: () => {
          setItems((prev) => {
            const existing = prev.find((i) => i.id === itemToRemove.id);
            if (existing) {
              return prev.map((i) =>
                i.id === itemToRemove.id
                  ? { ...i, quantity: i.quantity + itemToRemove.quantity }
                  : i
              );
            }
            return [...prev, itemToRemove];
          });
          setLastRemoved(null);
          if (lastRemovedToastId.current) {
            removeToast(lastRemovedToastId.current);
            lastRemovedToastId.current = null;
          }
        },
        duration: 6000,
      });
      lastRemovedToastId.current = toastId;
    },
    [items, showToast, removeToast, t]
  );

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setLastRemoved(null);
  }, []);

  const undoRemove = useCallback(() => {
    if (!lastRemoved) return;
    setItems((prev) => {
      const existing = prev.find((i) => i.id === lastRemoved.id);
      if (existing) {
        return prev.map((i) =>
          i.id === lastRemoved.id
            ? { ...i, quantity: i.quantity + lastRemoved.quantity }
            : i
        );
      }
      return [...prev, lastRemoved];
    });
    setLastRemoved(null);
  }, [lastRemoved]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((v) => !v), []);

  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const vat = subtotal * VAT_RATE;
  const total = subtotal + vat;
  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        vat,
        total,
        totalItems,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        lastRemoved,
        undoRemove,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}