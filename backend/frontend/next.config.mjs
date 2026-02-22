/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Полностью отключаем Turbopack
  experimental: {
    turbopack: false,
  },
};

export default nextConfig;
