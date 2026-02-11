/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // 禁用自动添加末尾斜杠（避免 307/308 重定向）
  trailingSlash: false,

  // 图片优化配置
  images: {
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp'],
  },

  // 环境变量
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },

  // 开发环境代理配置
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
    ];
  },

  // 禁用 X-Powered-By 头
  poweredByHeader: false,

  // 跳过末尾斜杠重定向
  skipTrailingSlashRedirect: true,

  // Webpack 配置
  webpack: (config) => {
    return config;
  },
};

module.exports = nextConfig;
