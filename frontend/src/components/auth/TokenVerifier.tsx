'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { verifyToken, getCurrentUser } from '@/lib/api/auth';

// 公开页面列表（不需要登录即可访问）
const PUBLIC_PATHS = [
  '/login', 
  '/register', 
  '/forgot-password', 
  '/',
  '/daily',
  '/albums',
  '/travel',
  '/tools',
  '/trending',
  '/explore',
];

// 需要登录的页面列表
const PROTECTED_PATHS = [
  '/create',
  '/my-works',
  '/settings',
  '/profile',
  '/tools/habit',
  '/tools/countdown',
  '/tools/todo',
  '/tools/expense',
];

export function TokenVerifier() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isInitialized, user, setUser, setAuth, logout, initialize } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  // 初始化：从 localStorage 恢复状态
  useEffect(() => {
    // 延迟初始化，确保 persist 恢复完成
    const timer = setTimeout(() => {
      initialize();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [initialize]);

  // 验证 token 并获取用户信息
  useEffect(() => {
    const checkAuth = async () => {
      // 等待初始化完成
      if (!isInitialized) {
        console.log('等待初始化完成...');
        // 保持 isChecking 为 true，显示加载状态
        return;
      }

      console.log('检查认证状态:', { pathname, isAuthenticated, hasUser: !!user });

      // 检查是否是公开页面
      const isPublicPath = PUBLIC_PATHS.includes(pathname) || 
        pathname.startsWith('/daily/') ||
        pathname.startsWith('/albums/') ||
        pathname.startsWith('/travel/') ||
        pathname.startsWith('/posts/') ||
        pathname.startsWith('/tools/password') ||
        pathname.startsWith('/tools/converter') ||
        pathname.startsWith('/tools/pomodoro');
      
      if (isPublicPath) {
        console.log('公开页面，无需认证');
        setIsChecking(false);
        return;
      }

      // 检查是否有 token
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      
      console.log('Token 检查:', { hasToken: !!token, isAuthenticated });
      
      if (!token) {
        // 没有 token，跳转到登录页
        console.log('没有 token，跳转到登录页');
        setIsChecking(false);
        router.push('/login?redirect=' + encodeURIComponent(pathname));
        return;
      }

      // 有 token 且已认证，直接通过
      if (isAuthenticated) {
        console.log('已认证，用户:', user?.username || '(用户信息加载中)');
        setIsChecking(false);
        
        // 如果没有用户信息，异步获取（不阻塞页面）
        if (!user) {
          console.log('异步获取用户信息...');
          getCurrentUser()
            .then(userData => {
              console.log('用户信息获取成功:', userData);
              setUser(userData);
            })
            .catch(error => {
              console.error('获取用户信息失败:', error);
            });
        }
        return;
      }

      // 有 token 但未认证，恢复认证状态
      console.log('有 token 但未认证，恢复认证状态');
      if (!user) {
        try {
          console.log('获取用户信息...');
          const userData = await getCurrentUser();
          console.log('用户信息获取成功:', userData);
          setAuth(userData, token);
        } catch (error) {
          console.error('获取用户信息失败:', error);
          // 获取用户信息失败，可能 token 已过期
          logout();
          router.push('/login?redirect=' + encodeURIComponent(pathname));
        }
      } else {
        // 有用户信息但未认证，直接设置为已认证
        setAuth(user, token);
      }
      
      setIsChecking(false);
    };

    checkAuth();
  }, [pathname, isInitialized, isAuthenticated, user, setUser, setAuth, logout, router]);

  // 显示加载状态（仅对需要认证的页面）
  const isPublicPath = PUBLIC_PATHS.includes(pathname) || 
    pathname.startsWith('/daily/') ||
    pathname.startsWith('/albums/') ||
    pathname.startsWith('/travel/') ||
    pathname.startsWith('/posts/') ||
    pathname.startsWith('/tools/password') ||
    pathname.startsWith('/tools/converter') ||
    pathname.startsWith('/tools/pomodoro');
  
  if (isChecking && !isPublicPath) {
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

