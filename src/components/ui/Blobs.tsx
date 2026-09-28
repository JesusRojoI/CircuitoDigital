'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface Props {
  variant?: 'pastel' | 'dark' | 'violet';
  className?: string;
}

const COLORS: Record<string, string[]> = {
  pastel: [
    'rgba(255,179,186,0.55)',
    'rgba(186,225,255,0.55)',
    'rgba(224,187,228,0.55)',
    'rgba(255,223,186,0.55)',
  ],
  dark: [
    'rgba(139,92,246,0.35)',
    'rgba(236,72,153,0.30)',
    'rgba(59,130,246,0.25)',
    'rgba(245,158,11,0.25)',
  ],
  violet: [
    'rgba(139,92,246,0.55)',
    'rgba(168,85,247,0.45)',
    'rgba(236,72,153,0.35)',
    'rgba(99,102,241,0.45)',
  ],
};

const POSITIONS = [
  { top: '-10%', left: '-10%', size: 340 },
  { bottom: '-15%', right: '-10%', size: 420 },
  { top: '30%', right: '20%', size: 260 },
  { bottom: '20%', left: '30%', size: 220 },
];

export default function Blobs({ variant = 'pastel', className }: Props) {
  const colors = COLORS[variant];
  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      {POSITIONS.map((pos, i) => (
        <div
          key={i}
          className="blob animate-float"
          style={{
            top: pos.top,
            left: pos.left,
            right: pos.right,
            bottom: pos.bottom,
            width: pos.size,
            height: pos.size,
            background: colors[i % colors.length],
            animationDelay: `${i * 0.8}s`,
          }}
        />
      ))}
    </div>
  );
}