'use client';

import React from 'react';
import { COUNTRIES } from '@/lib/countries';

interface Props {
  countryCode: string;
  size?: 'sm' | 'md';
}

export default function FlagIcon({ countryCode, size = 'sm' }: Props) {
  const country = COUNTRIES.find((c) => c.code === countryCode);
  const flag = country?.flag ?? '🏳️';
  return (
    <span
      className={
        size === 'sm'
          ? 'inline-flex items-center justify-center w-6 h-6 text-lg leading-none'
          : 'inline-flex items-center justify-center w-8 h-8 text-2xl leading-none'
      }
      aria-hidden
    >
      {flag}
    </span>
  );
}