import apiClient from './client';

export interface ContentCreate {
  type: 'daily' | 'album' | 'travel';
  title: string;
  content: string;
  tags?: string[];
  images?: string[];
  location?: string;
  is_public?: boolean;
}

export interface ContentUpdate {
  title?: string;
  content?: string;
  tags?: string[];
  images?: string[];
  location?: string;
  is_public?: boolean;
}

export interface Content {
  id: string;
  user_id: string;
  type: 'daily' | 'album' | 'travel';
  title: string;
  content: string;
  tags: string[];
  images: string[];
  location?: string;
  is_public: boolean;
  view_count: number;
  like_count: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
}

export interface ContentListResponse {
  items: Content[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

/**
 * 创建内容
 */
export async function createContent(data: ContentCreate): Promise<Content> {
  const response = await apiClient.post('/content/', data);
  return response.data;
}

/**
 * 获取内容详情
 */
export async function getContent(contentId: string): Promise<Content> {
  const response = await apiClient.get(`/content/${contentId}`);
  return response.data;
}

/**
 * 更新内容
 */
export async function updateContent(contentId: string, data: ContentUpdate): Promise<Content> {
  const response = await apiClient.put(`/content/${contentId}`, data);
  return response.data;
}

/**
 * 删除内容
 */
export async function deleteContent(contentId: string): Promise<void> {
  await apiClient.delete(`/content/${contentId}`);
}

/**
 * 获取内容列表
 */
export async function getContentList(params?: {
  page?: number;
  page_size?: number;
  type?: 'daily' | 'album' | 'travel';
  user_id?: string;
  is_public?: boolean;
  keyword?: string;
}): Promise<ContentListResponse> {
  const response = await apiClient.get('/content/', { params });
  return response.data;
}

/**
 * 获取我的内容
 */
export async function getMyContents(params?: {
  page?: number;
  page_size?: number;
  type?: 'daily' | 'album' | 'travel';
}): Promise<ContentListResponse> {
  const response = await apiClient.get('/content/my/contents', { params });
  return response.data;
}

