// src/app/api/send-email/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import {
  contactAdminEmail,
  contactClientEmail,
  orderClientEmail,
  orderAdminEmail,
  quoteAdminEmail,
  quoteClientEmail,
} from '@/lib/emailTemplates';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, language = 'es', ...data } = body;

    const apiKey = process.env.RESEND_API_KEY;
    const emailFrom = process.env.EMAIL_FROM;
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!apiKey) {
      console.error('❌ RESEND_API_KEY no configurada');
      return NextResponse.json(
        { success: false, message: 'Email service not configured' },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);
    const from = emailFrom || 'gestion@circuitodigital.com.mx';

    /* ============ CONTACTO ============ */
    if (type === 'contact') {
      // 1. Correo al admin (forward)
      if (adminEmail) {
        await resend.emails.send({
          from,
          to: adminEmail,
          subject:
            language === 'en'
              ? '[FWD] New Contact Message - CircuitoDigital'
              : '[FWD] Nuevo mensaje de contacto - CircuitoDigital',
          html: contactAdminEmail(language, data),
        });
      }

      // 2. Correo al cliente
      await resend.emails.send({
        from,
        to: data.email,
        subject:
          language === 'en'
            ? 'Message Received - CircuitoDigital'
            : 'Mensaje recibido - CircuitoDigital',
        html: contactClientEmail(language, data),
      });

      return NextResponse.json({ success: true });
    }

    /* ============ COTIZACIÓN PERSONALIZADA ============ */
    if (type === 'quote') {
      if (adminEmail) {
        await resend.emails.send({
          from,
          to: adminEmail,
          subject:
            language === 'en'
              ? '[FWD] New Custom Quote - CircuitoDigital'
              : '[FWD] Nueva cotización personalizada - CircuitoDigital',
          html: quoteAdminEmail(language, data),
        });
      }

      await resend.emails.send({
        from,
        to: data.email,
        subject:
          language === 'en'
            ? 'Quote Received - CircuitoDigital'
            : 'Cotización recibida - CircuitoDigital',
        html: quoteClientEmail(language, data),
      });

      return NextResponse.json({ success: true });
    }

    /* ============ COMPRA ============ */
    if (type === 'order' && data.orderData) {
      // 1. Correo al cliente
      await resend.emails.send({
        from,
        to: data.orderData.email,
        subject:
          language === 'en'
            ? 'Purchase Confirmed! - CircuitoDigital'
            : '¡Compra confirmada! - CircuitoDigital',
        html: orderClientEmail(language, data.orderData),
      });

      // 2. Forward al admin
      if (adminEmail) {
        await resend.emails.send({
          from,
          to: adminEmail,
          subject:
            language === 'en'
              ? `[FWD] New Purchase - ${data.orderData.nombre}`
              : `[FWD] Nueva compra - ${data.orderData.nombre}`,
          html: orderAdminEmail(language, data.orderData),
        });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid email type' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('❌ Error enviando correo:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Error sending email' },
      { status: 500 }
    );
  }
}