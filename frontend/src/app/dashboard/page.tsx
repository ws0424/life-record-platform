'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { useToast } from '@/lib/hooks/useToast';
import { ToastContainer } from '@/components/ui/Toast';
import styles from './page.module.css';

// Tab 类型
type TabType = 'profile' | 'security' | 'activity' | 'devices' | 'bindings';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isLoading, setIsLoading] = useState(true);
  const { toasts, removeToast, success, error } = useToast();

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
          {activeTab === 'devices' && <DevicesSection />}
          {activeTab === 'bindings' && <BindingsSection />}
        </motion.main>
      </div>
    </div>
  );
}

// 个人信息组件
function ProfileSection({ user, success, error }: { user: any; success: (msg: string) => void; error: (msg: string) => void }) {
  const { setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { updateProfile } = await import('@/lib/api/auth');
      const updatedUser = await updateProfile(formData);
      
      // 更新本地用户信息
      setUser(updatedUser);
      success('个人信息更新成功！');
      setIsEditing(false);
    } catch (err: any) {
      console.error('Update profile error:', err);
      error(err.message || '更新失败，请重试');
    } finally {
      setIsLoading(false);
    }
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
          <button type="submit" className={styles.submitBtn} disabled={isLoading}>
            {isLoading ? '保存中...' : '保存修改'}
          </button>
        )}
      </form>
    </div>
  );
}

