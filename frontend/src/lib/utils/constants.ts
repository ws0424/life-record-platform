// API 基础 URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// 媒体文件 URL
export const MEDIA_BASE_URL = process.env.NEXT_PUBLIC_MEDIA_URL || 'http://localhost:9000';

// 网站 URL
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// 分页配置
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
};

// 文件上传配置
export const UPLOAD = {
  MAX_IMAGE_SIZE: 10, // MB
  MAX_VIDEO_SIZE: 100, // MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/ogg'],
};

// 内容类型
export const CONTENT_TYPES = {
  DAILY: 'daily',
  ALBUM: 'album',
  TRAVEL: 'travel',
  TOOL: 'tool',
} as const;

// 路由路径
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  CREATE: '/create',
  EXPLORE: '/explore',
  DAILY: '/daily',
  ALBUMS: '/albums',
  TRAVEL: '/travel',
  TOOLS: '/tools',
} as const;

