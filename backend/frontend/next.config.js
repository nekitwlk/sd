/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Отключаем Turbopack полностью — используем стабильный webpack
  experimental: {
    turbopack: false,
  },
};

module.exports = nextConfig;
