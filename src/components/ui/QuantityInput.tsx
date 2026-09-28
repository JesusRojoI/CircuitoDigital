'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface QuantityInputProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  className?: string;
  size?: 'sm' | 'md';
}

export default function QuantityInput({
  value,
  onChange,
  min = 1,
  max = 99,
  className,
  size = 'md',
}: QuantityInputProps) {
  const dec = () => {
    if (value > min) onChange(value - 1);
  };
  const inc = () => {
    if (value < max) onChange(value + 1);
  };
  const handleManual = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    const n = parseInt(raw, 10);
    if (isNaN(n)) {
      onChange(min);
    } else {
      onChange(Math.min(max, Math.max(min, n)));
    }
  };

  const btnSize = size === 'sm' ? 'w-8 h-8 text-sm' : 'w-10 h-10 text-base';
  const inputSize = size === 'sm' ? 'w-10 h-8 text-sm' : 'w-14 h-10 text-base';

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border border-gray-200 bg-white overflow-hidden',
        className
      )}
    >
      <button
        type="button"
        onClick={dec}
        disabled={value <= min}
        className={cn(
          'flex items-center justify-center text-ink-soft hover:bg-primary-50 hover:text-primary-600 transition-colors disabled:opacity-40 disabled:hover:bg-transparent',
          btnSize
        )}
        aria-label="Decrease"
      >
        <i className="bi bi-dash" />
      </button>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={handleManual}
        className={cn(
          'text-center font-semibold text-ink bg-transparent outline-none',
          inputSize
        )}
      />
      <button
        type="button"
        onClick={inc}
        disabled={value >= max}
        className={cn(
          'flex items-center justify-center text-ink-soft hover:bg-primary-50 hover:text-primary-600 transition-colors disabled:opacity-40 disabled:hover:bg-transparent',
          btnSize
        )}
        aria-label="Increase"
      >
        <i className="bi bi-plus" />
      </button>
    </div>
  );
}