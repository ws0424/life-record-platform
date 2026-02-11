'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, Avatar, Spin, message } from 'antd';
import { UserOutlined, LockOutlined, BarChartOutlined, MobileOutlined, LinkOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/lib/store/authStore';
import { ProfileSection } from './components/ProfileSection';
import { SecuritySection } from './components/SecuritySection';
import { ActivitySection } from './components/ActivitySection';
import { DevicesSection } from './components/DevicesSection';
import { BindingsSection } from './components/BindingsSection';
import styles from './page.module.css';

type TabType = 'profile' | 'security' | 'activity' | 'devices' | 'bindings';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isInitialized, initialize } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isLoading, setIsLoading] = useState(true);

  const tabs = [
    { id: 'profile' as TabType, label: '个人信息', icon: <UserOutlined /> },
    { id: 'security' as TabType, label: '安全设置', icon: <LockOutlined /> },
    { id: 'activity' as TabType, label: '最新动态', icon: <BarChartOutlined /> },
    { id: 'devices' as TabType, label: '登录设备', icon: <MobileOutlined /> },
    { id: 'bindings' as TabType, label: '账号绑定', icon: <LinkOutlined /> },
  ];

  // 初始化认证状态
  useEffect(() => {
    initialize();
  }, [initialize]);

  // 等待初始化完成后再检查登录状态
  useEffect(() => {
    if (isInitialized) {
      setIsLoading(false);
      if (!isAuthenticated) {
        message.warning('请先登录后再访问个人中心');
        setTimeout(() => {
          router.push('/login?redirect=' + encodeURIComponent('/dashboard'));
        }, 1500);
      }
    }
  }, [isInitialized, isAuthenticated, router]);

  // 加载中或未登录时显示加载状态
  if (isLoading || !isAuthenticated) {
    return (
      <div className={styles.page}>
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Spin size="large" tip={isLoading ? "加载中..." : "正在跳转到登录页..."} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* 侧边栏 */}
        <motion.aside
          className={styles.sidebar}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            style={{
              textAlign: 'center',
              marginBottom: 24,
            }}
          >
            <Avatar
              size={80}
              src={user?.avatar}
              style={{
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                marginBottom: 16,
              }}
            >
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>
            <h2 style={{
              fontSize: 20,
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: 8,
            }}>
              {user?.username}
            </h2>
            <p style={{
              fontSize: 14,
              color: 'var(--text-secondary)',
              marginBottom: user?.bio ? 12 : 0,
            }}>
              {user?.email}
            </p>
            {user?.bio && (
              <p style={{
                fontSize: 13,
                color: 'var(--text-tertiary)',
                lineHeight: 1.6,
              }}>
                {user.bio}
              </p>
            )}
          </Card>

          <Card style={{ padding: '8px 0' }}>
            <nav className={styles.nav}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`${styles.navItem} ${activeTab === tab.id ? styles.active : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className={styles.navIcon}>{tab.icon}</span>
                  <span className={styles.navLabel}>{tab.label}</span>
                </button>
              ))}
            </nav>
          </Card>
        </motion.aside>

        {/* 主内容区 */}
        <motion.main
          className={styles.main}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {activeTab === 'profile' && <ProfileSection user={user} />}
          {activeTab === 'security' && <SecuritySection user={user} />}
          {activeTab === 'activity' && <ActivitySection />}
          {activeTab === 'devices' && <DevicesSection />}
          {activeTab === 'bindings' && <BindingsSection />}
        </motion.main>
      </div>
    </div>
  );
}
