// src/lib/etomin.ts
// Lógica de integración con Etomin (pagos)

interface CardData {
  number: string;
  name: string;
  month: string;
  year: string;
  cvv: string;
}

interface Customer {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  direccion2?: string;
  ciudad: string;
  estado: string;
  pais?: string;
  cp: string;
  empresa?: string;
}

interface PaymentData {
  amount: number;
  orderId: string;
  cardData: CardData;
  customer: Customer;
  language?: string;
}

const getConfig = () => {
  const baseUrl = process.env.ETOMIN_BASE_URL || 'https://pagos.etomin.com/api/v1';
  const user = process.env.ETOMIN_USER;
  const password = process.env.ETOMIN_PASSWORD;
  return { baseUrl, user, password };
};

async function authenticate(): Promise<string> {
  const { baseUrl, user, password } = getConfig();

  if (!user || !password) {
    throw new Error('Etomin credentials not configured');
  }

  const res = await fetch(`${baseUrl}/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: user, password }),
    cache: 'no-store',
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || 'Authentication failed');
  }

  const token = data?.authToken || data?.data?.authToken;
  if (!token) throw new Error('No auth token received from Etomin');
  return token;
}

async function tokenizeCard(token: string, cardData: CardData): Promise<string> {
  const { baseUrl } = getConfig();

  const res = await fetch(`${baseUrl}/card/tokenizer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      cardData: {
        cardNumber: cardData.number.replace(/\s/g, ''),
        cardholderName: cardData.name,
        expirationYear: cardData.year.length === 2 ? `20${cardData.year}` : cardData.year,
        expirationMonth: cardData.month,
      },
    }),
    cache: 'no-store',
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || 'Card tokenization failed');
  }

  const cardToken = data?.cardNumberToken || data?.data?.cardNumberToken;
  if (!cardToken) throw new Error('No card token received');
  return cardToken;
}

async function processSale(
  token: string,
  cardToken: string,
  payment: PaymentData
): Promise<any> {
  const { baseUrl } = getConfig();

  const res = await fetch(`${baseUrl}/sale`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      amount: payment.amount,
      currency: '484', // MXN
      reference: payment.orderId,
      customerInformation: {
        firstName: payment.customer.nombre?.trim() || 'Cliente',
        lastName: payment.customer.apellido?.trim() || 'CircuitoDigital',
        middleName: '',
        email: payment.customer.email,
        phone1: payment.customer.telefono,
        address1: payment.customer.direccion,
        address2: payment.customer.direccion2 || '',
        city: payment.customer.ciudad,
        state: payment.customer.estado,
        postalCode: payment.customer.cp,
        country: payment.customer.pais || 'MX',
        company: payment.customer.empresa || '',
        ip: '0.0.0.0',
      },
      cardData: {
        cardNumberToken: cardToken,
        cvv: payment.cardData.cvv,
      },
    }),
    cache: 'no-store',
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || 'Sale processing failed');
  }

  return data;
}

export async function processEtominPayment(payment: PaymentData) {
  try {
    // 1. Autenticación
    const token = await authenticate();

    // 2. Tokenizar tarjeta
    const cardToken = await tokenizeCard(token, payment.cardData);

    // 3. Procesar venta
    const saleData = await processSale(token, cardToken, payment);

    const status = saleData?.status || saleData?.data?.status;
    const approved = status === 'APPROVED' || status === 'approved';

    if (approved) {
      return {
        success: true,
        transactionId:
          saleData?.orderId || saleData?.reference || payment.orderId,
        reference: saleData?.reference || payment.orderId,
        status,
        raw: saleData,
      };
    }

    return {
      success: false,
      status: status || 'REJECTED',
      message: saleData?.message || 'Payment rejected',
      raw: saleData,
    };
  } catch (error: any) {
    return {
      success: false,
      status: 'ERROR',
      message: error?.message || 'Payment processing error',
    };
  }
}