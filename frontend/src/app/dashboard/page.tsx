'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, Avatar, Tabs, Spin, message } from 'antd';
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
  const { user, isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  const tabItems = [
    {
      key: 'profile',
      label: (
        <span>
          <UserOutlined style={{ marginRight: 8 }} />
          个人信息
        </span>
      ),
      children: <ProfileSection user={user} />,
    },
    {
      key: 'security',
      label: (
        <span>
          <LockOutlined style={{ marginRight: 8 }} />
          安全设置
        </span>
      ),
      children: <SecuritySection user={user} />,
    },
    {
      key: 'activity',
      label: (
        <span>
          <BarChartOutlined style={{ marginRight: 8 }} />
          最新动态
        </span>
      ),
      children: <ActivitySection />,
    },
    {
      key: 'devices',
      label: (
        <span>
          <MobileOutlined style={{ marginRight: 8 }} />
          登录设备
        </span>
      ),
      children: <DevicesSection />,
    },
    {
      key: 'bindings',
      label: (
        <span>
          <LinkOutlined style={{ marginRight: 8 }} />
          账号绑定
        </span>
      ),
      children: <BindingsSection />,
    },
  ];

  // 检查登录状态，未登录时跳转
  useEffect(() => {
    if (!isAuthenticated) {
      message.warning('请先登录后再访问个人中心');
      setTimeout(() => {
        router.push('/login?redirect=' + encodeURIComponent('/dashboard'));
      }, 1500);
    }
  }, [isAuthenticated, router]);

  // 未登录时显示加载状态
  if (!isAuthenticated) {
    return (
      <div className={styles.page}>
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Spin size="large" tip="正在跳转到登录页..." />
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
        </motion.aside>

        {/* 主内容区 */}
        <motion.main
          className={styles.main}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Tabs
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key as TabType)}
            items={tabItems}
            size="large"
            tabPosition="top"
          />
        </motion.main>
      </div>
    </div>
  );
}