// 安全设置组件
function SecuritySection({ user, success, error }: { user: any; success: (msg: string) => void; error: (msg: string) => void }) {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [securitySettings, setSecuritySettings] = useState<any>(null);
  const { setUser } = useAuthStore();
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [emailData, setEmailData] = useState({
    newEmail: '',
    code: '',
    password: '',
  });

  // 加载安全设置信息
  useEffect(() => {
    const loadSecuritySettings = async () => {
      try {
        const { getSecuritySettings } = await import('@/lib/api/auth');
        const settings = await getSecuritySettings();
        setSecuritySettings(settings);
      } catch (err: any) {
        console.error('Load security settings error:', err);
      }
    };
    loadSecuritySettings();
  }, []);

  // 倒计时
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { changePassword } = await import('@/lib/api/auth');
      await changePassword({
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
        confirm_password: passwordData.confirmPassword,
      });
      
      success('密码修改成功！');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setShowPasswordForm(false);
    } catch (err: any) {
      console.error('Change password error:', err);
      error(err.message || '密码修改失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendCode = async () => {
    if (!emailData.newEmail) {
      error('请输入新邮箱地址');
      return;
    }

    setIsSendingCode(true);
    try {
      const { sendCode } = await import('@/lib/api/auth');
      await sendCode({
        email: emailData.newEmail,
        type: 'register',
      });
      success('验证码已发送到新邮箱！');
      setCountdown(60);
    } catch (err: any) {
      console.error('Send code error:', err);
      error(err.message || '验证码发送失败，请重试');
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { changeEmail } = await import('@/lib/api/auth');
      const updatedUser = await changeEmail({
        new_email: emailData.newEmail,
        code: emailData.code,
        password: emailData.password,
      });
      
      // 更新本地用户信息
      setUser(updatedUser);
      success('邮箱换绑成功！');
      setEmailData({
        newEmail: '',
        code: '',
        password: '',
      });
      setShowEmailForm(false);
    } catch (err: any) {
      console.error('Change email error:', err);
      error(err.message || '邮箱换绑失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>安全设置</h2>

      {securitySettings && (
        <div className={styles.securityOverview}>
          <div className={styles.overviewItem}>
            <span className={styles.overviewLabel}>活跃设备</span>
            <span className={styles.overviewValue}>{securitySettings.active_devices_count} 台</span>
          </div>
          <div className={styles.overviewItem}>
            <span className={styles.overviewLabel}>最近30天登录</span>
            <span className={styles.overviewValue}>{securitySettings.recent_login_count} 次</span>
          </div>
        </div>
      )}

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
                minLength={6}
              />
              <p className={styles.hint}>密码必须包含字母和数字，长度至少6位</p>
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

            <button type="submit" className={styles.submitBtn} disabled={isLoading}>
              {isLoading ? '修改中...' : '确认修改'}
            </button>
          </form>
        )}

        <div className={styles.securityItem}>
          <div className={styles.securityInfo}>
            <h3>邮箱验证</h3>
            <p>
              当前邮箱: {user?.email}
              {user?.is_verified ? (
                <span className={styles.verified}> ✓ 已验证</span>
              ) : (
                <span className={styles.unverified}> ✗ 未验证</span>
              )}
            </p>
          </div>
          <button 
            className={styles.actionBtn}
            onClick={() => setShowEmailForm(!showEmailForm)}
          >
            {showEmailForm ? '取消' : '换绑邮箱'}
          </button>
        </div>

        {showEmailForm && (
          <form onSubmit={handleEmailChange} className={styles.passwordForm}>
            <div className={styles.formGroup}>
              <label className={styles.label}>新邮箱地址</label>
              <input
                type="email"
                className={styles.input}
                value={emailData.newEmail}
                onChange={(e) => setEmailData({ ...emailData, newEmail: e.target.value })}
                required
                placeholder="请输入新邮箱地址"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>验证码</label>
              <div className={styles.codeInputWrapper}>
                <input
                  type="text"
                  className={styles.input}
                  value={emailData.code}
                  onChange={(e) => setEmailData({ ...emailData, code: e.target.value })}
                  required
                  maxLength={6}
                  placeholder="请输入6位验证码"
                />
                <button
                  type="button"
                  className={styles.sendCodeBtn}
                  onClick={handleSendCode}
                  disabled={isSendingCode || countdown > 0}
                >
                  {countdown > 0 ? `${countdown}秒后重试` : isSendingCode ? '发送中...' : '发送验证码'}
                </button>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>当前密码</label>
              <input
                type="password"
                className={styles.input}
                value={emailData.password}
                onChange={(e) => setEmailData({ ...emailData, password: e.target.value })}
                required
                placeholder="请输入当前密码以验证身份"
              />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={isLoading}>
              {isLoading ? '换绑中...' : '确认换绑'}
            </button>
          </form>
        )}

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
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const { getLoginLogs } = await import('@/lib/api/auth');
        const logs = await getLoginLogs(1, 10);
        setActivities(logs);
      } catch (err: any) {
        console.error('Load activities error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadActivities();
  }, []);

  if (isLoading) {
    return (
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>最新动态</h2>
        <div className={styles.loading}>加载中...</div>
      </div>
    );
  }

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>最新动态</h2>
      <div className={styles.activityList}>
        {activities.length === 0 ? (
          <p className={styles.emptyText}>暂无登录记录</p>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className={styles.activityItem}>
              <div className={styles.activityIcon}>
                {activity.login_type === 'password' && '🔑'}
                {activity.status === 'success' ? '✅' : '❌'}
              </div>
              <div className={styles.activityContent}>
                <h4>
                  {activity.status === 'success' ? '登录成功' : '登录失败'}
                  {activity.browser && ` - ${activity.browser}`}
                  {activity.os && ` on ${activity.os}`}
                </h4>
                <p className={styles.activityMeta}>
                  {new Date(activity.created_at).toLocaleString('zh-CN')} · IP: {activity.ip_address}
                  {activity.location && ` · ${activity.location}`}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// 登录设备组件
function DevicesSection() {
  const [devices, setDevices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { success, error } = useToast();

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      const { getLoginDevices } = await import('@/lib/api/auth');
      const deviceList = await getLoginDevices();
      setDevices(deviceList);
    } catch (err: any) {
      console.error('Load devices error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveDevice = async (deviceId: string) => {
    if (!confirm('确定要移除此设备吗？')) {
      return;
    }

    try {
      const { removeLoginDevice } = await import('@/lib/api/auth');
      await removeLoginDevice(deviceId);
      success('设备移除成功！');
      // 重新加载设备列表
      loadDevices();
    } catch (err: any) {
      console.error('Remove device error:', err);
      error(err.message || '设备移除失败，请重试');
    }
  };

  const handleForceLogout = async (deviceId: string) => {
    if (!confirm('确定要强制此设备下线吗？该设备将立即失去访问权限。')) {
      return;
    }

    try {
      const { forceLogoutDevice } = await import('@/lib/api/auth');
      await forceLogoutDevice(deviceId);
      success('设备已强制下线！');
      // 重新加载设备列表
      loadDevices();
    } catch (err: any) {
      console.error('Force logout device error:', err);
      error(err.message || '强制下线失败，请重试');
    }
  };

  if (isLoading) {
    return (
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>登录设备</h2>
        <div className={styles.loading}>加载中...</div>
      </div>
    );
  }

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>登录设备</h2>
      <div className={styles.deviceList}>
        {devices.length === 0 ? (
          <p className={styles.emptyText}>暂无登录设备</p>
        ) : (
          devices.map((device) => (
            <div key={device.id} className={styles.deviceItem}>
              <div className={styles.deviceIcon}>
                {device.device_type === 'mobile' && '📱'}
                {device.device_type === 'tablet' && '📱'}
                {device.device_type === 'desktop' && '💻'}
                {!device.device_type && '🖥️'}
              </div>
              <div className={styles.deviceInfo}>
                <h4>
                  {device.device_name}
                  {device.is_current && <span className={styles.currentDevice}>当前设备</span>}
                </h4>
                <p className={styles.deviceMeta}>
                  {device.location || device.ip_address} · 
                  最后活跃: {new Date(device.last_active).toLocaleString('zh-CN')}
                </p>
              </div>
              {!device.is_current && (
                <div className={styles.deviceActions}>
                  <button 
                    className={styles.logoutBtn}
                    onClick={() => handleForceLogout(device.device_id)}
                  >
                    强制下线
                  </button>
                  <button 
                    className={styles.removeBtn}
                    onClick={() => handleRemoveDevice(device.device_id)}
                  >
                    移除
                  </button>
                </div>
              )}
            </div>
          ))
        )}
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

