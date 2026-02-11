import axios from 'axios';

// 后端统一响应格式
export interface ApiResponse<T = any> {
  code: number;
  data: T;
  msg: string;
  errMsg: string | null;
}

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    // 后端返回统一格式 {code, data, msg, errMsg}
    const apiResponse: ApiResponse = response.data;
    
    // 如果业务状态码是 401，处理未授权
    if (apiResponse.code === 401) {
      handleUnauthorized();
      const error: any = new Error(apiResponse.errMsg || apiResponse.msg || '未授权，请重新登录');
      error.code = apiResponse.code;
      error.response = response;
      return Promise.reject(error);
    }
    
    // 如果业务状态码不是 200，抛出错误
    if (apiResponse.code !== 200) {
      const error: any = new Error(apiResponse.errMsg || apiResponse.msg);
      error.code = apiResponse.code;
      error.response = response;
      return Promise.reject(error);
    }
    
    // 返回 data 部分
    return { ...response, data: apiResponse.data };
  },
  async (error) => {
    const originalRequest = error.config;

    // 如果是 HTTP 401 错误且还没有重试过
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 尝试刷新 token
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          // 没有 refresh_token，直接退出登录
          handleUnauthorized();
          return Promise.reject(new Error('未授权，请重新登录'));
        }

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          { refresh_token: refreshToken }
        );

        const { access_token } = response.data.data;
        localStorage.setItem('access_token', access_token);

        // 重新发送原始请求
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // 刷新失败，清除 token 并跳转到登录页
        handleUnauthorized();
        return Promise.reject(refreshError);
      }
    }

    // 处理后端返回的错误信息
    if (error.response?.data?.errMsg) {
      error.message = error.response.data.errMsg;
    } else if (error.response?.data?.msg) {
      error.message = error.response.data.msg;
    }

    return Promise.reject(error);
  }
);

/**
 * 处理未授权错误
 * - 清除本地存储的 token
 * - 清除 Zustand store 的认证状态
 * - 如果不在首页，跳转到登录页
 */
function handleUnauthorized() {
  if (typeof window === 'undefined') return;

  // 清除 token
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  
  // 清除 Zustand store 的认证状态
  // 使用动态导入避免循环依赖
  import('@/lib/store/authStore').then(({ useAuthStore }) => {
    useAuthStore.getState().logout();
  });

  // 获取当前路径
  const currentPath = window.location.pathname;

  // 如果在首页或登录页，不跳转
  if (currentPath === '/' || currentPath === '/login') {
    return;
  }

  // 跳转到登录页，并保存当前路径用于登录后跳转
  const redirectUrl = encodeURIComponent(currentPath);
  window.location.href = `/login?redirect=${redirectUrl}`;
}

export default apiClient;

