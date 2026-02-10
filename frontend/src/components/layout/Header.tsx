'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/common/ThemeToggle';
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
          <Link href="/create" className={styles.createBtn}>
            <svg className={styles.createIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>创建</span>
          </Link>
          <Link href="/login" className={styles.loginBtn}>
            登录
          </Link>
        </div>
      </div>
    </header>
  );
}

