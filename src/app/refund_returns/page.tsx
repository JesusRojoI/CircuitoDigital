'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import SectionReveal from '@/components/ui/SectionReveal';
import Blobs from '@/components/ui/Blobs';

export default function RefundReturnsPage() {
  const { t, tArray } = useLanguage();

  return (
    <section className="relative pt-28 md:pt-32 pb-20 overflow-hidden">
      <Blobs variant="pastel" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título */}
        <SectionReveal>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-ink mb-10">
            {t('refunds.title')}
          </h1>
        </SectionReveal>

        <SectionReveal delay={100}>
          <div className="rounded-3xl bg-white border border-gray-100 p-6 md:p-10 shadow-xl shadow-primary-500/5 space-y-8 text-sm md:text-base text-ink-soft leading-relaxed">

            {/* Intro */}
            <p>{t('refunds.intro')}</p>
            <p className="font-medium">{t('refunds.suggestion')}</p>

            {/* Objetivo */}
            <div>
              <h2 className="font-display font-bold text-xl md:text-2xl text-ink mb-4">
                {t('refunds.objective.title')}
              </h2>
              <p className="mb-4">{t('refunds.objective.text')}</p>
              <p>{t('refunds.objective.scope')}</p>
            </div>

            {/* Condiciones */}
            <div>
              <h2 className="font-display font-bold text-xl md:text-2xl text-ink mb-4">
                {t('refunds.conditions.title')}
              </h2>
              <p className="mb-4">{t('refunds.conditions.intro')}</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                {tArray('refunds.conditions.items').map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <p>{t('refunds.conditions.period')}</p>
            </div>

            {/* Procedimiento */}
            <div>
              <h2 className="font-display font-bold text-xl md:text-2xl text-ink mb-4">
                {t('refunds.procedure.title')}
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                {tArray('refunds.procedure.items').map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Forma de reembolso */}
            <div>
              <h2 className="font-display font-bold text-xl md:text-2xl text-ink mb-4">
                {t('refunds.refundMethod.title')}
              </h2>
              <p>{t('refunds.refundMethod.text')}</p>
            </div>

            {/* Exclusiones */}
            <div>
              <h2 className="font-display font-bold text-xl md:text-2xl text-ink mb-4">
                {t('refunds.exclusions.title')}
              </h2>
              <p className="mb-4">{t('refunds.exclusions.intro')}</p>
              <ul className="list-disc pl-6 space-y-2">
                {tArray('refunds.exclusions.items').map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Modificaciones */}
            <div>
              <h2 className="font-display font-bold text-xl md:text-2xl text-ink mb-4">
                {t('refunds.modifications.title')}
              </h2>
              <p>{t('refunds.modifications.text')}</p>
            </div>

            {/* Contacto */}
            <div>
              <h2 className="font-display font-bold text-xl md:text-2xl text-ink mb-4">
                {t('refunds.contact.title')}
              </h2>
              <p className="mb-4">{t('refunds.contact.text')}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t('refunds.contact.email')}</li>
                <li>{t('refunds.contact.phone')}</li>
                <li>{t('refunds.contact.address')}</li>
              </ul>
            </div>

          </div>
        </SectionReveal>
      </div>
    </section>
  );
}