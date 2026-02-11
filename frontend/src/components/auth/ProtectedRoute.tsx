'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * 路由保护组件
 * 用于保护需要登录才能访问的页面
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isInitialized } = useAuthStore();

  useEffect(() => {
    // 等待初始化完成
    if (!isInitialized) {
      return;
    }

    // 如果未认证，跳转到登录页
    if (!isAuthenticated) {
      const currentPath = window.location.pathname;
      const redirectUrl = encodeURIComponent(currentPath);
      router.replace(`/login?redirect=${redirectUrl}`);
    }
  }, [isAuthenticated, isInitialized, router]);

  // 未初始化或未认证时，显示加载状态
  if (!isInitialized || !isAuthenticated) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'var(--color-background)',
      }}>
        <div style={{
          textAlign: 'center',
          color: 'var(--color-text-secondary)',
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid var(--color-border)',
            borderTopColor: 'var(--color-primary)',
            borderRadius: '50%',
            margin: '0 auto 16px',
            animation: 'spin 0.8s linear infinite',
          }} />
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

