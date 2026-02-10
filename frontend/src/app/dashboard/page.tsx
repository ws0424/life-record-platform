'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import styles from './page.module.css';

// Tab 类型
type TabType = 'profile' | 'security' | 'activity' | 'devices' | 'bindings';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 检查登录状态
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    setIsLoading(false);
  }, [isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>加载中...</p>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: '个人信息', icon: '👤' },
    { id: 'security', label: '安全设置', icon: '🔒' },
    { id: 'activity', label: '最新动态', icon: '📊' },
    { id: 'devices', label: '登录设备', icon: '📱' },
    { id: 'bindings', label: '账号绑定', icon: '🔗' },
  ];

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

// 个人信息组件
function ProfileSection({ user }: { user: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 调用更新用户信息 API
    console.log('Update profile:', formData);
    setIsEditing(false);
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>个人信息</h2>
        <button
          className={styles.editBtn}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? '取消' : '编辑'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>用户名</label>
          <input
            type="text"
            className={styles.input}
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            disabled={!isEditing}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>邮箱</label>
          <input
            type="email"
            className={styles.input}
            value={user?.email}
            disabled
          />
          <p className={styles.hint}>邮箱不可修改</p>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>个人简介</label>
          <textarea
            className={styles.textarea}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            disabled={!isEditing}
            rows={4}
            placeholder="介绍一下自己..."
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>注册时间</label>
          <input
            type="text"
            className={styles.input}
            value={new Date(user?.created_at).toLocaleString('zh-CN')}
            disabled
          />
        </div>

        {isEditing && (
          <button type="submit" className={styles.submitBtn}>
            保存修改
          </button>
        )}
      </form>
    </div>
  );
}

// 安全设置组件
function SecuritySection({ user }: { user: any }) {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 调用修改密码 API
    console.log('Change password:', passwordData);
  };

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>安全设置</h2>

      <div className={styles.securityCard}>
        <div className={styles.securityItem}>
          <div className={styles.securityInfo}>
            <h3>修改密码</h3>
            <p>定期修改密码可以提高账户安全性</p>
          </div>
          <button
            className={styles.actionBtn}
            onClick={() => setShowPasswordForm(!showPasswordForm)}
          >
            {showPasswordForm ? '取消' : '修改密码'}
          </button>
        </div>

        {showPasswordForm && (
          <form onSubmit={handlePasswordChange} className={styles.passwordForm}>
            <div className={styles.formGroup}>
              <label className={styles.label}>当前密码</label>
              <input
                type="password"
                className={styles.input}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>新密码</label>
              <input
                type="password"
                className={styles.input}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>确认新密码</label>
              <input
                type="password"
                className={styles.input}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
              />
            </div>

            <button type="submit" className={styles.submitBtn}>
              确认修改
            </button>
          </form>
        )}

        <div className={styles.securityItem}>
          <div className={styles.securityInfo}>
            <h3>邮箱验证</h3>
            <p>
              {user?.is_verified ? (
                <span className={styles.verified}>✓ 已验证</span>
              ) : (
                <span className={styles.unverified}>✗ 未验证</span>
              )}
            </p>
          </div>
          {!user?.is_verified && (
            <button className={styles.actionBtn}>发送验证邮件</button>
          )}
        </div>

        <div className={styles.securityItem}>
          <div className={styles.securityInfo}>
            <h3>账户状态</h3>
            <p>
              {user?.is_active ? (
                <span className={styles.active}>● 正常</span>
              ) : (
                <span className={styles.inactive}>● 已停用</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 最新动态组件
function ActivitySection() {
  const activities = [
    { id: 1, type: 'login', message: '登录账户', time: '2026-02-10 10:30:00', ip: '192.168.1.1' },
    { id: 2, type: 'update', message: '更新个人信息', time: '2026-02-09 15:20:00', ip: '192.168.1.1' },
    { id: 3, type: 'password', message: '修改密码', time: '2026-02-08 09:15:00', ip: '192.168.1.1' },
  ];

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>最新动态</h2>
      <div className={styles.activityList}>
        {activities.map((activity) => (
          <div key={activity.id} className={styles.activityItem}>
            <div className={styles.activityIcon}>
              {activity.type === 'login' && '🔑'}
              {activity.type === 'update' && '✏️'}
              {activity.type === 'password' && '🔒'}
            </div>
            <div className={styles.activityContent}>
              <h4>{activity.message}</h4>
              <p className={styles.activityMeta}>
                {activity.time} · IP: {activity.ip}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 登录设备组件
function DevicesSection() {
  const devices = [
    { id: 1, name: 'Chrome on macOS', location: '北京', lastActive: '刚刚', current: true },
    { id: 2, name: 'Safari on iPhone', location: '上海', lastActive: '2小时前', current: false },
    { id: 3, name: 'Edge on Windows', location: '深圳', lastActive: '1天前', current: false },
  ];

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>登录设备</h2>
      <div className={styles.deviceList}>
        {devices.map((device) => (
          <div key={device.id} className={styles.deviceItem}>
            <div className={styles.deviceIcon}>📱</div>
            <div className={styles.deviceInfo}>
              <h4>
                {device.name}
                {device.current && <span className={styles.currentDevice}>当前设备</span>}
              </h4>
              <p className={styles.deviceMeta}>
                {device.location} · {device.lastActive}
              </p>
            </div>
            {!device.current && (
              <button className={styles.removeBtn}>移除</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// 账号绑定组件
function BindingsSection() {
  const bindings = [
    { id: 'wechat', name: '微信', icon: '💬', bound: false },
    { id: 'github', name: 'GitHub', icon: '🐙', bound: false },
    { id: 'google', name: 'Google', icon: '🔍', bound: false },
  ];

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>账号绑定</h2>
      <div className={styles.bindingList}>
        {bindings.map((binding) => (
          <div key={binding.id} className={styles.bindingItem}>
            <div className={styles.bindingIcon}>{binding.icon}</div>
            <div className={styles.bindingInfo}>
              <h4>{binding.name}</h4>
              <p>
                {binding.bound ? (
                  <span className={styles.bound}>已绑定</span>
                ) : (
                  <span className={styles.unbound}>未绑定</span>
                )}
              </p>
            </div>
            <button className={styles.bindBtn}>
              {binding.bound ? '解绑' : '绑定'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

