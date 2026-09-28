export function formatCurrency(amount: number, language: string = 'es'): string {
  return new Intl.NumberFormat(language === 'en' ? 'en-US' : 'es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(amount: number, language: string = 'es'): string {
  return new Intl.NumberFormat(language === 'en' ? 'en-US' : 'es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhone(phone: string): boolean {
  return /^\d{10}$/.test(phone.replace(/\D/g, ''));
}

export function validatePostalCode(cp: string): boolean {
  return /^\d{5}$/.test(cp);
}

export function generateOrderId(): string {
  return 'TXN-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}