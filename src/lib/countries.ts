export interface Country {
  code: string;
  name: { es: string; en: string };
  dialCode: string;
  flag: string; // emoji solo para mostrar en selector de LADA
}

export const COUNTRIES: Country[] = [
  { code: 'MX', name: { es: 'México', en: 'Mexico' }, dialCode: '+52', flag: '🇲🇽' },
  { code: 'US', name: { es: 'Estados Unidos', en: 'United States' }, dialCode: '+1', flag: '🇺🇸' },
  { code: 'CA', name: { es: 'Canadá', en: 'Canada' }, dialCode: '+1', flag: '🇨🇦' },
  { code: 'AR', name: { es: 'Argentina', en: 'Argentina' }, dialCode: '+54', flag: '🇦🇷' },
  { code: 'BR', name: { es: 'Brasil', en: 'Brazil' }, dialCode: '+55', flag: '🇧🇷' },
  { code: 'CL', name: { es: 'Chile', en: 'Chile' }, dialCode: '+56', flag: '🇨🇱' },
  { code: 'CO', name: { es: 'Colombia', en: 'Colombia' }, dialCode: '+57', flag: '🇨🇴' },
  { code: 'PE', name: { es: 'Perú', en: 'Peru' }, dialCode: '+51', flag: '🇵🇪' },
  { code: 'ES', name: { es: 'España', en: 'Spain' }, dialCode: '+34', flag: '🇪🇸' },
  { code: 'FR', name: { es: 'Francia', en: 'France' }, dialCode: '+33', flag: '🇫🇷' },
  { code: 'DE', name: { es: 'Alemania', en: 'Germany' }, dialCode: '+49', flag: '🇩🇪' },
  { code: 'IT', name: { es: 'Italia', en: 'Italy' }, dialCode: '+39', flag: '🇮🇹' },
  { code: 'GB', name: { es: 'Reino Unido', en: 'United Kingdom' }, dialCode: '+44', flag: '🇬🇧' },
  { code: 'PT', name: { es: 'Portugal', en: 'Portugal' }, dialCode: '+351', flag: '🇵🇹' },
  { code: 'NL', name: { es: 'Países Bajos', en: 'Netherlands' }, dialCode: '+31', flag: '🇳🇱' },
  { code: 'BE', name: { es: 'Bélgica', en: 'Belgium' }, dialCode: '+32', flag: '🇧🇪' },
  { code: 'CH', name: { es: 'Suiza', en: 'Switzerland' }, dialCode: '+41', flag: '🇨🇭' },
  { code: 'AT', name: { es: 'Austria', en: 'Austria' }, dialCode: '+43', flag: '🇦🇹' },
  { code: 'SE', name: { es: 'Suecia', en: 'Sweden' }, dialCode: '+46', flag: '🇸🇪' },
  { code: 'NO', name: { es: 'Noruega', en: 'Norway' }, dialCode: '+47', flag: '🇳🇴' },
  { code: 'DK', name: { es: 'Dinamarca', en: 'Denmark' }, dialCode: '+45', flag: '🇩🇰' },
  { code: 'FI', name: { es: 'Finlandia', en: 'Finland' }, dialCode: '+358', flag: '🇫🇮' },
  { code: 'IE', name: { es: 'Irlanda', en: 'Ireland' }, dialCode: '+353', flag: '🇮🇪' },
  { code: 'PL', name: { es: 'Polonia', en: 'Poland' }, dialCode: '+48', flag: '🇵🇱' },
  { code: 'CZ', name: { es: 'República Checa', en: 'Czech Republic' }, dialCode: '+420', flag: '🇨🇿' },
  { code: 'GR', name: { es: 'Grecia', en: 'Greece' }, dialCode: '+30', flag: '🇬🇷' },
  { code: 'TR', name: { es: 'Turquía', en: 'Turkey' }, dialCode: '+90', flag: '🇹🇷' },
  { code: 'RU', name: { es: 'Rusia', en: 'Russia' }, dialCode: '+7', flag: '🇷🇺' },
  { code: 'CN', name: { es: 'China', en: 'China' }, dialCode: '+86', flag: '🇨🇳' },
  { code: 'JP', name: { es: 'Japón', en: 'Japan' }, dialCode: '+81', flag: '🇯🇵' },
  { code: 'KR', name: { es: 'Corea del Sur', en: 'South Korea' }, dialCode: '+82', flag: '🇰🇷' },
  { code: 'IN', name: { es: 'India', en: 'India' }, dialCode: '+91', flag: '🇮🇳' },
  { code: 'AU', name: { es: 'Australia', en: 'Australia' }, dialCode: '+61', flag: '🇦🇺' },
  { code: 'NZ', name: { es: 'Nueva Zelanda', en: 'New Zealand' }, dialCode: '+64', flag: '🇳🇿' },
  { code: 'ZA', name: { es: 'Sudáfrica', en: 'South Africa' }, dialCode: '+27', flag: '🇿🇦' },
  { code: 'EG', name: { es: 'Egipto', en: 'Egypt' }, dialCode: '+20', flag: '🇪🇬' },
  { code: 'MA', name: { es: 'Marruecos', en: 'Morocco' }, dialCode: '+212', flag: '🇲🇦' },
  { code: 'IL', name: { es: 'Israel', en: 'Israel' }, dialCode: '+972', flag: '🇮🇱' },
  { code: 'SA', name: { es: 'Arabia Saudita', en: 'Saudi Arabia' }, dialCode: '+966', flag: '🇸🇦' },
  { code: 'AE', name: { es: 'Emiratos Árabes Unidos', en: 'United Arab Emirates' }, dialCode: '+971', flag: '🇦🇪' },
  { code: 'SG', name: { es: 'Singapur', en: 'Singapore' }, dialCode: '+65', flag: '🇸🇬' },
  { code: 'MY', name: { es: 'Malasia', en: 'Malaysia' }, dialCode: '+60', flag: '🇲🇾' },
  { code: 'TH', name: { es: 'Tailandia', en: 'Thailand' }, dialCode: '+66', flag: '🇹🇭' },
  { code: 'VN', name: { es: 'Vietnam', en: 'Vietnam' }, dialCode: '+84', flag: '🇻🇳' },
  { code: 'PH', name: { es: 'Filipinas', en: 'Philippines' }, dialCode: '+63', flag: '🇵🇭' },
  { code: 'ID', name: { es: 'Indonesia', en: 'Indonesia' }, dialCode: '+62', flag: '🇮🇩' },
  { code: 'PK', name: { es: 'Pakistán', en: 'Pakistan' }, dialCode: '+92', flag: '🇵🇰' },
  { code: 'BD', name: { es: 'Bangladés', en: 'Bangladesh' }, dialCode: '+880', flag: '🇧🇩' },
  { code: 'NG', name: { es: 'Nigeria', en: 'Nigeria' }, dialCode: '+234', flag: '🇳🇬' },
  { code: 'KE', name: { es: 'Kenia', en: 'Kenya' }, dialCode: '+254', flag: '🇰🇪' },
];

export const MEXICAN_STATES = [
  'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche',
  'Chiapas', 'Chihuahua', 'Ciudad de México', 'Coahuila', 'Colima', 'Durango',
  'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco', 'México', 'Michoacán',
  'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca', 'Puebla', 'Querétaro',
  'Quintana Roo', 'San Luis Potosí', 'Sinaloa', 'Sonora', 'Tabasco',
  'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas'
];

export const MEXICAN_STATES_EN = [
  'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche',
  'Chiapas', 'Chihuahua', 'Mexico City', 'Coahuila', 'Colima', 'Durango',
  'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco', 'Mexico State', 'Michoacan',
  'Morelos', 'Nayarit', 'Nuevo Leon', 'Oaxaca', 'Puebla', 'Queretaro',
  'Quintana Roo', 'San Luis Potosi', 'Sinaloa', 'Sonora', 'Tabasco',
  'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatan', 'Zacatecas'
];