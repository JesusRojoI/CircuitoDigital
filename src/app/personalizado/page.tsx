'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { validateEmail } from '@/lib/utils';
import SectionReveal from '@/components/ui/SectionReveal';
import Blobs from '@/components/ui/Blobs';
import Modal from '@/components/ui/Modal';

interface FormState {
  name: string;
  lastName: string;
  email: string;
  quoteId: string;
  amount: string;
}

const EMPTY: FormState = {
  name: '',
  lastName: '',
  email: '',
  quoteId: '',
  amount: '',
};

export default function PersonalizadoPage() {
  const { t, language } = useLanguage();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const router = useRouter();

  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [pendingAmount, setPendingAmount] = useState(0);

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

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/[^\d.]/g, '');
    // sólo un punto
    const parts = v.split('.');
    if (parts.length > 2) v = parts[0] + '.' + parts.slice(1).join('');
    // max 2 decimales
    if (parts[1] && parts[1].length > 2) {
      v = parts[0] + '.' + parts[1].slice(0, 2);
    }
    setField('amount', v);
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = t('errors.requiredField');
    if (!form.lastName.trim()) e.lastName = t('errors.requiredField');
    if (!validateEmail(form.email)) e.email = t('errors.invalidEmail');
    if (!form.quoteId.trim()) e.quoteId = t('errors.requiredField');
    const amountNum = parseFloat(form.amount);
    if (!form.amount || isNaN(amountNum) || amountNum <= 0) {
      e.amount = t('errors.invalidAmount');
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const amountNum = parseFloat(form.amount);

    setLoading(true);
    try {
      // Enviar correo de cotización
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'quote',
          language,
          name: form.name,
          lastName: form.lastName,
          email: form.email,
          quoteId: form.quoteId,
          amount: amountNum,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        showToast({
          type: 'error',
          message: t('checkout.genericError'),
        });
        setLoading(false);
        return;
      }

      // Guardar para agregar al carrito al cerrar modal
      setPendingAmount(amountNum);
      setSuccessOpen(true);
    } catch (err) {
      console.error(err);
      showToast({
        type: 'error',
        message: t('checkout.genericError'),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccess = () => {
    // Agregar producto personalizado al carrito
    const customName = t('custom.customProductName');
    addItem({
      id: `custom-${Date.now()}`,
      slug: 'custom',
      nameKey: 'custom.customProductName',
      price: pendingAmount,
      quantity: 1,
      isCustom: true,
      customDescription: `${form.quoteId} — ${customName}`,
    });

    setSuccessOpen(false);
    setForm(EMPTY);
    setPendingAmount(0);
    router.push('/carrito');
  };

  return (
    <>
      {/* ==================== SECCIÓN 1: FORMULARIO ==================== */}
      <section className="relative pt-28 md:pt-32 pb-16 overflow-hidden">
        <Blobs variant="pastel" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            {/* Formulario 60% */}
            <SectionReveal className="lg:col-span-3">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-xs font-medium uppercase tracking-widest text-primary-600 mb-5">
                <i className="bi bi-sliders" />
                CircuitoDigital
              </span>
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-ink mb-3">
                {t('custom.title')}
              </h1>
              <h2 className="font-display font-semibold text-xl md:text-2xl text-primary-600 mb-8">
                {t('custom.subtitle')}
              </h2>

              <form
                onSubmit={handleSubmit}
                className="rounded-3xl bg-white border border-gray-100 p-6 md:p-8 shadow-xl shadow-primary-500/5"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Nombre */}
                  <div>
                    <label className="block text-sm font-medium text-ink-soft mb-2">
                      {t('custom.name')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setField('name', e.target.value)}
                      className={`input-base ${errors.name ? 'border-red-300' : ''}`}
                      placeholder={t('custom.name')}
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
                      {t('custom.lastName')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(e) => setField('lastName', e.target.value)}
                      className={`input-base ${errors.lastName ? 'border-red-300' : ''}`}
                      placeholder={t('custom.lastName')}
                    />
                    {errors.lastName && (
                      <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                        <i className="bi bi-exclamation-circle-fill" />
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="mt-5">
                  <label className="block text-sm font-medium text-ink-soft mb-2">
                    {t('custom.email')} <span className="text-red-500">*</span>
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

                {/* ID de Cotización */}
                <div className="mt-5">
                  <label className="block text-sm font-medium text-ink-soft mb-2">
                    {t('custom.quoteId')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.quoteId}
                    onChange={(e) => setField('quoteId', e.target.value)}
                    className={`input-base ${errors.quoteId ? 'border-red-300' : ''}`}
                    placeholder="QUOTE-0001"
                  />
                  <p className="mt-2 text-xs text-ink-muted">
                    {t('custom.quoteIdHelp')}{' '}
                    <Link
                      href="/contacto"
                      className="font-semibold text-primary-600 underline decoration-2 underline-offset-2 hover:text-primary-700 transition-colors"
                    >
                      {t('custom.here')}
                    </Link>
                    .
                  </p>
                  {errors.quoteId && (
                    <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                      <i className="bi bi-exclamation-circle-fill" />
                      {errors.quoteId}
                    </p>
                  )}
                </div>

                {/* Monto */}
                <div className="mt-5">
                  <label className="block text-sm font-medium text-ink-soft mb-2">
                    {t('custom.amount')} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
  <span
    className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 text-ink-muted text-sm font-medium pointer-events-none z-10"
    aria-hidden
  >
    $
  </span>
  <input
    type="text"
    inputMode="decimal"
    value={form.amount}
    onChange={handleAmountChange}
    onBlur={() => {
      if (form.amount && !form.amount.includes('.')) {
        setField('amount', `${form.amount}.00`);
      }
    }}
    style={{ paddingLeft: '44px', paddingRight: '56px' }}
    className={`input-base ${errors.amount ? 'border-red-300' : ''}`}
    placeholder="0.00"
  />
  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-muted text-xs font-medium pointer-events-none">
    {t('common.currency')}
  </span>
</div>
                  {errors.amount && (
                    <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                      <i className="bi bi-exclamation-circle-fill" />
                      {errors.amount}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-8 w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-semibold text-white bg-gradient-to-r from-primary-500 to-pink-500 shadow-xl shadow-primary-500/30 hover:shadow-primary-500/50 transition-all duration-300 hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span>{t('common.loading')}</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-credit-card-2-front-fill" />
                      <span>{t('custom.pay')}</span>
                    </>
                  )}
                </button>
              </form>
            </SectionReveal>

            {/* Imagen 40% */}
            <SectionReveal delay={150} className="lg:col-span-2">
              <div className="relative aspect-[3/4] lg:aspect-auto lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl shadow-primary-500/20">
                <Image
                  src="/images/custom.jpg"
                  alt={t('custom.title')}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <i className="bi bi-gem text-3xl mb-3 inline-block" />
                  <p className="font-display font-bold text-lg">
                    {t('custom.title')}
                  </p>
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* ==================== SECCIÓN 2: AYUDA ==================== */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/custom-help.jpg"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-ink/90 via-primary-900/80 to-pink-900/70" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <SectionReveal>
            <i className="bi bi-life-preserver text-4xl md:text-5xl text-primary-300 mb-6 inline-block animate-float" />
          </SectionReveal>
          <SectionReveal delay={100}>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl leading-tight mb-6">
              {t('custom.help.title')}
            </h2>
          </SectionReveal>
          <SectionReveal delay={200}>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed mb-3 max-w-2xl mx-auto">
              {t('custom.help.text')}
            </p>
            <p className="text-base text-white/70 leading-relaxed mb-10 max-w-xl mx-auto">
              {t('custom.help.text2')}
            </p>
          </SectionReveal>
          <SectionReveal delay={300}>
            <Link
              href="/contacto"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-white bg-gradient-to-r from-primary-500 to-pink-500 shadow-2xl shadow-primary-500/40 hover:shadow-primary-500/60 transition-all duration-300 hover:-translate-y-1"
            >
              <i className="bi bi-chat-dots text-lg" />
              <span>{t('custom.help.cta')}</span>
              <i className="bi bi-arrow-right transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </SectionReveal>
        </div>
      </section>

      {/* ==================== MODAL DE ÉXITO ==================== */}
      <Modal
        isOpen={successOpen}
        onClose={handleCloseSuccess}
        size="sm"
        showClose={false}
      >
        <div className="text-center py-2">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-500/30">
            <i className="bi bi-check-lg text-white text-3xl" />
          </div>
          <h3 className="font-display font-bold text-xl text-ink mb-3">
            {t('custom.successTitle')}
          </h3>
          <p className="text-sm text-ink-muted mb-6 leading-relaxed">
            {t('custom.successMessage')}
          </p>
          <button
            type="button"
            onClick={handleCloseSuccess}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium text-white bg-gradient-to-r from-primary-500 to-pink-500 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <i className="bi bi-cart-plus" />
            {t('cart.viewCart')}
          </button>
        </div>
      </Modal>
    </>
  );
}