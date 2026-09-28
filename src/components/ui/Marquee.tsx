'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface MarqueeProps {
  items: string[];
  separator?: React.ReactNode;
  direction?: 'left' | 'right';
  speed?: number; // segundos por ciclo
  className?: string;
  itemClassName?: string;
}

export default function Marquee({
  items,
  separator,
  direction = 'left',
  speed = 25,
  className,
  itemClassName,
}: MarqueeProps) {
  // Duplicamos los items para lograr el bucle infinito sin costuras
  const duplicated = [...items, ...items, ...items, ...items];

  return (
    <div
      className={cn('relative overflow-hidden py-6 select-none', className)}
      style={{
        maskImage:
          'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
      }}
    >
      <div
        className={cn(
          'flex w-max gap-12 whitespace-nowrap',
          direction === 'left' ? 'animate-marquee' : 'animate-marquee-reverse'
        )}
        style={{
          animationDuration: `${speed}s`,
        }}
      >
        {duplicated.map((item, i) => (
          <div
            key={`${item}-${i}`}
            className={cn(
              'flex items-center gap-12 shrink-0',
              itemClassName
            )}
          >
            <span>{item}</span>
            {separator !== undefined ? (
              separator
            ) : (
              <span className="w-3 h-3 rounded-full bg-gradient-to-br from-primary-400 to-pink-400 shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}