import es from './es.json';
import en from './en.json';

export type Language = 'es' | 'en';

export const dictionaries = {
  es,
  en,
};

export type Dictionary = typeof es;

export function getDictionary(lang: Language): Dictionary {
  return dictionaries[lang] || dictionaries.es;
}

// Helper para acceder a valores anidados con notación de punto
export function t(
  dict: any,
  path: string,
  vars?: Record<string, string | number>
): string {
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
}

// Helper para arrays (marquesinas, etc.)
export function tArray(dict: any, path: string): string[] {
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
}