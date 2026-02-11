/**
 * 创建页面类型定义
 */

export type ContentType = 'daily' | 'album' | 'travel' | 'mood';

export interface FormData {
  type: ContentType;
  title: string;
  content: string;
  tags: string[];
  images: File[];
  videos: File[];
  location?: string;
  isPublic: boolean;
}

export interface ContentTypeOption {
  id: ContentType;
  label: string;
  icon: string;
  description: string;
  color: string;
}

