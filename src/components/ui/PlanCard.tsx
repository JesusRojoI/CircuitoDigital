'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { cn, formatNumber } from '@/lib/utils';

interface PlanCardProps {
  productSlug: string;
  nameKey: string;
  price: number;
  featuresKey: string;
  featured?: boolean;
  accentIndex?: number;
  className?: string;
}

const ACCENTS = [
  { bg: 'from-pastel-red to-pastel-orange', dot: 'bg-pastel-red' },
  { bg: 'from-pastel-orange to-pastel-yellow', dot: 'bg-pastel-orange' },
  { bg: 'from-pastel-green to-pastel-blue', dot: 'bg-pastel-green' },
  { bg: 'from-pastel-blue to-pastel-indigo', dot: 'bg-pastel-blue' },
  { bg: 'from-pastel-indigo to-pastel-violet', dot: 'bg-pastel-indigo' },
  { bg: 'from-pastel-violet to-pastel-pink', dot: 'bg-pastel-violet' },
  { bg: 'from-pastel-pink to-pastel-red', dot: 'bg-pastel-pink' },
  { bg: 'from-primary-400 to-pink-400', dot: 'bg-primary-400' },
];

export default function PlanCard({
  productSlug,
  nameKey,
  price,
  featuresKey,
  featured,
  accentIndex = 0,
  className,
}: PlanCardProps) {
  const { t, tArray, language } = useLanguage();
  const features = tArray(featuresKey);
  const accent = ACCENTS[accentIndex % ACCENTS.length];

  return (
    <div
      className={cn(
        'group relative flex flex-col h-full rounded-3xl bg-white border border-gray-100 overflow-hidden',
        'transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary-500/15',
        featured && 'ring-2 ring-primary-400 shadow-xl shadow-primary-500/10',
        className
      )}
    >
      {/* Círculo decorativo difuminado (reemplaza el borde superior) */}
      <div
        className={cn(
          'absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br opacity-30 blur-2xl pointer-events-none transition-opacity duration-500 group-hover:opacity-50',
          accent.bg
        )}
      />

      {/* Badge "Popular" */}
      {featured && (
        <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white bg-gradient-to-r from-primary-500 to-pink-500 shadow-md z-10">
          ★ Popular
        </span>
      )}

      <div className="relative p-6 md:p-7 flex flex-col flex-1">
        {/* Nombre con puntito de color */}
        <div className="flex items-center gap-3 mb-4">
          <span
            className={cn(
              'w-3 h-3 rounded-full shrink-0 shadow-sm',
              accent.dot
            )}
          />
          <h3 className="font-display font-bold text-lg md:text-xl text-ink">
            {t(nameKey)}
          </h3>
        </div>

        {/* Precio */}
        <div className="mb-5 pb-5 border-b border-gray-100">
          <div className="flex items-baseline gap-1">
            <span className="font-display font-extrabold text-3xl md:text-4xl text-ink">
              ${formatNumber(price, language)}
            </span>
            <span className="text-xs font-semibold text-ink-muted ml-1">
              {t('common.currency')}
            </span>
          </div>
          <p className="text-xs font-medium text-ink-muted mt-1 uppercase tracking-wider">
            {t('common.plusVat')}
          </p>
        </div>

        {/* Botón Contratar */}
        <Link
          href={`/producto/${productSlug}`}
          className={cn(
            'w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-sm mb-6',
            'transition-all duration-300',
            featured
              ? 'text-white bg-gradient-to-r from-primary-500 to-pink-500 shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-0.5'
              : 'text-primary-600 border-2 border-primary-500 hover:bg-primary-50 hover:-translate-y-0.5'
          )}
        >
          <i className="bi bi-bag-plus" />
          {t('plans.hire')}
        </Link>

        {/* Features */}
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-3">
            {t('plans.features')}
          </p>
          <ul className="space-y-2.5">
            {features.map((f, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-ink-soft leading-snug">
                <i className="bi bi-check2-circle mt-0.5 shrink-0 text-base text-primary-500" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}