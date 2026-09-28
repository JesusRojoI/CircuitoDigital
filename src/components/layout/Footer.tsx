'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative bg-ink text-white overflow-hidden">
      {/* Adornos */}
      <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-primary-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-pink-500/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          {/* Columna 1 */}
          <div>
            <h3 className="font-display font-bold text-2xl md:text-3xl text-white mb-5 leading-tight">
              {t('footer.tagline')}
            </h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-3">
                <i className="bi bi-geo-alt-fill text-primary-400 mt-0.5 shrink-0" />
                <span>{t('footer.address')}</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="bi bi-telephone-fill text-primary-400 shrink-0" />
                <span>{t('footer.phone')}</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="bi bi-envelope-fill text-primary-400 shrink-0" />
                <span>{t('footer.email')}</span>
              </li>
            </ul>
          </div>

          {/* Columna 2 */}
          <div className="md:pl-10">
            <h4 className="font-display font-semibold text-lg text-white mb-5">
              Links
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { href: '/aviso-privacidad', key: 'footer.privacy' },
                { href: '/terminos-y-condiciones', key: 'footer.terms' },
                { href: '/refund_returns', key: 'footer.refunds' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-2 text-white/70 hover:text-primary-300 transition-colors group"
                  >
                    <i className="bi bi-arrow-right text-xs transition-transform duration-300 group-hover:translate-x-1" />
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divisor */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 brightness-0 invert">
              <Image
                src="/logo.svg"
                alt="CircuitoDigital"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-display font-bold text-lg text-white">
              CircuitoDigital
            </span>
          </div>

          {/* Copyright */}
          <p className="text-xs text-white/50 text-center order-3 md:order-2">
            {t('footer.copyright')}
          </p>

          {/* Métodos de pago */}
          <div className="flex items-center gap-3 order-2 md:order-3">
            <div className="relative w-10 h-7">
              <Image src="/visa.svg" alt="Visa" fill className="object-contain" />
            </div>
            <div className="relative w-10 h-7">
              <Image src="/mastercard.svg" alt="Mastercard" fill className="object-contain" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}