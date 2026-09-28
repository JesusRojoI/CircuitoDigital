'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { cn, formatCurrency } from '@/lib/utils';

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    subtotal,
    totalItems,
  } = useCart();
  const { t, language } = useLanguage();

  // Cerrar con ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) closeCart();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, closeCart]);

  // Bloquear scroll cuando está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={closeCart}
        className={cn(
          'fixed inset-0 z-50 bg-ink/30 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        aria-hidden={!isOpen}
      />

      {/* Drawer */}
      <aside
        className={cn(
          'fixed top-0 right-0 z-50 h-full w-full sm:w-[420px] bg-white shadow-2xl',
          'flex flex-col transition-transform duration-400 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        aria-hidden={!isOpen}
      >
        {/* Header del drawer */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-pink-500 flex items-center justify-center">
              <i className="bi bi-bag-check text-white text-lg" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-ink">
                {t('cart.title')}
              </h2>
              <p className="text-xs text-ink-muted">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label={t('common.close')}
          >
            <i className="bi bi-x-lg text-ink-soft" />
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-10 animate-fade-in">
              <div className="w-24 h-24 rounded-full bg-primary-50 flex items-center justify-center mb-4">
                <i className="bi bi-cart-x text-primary-400 text-4xl" />
              </div>
              <h3 className="font-display font-bold text-lg text-ink mb-2">
                {t('cart.empty')}
              </h3>
              <p className="text-sm text-ink-muted mb-6 max-w-xs">
                {t('cart.emptyMessage')}
              </p>
              <Link
                href="/planes"
                onClick={closeCart}
                className="btn-primary text-sm"
              >
                <i className="bi bi-grid" />
                {t('cart.continueShopping')}
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="group flex gap-3 p-3 rounded-2xl bg-gray-50/70 hover:bg-primary-50/50 transition-colors animate-slide-up"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-100 to-pink-100 flex items-center justify-center shrink-0">
                    <i className="bi bi-box-seam text-primary-500 text-xl" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-sm text-ink truncate">
                        {t(item.nameKey)}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="p-1 rounded-full hover:bg-red-50 text-ink-muted hover:text-red-500 transition-colors shrink-0"
                        aria-label={t('cart.removeItem')}
                      >
                        <i className="bi bi-trash3 text-xs" />
                      </button>
                    </div>
                    {item.isCustom && item.customDescription && (
                      <p className="text-xs text-ink-muted truncate">
                        {item.customDescription}
                      </p>
                    )}
                    <p className="text-xs text-ink-muted mt-1">
                      {item.quantity} × {formatCurrency(item.price, language)}
                    </p>
                    <p className="text-sm font-semibold text-primary-600 mt-1">
                      {formatCurrency(item.price * item.quantity, language)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer del drawer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-6 py-5 bg-white/95 backdrop-blur">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-ink-muted">
                {t('common.subtotal')}
              </span>
              <span className="font-display font-bold text-lg text-ink">
                {formatCurrency(subtotal, language)}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <Link
                href="/carrito"
                onClick={closeCart}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium border-2 border-primary-500 text-primary-600 hover:bg-primary-50 transition-all duration-300"
              >
                <i className="bi bi-cart3" />
                {t('cart.viewCart')}
              </Link>
              <Link
                href="/finalizar-compra"
                onClick={closeCart}
                className="btn-primary w-full"
              >
                <i className="bi bi-credit-card" />
                {t('cart.checkout')}
              </Link>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}