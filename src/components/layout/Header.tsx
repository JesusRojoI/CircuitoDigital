'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';
import LanguageSelector from './LanguageSelector';

const NAV_LINKS = [
  { href: '/', key: 'header.home' },
  { href: '/planes', key: 'header.plans' },
  { href: '/contacto', key: 'header.contact' },
];

export default function Header() {
  const { totalItems, toggleCart } = useCart();
  const { t } = useLanguage();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        scrolled
          ? 'bg-white/90 backdrop-blur-md shadow-[0_4px_20px_-8px_rgba(139,92,246,0.15)]'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
         <Link href="/" className="flex items-center shrink-0 group">
  <div className="relative w-10 h-10 md:w-12 md:h-12 transition-transform duration-300 group-hover:scale-105">
    <Image
      src="/logo.svg"
      alt="CircuitoDigital"
      fill
      className="object-contain"
      priority
    />
  </div>
</Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300',
                  isActive(link.href)
                    ? 'text-primary-700 bg-primary-50'
                    : 'text-ink-soft hover:text-primary-600 hover:bg-primary-50/60'
                )}
              >
                {t(link.key)}
                {isActive(link.href) && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-gradient-to-r from-primary-500 to-pink-500" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 md:gap-3">
            <LanguageSelector />

            {/* Botón carrito */}
            <button
              type="button"
              onClick={toggleCart}
              className={cn(
                'relative p-2.5 rounded-full transition-all duration-300',
                'bg-white/80 border border-gray-200 hover:border-primary-400 hover:bg-white',
                'hover:scale-105'
              )}
              aria-label={t('header.cart')}
            >
              <i className="bi bi-cart3 text-lg text-ink-soft" />
              {totalItems > 0 && (
                <span
                  className={cn(
                    'absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full',
                    'bg-gradient-to-br from-primary-500 to-pink-500 text-white',
                    'text-[10px] font-bold flex items-center justify-center',
                    'shadow-md animate-pulse-soft'
                  )}
                >
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>

            {/* Botón móvil */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden p-2.5 rounded-full bg-white/80 border border-gray-200"
              aria-label="Menu"
            >
              <i
                className={cn(
                  'bi text-lg text-ink-soft transition-all duration-300',
                  mobileOpen ? 'bi-x-lg' : 'bi-list'
                )}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300 bg-white/95 backdrop-blur-md border-t border-gray-100',
          mobileOpen ? 'max-h-72' : 'max-h-0'
        )}
      >
        <nav className="px-4 py-3 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                isActive(link.href)
                  ? 'text-primary-700 bg-primary-50'
                  : 'text-ink-soft hover:bg-primary-50/60'
              )}
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}