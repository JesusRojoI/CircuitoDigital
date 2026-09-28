'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { COUNTRIES, Country } from '@/lib/countries';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

interface CountryPhoneInputProps {
  value: string;
  dialCode: string;
  onPhoneChange: (v: string) => void;
  onDialCodeChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
}

export default function CountryPhoneInput({
  value,
  dialCode,
  onPhoneChange,
  onDialCodeChange,
  error,
  placeholder,
  label,
  required,
}: CountryPhoneInputProps) {
  const { language, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const selected =
    COUNTRIES.find((c) => c.dialCode === dialCode) ?? COUNTRIES[0];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter((c) => {
      const name = c.name[language].toLowerCase();
      return (
        name.includes(q) ||
        c.dialCode.includes(q) ||
        c.code.toLowerCase().includes(q)
      );
    });
  }, [search, language]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Solo dígitos, máximo 10
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
    // Formato: 222 123 4567
    let formatted = digits;
    if (digits.length > 6) {
      formatted = `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    } else if (digits.length > 3) {
      formatted = `${digits.slice(0, 3)} ${digits.slice(3)}`;
    }
    onPhoneChange(formatted);
  };

  return (
    <div className="relative" ref={ref}>
      {label && (
        <label className="block text-sm font-medium text-ink-soft mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        className={cn(
          'flex items-stretch rounded-xl border bg-white overflow-hidden transition-all duration-200',
          error
            ? 'border-red-300 focus-within:border-red-400 focus-within:ring-4 focus-within:ring-red-100'
            : 'border-gray-200 focus-within:border-primary-400 focus-within:ring-4 focus-within:ring-primary-100'
        )}
      >
        {/* Selector de país */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 px-3 py-3 border-r border-gray-100 hover:bg-gray-50 transition-colors shrink-0"
        >
          <span className="text-xl leading-none">{selected.flag}</span>
          <span className="text-sm font-medium text-ink-soft">
            {selected.dialCode}
          </span>
          <i
            className={cn(
              'bi bi-chevron-down text-xs text-ink-muted transition-transform duration-200',
              open && 'rotate-180'
            )}
          />
        </button>

        {/* Input teléfono */}
        <input
          type="tel"
          inputMode="numeric"
          value={value}
          onChange={handlePhoneChange}
          placeholder={placeholder ?? '222 123 4567'}
          className="flex-1 px-4 py-3 text-sm text-ink bg-transparent outline-none placeholder:text-ink-muted/60"
        />
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
          <i className="bi bi-exclamation-circle-fill" />
          {error}
        </p>
      )}

      {/* Dropdown de países */}
      {open && (
        <div className="absolute z-50 mt-2 left-0 w-72 max-w-[90vw] rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden animate-slide-up">
          {/* Buscador */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted text-sm" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('common.search')}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-gray-50 outline-none focus:bg-white focus:ring-2 focus:ring-primary-200"
              />
            </div>
          </div>

          {/* Lista */}
          <ul className="max-h-64 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-sm text-ink-muted text-center">
                —
              </li>
            ) : (
              filtered.map((c: Country) => (
                <li key={`${c.code}-${c.dialCode}`}>
                  <button
                    type="button"
                    onClick={() => {
                      onDialCodeChange(c.dialCode);
                      setOpen(false);
                      setSearch('');
                    }}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors',
                      'hover:bg-primary-50',
                      selected.code === c.code && 'bg-primary-50'
                    )}
                  >
                    <span className="text-xl leading-none">{c.flag}</span>
                    <span className="flex-1 text-ink-soft truncate">
                      {c.name[language]}
                    </span>
                    <span className="text-xs font-medium text-ink-muted">
                      {c.dialCode}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}