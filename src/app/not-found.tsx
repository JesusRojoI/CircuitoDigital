'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import Blobs from '@/components/ui/Blobs';

export default function NotFound() {
  const { t, language } = useLanguage();

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-20">
      <Blobs variant="pastel" />

      <div className="relative max-w-xl mx-auto px-4 text-center">
        <p className="font-display font-extrabold text-8xl md:text-9xl text-gradient mb-4">
          404
        </p>
        <h1 className="font-display font-bold text-2xl md:text-3xl text-ink mb-4">
          {language === 'en' ? 'Page not found' : 'Página no encontrada'}
        </h1>
        <p className="text-ink-muted mb-10">
          {language === 'en'
            ? 'The page you are looking for does not exist or has been moved.'
            : 'La página que buscas no existe o ha sido movida.'}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white bg-gradient-to-r from-primary-500 to-pink-500 shadow-xl shadow-primary-500/30 hover:shadow-primary-500/50 transition-all duration-300 hover:-translate-y-1"
        >
          <i className="bi bi-house-door" />
          {t('success.backToMenu')}
        </Link>
      </div>
    </section>
  );
}