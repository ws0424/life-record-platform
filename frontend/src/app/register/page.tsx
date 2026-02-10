'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import * as authApi from '@/lib/api/auth';
import { useAuthStore } from '@/lib/store/authStore';
import { useToast } from '@/lib/hooks/useToast';
import { ToastContainer } from '@/components/ui/Toast';

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { toasts, removeToast, success, error, info } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  // 注册表单
  const [formData, setFormData] = useState({
    email: '',
    code: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  // 发送验证码
  const handleSendCode = async () => {
    if (!formData.email) {
      error('请输入邮箱地址');
      return;
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      error('请输入正确的邮箱格式');
      return;
    }

    if (countdown > 0) {
      return;
    }

    setIsLoading(true);
    
    try {
      await authApi.sendCode({
        email: formData.email,
        type: 'register',
      });
      
      success('验证码已发送到您的邮箱');
      setCountdown(60);
      
      // 倒计时
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      console.error('Send code error:', err);
      error(err.message || '验证码发送失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 注册提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证密码
    if (formData.password !== formData.confirmPassword) {
      error('两次输入的密码不一致');
      return;
    }

    if (formData.password.length < 6) {
      error('密码长度至少6位');
      return;
    }

    // 验证密码强度（包含字母和数字）
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)/;
    if (!passwordRegex.test(formData.password)) {
      error('密码必须包含字母和数字');
      return;
    }

    if (formData.username.length < 2 || formData.username.length > 20) {
      error('用户名长度必须在2-20个字符之间');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await authApi.register({
        email: formData.email,
        code: formData.code,
        username: formData.username,
        password: formData.password,
      });
      
      // 保存 token 和用户信息
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      setAuth(response.user, response.access_token);
      
      success('注册成功！');
      
      // 延迟跳转
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (err: any) {
      console.error('Register error:', err);
      error(err.message || '注册失败，请检查信息是否正确');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className={styles.page}>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div className={styles.container}>
        <motion.div
          className={styles.formCard}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.formHeader}>
            <h1 className={styles.title}>创建账户</h1>
            <p className={styles.subtitle}>加入我们，开始记录美好生活</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                邮箱地址
              </label>
              <div className={styles.inputWrapper}>
                <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="code" className={styles.label}>
                验证码
              </label>
              <div className={styles.codeWrapper}>
                <div className={styles.inputWrapper}>
                  <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                  <input
                    type="text"
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="请输入6位验证码"
                    maxLength={6}
                    required
                  />
                </div>
                <button
                  type="button"
                  className={styles.codeBtn}
                  onClick={handleSendCode}
                  disabled={countdown > 0 || isLoading}
                >
                  {countdown > 0 ? `${countdown}秒后重试` : '发送验证码'}
                </button>
              </div>
              <p className={styles.hint}>验证码将发送到您的邮箱，有效期5分钟</p>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="username" className={styles.label}>
                用户名
              </label>
              <div className={styles.inputWrapper}>
                <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="请输入用户名（2-20个字符）"
                  minLength={2}
                  maxLength={20}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>
                密码
              </label>
              <div className={styles.inputWrapper}>
                <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="至少6位，包含字母和数字"
                  minLength={6}
                  maxLength={20}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>
                确认密码
              </label>
              <div className={styles.inputWrapper}>
                <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="请再次输入密码"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className={styles.spinner} />
              ) : (
                '注册'
              )}
            </button>

            <div className={styles.loginHint}>
              <p>
                已有账户？
                <Link href="/login" className={styles.loginLink}>
                  立即登录
                </Link>
              </p>
            </div>
          </form>
        </motion.div>

        <motion.div
          className={styles.illustration}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className={styles.illustrationContent}>
            <svg viewBox="0 0 400 400" className={styles.illustrationSvg}>
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#E11D48', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#FB7185', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              <circle cx="200" cy="200" r="150" fill="url(#grad1)" opacity="0.1" />
              <circle cx="200" cy="200" r="100" fill="url(#grad1)" opacity="0.2" />
              <circle cx="200" cy="200" r="50" fill="url(#grad1)" opacity="0.3" />
            </svg>
            <h2 className={styles.illustrationTitle}>开启记录之旅</h2>
            <p className={styles.illustrationText}>
              记录生活点滴，分享精彩瞬间，与志同道合的朋友一起成长
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
