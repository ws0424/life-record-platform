import apiClient from './client';

// 登录请求数据
export interface LoginData {
  identifier: string; // 用户名或邮箱
  password: string;
  remember?: boolean;
  login_type?: 'email' | 'username';
}

// 注册请求数据
export interface RegisterData {
  email: string;
  code: string;
  username: string;
  password: string;
}

// 发送验证码请求数据
export interface SendCodeData {
  email: string;
  type: 'register' | 'reset';
}

// 重置密码请求数据
export interface ResetPasswordData {
  email: string;
  code: string;
  new_password: string;
  confirm_password: string;
}

// 更新个人信息请求数据
export interface UpdateProfileData {
  username?: string;
  bio?: string;
  avatar?: string;
}

// 修改密码请求数据
export interface ChangePasswordData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

// 用户信息
export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

// 认证响应数据
export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

// 验证码响应数据
export interface SendCodeResponse {
  email: string;
  expires_in: number;
  sent_at: string;
}

// 发送验证码
export const sendCode = async (data: SendCodeData): Promise<SendCodeResponse> => {
  const response = await apiClient.post('/auth/send-code', data);
  return response.data;
};

// 用户注册
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await apiClient.post('/auth/register', data);
  return response.data;
};

// 用户登录
export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await apiClient.post('/auth/login', data);
  return response.data;
};

// 用户登出
export const logout = async (): Promise<void> => {
  try {
    await apiClient.post('/auth/logout');
  } finally {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};

// 获取当前用户信息
export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};

// 更新个人信息
export const updateProfile = async (data: UpdateProfileData): Promise<User> => {
  const response = await apiClient.put('/auth/profile', data);
  return response.data;
};

// 修改密码
export const changePassword = async (data: ChangePasswordData): Promise<void> => {
  const response = await apiClient.post('/auth/change-password', data);
  return response.data;
};

// 刷新 token
export const refreshToken = async (refreshToken: string): Promise<AuthResponse> => {
  const response = await apiClient.post('/auth/refresh', {
    refresh_token: refreshToken,
  });
  return response.data;
};

// 重置密码
export const resetPassword = async (data: ResetPasswordData): Promise<void> => {
  const response = await apiClient.post('/auth/reset-password', data);
  return response.data;
};

// 验证 Token 是否有效
export const verifyToken = async (): Promise<boolean> => {
  try {
    await apiClient.get('/auth/verify-token');
    return true;
  } catch (error) {
    return false;
  }
};

// 获取安全设置信息
export const getSecuritySettings = async () => {
  const response = await apiClient.get('/auth/security/settings');
  return response.data;
};

// 获取登录日志
export const getLoginLogs = async (page: number = 1, pageSize: number = 20) => {
  const response = await apiClient.get('/auth/security/login-logs', {
    params: { page, pageSize }
  });
  return response.data;
};

// 获取登录设备
export const getLoginDevices = async () => {
  const response = await apiClient.get('/auth/security/devices');
  return response.data;
};

// 移除登录设备
export const removeLoginDevice = async (deviceId: string) => {
  const response = await apiClient.delete(`/auth/security/devices/${deviceId}`);
  return response.data;
};

