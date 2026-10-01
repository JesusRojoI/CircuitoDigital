'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import SectionReveal from '@/components/ui/SectionReveal';
import Blobs from '@/components/ui/Blobs';

export default function AvisoPrivacidadPage() {
  const { t, tArray } = useLanguage();

  return (
    <section className="relative pt-28 md:pt-32 pb-20 overflow-hidden">
      <Blobs variant="pastel" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título */}
        <SectionReveal>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-ink mb-10">
            {t('privacy.title')}
          </h1>
        </SectionReveal>

        <SectionReveal delay={100}>
          <div className="rounded-3xl bg-white border border-gray-100 p-6 md:p-10 shadow-xl shadow-primary-500/5 space-y-8 text-sm md:text-base text-ink-soft leading-relaxed">

            {/* Intro */}
            <p>{t('privacy.intro')}</p>

            {/* Fines */}
            <div>
              <h2 className="font-display font-bold text-xl md:text-2xl text-ink mb-4">
                {t('privacy.purposes.title')}
              </h2>
              <p className="mb-4">{t('privacy.purposes.intro')}</p>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                {tArray('privacy.purposes.list').map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <p className="mb-4">{t('privacy.purposes.secondary')}</p>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                {tArray('privacy.purposes.secondaryList').map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <p className="mb-4">{t('privacy.purposes.optOut')}</p>
              <p>{t('privacy.purposes.collection')}</p>
            </div>

            {/* Qué datos */}
            <div>
              <h2 className="font-display font-bold text-xl md:text-2xl text-ink mb-4">
                {t('privacy.whatData.title')}
              </h2>
              <p className="mb-4">{t('privacy.whatData.intro')}</p>
              <ul className="list-disc pl-6 space-y-2">
                {tArray('privacy.whatData.list').map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Compartir */}
            <div>
              <h2 className="font-display font-bold text-xl md:text-2xl text-ink mb-4">
                {t('privacy.sharing.title')}
              </h2>
              <p className="mb-4">{t('privacy.sharing.intro')}</p>
              <p className="mb-4">{t('privacy.sharing.consent')}</p>
              <p className="mb-4">{t('privacy.sharing.commitment')}</p>
              <p className="mb-4">{t('privacy.sharing.abroad')}</p>
              <p>{t('privacy.sharing.mechanism')}</p>
            </div>

            {/* ARCO */}
            <div>
              <h2 className="font-display font-bold text-xl md:text-2xl text-ink mb-4">
                {t('privacy.arco.title')}
              </h2>
              <p className="mb-4">{t('privacy.arco.intro')}</p>
              <p className="mb-4">{t('privacy.arco.procedure')}</p>
              <p className="mb-6">{t('privacy.arco.requirements')}</p>

              {/* Items a) - e) */}
              <div className="space-y-5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i}>
                    <p className="font-semibold text-ink mb-1">
                      {t(`privacy.arco.items.${i}.label`)}{' '}
                      {t(`privacy.arco.items.${i}.title`)}
                    </p>
                    <p>{t(`privacy.arco.items.${i}.text`)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Revocar */}
            <div>
              <h2 className="font-display font-bold text-xl md:text-2xl text-ink mb-4">
                {t('privacy.revoke.title')}
              </h2>
              <p>{t('privacy.revoke.text')}</p>
            </div>

            {/* Limitar */}
            <div>
              <h2 className="font-display font-bold text-xl md:text-2xl text-ink mb-4">
                {t('privacy.limit.title')}
              </h2>
              <p>{t('privacy.limit.text')}</p>
            </div>

            {/* Tecnologías */}
            <div>
              <h2 className="font-display font-bold text-xl md:text-2xl text-ink mb-4">
                {t('privacy.technologies.title')}
              </h2>
              <p className="mb-4">{t('privacy.technologies.intro')}</p>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                {tArray('privacy.technologies.purposes').map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <p className="mb-4">{t('privacy.technologies.dataIntro')}</p>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                {tArray('privacy.technologies.dataList').map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <p>{t('privacy.technologies.disable')}</p>
            </div>

            {/* Cambios */}
            <div>
              <h2 className="font-display font-bold text-xl md:text-2xl text-ink mb-4">
                {t('privacy.changes.title')}
              </h2>
              <p className="mb-4">{t('privacy.changes.intro')}</p>
              <p className="mb-4">{t('privacy.changes.notification')}</p>
              <p>{t('privacy.changes.compliance')}</p>
            </div>

            {/* Contacto */}
            <div>
              <h2 className="font-display font-bold text-xl md:text-2xl text-ink mb-4">
                {t('privacy.contact.title')}
              </h2>
              <p>{t('privacy.contact.text')}</p>
            </div>

          </div>
        </SectionReveal>
      </div>
    </section>
  );
}