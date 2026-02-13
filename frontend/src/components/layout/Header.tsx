'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { useAuthStore } from '@/lib/store/authStore';
import { useState, useEffect, useRef } from 'react';
import styles from './Header.module.css';

const navItems = [
  { label: '首页', href: '/' },
  { label: '日常记录', href: '/daily' },
  { label: '相册', href: '/albums' },
  { label: '旅游路线', href: '/travel' },
  { label: '小工具', href: '/tools' },
  { label: '热搜榜', href: '/trending' },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  // 监听 token 变化，如果 token 被清除则更新认证状态
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('access_token');
      if (!token && isAuthenticated) {
        // token 被清除但状态还是已认证，更新状态
        logout();
      }
    };

    // 初始检查
    checkAuth();

    // 定期检查（每秒检查一次）
    const interval = setInterval(checkAuth, 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated, logout]);

  const handleLogout = () => {
    setShowUserMenu(false);
    logout();
    router.push('/login');
  };

  const handleMenuItemClick = () => {
    setShowUserMenu(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <svg className={styles.logoIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span className={styles.logoText}>生活记录</span>
        </Link>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${pathname === item.href ? styles.active : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <ThemeToggle />
          
          {isAuthenticated ? (
            <>
              <Link href="/create" className={styles.createBtn}>
                <svg className={styles.createIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>创建</span>
              </Link>
              
              <div className={styles.userMenu} ref={menuRef}>
                <button
                  className={styles.userBtn}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.username} className={styles.avatar} />
                  ) : (
                    <div className={styles.avatarPlaceholder}>
                      {user?.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className={styles.username}>{user?.username}</span>
                  <svg className={styles.chevron} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                
                {showUserMenu && (
                  <div className={styles.dropdown}>
                    <Link 
                      href="/dashboard" 
                      className={styles.dropdownItem}
                      onClick={handleMenuItemClick}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      个人中心
                    </Link>
                    <Link 
                      href="/my-works" 
                      className={styles.dropdownItem}
                      onClick={handleMenuItemClick}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                      </svg>
                      我的创作
                    </Link>
                    <Link 
                      href="/settings" 
                      className={styles.dropdownItem}
                      onClick={handleMenuItemClick}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24" />
                      </svg>
                      设置
                    </Link>
                    <div className={styles.divider} />
                    <button onClick={handleLogout} className={styles.dropdownItem}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      退出登录
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link href="/login" className={styles.loginBtn}>
              登录
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

