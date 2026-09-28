import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { ToastProvider } from '@/context/ToastContext';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import ToastContainer from '@/components/ui/ToastContainer';

export const metadata: Metadata = {
  title: 'CircuitoDigital - Soluciones Digitales',
  description:
    'Desarrollamos soluciones digitales a medida para impulsar su éxito. Aplicaciones móviles, diseño web y más.',
  icons: {
    icon: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Ocultar indicador de Next.js (por si acaso) */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              nextjs-portal, [data-nextjs-toast], [data-nextjs-dialog-overlay] {
                display: none !important;
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FAFAFB]">
        <LanguageProvider>
          <ToastProvider>
            <CartProvider>
              <Header />
              <main className="flex-1 pt-16 md:pt-20">{children}</main>
              <Footer />
              <CartDrawer />
              <ToastContainer />
            </CartProvider>
          </ToastProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}