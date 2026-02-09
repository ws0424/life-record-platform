/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // 支持 CSS Modules
  cssModules: true,
  
  // 图片优化配置
  images: {
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // 环境变量
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },
  
  // 实验性功能
  experimental: {
    optimizeCss: true,
  },
};

module.exports = nextConfig;
