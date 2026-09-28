'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import {
  formatCurrency,
  validateEmail,
  validatePhone,
  validatePostalCode,
} from '@/lib/utils';
import SectionReveal from '@/components/ui/SectionReveal';
import Blobs from '@/components/ui/Blobs';
import CountrySelect from '@/components/ui/CountrySelect';
import StateSelect from '@/components/ui/StateSelect';

interface BillingForm {
  firstName: string;
  lastName: string;
  company: string;
  country: string;
  address: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  email: string;
  orderNotes: string;
  cardName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
}

const EMPTY: BillingForm = {
  firstName: '',
  lastName: '',
  company: '',
  country: 'MX',
  address: '',
  address2: '',
  city: '',
  state: 'Ciudad de México',
  postalCode: '',
  phone: '',
  email: '',
  orderNotes: '',
  cardName: '',
  cardNumber: '',
  cardExpiry: '',
  cardCvv: '',
};

export default function FinalizarCompraPage() {
  const { t, language } = useLanguage();
  const { items, subtotal, vat, total, clearCart } = useCart();
  const { showToast } = useToast();
  const router = useRouter();

  const [form, setForm] = useState<BillingForm>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Si el carrito está vacío y no estamos procesando, regresar a /carrito
  useEffect(() => {
    if (items.length === 0 && !loading) {
      router.replace('/carrito');
    }
  }, [items.length, loading, router]);

  const setField = <K extends keyof BillingForm>(key: K, value: BillingForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[key as string];
        return copy;
      });
    }
  };

  /* ============ Formateadores ============ */
  const formatCardNumber = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  const formatPostalCode = (v: string) =>
    v.replace(/\D/g, '').slice(0, 5);

  const formatPhone = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 10);
    if (digits.length > 6)
      return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    if (digits.length > 3)
      return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    return digits;
  };

  /* ============ Validación ============ */
  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = t('errors.requiredField');
    if (!form.lastName.trim()) e.lastName = t('errors.requiredField');
    if (!form.country) e.country = t('errors.requiredField');
    if (!form.address.trim()) e.address = t('errors.requiredField');
    if (!form.city.trim()) e.city = t('errors.requiredField');
    if (!form.state.trim()) e.state = t('errors.requiredField');
    if (!validatePostalCode(form.postalCode)) e.postalCode = t('errors.invalidPostalCode');
    if (!validatePhone(form.phone)) e.phone = t('errors.invalidPhone');
    if (!validateEmail(form.email)) e.email = t('errors.invalidEmail');
    if (!form.cardName.trim()) e.cardName = t('errors.requiredField');

    const cardDigits = form.cardNumber.replace(/\s/g, '');
    if (cardDigits.length < 13) e.cardNumber = t('errors.invalidCard');

    const expDigits = form.cardExpiry.replace(/\D/g, '');
    if (expDigits.length !== 4) e.cardExpiry = t('errors.invalidExpiry');

    if (form.cardCvv.length < 3) e.cardCvv = t('errors.invalidCvc');

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ============ Submit ============ */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast({
        type: 'error',
        message: t('checkout.genericError'),
      });
      return;
    }

    setLoading(true);

    const orderId = `TXN-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)
      .toUpperCase()}`;

    const [month, year] = form.cardExpiry.split('/');

    const orderData = {
      nombre: form.firstName,
      apellido: form.lastName,
      email: form.email,
      telefono: form.phone,
      direccion: form.address,
      ciudad: form.city,
      estado: form.state,
      cp: form.postalCode,
      empresa: form.company,
      productos: items.map((i) => ({
        nombre: t(i.nameKey),
        cantidad: i.quantity,
        precio: i.price,
      })),
      subtotal,
      impuesto: vat,
      total,
      descuento: 0,
      transactionId: orderId,
      language,
    };

    const paymentPayload = {
      amount: total,
      orderId,
      cardData: {
        number: form.cardNumber.replace(/\s/g, ''),
        name: form.cardName,
        month: month.padStart(2, '0'),
        year: year.length === 2 ? `20${year}` : year,
        cvv: form.cardCvv,
      },
      customer: {
        nombre: form.firstName,
        apellido: form.lastName,
        email: form.email,
        telefono: form.phone,
        direccion: form.address,
        direccion2: form.address2,
        ciudad: form.city,
        estado: form.state,
        pais: form.country,
        cp: form.postalCode,
        empresa: form.company,
      },
      language,
    };

    try {
      // 1. Procesar pago + correo vía API route combinada
      const res = await fetch('/api/process-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment: paymentPayload,
          order: orderData,
          language,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        // Falló el pago (o el correo, pero eso ya se maneja como advertencia)
        showToast({
          type: 'error',
          message: t('checkout.paymentError'),
        });
        setLoading(false);
        return;
      }

      // 2. Guardar resumen en sessionStorage para la página de éxito
      try {
        sessionStorage.setItem(
          'cd_last_order',
          JSON.stringify({
            ...orderData,
            transactionId: data.transactionId || orderId,
          })
        );
      } catch {}

      // 3. Limpiar carrito y redirigir
      clearCart();
      router.push('/compra-exitosa');
    } catch (err) {
      console.error(err);
      showToast({
        type: 'error',
        message: t('checkout.genericError'),
      });
      setLoading(false);
    }
  };

  /* ============ Render ============ */
  return (
    <section className="relative pt-28 md:pt-32 pb-20 overflow-hidden">
      <Blobs variant="pastel" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-ink mb-10">
            {t('checkout.title')}
          </h1>
        </SectionReveal>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ==================== COLUMNA IZQUIERDA: FORMULARIO ==================== */}
          <div className="lg:col-span-2 space-y-8">
            {/* --- Datos de facturación --- */}
            <SectionReveal>
              <div className="rounded-3xl bg-white border border-gray-100 p-6 md:p-8 shadow-xl shadow-primary-500/5">
                <h2 className="font-display font-bold text-xl text-ink mb-6 flex items-center gap-2">
                  <i className="bi bi-person-vcard text-primary-500" />
                  {t('checkout.title')}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Nombre */}
                  <Field
                    label={t('checkout.firstName')}
                    required
                    value={form.firstName}
                    onChange={(v) => setField('firstName', v)}
                    error={errors.firstName}
                  />
                  {/* Apellidos */}
                  <Field
                    label={t('checkout.lastName')}
                    required
                    value={form.lastName}
                    onChange={(v) => setField('lastName', v)}
                    error={errors.lastName}
                  />
                </div>

                {/* Empresa */}
                <div className="mt-5">
                  <Field
                    label={t('checkout.company')}
                    value={form.company}
                    onChange={(v) => setField('company', v)}
                    placeholder={t('common.optional')}
                  />
                </div>

                {/* País */}
                <div className="mt-5">
                  <CountrySelect
                    label={t('checkout.country')}
                    required
                    value={form.country}
                    onChange={(v) => setField('country', v)}
                  />
                </div>

                {/* Dirección */}
                <div className="mt-5">
                  <Field
                    label={t('checkout.address')}
                    required
                    value={form.address}
                    onChange={(v) => setField('address', v)}
                    error={errors.address}
                    placeholder={t('checkout.addressPlaceholder')}
                  />
                </div>

                {/* Dirección 2 */}
                <div className="mt-5">
                  <Field
                    label={t('checkout.address2')}
                    value={form.address2}
                    onChange={(v) => setField('address2', v)}
                    placeholder={t('common.optional')}
                  />
                </div>

                {/* Ciudad + Estado */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                  <Field
                    label={t('checkout.city')}
                    required
                    value={form.city}
                    onChange={(v) => setField('city', v)}
                    error={errors.city}
                  />
                  <StateSelect
                    label={t('checkout.state')}
                    required
                    value={form.state}
                    onChange={(v) => setField('state', v)}
                  />
                </div>

                {/* CP + Teléfono */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                  <Field
                    label={t('checkout.postalCode')}
                    required
                    value={form.postalCode}
                    onChange={(v) => setField('postalCode', formatPostalCode(v))}
                    error={errors.postalCode}
                    inputMode="numeric"
                  />
                  <Field
                    label={t('checkout.phone')}
                    required
                    value={form.phone}
                    onChange={(v) => setField('phone', formatPhone(v))}
                    error={errors.phone}
                    inputMode="tel"
                  />
                </div>

                {/* Email */}
                <div className="mt-5">
                  <Field
                    label={t('checkout.email')}
                    required
                    type="email"
                    value={form.email}
                    onChange={(v) => setField('email', v)}
                    error={errors.email}
                  />
                </div>
              </div>
            </SectionReveal>

            {/* --- Información adicional --- */}
            <SectionReveal delay={80}>
              <div className="rounded-3xl bg-white border border-gray-100 p-6 md:p-8 shadow-xl shadow-primary-500/5">
                <h2 className="font-display font-bold text-xl text-ink mb-6 flex items-center gap-2">
                  <i className="bi bi-chat-left-text text-primary-500" />
                  {t('checkout.additionalInfo')}
                </h2>
                <label className="block text-sm font-medium text-ink-soft mb-2">
                  {t('checkout.orderNotes')}
                </label>
                <textarea
                  rows={4}
                  value={form.orderNotes}
                  onChange={(e) => setField('orderNotes', e.target.value)}
                  placeholder={t('checkout.orderNotesPlaceholder')}
                  className="input-base resize-none"
                />
              </div>
            </SectionReveal>

            {/* --- Tarjeta --- */}
            <SectionReveal delay={160}>
              <div className="rounded-3xl bg-white border border-gray-100 overflow-hidden shadow-xl shadow-primary-500/5">
  <div className="p-6 md:p-8">
    <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                      <h2 className="font-display font-bold text-xl text-ink">
                        {t('checkout.cardTitle')}
                      </h2>
                      <p className="text-xs text-ink-muted mt-1">
                        {t('checkout.cardSubtitle')}
                      </p>
                    </div>
                    <div className="relative w-24 h-10 shrink-0">
                      <Image
                        src="/etomin.svg"
                        alt="Etomin"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>

                  {/* Nombre en tarjeta */}
                  <div className="mb-5">
                    <Field
                      label={t('checkout.cardName')}
                      required
                      value={form.cardName}
                      onChange={(v) => setField('cardName', v)}
                      error={errors.cardName}
                    />
                  </div>

                  {/* Número de tarjeta */}
                  <div className="mb-5">
                    <Field
                      label={t('checkout.cardNumber')}
                      required
                      value={form.cardNumber}
                      onChange={(v) => setField('cardNumber', formatCardNumber(v))}
                      error={errors.cardNumber}
                      placeholder="0000 0000 0000 0000"
                      icon="bi-credit-card-2-front"
                      inputMode="numeric"
                    />
                  </div>

                  {/* MM/AA + CVC */}
                  <div className="grid grid-cols-2 gap-5">
                    <Field
                      label={t('checkout.cardExpiry')}
                      required
                      value={form.cardExpiry}
                      onChange={(v) => setField('cardExpiry', formatExpiry(v))}
                      error={errors.cardExpiry}
                      placeholder="MM/AA"
                      inputMode="numeric"
                    />
                    <div>
                      <Field
                        label={t('checkout.cardCvc')}
                        required
                        type="password"
                        value={form.cardCvv}
                        onChange={(v) =>
                          setField('cardCvv', v.replace(/\D/g, '').slice(0, 4))
                        }
                        error={errors.cardCvc}
                        placeholder="•••"
                        inputMode="numeric"
                        icon="bi-shield-lock"
                      />
                    </div>
                  </div>

                  {/* Secure badge */}
                  <div className="mt-5 flex items-center gap-3 p-3 rounded-2xl bg-green-50/60 border border-green-100">
                    <div className="relative w-8 h-8 shrink-0">
                      <Image src="/secure.svg" alt="Secure" fill className="object-contain" />
                    </div>
                    <p className="text-xs text-green-800 leading-snug">
                      {language === 'en'
                        ? 'Your payment is protected with SSL encryption'
                        : 'Tu pago está protegido con encriptación SSL'}
                    </p>
                  </div>
                </div>
              </div>
            </SectionReveal>

            {/* --- Aviso de privacidad --- */}
            <SectionReveal delay={200}>
              <p className="text-xs text-ink-muted text-center px-4">
                {t('checkout.privacyText')}{' '}
                <Link
                  href="/aviso-privacidad"
                  className="font-semibold text-primary-600 underline decoration-2 underline-offset-2 hover:text-primary-700 transition-colors"
                >
                  {t('checkout.privacyLink')}
                </Link>
                .
              </p>
            </SectionReveal>
          </div>

          {/* ==================== COLUMNA DERECHA: RESUMEN ==================== */}
          <div className="lg:col-span-1">
           <div className="sticky top-28 rounded-3xl bg-white border border-gray-100 overflow-hidden shadow-xl shadow-primary-500/5 relative">
  <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-primary-200 to-pink-200 opacity-30 blur-2xl pointer-events-none" />
  <div className="relative p-6">
                <h2 className="font-display font-bold text-xl text-ink mb-6 flex items-center gap-2">
                  <i className="bi bi-bag-check text-primary-500" />
                  {t('checkout.yourOrder')}
                </h2>

                {/* Items */}
                <ul className="space-y-3 mb-5 max-h-56 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-start gap-3 text-sm"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-100 to-pink-100 flex items-center justify-center shrink-0">
                        <i className="bi bi-box-seam text-primary-500 text-xs" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-ink truncate">
                          {t(item.nameKey)}
                        </p>
                        <p className="text-xs text-ink-muted">× {item.quantity}</p>
                      </div>
                      <span className="text-ink-soft font-medium text-xs shrink-0">
                        {formatCurrency(item.price * item.quantity, language)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="h-px bg-gray-100 my-5" />

                {/* Totales */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ink-muted">{t('common.subtotal')}</span>
                    <span className="font-medium text-ink">
                      {formatCurrency(subtotal, language)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ink-muted">
                      {t('common.vat')} (16%)
                    </span>
                    <span className="font-medium text-ink">
                      {formatCurrency(vat, language)}
                    </span>
                  </div>
                  <div className="h-px bg-gray-100" />
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-base text-ink">
                      {t('common.total')}
                    </span>
                    <span className="font-display font-extrabold text-2xl text-gradient">
                      {formatCurrency(total, language)}
                    </span>
                  </div>
                </div>

                {/* Botón */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 rounded-full font-semibold text-white bg-gradient-to-r from-primary-500 to-pink-500 shadow-xl shadow-primary-500/30 hover:shadow-primary-500/50 transition-all duration-300 hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span>{t('checkout.processing')}</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-lock-fill" />
                      <span>{t('checkout.placeOrder')}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
/* ============ Subcomponente Field ============ */
interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  type?: string;
  inputMode?: 'text' | 'numeric' | 'decimal' | 'tel' | 'email';
  icon?: string;
}

function Field({
  label,
  value,
  onChange,
  error,
  required,
  placeholder,
  type = 'text',
  inputMode,
  icon,
}: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink-soft mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <span
            className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 text-ink-muted pointer-events-none z-10"
            aria-hidden
          >
            <i className={`bi ${icon} text-base leading-none`} />
          </span>
        )}
        <input
          type={type}
          inputMode={inputMode}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={icon ? { paddingLeft: '44px' } : undefined}
          className={`input-base ${error ? 'border-red-300' : ''}`}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
          <i className="bi bi-exclamation-circle-fill" />
          {error}
        </p>
      )}
    </div>
  );
}