/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // 图片优化配置
  images: {
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp'],
  },

  // 环境变量
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },

  // CSS 配置
  cssModules: true,

  // Webpack 配置
  webpack: (config) => {
    return config;
  },
};

module.exports = nextConfig;
