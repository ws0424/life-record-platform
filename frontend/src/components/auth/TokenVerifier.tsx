'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { verifyToken } from '@/lib/api/auth';

export function TokenVerifier() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    // 公开页面不需要验证
    const publicPaths = ['/login', '/register', '/forgot-password', '/'];
    if (publicPaths.includes(pathname)) {
      return;
    }

    // 如果用户已登录，验证 token
    const checkToken = async () => {
      if (isAuthenticated) {
        const isValid = await verifyToken();
        if (!isValid) {
          // Token 无效或过期，退出登录
          logout();
          router.push('/login');
        }
      }
    };

    checkToken();
  }, [pathname, isAuthenticated, logout, router]);

  return null;
}

