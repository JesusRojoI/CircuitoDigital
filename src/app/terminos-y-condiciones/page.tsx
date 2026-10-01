'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import SectionReveal from '@/components/ui/SectionReveal';
import Blobs from '@/components/ui/Blobs';

export default function TerminosPage() {
  const { t, tArray } = useLanguage();

  return (
    <section className="relative pt-28 md:pt-32 pb-20 overflow-hidden">
      <Blobs variant="pastel" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título */}
        <SectionReveal>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-ink mb-10">
            {t('terms.title')}
          </h1>
        </SectionReveal>

        <SectionReveal delay={100}>
          <div className="rounded-3xl bg-white border border-gray-100 p-6 md:p-10 shadow-xl shadow-primary-500/5 space-y-8 text-sm md:text-base text-ink-soft leading-relaxed">

            {/* Intro */}
            <p>{t('terms.intro')}</p>
            <p>{t('terms.acceptance')}</p>
            <p>{t('terms.access')}</p>

            {/* Objeto */}
            <div>
              <h2 className="font-display font-bold text-xl md:text-2xl text-ink mb-4">
                {t('terms.object.title')}
              </h2>
              <p className="mb-4">{t('terms.object.text')}</p>
              <p className="mb-4">{t('terms.object.servicesIntro')}</p>
              <ul className="list-disc pl-6 space-y-2">
                {tArray('terms.object.services').map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Planes */}
            <div>
              <h2 className="font-display font-bold text-xl md:text-2xl text-ink mb-4">
                {t('terms.plans.title')}
              </h2>
              <p>{t('terms.plans.text')}</p>
            </div>

            {/* Métodos de pago */}
            <div>
              <h2 className="font-display font-bold text-xl md:text-2xl text-ink mb-4">
                {t('terms.payment.title')}
              </h2>
              <p className="mb-4">{t('terms.payment.intro')}</p>
              <ul className="list-disc pl-6 space-y-2">
                {tArray('terms.payment.methods').map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Privacidad */}
            <div>
              <h2 className="font-display font-bold text-xl md:text-2xl text-ink mb-4">
                {t('terms.privacySection.title')}
              </h2>
              <p>{t('terms.privacySection.text')}</p>
            </div>

            {/* Pago seguro */}
            <div>
              <h2 className="font-display font-bold text-xl md:text-2xl text-ink mb-4">
                {t('terms.securePayment.title')}
              </h2>
              <p>{t('terms.securePayment.text')}</p>
            </div>

            {/* Propiedad intelectual */}
            <div>
              <h2 className="font-display font-bold text-xl md:text-2xl text-ink mb-4">
                {t('terms.ip.title')}
              </h2>
              <p className="mb-4">{t('terms.ip.intro')}</p>
              <p className="mb-4">{t('terms.ip.content')}</p>
              <p>{t('terms.ip.brands')}</p>
            </div>

            {/* Licencia */}
            <div>
              <h2 className="font-display font-bold text-xl md:text-2xl text-ink mb-4">
                {t('terms.license.title')}
              </h2>
              <p className="mb-4">{t('terms.license.intro')}</p>
              <p className="mb-4">{t('terms.license.prohibitions')}</p>
              <p className="mb-4">{t('terms.license.notificationIntro')}</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                {tArray('terms.license.notificationItems').map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <p>{t('terms.license.warning')}</p>
            </div>

            {/* Limitación de responsabilidad */}
            <div>
              <h2 className="font-display font-bold text-xl md:text-2xl text-ink mb-4">
                {t('terms.liability.title')}
              </h2>
              <p className="mb-4">{t('terms.liability.intro')}</p>
              <p className="mb-4">{t('terms.liability.asIs')}</p>
              <p className="mb-4">{t('terms.liability.damages')}</p>
              <p className="mb-4">{t('terms.liability.notResponsibleIntro')}</p>
              <ul className="list-disc pl-6 space-y-2">
                {tArray('terms.liability.notResponsibleItems').map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Indemnización */}
            <div>
              <h2 className="font-display font-bold text-xl md:text-2xl text-ink mb-4">
                {t('terms.indemnity.title')}
              </h2>
              <p>{t('terms.indemnity.text')}</p>
            </div>

            {/* Política de devoluciones */}
            <div>
              <h2 className="font-display font-bold text-xl md:text-2xl text-ink mb-4">
                {t('terms.refundPolicy.title')}
              </h2>
              <p>{t('terms.refundPolicy.text')}</p>
            </div>

            {/* Terceros */}
            <div>
              <h2 className="font-display font-bold text-xl md:text-2xl text-ink mb-4">
                {t('terms.thirdParties.title')}
              </h2>
              <p>{t('terms.thirdParties.text')}</p>
            </div>

            {/* Suspensión */}
            <div>
              <h2 className="font-display font-bold text-xl md:text-2xl text-ink mb-4">
                {t('terms.suspension.title')}
              </h2>
              <p>{t('terms.suspension.text')}</p>
            </div>

            {/* Jurisdicción */}
            <div>
              <h2 className="font-display font-bold text-xl md:text-2xl text-ink mb-4">
                {t('terms.jurisdiction.title')}
              </h2>
              <p>{t('terms.jurisdiction.text')}</p>
            </div>

            {/* Modificaciones */}
            <div>
              <h2 className="font-display font-bold text-xl md:text-2xl text-ink mb-4">
                {t('terms.modifications.title')}
              </h2>
              <p>{t('terms.modifications.text')}</p>
            </div>

            {/* Contacto */}
            <div>
              <h2 className="font-display font-bold text-xl md:text-2xl text-ink mb-4">
                {t('terms.contact.title')}
              </h2>
              <p>{t('terms.contact.text')}</p>
            </div>

          </div>
        </SectionReveal>
      </div>
    </section>
  );
}