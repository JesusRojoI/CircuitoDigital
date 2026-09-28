'use client';

import React from 'react';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/lib/utils';

const ICONS: Record<string, string> = {
  success: 'bi-check-circle-fill',
  error: 'bi-x-circle-fill',
  info: 'bi-info-circle-fill',
  warning: 'bi-exclamation-triangle-fill',
};

const COLORS: Record<string, string> = {
  success: 'from-green-500 to-emerald-500',
  error: 'from-red-500 to-rose-500',
  info: 'from-primary-500 to-pink-500',
  warning: 'from-amber-500 to-orange-500',
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col gap-3 w-[calc(100%-2rem)] max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-xl',
            'bg-white border border-gray-100 animate-slide-in-right'
          )}
          role="alert"
        >
          <div
            className={cn(
              'w-9 h-9 rounded-full bg-gradient-to-br flex items-center justify-center shrink-0 text-white',
              COLORS[toast.type] || COLORS.info
            )}
          >
            <i className={cn('bi text-sm', ICONS[toast.type] || ICONS.info)} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-ink font-medium leading-snug break-words">
              {toast.message}
            </p>
            {toast.actionLabel && toast.onAction && (
              <button
                type="button"
                onClick={() => {
                  toast.onAction?.();
                  removeToast(toast.id);
                }}
                className="mt-2 text-sm font-semibold text-primary-600 hover:text-primary-700 hover:underline transition-colors"
              >
                {toast.actionLabel}
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => removeToast(toast.id)}
            className="p-1 rounded-full hover:bg-gray-100 text-ink-muted transition-colors shrink-0"
            aria-label="Close"
          >
            <i className="bi bi-x text-sm" />
          </button>
        </div>
      ))}
    </div>
  );
}