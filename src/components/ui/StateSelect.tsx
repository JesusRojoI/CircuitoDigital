'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MEXICAN_STATES, MEXICAN_STATES_EN } from '@/lib/countries';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

interface Props {
  value: string;
  onChange: (v: string) => void;
  label?: string;
  required?: boolean;
}

export default function StateSelect({ value, onChange, label, required }: Props) {
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

  const states = language === 'en' ? MEXICAN_STATES_EN : MEXICAN_STATES;

  /**
   * Mapea el valor actual (que puede estar en español o inglés) al índice
   * del estado para mostrarlo en el idioma actual.
   */
  const currentIndex = useMemo(() => {
    let idx = MEXICAN_STATES.indexOf(value);
    if (idx === -1) idx = MEXICAN_STATES_EN.indexOf(value);
    return idx;
  }, [value]);

  const displayValue =
    currentIndex >= 0 ? states[currentIndex] : value || '—';

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return states;
    return states.filter((s) => s.toLowerCase().includes(q));
  }, [search, states]);

  const handleSelect = (s: string) => {
    onChange(s);
    setOpen(false);
    setSearch('');
  };

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
        className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-left hover:border-primary-300 transition-colors"
      >
        <span className={cn('truncate', value ? 'text-ink' : 'text-ink-muted')}>
          {displayValue}
        </span>
        <i
          className={cn(
            'bi bi-chevron-down text-xs text-ink-muted transition-transform shrink-0',
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
          <ul className="max-h-56 overflow-y-auto py-1">
            {filtered.map((s) => {
              const isSelected = displayValue === s;
              return (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => handleSelect(s)}
                    className={cn(
                      'w-full text-left px-4 py-2.5 text-sm transition-colors',
                      'hover:bg-primary-50',
                      isSelected && 'bg-primary-50 text-primary-700 font-medium'
                    )}
                  >
                    {s}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}