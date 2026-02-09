import apiClient from './client';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: {
    id: string;
    username: string;
    email: string;
    avatar_url?: string;
  };
}

// 登录
export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await apiClient.post('/auth/login', data);
  return response.data;
};

// 注册
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await apiClient.post('/auth/register', data);
  return response.data;
};

// 登出
export const logout = async (): Promise<void> => {
  await apiClient.post('/auth/logout');
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

// 获取当前用户信息
export const getCurrentUser = async () => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};

// 刷新 token
export const refreshToken = async (refreshToken: string): Promise<AuthResponse> => {
  const response = await apiClient.post('/auth/refresh', {
    refresh_token: refreshToken,
  });
  return response.data;
};

