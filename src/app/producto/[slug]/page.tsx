'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { getProductBySlug, PRODUCTS } from '@/lib/products';
import { formatNumber } from '@/lib/utils';
import QuantityInput from '@/components/ui/QuantityInput';
import SectionReveal from '@/components/ui/SectionReveal';
import Blobs from '@/components/ui/Blobs';

export default function ProductPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = params?.slug as string;

  const { t, tArray, language } = useLanguage();
  const { addItem } = useCart();
  const { showToast } = useToast();

  const product = getProductBySlug(slug);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <section className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-6">
            <i className="bi bi-box-seam text-primary-400 text-4xl" />
          </div>
          <h1 className="font-display font-bold text-3xl text-ink mb-3">
            {t('product.notFound')}
          </h1>
          <p className="text-ink-muted mb-8">{t('product.notFoundDesc')}</p>
          <Link href="/planes" className="btn-primary">
            <i className="bi bi-grid" />
            {t('home.services.viewPlans')}
          </Link>
        </div>
      </section>
    );
  }

  const features = tArray(product.featuresKey);
  const productName = t(product.nameKey);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      slug: product.slug,
      nameKey: product.nameKey,
      price: product.price,
      quantity,
    });

    showToast({
      type: 'success',
      message: t('cart.productAdded', { product: productName }),
      actionLabel: t('cart.viewCart'),
      onAction: () => router.push('/carrito'),
      duration: 6000,
    });
  };

  // Sugeridos: tomar 3 productos distintos
  const related = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <>
      {/* ==================== PRODUCTO PRINCIPAL ==================== */}
      <section className="relative pt-28 md:pt-32 pb-16 overflow-hidden">
        <Blobs variant="pastel" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <SectionReveal>
            <nav className="flex items-center gap-2 text-xs text-ink-muted mb-8">
              <Link href="/" className="hover:text-primary-600 transition-colors">
                {t('header.home')}
              </Link>
              <i className="bi bi-chevron-right text-[10px]" />
              <Link href="/planes" className="hover:text-primary-600 transition-colors">
                {t('header.plans')}
              </Link>
              <i className="bi bi-chevron-right text-[10px]" />
              <span className="text-primary-600 font-medium">{productName}</span>
            </nav>
          </SectionReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Imagen */}
            <SectionReveal>
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl shadow-primary-500/20 bg-gradient-to-br from-primary-100 via-pink-100 to-amber-100">
                <Image
                  src={`/images/products/${product.slug}.jpg`}
                  alt={productName}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  onError={(e) => {
                    // Fallback silencioso
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                {/* Overlay decorativo con logo */}
                <div className="absolute inset-0 flex items-center justify-center opacity-15">
                  <div className="relative w-40 h-40">
                    <Image src="/logo.svg" alt="" fill className="object-contain" />
                  </div>
                </div>

                {/* Badge "+IVA" */}
                <span className="absolute top-5 left-5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-xs font-bold uppercase tracking-wider text-ink shadow-md">
                  {t('common.plusVat')}
                </span>
              </div>
            </SectionReveal>

            {/* Detalles */}
            <SectionReveal delay={150}>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-xs font-medium uppercase tracking-widest text-primary-600 mb-5">
                <i className="bi bi-patch-check-fill" />
                CircuitoDigital
              </span>

              <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-ink mb-4 leading-tight">
                {productName}
              </h1>

              {/* Precio */}
              <div className="flex items-baseline gap-2 mb-8">
                <span className="font-display font-extrabold text-4xl md:text-5xl text-gradient">
                  ${formatNumber(product.price, language)}
                </span>
                <span className="text-base font-semibold text-ink-muted">
                  {t('common.currency')}
                </span>
                <span className="text-sm font-bold text-ink-muted uppercase tracking-wider ml-1">
                  {t('common.plusVat')}
                </span>
              </div>

              {/* Cantidad + Agregar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-ink-muted">
                    {t('product.quantity')}
                  </label>
                  <QuantityInput value={quantity} onChange={setQuantity} min={1} />
                </div>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-semibold text-white bg-gradient-to-r from-primary-500 to-pink-500 shadow-xl shadow-primary-500/30 hover:shadow-primary-500/50 transition-all duration-300 hover:-translate-y-1"
                >
                  <i className="bi bi-cart-plus text-lg" />
                  {t('product.addToCart')}
                </button>
              </div>

              {/* Features */}
              <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
                <h2 className="font-display font-bold text-lg text-ink mb-4 flex items-center gap-2">
                  <i className="bi bi-list-check text-primary-500" />
                  {t('plans.features')}
                </h2>
                <ul className="space-y-3">
                  {features.map((f, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm text-ink-soft leading-snug"
                    >
                      <i className="bi bi-check2-circle text-primary-500 mt-0.5 shrink-0 text-base" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* ==================== PRODUCTOS RELACIONADOS ==================== */}
      <section className="relative py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-ink text-center mb-10">
              {t('home.services.viewPlans')}
            </h2>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((p, i) => {
              const name = t(p.nameKey);
              return (
                <SectionReveal key={p.id} delay={i * 80}>
                  <Link
                    href={`/producto/${p.slug}`}
                    className="group block h-full rounded-3xl bg-white border border-gray-100 overflow-hidden hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary-500/15 transition-all duration-500"
                  >
                    <div className="relative h-40 bg-gradient-to-br from-primary-100 to-pink-100">
                      <Image
                        src={`/images/products/${p.slug}.jpg`}
                        alt={name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-display font-bold text-lg text-ink mb-2 group-hover:text-primary-600 transition-colors">
                        {name}
                      </h3>
                      <div className="flex items-baseline gap-1">
                        <span className="font-display font-extrabold text-xl text-gradient">
                          ${formatNumber(p.price, language)}
                        </span>
                        <span className="text-xs text-ink-muted">
                          {t('common.currency')}
                        </span>
                      </div>
                    </div>
                  </Link>
                </SectionReveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}