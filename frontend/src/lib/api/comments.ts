import apiClient from './client';

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  parent_id?: string;
  content: string;
  like_count: number;
  created_at: string;
  updated_at: string;
  author?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
  replies?: Comment[];
}

export interface CreateCommentData {
  post_id: string;
  content: string;
  parent_id?: string;
}

// 获取评论列表
export const getComments = async (postId: string) => {
  const response = await apiClient.get(`/posts/${postId}/comments`);
  return response.data;
};

// 创建评论
export const createComment = async (data: CreateCommentData) => {
  const response = await apiClient.post(`/posts/${data.post_id}/comments`, data);
  return response.data;
};

// 更新评论
export const updateComment = async (id: string, content: string) => {
  const response = await apiClient.put(`/comments/${id}`, { content });
  return response.data;
};

// 删除评论
export const deleteComment = async (id: string) => {
  const response = await apiClient.delete(`/comments/${id}`);
  return response.data;
};

// 点赞评论
export const likeComment = async (id: string) => {
  const response = await apiClient.post(`/comments/${id}/like`);
  return response.data;
};

