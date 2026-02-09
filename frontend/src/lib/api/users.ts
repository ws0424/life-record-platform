import apiClient from './client';

export interface User {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdateUserData {
  username?: string;
  bio?: string;
  avatar_url?: string;
}

// 获取用户信息
export const getUser = async (id: string) => {
  const response = await apiClient.get(`/users/${id}`);
  return response.data;
};

// 更新用户信息
export const updateUser = async (id: string, data: UpdateUserData) => {
  const response = await apiClient.put(`/users/${id}`, data);
  return response.data;
};

// 获取用户的文章
export const getUserPosts = async (id: string, page = 1, limit = 10) => {
  const response = await apiClient.get(`/users/${id}/posts`, {
    params: { page, limit },
  });
  return response.data;
};

// 关注用户
export const followUser = async (id: string) => {
  const response = await apiClient.post(`/users/${id}/follow`);
  return response.data;
};

// 取消关注
export const unfollowUser = async (id: string) => {
  const response = await apiClient.delete(`/users/${id}/follow`);
  return response.data;
};

