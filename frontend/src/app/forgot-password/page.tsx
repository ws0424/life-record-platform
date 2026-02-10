'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import * as authApi from '@/lib/api/auth';
import { useToast } from '@/lib/hooks/useToast';
import { ToastContainer } from '@/components/ui/Toast';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { toasts, removeToast, success, error } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [step, setStep] = useState<'email' | 'reset'>('email');
  
  const [formData, setFormData] = useState({
    email: '',
    code: '',
    newPassword: '',
    confirmPassword: '',
  });

  // 发送验证码
  const handleSendCode = async () => {
    if (!formData.email) {
      error('请输入邮箱地址');
      return;
    }

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
        type: 'reset',
      });
      
      success('验证码已发送到您的邮箱');
      setStep('reset');
      setCountdown(60);
      
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

  // 重置密码
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 'email') {
      handleSendCode();
      return;
    }

    // 验证密码
    if (formData.newPassword !== formData.confirmPassword) {
      error('两次输入的密码不一致');
      return;
    }

    if (formData.newPassword.length < 6) {
      error('密码长度至少6位');
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)/;
    if (!passwordRegex.test(formData.newPassword)) {
      error('密码必须包含字母和数字');
      return;
    }

    setIsLoading(true);
    
    try {
      await authApi.resetPassword({
        email: formData.email,
        code: formData.code,
        new_password: formData.newPassword,
        confirm_password: formData.confirmPassword,
      });
      
      success('密码重置成功！');
      
      setTimeout(() => {
        router.push('/login');
      }, 1000);
    } catch (err: any) {
      console.error('Reset password error:', err);
      error(err.message || '密码重置失败');
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
            <h1 className={styles.title}>重置密码</h1>
            <p className={styles.subtitle}>
              {step === 'email' 
                ? '输入您的邮箱地址，我们将发送验证码' 
                : '输入验证码和新密码'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {step === 'email' ? (
              <>
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

                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className={styles.spinner} />
                  ) : (
                    '发送验证码'
                  )}
                </button>
              </>
            ) : (
              <>
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
                      {countdown > 0 ? `${countdown}秒后重试` : '重新发送'}
                    </button>
                  </div>
                  <p className={styles.hint}>验证码已发送到 {formData.email}</p>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="newPassword" className={styles.label}>
                    新密码
                  </label>
                  <div className={styles.inputWrapper}>
                    <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
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
                    确认新密码
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
                      placeholder="请再次输入新密码"
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
                    '重置密码'
                  )}
                </button>
              </>
            )}

            <div className={styles.loginHint}>
              <p>
                想起密码了？
                <Link href="/login" className={styles.loginLink}>
                  返回登录
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
            <h2 className={styles.illustrationTitle}>安全重置密码</h2>
            <p className={styles.illustrationText}>
              我们会向您的邮箱发送验证码，确保账户安全
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

