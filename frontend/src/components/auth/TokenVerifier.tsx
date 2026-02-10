'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { verifyToken, getCurrentUser } from '@/lib/api/auth';

export function TokenVerifier() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isInitialized, user, setUser, setAuth, logout, initialize } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  // 初始化：从 localStorage 恢复状态
  useEffect(() => {
    initialize();
  }, [initialize]);

  // 验证 token 并获取用户信息
  useEffect(() => {
    const checkAuth = async () => {
      // 等待初始化完成
      if (!isInitialized) {
        return;
      }

      // 公开页面不需要验证
      const publicPaths = ['/login', '/register', '/forgot-password', '/'];
      if (publicPaths.includes(pathname)) {
        setIsChecking(false);
        return;
      }

      // 检查是否有 token
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      
      if (!token) {
        // 没有 token，跳转到登录页
        setIsChecking(false);
        if (!publicPaths.includes(pathname)) {
          router.push('/login');
        }
        return;
      }

      try {
        // 验证 token 是否有效
        const isValid = await verifyToken();
        
        if (!isValid) {
          // Token 无效，退出登录
          logout();
          router.push('/login');
          setIsChecking(false);
          return;
        }

        // Token 有效，如果没有用户信息则获取
        if (!user) {
          try {
            const userData = await getCurrentUser();
            setUser(userData);
          } catch (error) {
            console.error('获取用户信息失败:', error);
            // 获取用户信息失败，可能 token 已过期
            logout();
            router.push('/login');
          }
        }
      } catch (error) {
        console.error('Token 验证失败:', error);
        logout();
        router.push('/login');
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [pathname, isInitialized, isAuthenticated, user, setUser, setAuth, logout, router, initialize]);

  // 显示加载状态（可选）
  if (isChecking && pathname !== '/' && pathname !== '/login' && pathname !== '/register' && pathname !== '/forgot-password') {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-primary)',
        zIndex: 9999,
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid var(--border-color)',
          borderTopColor: 'var(--primary-color)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return null;
}

