'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { formatCurrency } from '@/lib/utils';
import SectionReveal from '@/components/ui/SectionReveal';
import Blobs from '@/components/ui/Blobs';

interface OrderSummary {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  estado: string;
  cp: string;
  productos: { nombre: string; cantidad: number; precio: number }[];
  subtotal: number;
  impuesto: number;
  total: number;
  transactionId: string;
}

export default function CompraExitosaPage() {
  const { t, language } = useLanguage();
  const [order, setOrder] = useState<OrderSummary | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('cd_last_order');
      if (raw) setOrder(JSON.parse(raw));
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <section className="relative pt-28 md:pt-32 pb-20 overflow-hidden min-h-[80vh]">
      <Blobs variant="pastel" />

      {/* Confeti decorativo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="absolute w-2 h-2 rounded-full animate-float"
            style={{
              left: `${(i * 8.3) % 100}%`,
              top: `${10 + ((i * 37) % 60)}%`,
              background: [
                '#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9',
                '#BAE1FF', '#C7CEEA', '#E0BBE4', '#FFC8DD',
              ][i % 8],
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${5 + (i % 4)}s`,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Check animado */}
        <SectionReveal>
          <div className="text-center mb-10">
            <div className="relative w-28 h-28 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-2xl shadow-green-500/40 animate-pulse-soft" />
              <div className="absolute inset-0 flex items-center justify-center">
                <i className="bi bi-check-lg text-white text-6xl" />
              </div>
            </div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-ink mb-4">
              {t('success.title')}
            </h1>
            <p className="text-ink-muted max-w-xl mx-auto leading-relaxed">
              {t('success.subtitle')}
            </p>
          </div>
        </SectionReveal>

        {/* Resumen del pedido */}
        {order && (
          <SectionReveal delay={150}>
            <div className="rounded-3xl bg-white border border-gray-100 overflow-hidden shadow-xl shadow-primary-500/5 mb-6">
              <div className="h-1.5 bg-gradient-to-r from-primary-500 via-pink-500 to-amber-400" />
              <div className="p-6 md:p-8">
                {/* Encabezado */}
                <div className="flex items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
                  <h2 className="font-display font-bold text-xl text-ink flex items-center gap-2">
                    <i className="bi bi-receipt text-primary-500" />
                    {t('success.orderSummary')}
                  </h2>
                  <div className="text-right">
                    <p className="text-xs text-ink-muted">
                      {t('success.transactionId')}
                    </p>
                    <p className="font-mono text-xs text-ink font-medium">
                      {order.transactionId}
                    </p>
                  </div>
                </div>

                {/* Datos del cliente */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6 pb-6 border-b border-gray-100">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-2">
                      {t('success.customerInfo')}
                    </p>
                    <p className="text-sm font-medium text-ink">
                      {order.nombre} {order.apellido}
                    </p>
                    <p className="text-xs text-ink-muted mt-1">{order.email}</p>
                    {order.telefono && (
                      <p className="text-xs text-ink-muted mt-1">
                        {order.telefono}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-2">
                      {language === 'en' ? 'Delivery' : 'Entrega'}
                    </p>
                    <p className="text-xs text-ink-muted leading-relaxed">
                      {order.direccion}
                      <br />
                      {order.ciudad}, {order.estado}, {order.cp}
                    </p>
                  </div>
                </div>

                {/* Productos */}
                <ul className="space-y-3 mb-6 pb-6 border-b border-gray-100">
                  {order.productos.map((p, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-100 to-pink-100 flex items-center justify-center shrink-0">
                        <i className="bi bi-box-seam text-primary-500 text-sm" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-ink truncate">{p.nombre}</p>
                        <p className="text-xs text-ink-muted">
                          × {p.cantidad} — {formatCurrency(p.precio, language)}
                        </p>
                      </div>
                      <span className="font-medium text-ink text-sm shrink-0">
                        {formatCurrency(p.precio * p.cantidad, language)}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Totales */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ink-muted">{t('common.subtotal')}</span>
                    <span className="font-medium text-ink">
                      {formatCurrency(order.subtotal, language)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ink-muted">
                      {t('common.vat')} (16%)
                    </span>
                    <span className="font-medium text-ink">
                      {formatCurrency(order.impuesto, language)}
                    </span>
                  </div>
                  <div className="h-px bg-gray-100" />
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-lg text-ink">
                      {t('common.total')}
                    </span>
                    <span className="font-display font-extrabold text-2xl text-gradient">
                      {formatCurrency(order.total, language)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </SectionReveal>
        )}

        {/* Botones */}
        <SectionReveal delay={250}>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-primary-600 border-2 border-primary-500 hover:bg-primary-50 transition-all duration-300 hover:-translate-y-0.5"
            >
              <i className="bi bi-house-door" />
              {t('success.backToMenu')}
            </Link>
            <Link
              href="/planes"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-white bg-gradient-to-r from-primary-500 to-pink-500 shadow-xl shadow-primary-500/30 hover:shadow-primary-500/50 transition-all duration-300 hover:-translate-y-0.5"
            >
              <i className="bi bi-grid" />
              {t('success.keepShopping')}
            </Link>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}