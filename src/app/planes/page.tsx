'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { PRODUCTS } from '@/lib/products';
import Marquee from '@/components/ui/Marquee';
import SectionReveal from '@/components/ui/SectionReveal';
import PlanCard from '@/components/ui/PlanCard';
import Blobs from '@/components/ui/Blobs';

// Grupos de planes según el documento
const GROUP_1 = [
  'plan-express',
  'plan-inicio',
  'plan-basico-plus',
  'paquete-esencial',
  'paquete-inicial',
  'paquete-avanzado',
  'paquete-profesional',
  'paquete-empresarial',
  'paquete-corporativo',
  'paquete-premium',
];

const GROUP_2 = ['paquete-elite', 'paquete-vip', 'paquete-ejecutivo'];
const GROUP_3 = ['plan-pro', 'plan-master', 'plan-elite-plus'];

export default function PlanesPage() {
  const { t, tArray, language } = useLanguage();
  const marqueeItems = tArray('plans.marquee');

  const bySlug = (slug: string) => PRODUCTS.find((p) => p.slug === slug);

  return (
    <>
      {/* ==================== SECCIÓN 1: TÍTULO + MARQUEE ==================== */}
      <section className="relative pt-28 md:pt-32 pb-6 overflow-hidden">
        <Blobs variant="violet" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionReveal>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 text-xs font-medium uppercase tracking-widest text-primary-600 mb-6">
              <i className="bi bi-grid-3x3-gap-fill" />
              CircuitoDigital
            </span>
          </SectionReveal>
          <SectionReveal delay={100}>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-ink mb-8">
              {t('plans.title')}
            </h1>
          </SectionReveal>
        </div>

        <div className="relative bg-gradient-to-r from-primary-50 via-pink-50 to-amber-50 py-6 border-y border-primary-100/50">
          <Marquee
            items={marqueeItems}
            speed={28}
            itemClassName="font-display font-bold text-2xl md:text-4xl text-gradient"
          />
        </div>
      </section>

      {/* ==================== SECCIÓN 2: GRUPO 1 DE PLANES ==================== */}
      <section className="relative py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-ink text-center mb-12">
              {t('plans.pricing')}
            </h2>
          </SectionReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {GROUP_1.map((slug, i) => {
              const p = bySlug(slug);
              if (!p) return null;
              return (
                <SectionReveal key={slug} delay={i * 50}>
                  <PlanCard
                    productSlug={p.slug}
                    nameKey={p.nameKey}
                    price={p.price}
                    featuresKey={p.featuresKey}
                    accentIndex={i}
                    featured={slug === 'paquete-avanzado'}
                  />
                </SectionReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== SECCIÓN 3: NOS APASIONA ASISTIR ==================== */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-primary-50/60 via-white to-pink-50/60 overflow-hidden">
        <Blobs variant="pastel" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Imagen 50% */}
            <SectionReveal>
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-primary-500/20 -rotate-2 hover:rotate-0 transition-transform duration-700">
                <Image
                  src="/images/plans-assist.jpg"
                  alt={t('plans.assist.title')}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/30 to-transparent" />
              </div>
            </SectionReveal>

            {/* Contenido 50% */}
            <SectionReveal delay={150}>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-primary-100 text-xs font-medium uppercase tracking-widest text-primary-600 mb-5">
                <i className="bi bi-headset" />
                Support
              </span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-ink mb-6 leading-tight">
                {t('plans.assist.title')}
              </h2>
              <p className="text-base text-ink-soft leading-relaxed mb-4">
                {t('plans.assist.text')}
              </p>
              <p className="text-base text-ink-muted leading-relaxed mb-8">
                {t('plans.assist.text2')}
              </p>
              <Link
                href="/personalizado"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-white bg-gradient-to-r from-primary-500 to-pink-500 shadow-xl shadow-primary-500/30 hover:shadow-primary-500/50 transition-all duration-300 hover:-translate-y-1"
              >
                <i className="bi bi-chat-square-text text-lg" />
                <span>{t('plans.assist.cta')}</span>
                <i className="bi bi-arrow-right transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* ==================== SECCIÓN 4: GRUPO 2 DE PLANES ==================== */}
      <section className="relative py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {GROUP_2.map((slug, i) => {
              const p = bySlug(slug);
              if (!p) return null;
              return (
                <SectionReveal key={slug} delay={i * 80}>
                  <PlanCard
                    productSlug={p.slug}
                    nameKey={p.nameKey}
                    price={p.price}
                    featuresKey={p.featuresKey}
                    accentIndex={i + 3}
                  />
                </SectionReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== SECCIÓN 5: ENCUENTRA EL PLAN PERFECTO ==================== */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/plans-perfect.jpg"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-ink/90 via-primary-900/75 to-pink-900/65" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <SectionReveal>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium uppercase tracking-widest mb-6">
              <i className="bi bi-stars" />
              Discover
            </span>
          </SectionReveal>
          <SectionReveal delay={100}>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
              {t('plans.perfect.title')}
            </h2>
          </SectionReveal>
          <SectionReveal delay={200}>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed max-w-3xl mx-auto">
              {t('plans.perfect.text')}
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* ==================== SECCIÓN 6: GRUPO 3 DE PLANES ==================== */}
      <section className="relative py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {GROUP_3.map((slug, i) => {
              const p = bySlug(slug);
              if (!p) return null;
              return (
                <SectionReveal key={slug} delay={i * 80}>
                  <PlanCard
                    productSlug={p.slug}
                    nameKey={p.nameKey}
                    price={p.price}
                    featuresKey={p.featuresKey}
                    accentIndex={i + 5}
                    featured={slug === 'plan-master'}
                  />
                </SectionReveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}