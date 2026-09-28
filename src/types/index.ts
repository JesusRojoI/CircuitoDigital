export interface Product {
  id: string;
  slug: string;
  nameKey: string; // clave i18n
  descriptionKey: string;
  price: number;
  featuresKey: string; // clave i18n para array de características
  isCustom?: boolean;
}

export interface CartItem {
  id: string;
  slug: string;
  nameKey: string;
  price: number;
  quantity: number;
  isCustom?: boolean;
  customDescription?: string;
}

export interface OrderData {
  nombre: string;
  apellido?: string;
  email: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  estado?: string;
  cp?: string;
  empresa?: string;
  productos: {
    nombre: string;
    cantidad: number;
    precio: number;
  }[];
  subtotal: number;
  impuesto: number;
  total: number;
  descuento: number;
  cupon?: string;
  transactionId: string;
  language: string;
}

export interface PaymentData {
  amount: number;
  orderId: string;
  cardData: {
    number: string;
    name: string;
    month: string;
    year: string;
    cvv: string;
  };
  customer: {
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
  };
  language?: string;
}