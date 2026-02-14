import apiClient from './client';

export interface Post {
  id: string;
  user_id: string;
  type: 'daily' | 'album' | 'travel' | 'tool';
  title: string;
  content: string;
  cover_image?: string;
  is_public: boolean;
  view_count: number;
  like_count: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
  author?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
  tags?: string[];
  media?: any[];
}

export interface CreatePostData {
  type: 'daily' | 'album' | 'travel' | 'tool';
  title: string;
  content: string;
  cover_image?: string;
  is_public?: boolean;
  tags?: string[];
}

export interface UpdatePostData extends Partial<CreatePostData> {}

export interface PostsQuery {
  page?: number;
  limit?: number;
  type?: string;
  tag?: string;
  user_id?: string;
  search?: string;
}

// 获取文章列表
export const getPosts = async (query: PostsQuery = {}) => {
  const response = await apiClient.get('/posts', { params: query });
  return response.data.data;
};

// 获取文章详情
export const getPost = async (id: string) => {
  const response = await apiClient.get(`/posts/${id}`);
  return response.data.data;
};

// 创建文章
export const createPost = async (data: CreatePostData) => {
  const response = await apiClient.post('/posts', data);
  return response.data.data;
};

// 更新文章
export const updatePost = async (id: string, data: UpdatePostData) => {
  const response = await apiClient.put(`/posts/${id}`, data);
  return response.data.data;
};

// 删除文章
export const deletePost = async (id: string) => {
  const response = await apiClient.delete(`/posts/${id}`);
  return response.data.data;
};

// 点赞文章
export const likePost = async (id: string) => {
  const response = await apiClient.post(`/posts/${id}/like`);
  return response.data.data;
};

// 取消点赞
export const unlikePost = async (id: string) => {
  const response = await apiClient.delete(`/posts/${id}/like`);
  return response.data.data;
};

