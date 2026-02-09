/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // 图片优化配置
  images: {
    domains: ['localhost', 'your-cdn-domain.com'],
    formats: ['image/avif', 'image/webp'],
  },

  // 支持 Less
  webpack: (config) => {
    config.module.rules.push({
      test: /\.less$/,
      use: [
        {
          loader: 'style-loader',
        },
        {
          loader: 'css-loader',
        },
        {
          loader: 'less-loader',
          options: {
            lessOptions: {
              modifyVars: {
                // Ant Design 主题定制
                '@primary-color': '#1890ff',
                '@link-color': '#1890ff',
                '@success-color': '#52c41a',
                '@warning-color': '#faad14',
                '@error-color': '#f5222d',
                '@font-size-base': '14px',
                '@border-radius-base': '4px',
              },
              javascriptEnabled: true,
            },
          },
        },
      ],
    });
    return config;
  },

  // 生产环境优化
  output: 'standalone',
  
  // 实验性功能
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig

