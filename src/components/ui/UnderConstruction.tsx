'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import Blobs from '@/components/ui/Blobs';
import SectionReveal from '@/components/ui/SectionReveal';

interface Props {
  titleKey: string;
  constructionKey: string;
}

export default function UnderConstruction({ titleKey, constructionKey }: Props) {
  const { t } = useLanguage();

  return (
    <section className="relative pt-32 md:pt-40 pb-24 min-h-[75vh] overflow-hidden">
      <Blobs variant="violet" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <SectionReveal>
          <div className="relative w-28 h-28 mx-auto mb-8">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary-500 to-pink-500 shadow-2xl shadow-primary-500/40 rotate-6 animate-float" />
            <div className="absolute inset-0 flex items-center justify-center">
              <i className="bi bi-tools text-white text-5xl" />
            </div>
          </div>
        </SectionReveal>

        <SectionReveal delay={100}>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-ink mb-6">
            {t(titleKey)}
          </h1>
        </SectionReveal>

        <SectionReveal delay={200}>
          <p className="text-base md:text-lg text-ink-muted leading-relaxed mb-10 max-w-xl mx-auto">
            {t(constructionKey)}
          </p>
        </SectionReveal>

        <SectionReveal delay={300}>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white bg-gradient-to-r from-primary-500 to-pink-500 shadow-xl shadow-primary-500/30 hover:shadow-primary-500/50 transition-all duration-300 hover:-translate-y-1"
          >
            <i className="bi bi-arrow-left" />
            {t('success.backToMenu')}
          </Link>
        </SectionReveal>
      </div>
    </section>
  );
}