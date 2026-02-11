/**
 * 创建页面常量
 */

export const MAX_IMAGES = 9;
export const MAX_VIDEOS = 3;
export const MAX_TITLE_LENGTH = 100;
export const MAX_CONTENT_LENGTH = 10000;

export const CONTENT_TYPES = [
  { 
    id: 'daily' as const, 
    label: '日常记录', 
    icon: '📝', 
    description: '记录生活点滴',
    color: '#1890ff'
  },
  { 
    id: 'album' as const, 
    label: '相册', 
    icon: '📷', 
    description: '分享精彩照片',
    color: '#52c41a'
  },
  { 
    id: 'travel' as const, 
    label: '旅游路线', 
    icon: '🗺️', 
    description: '分享旅行攻略',
    color: '#faad14'
  },
  { 
    id: 'mood' as const, 
    label: '每日心情', 
    icon: '😊', 
    description: '记录心情变化',
    color: '#eb2f96'
  },
] as const;

export const ACCEPTED_IMAGE_TYPES = 'image/jpeg,image/png,image/gif,image/webp';
export const ACCEPTED_VIDEO_TYPES = 'video/mp4,video/mpeg,video/quicktime,video/webm';
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500MB
export const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB 分片大小

