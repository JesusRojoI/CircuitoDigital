'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import QuantityInput from '@/components/ui/QuantityInput';
import SectionReveal from '@/components/ui/SectionReveal';
import Blobs from '@/components/ui/Blobs';

export default function CarritoPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    vat,
    total,
  } = useCart();
  const { t, language } = useLanguage();
  const router = useRouter();

  return (
    <section className="relative pt-28 md:pt-32 pb-20 overflow-hidden min-h-[80vh]">
      <Blobs variant="pastel" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-ink mb-10">
            {t('cart.title')}
          </h1>
        </SectionReveal>

        {items.length === 0 ? (
          /* ==================== CARRITO VACÍO ==================== */
          <SectionReveal delay={100}>
            <div className="rounded-3xl bg-white border border-gray-100 p-10 md:p-16 text-center shadow-xl shadow-primary-500/5">
              <div className="w-24 h-24 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-6">
                <i className="bi bi-cart-x text-primary-400 text-4xl" />
              </div>
              <h2 className="font-display font-bold text-2xl md:text-3xl text-ink mb-3">
                {t('cart.empty')}
              </h2>
              <p className="text-ink-muted mb-8 max-w-md mx-auto">
                {t('cart.emptyMessage')}
              </p>
              <Link
                href="/planes"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-white bg-gradient-to-r from-primary-500 to-pink-500 shadow-xl shadow-primary-500/30 hover:shadow-primary-500/50 transition-all duration-300 hover:-translate-y-1"
              >
                <i className="bi bi-grid" />
                {t('cart.continueShopping')}
              </Link>
            </div>
          </SectionReveal>
        ) : (
          /* ==================== CARRITO CON ITEMS ==================== */
          <SectionReveal delay={100}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Tabla de items */}
              <div className="lg:col-span-2">
                <div className="rounded-3xl bg-white border border-gray-100 overflow-hidden shadow-xl shadow-primary-500/5">
                  {/* Header de tabla (desktop) */}
                  <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-ink-muted">
                    <div className="col-span-1 text-center">{t('cart.removeItem')}</div>
                    <div className="col-span-2 text-center">{t('cart.thumbnail')}</div>
                    <div className="col-span-3">{t('common.product')}</div>
                    <div className="col-span-2 text-right">{t('common.price')}</div>
                    <div className="col-span-2 text-center">{t('common.quantity')}</div>
                    <div className="col-span-2 text-right">{t('common.subtotal')}</div>
                  </div>

                  {/* Items */}
                  <ul className="divide-y divide-gray-100">
                    {items.map((item) => (
                      <li
                        key={item.id}
                        className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-primary-50/30 transition-colors"
                      >
                        {/* Eliminar */}
                        <div className="col-span-12 md:col-span-1 order-2 md:order-1 flex justify-center md:justify-center">
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 flex items-center justify-center transition-colors"
                            aria-label={t('cart.removeItem')}
                          >
                            <i className="bi bi-x-lg text-xs" />
                          </button>
                        </div>

                        {/* Thumbnail */}
                        <div className="col-span-3 md:col-span-2 order-1 md:order-2 flex justify-center">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-pink-100 flex items-center justify-center shadow-sm">
                            <i className="bi bi-box-seam text-primary-500 text-xl" />
                          </div>
                        </div>

                        {/* Nombre */}
                        <div className="col-span-9 md:col-span-3 order-3 md:order-3">
                          <h3 className="font-medium text-sm text-ink">
                            {t(item.nameKey)}
                          </h3>
                          {item.isCustom && item.customDescription && (
                            <p className="text-xs text-ink-muted mt-0.5">
                              {item.customDescription}
                            </p>
                          )}
                        </div>

                        {/* Precio unitario */}
                        <div className="col-span-6 md:col-span-2 order-4 md:order-4 text-left md:text-right">
                          <span className="md:hidden text-xs text-ink-muted block">
                            {t('common.price')}
                          </span>
                          <span className="text-sm font-medium text-ink-soft">
                            {formatCurrency(item.price, language)}
                          </span>
                        </div>

                        {/* Cantidad */}
                        <div className="col-span-6 md:col-span-2 order-5 md:order-5 flex justify-end md:justify-center">
                          <QuantityInput
                            size="sm"
                            value={item.quantity}
                            onChange={(v) => updateQuantity(item.id, v)}
                          />
                        </div>

                        {/* Subtotal */}
                        <div className="col-span-12 md:col-span-2 order-6 md:order-6 text-right">
                          <span className="md:hidden text-xs text-ink-muted block">
                            {t('common.subtotal')}
                          </span>
                          <span className="font-display font-bold text-base text-primary-600">
                            {formatCurrency(item.price * item.quantity, language)}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Totales */}
              <div className="lg:col-span-1">
                <div className="sticky top-28 rounded-3xl bg-white border border-gray-100 overflow-hidden shadow-xl shadow-primary-500/5 relative">
  <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-primary-200 to-pink-200 opacity-30 blur-2xl pointer-events-none" />
  <div className="relative p-6">
                    <h2 className="font-display font-bold text-xl text-ink mb-6 flex items-center gap-2">
                      <i className="bi bi-receipt text-primary-500" />
                      {t('cart.cartTotal')}
                    </h2>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-ink-muted">{t('common.subtotal')}</span>
                        <span className="font-medium text-ink">
                          {formatCurrency(subtotal, language)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-ink-muted">
                          {t('common.vat')} (16%)
                        </span>
                        <span className="font-medium text-ink">
                          {formatCurrency(vat, language)}
                        </span>
                      </div>
                      <div className="h-px bg-gray-100" />
                      <div className="flex items-center justify-between">
                        <span className="font-display font-bold text-base text-ink">
                          {t('common.total')}
                        </span>
                        <span className="font-display font-extrabold text-2xl text-gradient">
                          {formatCurrency(total, language)}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => router.push('/finalizar-compra')}
                      className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 rounded-full font-semibold text-white bg-gradient-to-r from-primary-500 to-pink-500 shadow-xl shadow-primary-500/30 hover:shadow-primary-500/50 transition-all duration-300 hover:-translate-y-1"
                    >
                      <i className="bi bi-credit-card-fill" />
                      {t('cart.checkout')}
                    </button>

                    <Link
                      href="/planes"
                      className="mt-3 w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium text-primary-600 border-2 border-primary-500 hover:bg-primary-50 transition-all duration-300 text-sm"
                    >
                      <i className="bi bi-arrow-left" />
                      {t('cart.continueShopping')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SectionReveal>
        )}
      </div>
    </section>
  );
}