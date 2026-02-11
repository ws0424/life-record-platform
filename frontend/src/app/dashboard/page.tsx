'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store/authStore';
import { useToast } from '@/lib/hooks/useToast';
import { ToastContainer } from '@/components/ui/Toast';
import { ProfileSection } from './components/ProfileSection';
import { SecuritySection } from './components/SecuritySection';
import { ActivitySection } from './components/ActivitySection';
import { DevicesSection } from './components/DevicesSection';
import { BindingsSection } from './components/BindingsSection';
import styles from './page.module.css';

type TabType = 'profile' | 'security' | 'activity' | 'devices' | 'bindings';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const { toasts, removeToast, success, error, warning } = useToast();

  const tabs = [
    { id: 'profile', label: '个人信息', icon: '👤' },
    { id: 'security', label: '安全设置', icon: '🔒' },
    { id: 'activity', label: '最新动态', icon: '📊' },
    { id: 'devices', label: '登录设备', icon: '📱' },
    { id: 'bindings', label: '账号绑定', icon: '🔗' },
  ];

  // 检查登录状态，未登录时跳转
  useEffect(() => {
    if (!isAuthenticated) {
      warning('请先登录后再访问个人中心');
      setTimeout(() => {
        router.push('/login?redirect=' + encodeURIComponent('/dashboard'));
      }, 1500);
    }
  }, [isAuthenticated, router, warning]);

  // 未登录时显示加载状态
  if (!isAuthenticated) {
    return (
      <div className={styles.page}>
        <ToastContainer toasts={toasts} onRemove={removeToast} />
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <p>正在跳转到登录页...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div className={styles.container}>
        {/* 侧边栏 */}
        <motion.aside
          className={styles.sidebar}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.userCard}>
            <div className={styles.avatar}>
              {user?.avatar ? (
                <img src={user.avatar} alt={user.username} />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <h2 className={styles.username}>{user?.username}</h2>
            <p className={styles.email}>{user?.email}</p>
            {user?.bio && <p className={styles.bio}>{user.bio}</p>}
          </div>

          <nav className={styles.nav}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.navItem} ${activeTab === tab.id ? styles.active : ''}`}
                onClick={() => setActiveTab(tab.id as TabType)}
              >
                <span className={styles.navIcon}>{tab.icon}</span>
                <span className={styles.navLabel}>{tab.label}</span>
              </button>
            ))}
          </nav>
        </motion.aside>

        {/* 主内容区 */}
        <motion.main
          className={styles.main}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {activeTab === 'profile' && <ProfileSection user={user} success={success} error={error} />}
          {activeTab === 'security' && <SecuritySection user={user} success={success} error={error} />}
          {activeTab === 'activity' && <ActivitySection />}
          {activeTab === 'devices' && <DevicesSection success={success} error={error} />}
          {activeTab === 'bindings' && <BindingsSection />}
        </motion.main>
      </div>
    </div>
  );
}
