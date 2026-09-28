// src/lib/emailTemplates.ts
import es from '@/i18n/es.json';
import en from '@/i18n/en.json';

const dicts: Record<string, any> = { es, en };

function getDict(lang: string) {
  return dicts[lang] || dicts.es;
}

// Helper
const t = (lang: string, path: string, vars?: Record<string, string>) => {
  const d = getDict(lang);
  const keys = path.split('.');
  let v: any = d;
  for (const k of keys) {
    if (v && typeof v === 'object' && k in v) v = v[k];
    else return path;
  }
  if (typeof v !== 'string') return path;
  if (vars) {
    return Object.entries(vars).reduce(
      (a, [k, val]) => a.replace(new RegExp(`{${k}}`, 'g'), String(val)),
      v
    );
  }
  return v;
};

/* ============ ESTILOS BASE ============ */
const baseStyles = `
  font-family: 'IBM Plex Sans KR', Arial, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  background-color: #f8fafc;
  border-radius: 12px;
  overflow: hidden;
  color: #1F2937;
`;

const headerStyle = (gradient: string) => `
  background: ${gradient};
  padding: 30px;
  text-align: center;
`;

const h1Style = `color: #f8fafc; margin: 0; font-size: 24px;`;

const bodyStyle = `padding: 30px; color: #1F2937;`;

const footerStyle = `
  background: #EDE9FE;
  padding: 20px;
  text-align: center;
  border-top: 1px solid rgba(139,92,246,0.1);
`;

const footerText = `color: #6B7280; font-size: 12px; margin: 0;`;

const gradientPrimary = 'linear-gradient(135deg, #8B5CF6, #EC4899)';

/* ============ CONTACT EMAIL (al admin - forward) ============ */
export function contactAdminEmail(lang: string, data: any) {
  const t2 = (p: string, v?: Record<string, string>) => t(lang, p, v);
  return `
  <div style="${baseStyles}">
    <div style="${headerStyle(gradientPrimary)}">
      <h1 style="${h1Style}">${t2('emails.contact.adminTitle')}</h1>
    </div>
    <div style="${bodyStyle}">
      <p><strong>${t2('emails.contact.name')}:</strong> ${data.name} ${data.lastName || ''}</p>
      <p><strong>${t2('emails.contact.company')}:</strong> ${data.company || '-'}</p>
      <p><strong>${t2('emails.contact.email')}:</strong> ${data.email}</p>
      <p><strong>${t2('emails.contact.phone')}:</strong> ${data.phone}</p>
      <p><strong>${t2('emails.contact.message')}:</strong></p>
      <p style="background:#f1f5f9;padding:15px;border-radius:8px;">${data.message}</p>
    </div>
    <div style="${footerStyle}">
      <p style="${footerText}">CircuitoDigital - support@circuitodigital.com.mx</p>
    </div>
  </div>`;
}

/* ============ CONTACT EMAIL (al cliente - confirmación) ============ */
export function contactClientEmail(lang: string, data: any) {
  const t2 = (p: string, v?: Record<string, string>) => t(lang, p, v);
  return `
  <div style="${baseStyles}">
    <div style="${headerStyle(gradientPrimary)}">
      <h1 style="${h1Style}">${t2('emails.contact.clientTitle')}</h1>
    </div>
    <div style="${bodyStyle}">
      <p>${t2('emails.contact.greeting', { name: data.name })}</p>
      <p>${t2('emails.contact.clientBody')}</p>
      <p style="color:#6B7280;">CircuitoDigital - support@circuitodigital.com.mx</p>
    </div>
    <div style="${footerStyle}">
      <p style="${footerText}">CircuitoDigital</p>
    </div>
  </div>`;
}

