// src/app/api/process-order/route.ts
import { NextResponse } from 'next/server';
import { processEtominPayment } from '@/lib/etomin';
import { Resend } from 'resend';
import { orderClientEmail, orderAdminEmail } from '@/lib/emailTemplates';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { payment, order, language = 'es' } = body;

    // 1. Procesar pago
    const paymentResult = await processEtominPayment({
      amount: payment.amount,
      orderId: payment.orderId || `TXN-${Date.now()}`,
      cardData: payment.cardData,
      customer: payment.customer,
      language,
    });

    if (!paymentResult.success) {
      return NextResponse.json(
        {
          success: false,
          stage: 'payment',
          status: paymentResult.status,
          message: paymentResult.message,
        },
        { status: 400 }
      );
    }

    // 2. Enviar correos
    let emailSuccess = true;
    try {
      const apiKey = process.env.RESEND_API_KEY;
      const from = process.env.EMAIL_FROM || 'gestion@circuitodigital.com.mx';
      const adminEmail = process.env.ADMIN_EMAIL;

      if (apiKey) {
        const resend = new Resend(apiKey);

        // Cliente
        await resend.emails.send({
          from,
          to: order.email,
          subject:
            language === 'en'
              ? 'Purchase Confirmed! - CircuitoDigital'
              : '¡Compra confirmada! - CircuitoDigital',
          html: orderClientEmail(language, order),
        });

        // Admin (forward)
        if (adminEmail) {
          await resend.emails.send({
            from,
            to: adminEmail,
            subject:
              language === 'en'
                ? `[FWD] New Purchase - ${order.nombre}`
                : `[FWD] Nueva compra - ${order.nombre}`,
            html: orderAdminEmail(language, order),
          });
        }
      }
    } catch (emailError: any) {
      console.error('❌ Error enviando correo:', emailError);
      emailSuccess = false;
    }

    return NextResponse.json({
      success: true,
      transactionId: paymentResult.transactionId,
      reference: paymentResult.reference,
      emailSuccess,
      message: 'Order processed',
    });
  } catch (error: any) {
    console.error('❌ Error procesando orden:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Order processing error' },
      { status: 500 }
    );
  }
}