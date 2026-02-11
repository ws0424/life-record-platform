import apiClient from './client';

export interface ContentCreate {
  type: 'daily' | 'album' | 'travel';
  title: string;
  description?: string;
  content: string;
  tags?: string[];
  images?: string[];
  location?: string;
  extra_data?: Record<string, any>;
  is_public?: boolean;
}

export interface ContentUpdate {
  title?: string;
  description?: string;
  content?: string;
  tags?: string[];
  images?: string[];
  location?: string;
  extra_data?: Record<string, any>;
  is_public?: boolean;
}

export interface UserBrief {
  id: string;
  username: string;
  email: string;
}

export interface Content {
  id: string;
  user_id: string;
  type: 'daily' | 'album' | 'travel';
  title: string;
  description?: string;
  content: string;
  tags: string[];
  images: string[];
  location?: string;
  extra_data?: Record<string, any>;
  is_public: boolean;
  is_featured: boolean;
  view_count: number;
  like_count: number;
  comment_count: number;
  save_count: number;
  created_at: string;
  updated_at: string;
  user?: UserBrief;
  is_liked?: boolean;
  is_saved?: boolean;
}

export interface ContentListItem {
  id: string;
  user_id: string;
  type: 'daily' | 'album' | 'travel';
  title: string;
  description?: string;
  tags: string[];
  images: string[];
  location?: string;
  is_featured: boolean;
  view_count: number;
  like_count: number;
  comment_count: number;
  save_count: number;
  created_at: string;
  user?: UserBrief;
}

export interface ContentListResponse {
  items: ContentListItem[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface CommentCreate {
  comment_text: string;
  parent_id?: string;
}

export interface Comment {
  id: string;
  content_id: string;
  user_id: string;
  comment_text: string;
  parent_id?: string;
  like_count: number;
  created_at: string;
  updated_at: string;
  user?: UserBrief;
  replies?: Comment[];
}

export interface CommentListResponse {
  items: Comment[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface LikeResponse {
  is_liked: boolean;
  like_count: number;
}

export interface SaveResponse {
  is_saved: boolean;
  save_count: number;
}

/**
 * 创建内容
 */
export async function createContent(data: ContentCreate): Promise<Content> {
  const response = await apiClient.post('/content', data);
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
  tag?: string;
  is_featured?: boolean;
}): Promise<ContentListResponse> {
  const response = await apiClient.get('/content', { params });
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

/**
 * 获取日常记录列表
 */
export async function getDailyList(params?: {
  page?: number;
  page_size?: number;
  keyword?: string;
}): Promise<ContentListResponse> {
  const response = await apiClient.get('/content/daily/list', { params });
  return response.data;
}

/**
 * 获取相册列表
 */
export async function getAlbumList(params?: {
  page?: number;
  page_size?: number;
  keyword?: string;
}): Promise<ContentListResponse> {
  const response = await apiClient.get('/content/albums/list', { params });
  return response.data;
}

/**
 * 获取旅游路线列表
 */
export async function getTravelList(params?: {
  page?: number;
  page_size?: number;
  keyword?: string;
}): Promise<ContentListResponse> {
  const response = await apiClient.get('/content/travel/list', { params });
  return response.data;
}

/**
 * 探索内容
 */
export async function exploreContents(params?: {
  page?: number;
  page_size?: number;
  category?: 'all' | 'daily' | 'album' | 'travel' | 'popular';
  keyword?: string;
  tag?: string;
}): Promise<ContentListResponse> {
  const response = await apiClient.get('/content/explore/list', { params });
  return response.data;
}

/**
 * 切换点赞
 */
export async function toggleLike(contentId: string): Promise<LikeResponse> {
  const response = await apiClient.post(`/content/${contentId}/like`);
  return response.data;
}

/**
 * 切换收藏
 */
export async function toggleSave(contentId: string): Promise<SaveResponse> {
  const response = await apiClient.post(`/content/${contentId}/save`);
  return response.data;
}

/**
 * 创建评论
 */
export async function createComment(contentId: string, data: CommentCreate): Promise<Comment> {
  const response = await apiClient.post(`/content/${contentId}/comments`, data);
  return response.data;
}

/**
 * 获取评论列表
 */
export async function getComments(contentId: string, params?: {
  page?: number;
  page_size?: number;
}): Promise<CommentListResponse> {
  const response = await apiClient.get(`/content/${contentId}/comments`, { params });
  return response.data;
}

/**
 * 获取热门标签
 */
export async function getHotTags(limit: number = 10): Promise<{ name: string; count: number }[]> {
  const response = await apiClient.get('/content/tags/hot', { params: { limit } });
  return response.data.tags;
}