/* ============ ORDER CONFIRMATION (al cliente) ============ */
export function orderClientEmail(lang: string, orderData: any) {
  const t2 = (p: string, v?: Record<string, string>) => t(lang, p, v);

  const productsHTML = orderData.productos
    .map(
      (p: any) => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid rgba(139,92,246,0.2);color:#1F2937;">
          ${p.nombre} × ${p.cantidad}
        </td>
        <td style="padding:8px;border-bottom:1px solid rgba(139,92,246,0.2);text-align:right;color:#8B5CF6;">
          $${p.precio.toFixed(2)}
        </td>
      </tr>`
    )
    .join('');

  return `
  <div style="${baseStyles}">
    <div style="${headerStyle(gradientPrimary)}">
      <h1 style="${h1Style}">${t2('emails.order.clientTitle')}</h1>
    </div>
    <div style="${bodyStyle}">
      <p style="font-size:16px;">
        ${t2('emails.order.greeting', { name: orderData.nombre })}
      </p>
      <p>${t2('emails.order.clientBody')}</p>
      <h2 style="color:#1F2937;font-size:18px;border-bottom:2px solid #8B5CF6;padding-bottom:8px;">
        ${t2('emails.order.summary')}
      </h2>
      <table style="width:100%;border-collapse:collapse;">${productsHTML}</table>
      <div style="margin-top:20px;padding:20px;background:#EDE9FE;border-radius:8px;border:1px solid rgba(139,92,246,0.2);">
        <p><strong>${t2('common.subtotal')}:</strong> <span style="color:#8B5CF6;">$${orderData.subtotal.toFixed(2)}</span></p>
        ${orderData.descuento > 0 ? `<p><strong>${t2('common.discount')}:</strong> <span style="color:#EF4444;">-$${orderData.descuento.toFixed(2)}</span></p>` : ''}
        <p><strong>${t2('common.vat')} (16%):</strong> <span style="color:#8B5CF6;">$${orderData.impuesto.toFixed(2)}</span></p>
        <p style="font-size:18px;">
          <strong>${t2('common.total')}:</strong>
          <span style="color:#8B5CF6;">$${orderData.total.toFixed(2)} MXN</span>
        </p>
      </div>
      <p style="color:#6B7280;"><strong>${t2('emails.order.transaction')}:</strong> ${orderData.transactionId}</p>
      <p>${t2('emails.order.thanks')} <strong style="color:#8B5CF6;">CircuitoDigital</strong>.</p>
    </div>
    <div style="${footerStyle}">
      <p style="${footerText}">CircuitoDigital - support@circuitodigital.com.mx</p>
    </div>
  </div>`;
}

/* ============ ORDER CONFIRMATION (al admin - forward) ============ */
export function orderAdminEmail(lang: string, orderData: any) {
  const t2 = (p: string, v?: Record<string, string>) => t(lang, p, v);
  return `
  <div style="${baseStyles}">
    <div style="${headerStyle(gradientPrimary)}">
      <h1 style="${h1Style}">${t2('emails.order.adminTitle')}</h1>
    </div>
    <div style="${bodyStyle}">
      <p><strong>${t2('emails.order.customer')}:</strong> ${orderData.nombre} ${orderData.apellido || ''}</p>
      <p><strong>${t2('emails.order.email')}:</strong> ${orderData.email}</p>
      <p><strong>${t2('common.total')}:</strong> <span style="color:#8B5CF6;">$${orderData.total.toFixed(2)} MXN</span></p>
      <p><strong>${t2('emails.order.transaction')}:</strong> ${orderData.transactionId}</p>
    </div>
    ${orderClientEmail(lang, orderData)}
  </div>`;
}

/* ============ QUOTE EMAIL (al admin - forward) ============ */
export function quoteAdminEmail(lang: string, data: any) {
  const t2 = (p: string, v?: Record<string, string>) => t(lang, p, v);
  return `
  <div style="${baseStyles}">
    <div style="${headerStyle(gradientPrimary)}">
      <h1 style="${h1Style}">${t2('emails.quote.adminTitle')}</h1>
    </div>
    <div style="${bodyStyle}">
      <p><strong>${t2('custom.name')}:</strong> ${data.name} ${data.lastName || ''}</p>
      <p><strong>${t2('custom.email')}:</strong> ${data.email}</p>
      <p><strong>${t2('custom.quoteId')}:</strong> ${data.quoteId}</p>
      <p><strong>${t2('custom.amount')}:</strong> $${Number(data.amount).toFixed(2)} MXN</p>
    </div>
    <div style="${footerStyle}">
      <p style="${footerText}">CircuitoDigital - support@circuitodigital.com.mx</p>
    </div>
  </div>`;
}

/* ============ QUOTE EMAIL (al cliente) ============ */
export function quoteClientEmail(lang: string, data: any) {
  const t2 = (p: string, v?: Record<string, string>) => t(lang, p, v);
  return `
  <div style="${baseStyles}">
    <div style="${headerStyle(gradientPrimary)}">
      <h1 style="${h1Style}">${t2('emails.quote.clientTitle')}</h1>
    </div>
    <div style="${bodyStyle}">
      <p>${t2('emails.quote.greeting', { name: data.name })}</p>
      <p>${t2('emails.quote.clientBody')}</p>
      <p style="color:#6B7280;">CircuitoDigital - support@circuitodigital.com.mx</p>
    </div>
    <div style="${footerStyle}">
      <p style="${footerText}">CircuitoDigital</p>
    </div>
  </div>`;
}