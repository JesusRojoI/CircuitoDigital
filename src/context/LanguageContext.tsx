'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import es from '@/i18n/es.json';
import en from '@/i18n/en.json';

export type Language = 'es' | 'en';

const dictionaries: Record<Language, any> = { es, en };

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (path: string, vars?: Record<string, string | number>) => string;
  tArray: (path: string) => string[];
  dict: any;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('es');

  // Cargar idioma guardado
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('cd_lang') : null;
    if (stored === 'es' || stored === 'en') {
      setLanguageState(stored);
    } else {
      // Detectar por navegador
      const nav = typeof navigator !== 'undefined' ? navigator.language : 'es';
      if (nav && nav.toLowerCase().startsWith('en')) {
        setLanguageState('en');
      }
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cd_lang', lang);
      document.documentElement.lang = lang;
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'es' ? 'en' : 'es');
  }, [language, setLanguage]);

  const dict = dictionaries[language];

  const t = useCallback(
    (path: string, vars?: Record<string, string | number>): string => {
      const keys = path.split('.');
      let value: any = dict;
      for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
          value = value[key];
        } else {
          return path;
        }
      }
      if (typeof value !== 'string') return path;
      if (vars) {
        return Object.entries(vars).reduce(
          (acc, [k, v]) => acc.replace(new RegExp(`{${k}}`, 'g'), String(v)),
          value
        );
      }
      return value;
    },
    [dict]
  );

  const tArray = useCallback(
    (path: string): string[] => {
      const keys = path.split('.');
      let value: any = dict;
      for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
          value = value[key];
        } else {
          return [];
        }
      }
      return Array.isArray(value) ? value : [];
    },
    [dict]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, tArray, dict }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}