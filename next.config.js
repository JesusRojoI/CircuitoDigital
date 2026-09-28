/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 🔇 Desactiva el indicador flotante de Next.js en desarrollo
  devIndicators: {
    buildActivity: false,
    buildActivityPosition: 'bottom-right',
  },
  // 🔇 Desactiva el indicador de "N" en la esquina
  experimental: {
    // Evita que aparezca el icono de Next.js
  },
  // Oculta el logo de Next.js en dev
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
};

module.exports = nextConfig;