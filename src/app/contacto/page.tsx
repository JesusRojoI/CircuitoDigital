'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/context/ToastContext';
import { validateEmail, validatePhone } from '@/lib/utils';
import SectionReveal from '@/components/ui/SectionReveal';
import Blobs from '@/components/ui/Blobs';
import Modal from '@/components/ui/Modal';
import CountryPhoneInput from '@/components/ui/CountryPhoneInput';

interface FormState {
  name: string;
  lastName: string;
  phone: string;
  dialCode: string;
  email: string;
  message: string;
}

const EMPTY: FormState = {
  name: '',
  lastName: '',
  phone: '',
  dialCode: '+52',
  email: '',
  message: '',
};

export default function ContactoPage() {
  const { t, language } = useLanguage();
  const { showToast } = useToast();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[key as string];
        return copy;
      });
    }
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = t('errors.requiredField');
    if (!form.lastName.trim()) e.lastName = t('errors.requiredField');
    if (!validatePhone(form.phone)) e.phone = t('errors.invalidPhone');
    if (!validateEmail(form.email)) e.email = t('errors.invalidEmail');
    if (!form.message.trim()) e.message = t('errors.requiredField');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast({
        type: 'error',
        message: t('contact.errorMessage'),
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'contact',
          language,
          name: form.name,
          lastName: form.lastName,
          phone: `${form.dialCode} ${form.phone}`,
          email: form.email,
          message: form.message,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccessOpen(true);
        setForm(EMPTY);
      } else {
        showToast({
          type: 'error',
          message: t('contact.errorMessage'),
        });
      }
    } catch (err) {
      console.error(err);
      showToast({
        type: 'error',
        message: t('contact.errorMessage'),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ==================== SECCIÓN 1: FORMULARIO ==================== */}
      <section className="relative pt-28 md:pt-32 pb-16 overflow-hidden">
        <Blobs variant="pastel" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="text-center mb-12 md:mb-16">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 text-xs font-medium uppercase tracking-widest text-primary-600 mb-5">
                <i className="bi bi-chat-dots-fill" />
                {t('contact.title')}
              </span>
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-ink mb-4">
                {t('contact.subtitle')}
              </h1>
              <p className="text-ink-muted max-w-xl mx-auto">
                {t('contact.successMessage')}
              </p>
            </div>
          </SectionReveal>

          <SectionReveal delay={100}>
            <div className="max-w-3xl mx-auto">
              <form
                onSubmit={handleSubmit}
                className="rounded-3xl bg-white border border-gray-100 p-6 md:p-10 shadow-xl shadow-primary-500/5"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Nombre */}
                  <div>
                    <label className="block text-sm font-medium text-ink-soft mb-2">
                      {t('contact.name')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setField('name', e.target.value)}
                      className={`input-base ${errors.name ? 'border-red-300' : ''}`}
                      placeholder={t('contact.name')}
                    />
                    {errors.name && (
                      <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                        <i className="bi bi-exclamation-circle-fill" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Apellidos */}
                  <div>
                    <label className="block text-sm font-medium text-ink-soft mb-2">
                      {t('contact.lastName')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(e) => setField('lastName', e.target.value)}
                      className={`input-base ${errors.lastName ? 'border-red-300' : ''}`}
                      placeholder={t('contact.lastName')}
                    />
                    {errors.lastName && (
                      <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                        <i className="bi bi-exclamation-circle-fill" />
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Teléfono + Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                  <CountryPhoneInput
                    label={t('contact.phone')}
                    required
                    value={form.phone}
                    dialCode={form.dialCode}
                    onPhoneChange={(v) => setField('phone', v)}
                    onDialCodeChange={(v) => setField('dialCode', v)}
                    error={errors.phone}
                  />

                  <div>
                    <label className="block text-sm font-medium text-ink-soft mb-2">
                      {t('contact.email')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setField('email', e.target.value)}
                      className={`input-base ${errors.email ? 'border-red-300' : ''}`}
                      placeholder="correo@ejemplo.com"
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                        <i className="bi bi-exclamation-circle-fill" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Mensaje */}
                <div className="mt-5">
                  <label className="block text-sm font-medium text-ink-soft mb-2">
                    {t('contact.message')} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={(e) => setField('message', e.target.value)}
                    className={`input-base resize-none ${errors.message ? 'border-red-300' : ''}`}
                    placeholder={t('contact.message')}
                  />
                  {errors.message && (
                    <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                      <i className="bi bi-exclamation-circle-fill" />
                      {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-8 w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-semibold text-white bg-gradient-to-r from-primary-500 to-pink-500 shadow-xl shadow-primary-500/30 hover:shadow-primary-500/50 transition-all duration-300 hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span>{t('common.loading')}</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send-fill" />
                      <span>{t('contact.send')}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ==================== SECCIÓN 2: MAPA ==================== */}
      <section className="relative w-full h-[400px] md:h-[500px] bg-gray-100">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.6650317490367!2d-99.1777777!3d19.4113888!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDI0JzQxLjAiTiA5OcKwMTAnNDAuMCJX!5e0!3m2!1ses!2smx!4v1234567890"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="CircuitoDigital location"
          className="absolute inset-0"
        />
      </section>

      {/* ==================== SECCIÓN 3: TARJETAS DE CONTACTO ==================== */}
      <section className="relative py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Correo */}
            <SectionReveal>
              <div className="h-full rounded-3xl bg-gradient-to-br from-pastel-blue to-pastel-indigo p-8 shadow-lg shadow-primary-500/10 hover:-translate-y-2 transition-transform duration-500">
                <div className="w-14 h-14 rounded-2xl bg-white/80 backdrop-blur flex items-center justify-center mb-5 shadow-sm">
                  <i className="bi bi-envelope-fill text-2xl text-primary-600" />
                </div>
                <h3 className="font-display font-bold text-xl text-ink mb-3">
                  {t('contact.emailLabel')}
                </h3>
                <a
                  href="mailto:support@circuitodigital.com.mx"
                  className="text-sm text-ink-soft hover:text-primary-700 transition-colors break-all"
                >
                  support@circuitodigital.com.mx
                </a>
              </div>
            </SectionReveal>

            {/* Teléfono */}
            <SectionReveal delay={100}>
              <div className="h-full rounded-3xl bg-gradient-to-br from-pastel-green to-pastel-yellow p-8 shadow-lg shadow-primary-500/10 hover:-translate-y-2 transition-transform duration-500">
                <div className="w-14 h-14 rounded-2xl bg-white/80 backdrop-blur flex items-center justify-center mb-5 shadow-sm">
                  <i className="bi bi-telephone-fill text-2xl text-primary-600" />
                </div>
                <h3 className="font-display font-bold text-xl text-ink mb-3">
                  {t('contact.phoneLabel')}
                </h3>
                <a
                  href="tel:+525559415147"
                  className="text-sm text-ink-soft hover:text-primary-700 transition-colors"
                >
                  +52 55 5941 5147
                </a>
              </div>
            </SectionReveal>

            {/* Dirección */}
            <SectionReveal delay={200}>
              <div className="h-full rounded-3xl bg-gradient-to-br from-pastel-violet to-pastel-pink p-8 shadow-lg shadow-primary-500/10 hover:-translate-y-2 transition-transform duration-500">
                <div className="w-14 h-14 rounded-2xl bg-white/80 backdrop-blur flex items-center justify-center mb-5 shadow-sm">
                  <i className="bi bi-geo-alt-fill text-2xl text-primary-600" />
                </div>
                <h3 className="font-display font-bold text-xl text-ink mb-3">
                  {t('contact.addressLabel')}
                </h3>
                <p className="text-sm text-ink-soft leading-relaxed">
                  {t('footer.address')}
                </p>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* ==================== MODAL DE ÉXITO ==================== */}
      <Modal
        isOpen={successOpen}
        onClose={() => setSuccessOpen(false)}
        size="sm"
        showClose={false}
      >
        <div className="text-center py-2">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-500/30">
            <i className="bi bi-check-lg text-white text-3xl" />
          </div>
          <h3 className="font-display font-bold text-xl text-ink mb-3">
            {t('contact.successTitle')}
          </h3>
          <p className="text-sm text-ink-muted mb-6 leading-relaxed">
            {t('contact.successMessage')}
          </p>
          <button
            type="button"
            onClick={() => setSuccessOpen(false)}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium text-white bg-gradient-to-r from-primary-500 to-pink-500 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <i className="bi bi-check2" />
            {t('common.close')}
          </button>
        </div>
      </Modal>
    </>
  );
}