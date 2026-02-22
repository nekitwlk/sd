const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  turbopack: {
    root: path.resolve(__dirname),  // фиксирует "inferred your workspace root" и поиск next/package.json
  },
};

module.exports = nextConfig;