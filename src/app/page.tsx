'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import Marquee from '@/components/ui/Marquee';
import SectionReveal from '@/components/ui/SectionReveal';
import Blobs from '@/components/ui/Blobs';
import { cn } from '@/lib/utils';

/* ============ Servicios (imágenes alternan cada 5s) ============ */
const SERVICES = [
  {
    key: 'home.services.webDesign',
    image: '/images/service-web.jpg',
    titleKey: 'home.services.webDesign',
  },
  {
    key: 'home.services.mobileApps',
    image: '/images/service-mobile.jpg',
    titleKey: 'home.services.mobileApps',
  },
];

function ServicesCarousel() {
  const { t } = useLanguage();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((v) => (v + 1) % SERVICES.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative">
      <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl shadow-primary-500/20">
        {SERVICES.map((s, i) => (
          <div
            key={s.key}
            className={cn(
              'absolute inset-0 transition-opacity duration-1000 ease-out',
              i === active ? 'opacity-100' : 'opacity-0'
            )}
          >
            <Image
              src={s.image}
              alt={t(s.titleKey)}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />
          </div>
        ))}

        {/* Indicador del servicio actual */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-gradient-to-br from-primary-500 to-pink-500 animate-pulse" />
            <span className="text-sm font-medium text-ink">
              {t(SERVICES[active].titleKey)}
            </span>
          </div>
        </div>

        {/* Dots */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {SERVICES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                'w-2 rounded-full transition-all duration-300',
                i === active
                  ? 'h-8 bg-white'
                  : 'h-2 bg-white/50 hover:bg-white/80'
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============ Página principal ============ */
export default function HomePage() {
  const { t, tArray } = useLanguage();
  const marqueeItems = tArray('home.marquee.items');

  return (
    <>
      {/* ==================== SECCIÓN 1: HERO ==================== */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Imagen de fondo */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/hero-home.jpg"
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-ink/85 via-primary-900/75 to-pink-900/60" />
        </div>

        {/* Adornos */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary-500/20 blur-3xl animate-float" />
        <div
          className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-pink-500/20 blur-3xl animate-float"
          style={{ animationDelay: '1.5s' }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-white">
          <div className="max-w-3xl">
            <SectionReveal>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium uppercase tracking-widest mb-6">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                CircuitoDigital
              </span>
            </SectionReveal>

            <SectionReveal delay={100}>
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-6">
                {t('home.hero.title')}
              </h1>
            </SectionReveal>

            <SectionReveal delay={200}>
              <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mb-10 leading-relaxed">
                {t('home.hero.subtitle')}
              </p>
            </SectionReveal>

            <SectionReveal delay={300}>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/planes"
                  className="group inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-white bg-gradient-to-r from-primary-500 to-pink-500 shadow-2xl shadow-primary-500/40 hover:shadow-primary-500/60 transition-all duration-300 hover:-translate-y-1"
                >
                  <i className="bi bi-rocket-takeoff text-lg" />
                  <span>{t('home.hero.cta')}</span>
                  <i className="bi bi-arrow-right transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </SectionReveal>
          </div>
        </div>

        {/* Curva decorativa inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#FAFAFB] rounded-t-[50%] scale-x-125" />
      </section>

      {/* ==================== SECCIÓN 2: MARQUEE + SOLUCIONES ==================== */}
      <section className="relative py-16 md:py-24">
        <Blobs variant="pastel" />

        {/* Marquesina */}
        <div className="relative bg-gradient-to-r from-primary-50 via-pink-50 to-amber-50 py-8 border-y border-primary-100/50">
          <Marquee
            items={marqueeItems}
            speed={30}
            itemClassName="font-display font-bold text-3xl md:text-5xl text-gradient"
          />
        </div>

        {/* Contenido */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center">
            {/* Izquierda 60%: texto */}
            <SectionReveal className="lg:col-span-3">
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-ink leading-tight mb-8">
                {t('home.solutions.title')}
              </h2>
              <p className="text-base sm:text-lg text-ink-muted leading-relaxed mb-10 max-w-xl">
                {t('home.innovation.text')}
              </p>
              <Link
                href="/contacto"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-white bg-gradient-to-r from-primary-500 to-pink-500 shadow-xl shadow-primary-500/30 hover:shadow-primary-500/50 transition-all duration-300 hover:-translate-y-1"
              >
                <i className="bi bi-chat-dots text-lg" />
                <span>{t('home.solutions.cta')}</span>
                <i className="bi bi-arrow-right transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </SectionReveal>

            {/* Derecha 40%: imagen */}
            <SectionReveal delay={150} className="lg:col-span-2">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl shadow-primary-500/20 rotate-2 hover:rotate-0 transition-transform duration-700">
                <Image
                  src="/images/solutions.jpg"
                  alt="Solutions"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/40 to-transparent" />
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* ==================== SECCIÓN 3: SERVICIOS ==================== */}
      <section className="relative py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header de la sección */}
          <SectionReveal>
            <div className="flex items-end justify-between gap-6 mb-12 md:mb-16">
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-ink">
                {t('home.services.title')}
              </h2>
              <Link
                href="/planes"
                className="group hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-primary-600 relative"
              >
                <span className="relative">
                  {t('home.services.viewPlans')}
                  <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-pink-500 rounded-full origin-left scale-x-100 transition-transform duration-300 group-hover:scale-x-110" />
                </span>
                <i className="bi bi-arrow-up-right transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </SectionReveal>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
            {/* Columna izquierda 40%: carrusel */}
            <SectionReveal className="lg:col-span-2">
              <ServicesCarousel />
            </SectionReveal>

            {/* Columna derecha 60%: servicios */}
            <div className="lg:col-span-3 space-y-10">
              {/* Servicio 01 */}
              <SectionReveal delay={100}>
                <div className="group relative pl-8 border-l-2 border-primary-100 hover:border-primary-400 transition-colors duration-300">
                  <span className="absolute -left-5 top-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-pink-500 text-white font-display font-bold text-sm flex items-center justify-center shadow-lg shadow-primary-500/30">
                    01
                  </span>
                  <h3 className="font-display font-bold text-2xl md:text-3xl text-ink mb-3 group-hover:text-primary-600 transition-colors">
                    {t('home.services.webDesign')}
                  </h3>
                  <p className="text-ink-muted leading-relaxed">
                    {t('home.services.webDesignDesc')}
                  </p>
                </div>
              </SectionReveal>

              {/* Servicio 02 */}
              <SectionReveal delay={200}>
                <div className="group relative pl-8 border-l-2 border-primary-100 hover:border-primary-400 transition-colors duration-300">
                  <span className="absolute -left-5 top-0 w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-amber-500 text-white font-display font-bold text-sm flex items-center justify-center shadow-lg shadow-pink-500/30">
                    02
                  </span>
                  <h3 className="font-display font-bold text-2xl md:text-3xl text-ink mb-3 group-hover:text-primary-600 transition-colors">
                    {t('home.services.mobileApps')}
                  </h3>
                  <p className="text-ink-muted leading-relaxed">
                    {t('home.services.mobileAppsDesc')}
                  </p>
                </div>
              </SectionReveal>

              {/* Enlace móvil a planes */}
              <SectionReveal delay={300}>
                <Link
                  href="/planes"
                  className="sm:hidden inline-flex items-center gap-2 text-sm font-semibold text-primary-600 underline decoration-2 underline-offset-4"
                >
                  {t('home.services.viewPlans')}
                  <i className="bi bi-arrow-up-right" />
                </Link>
              </SectionReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SECCIÓN 4: INNOVACIÓN ==================== */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Fondo */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/innovation.jpg"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-ink/90 via-primary-900/80 to-pink-900/70" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <SectionReveal>
            <i className="bi bi-lightbulb text-4xl md:text-5xl text-primary-300 mb-6 inline-block animate-float" />
          </SectionReveal>
          <SectionReveal delay={100}>
            <p className="font-display font-medium text-xl sm:text-2xl md:text-3xl leading-relaxed md:leading-relaxed text-white/90">
              {t('home.innovation.text')}
            </p>
          </SectionReveal>
        </div>
      </section>
    </>
  );
}