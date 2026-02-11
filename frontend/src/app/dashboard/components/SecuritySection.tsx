'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { 
  getSecuritySettings, 
  changePassword, 
  changeEmail, 
  sendCode 
} from '@/lib/api/auth';
import styles from '../page.module.css';

interface SecuritySectionProps {
  user: any;
  success: (msg: string) => void;
  error: (msg: string) => void;
}

export function SecuritySection({ user, success, error }: SecuritySectionProps) {
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

  useEffect(() => {
    loadSecuritySettings();
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const loadSecuritySettings = async () => {
    try {
      const settings = await getSecuritySettings();
      setSecuritySettings(settings);
    } catch (err: any) {
      console.error('Load security settings error:', err);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
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
      const updatedUser = await changeEmail({
        new_email: emailData.newEmail,
        code: emailData.code,
        password: emailData.password,
      });
      
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
      <div className={styles.sectionContent}>
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
    </div>
  );
}

