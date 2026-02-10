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

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { toasts, removeToast, success, error } = useToast();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await authApi.login({
        email: formData.email,
        password: formData.password,
        remember: formData.remember,
      });
      
      // 保存 token 和用户信息
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      setAuth(response.user, response.access_token);
      
      success('登录成功！');
      
      // 延迟跳转，让用户看到成功提示
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (err: any) {
      console.error('Login error:', err);
      error(err.message || '登录失败，请检查邮箱和密码');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
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
            <h1 className={styles.title}>欢迎回来</h1>
            <p className={styles.subtitle}>登录你的账户，继续记录生活</p>
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
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className={styles.formOptions}>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                />
                <span className={styles.checkboxLabel}>记住我</span>
              </label>
              <Link href="/forgot-password" className={styles.forgotLink}>
                忘记密码？
              </Link>
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className={styles.spinner} />
              ) : (
                '登录'
              )}
            </button>

            <div className={styles.registerHint}>
              <p>
                还没有账户？
                <Link href="/register" className={styles.registerLink}>
                  立即注册
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
            <h2 className={styles.illustrationTitle}>记录生活的每一刻</h2>
            <p className={styles.illustrationText}>
              分享你的故事、相册和旅程，与世界连接
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
