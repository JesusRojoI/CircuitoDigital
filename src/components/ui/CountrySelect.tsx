'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { COUNTRIES } from '@/lib/countries';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

interface Props {
  value: string; // código ISO (MX, US, etc.)
  onChange: (code: string) => void;
  label?: string;
  required?: boolean;
}

export default function CountrySelect({ value, onChange, label, required }: Props) {
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

  const selected = COUNTRIES.find((c) => c.code === value) ?? COUNTRIES[0];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name[language].toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [search, language]);

  return (
    <div className="relative" ref={ref}>
      {label && (
        <label className="block text-sm font-medium text-ink-soft mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-left hover:border-primary-300 transition-colors"
      >
        <span className="text-xl leading-none">{selected.flag}</span>
        <span className="flex-1 text-ink">{selected.name[language]}</span>
        <i
          className={cn(
            'bi bi-chevron-down text-xs text-ink-muted transition-transform',
            open && 'rotate-180'
          )}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 left-0 right-0 rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden animate-slide-up">
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
          <ul className="max-h-64 overflow-y-auto py-1">
            {filtered.map((c) => (
              <li key={c.code}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(c.code);
                    setOpen(false);
                    setSearch('');
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors',
                    'hover:bg-primary-50',
                    value === c.code && 'bg-primary-50'
                  )}
                >
                  <span className="text-xl leading-none">{c.flag}</span>
                  <span className="flex-1 text-ink-soft">{c.name[language]}</span>
                  {value === c.code && (
                    <i className="bi bi-check2 text-primary-500" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}