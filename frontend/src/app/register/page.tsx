'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, SafetyOutlined } from '@ant-design/icons';
import styles from './page.module.css';
import * as authApi from '@/lib/api/auth';
import { useAuthStore } from '@/lib/store/authStore';

type RegisterFormValues = {
  email: string;
  code: string;
  username: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // 发送验证码
  const handleSendCode = async () => {
    try {
      const email = form.getFieldValue('email');
      
      if (!email) {
        message.error('请输入邮箱地址');
        return;
      }

      // 验证邮箱格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        message.error('请输入正确的邮箱格式');
        return;
      }

      if (countdown > 0) {
        return;
      }

      setIsLoading(true);
      
      await authApi.sendCode({
        email,
        type: 'register',
      });
      
      message.success('验证码已发送到您的邮箱');
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
      message.error(err.message || '验证码发送失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 注册提交
  const handleSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true);
    
    try {
      const response = await authApi.register({
        email: values.email,
        code: values.code,
        username: values.username,
        password: values.password,
      });
      
      // 保存 token 和用户信息
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      setAuth(response.user, response.access_token);
      
      message.success('注册成功！');
      
      // 延迟跳转
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (err: any) {
      console.error('Register error:', err);
      message.error(err.message || '注册失败，请检查信息是否正确');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
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

          <Form
            form={form}
            name="register"
            onFinish={handleSubmit}
            size="large"
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item
              name="email"
              label="邮箱地址"
              rules={[
                { required: true, message: '请输入邮箱地址' },
                { type: 'email', message: '请输入正确的邮箱格式' },
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: 'var(--text-tertiary)' }} />}
                placeholder="your@email.com"
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item
              name="code"
              label="验证码"
              rules={[
                { required: true, message: '请输入验证码' },
                { len: 6, message: '验证码为6位数字' },
              ]}
              extra="验证码将发送到您的邮箱，有效期5分钟"
            >
              <Input
                prefix={<SafetyOutlined style={{ color: 'var(--text-tertiary)' }} />}
                placeholder="请输入6位验证码"
                maxLength={6}
                suffix={
                  <Button
                    type="link"
                    onClick={handleSendCode}
                    disabled={countdown > 0 || isLoading}
                    style={{ padding: 0 }}
                  >
                    {countdown > 0 ? `${countdown}秒后重试` : '发送验证码'}
                  </Button>
                }
              />
            </Form.Item>

            <Form.Item
              name="username"
              label="用户名"
              rules={[
                { required: true, message: '请输入用户名' },
                { min: 2, message: '用户名至少2个字符' },
                { max: 20, message: '用户名最多20个字符' },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: 'var(--text-tertiary)' }} />}
                placeholder="请输入用户名（2-20个字符）"
                autoComplete="username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="密码"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码至少6个字符' },
                { max: 20, message: '密码最多20个字符' },
                {
                  pattern: /^(?=.*[A-Za-z])(?=.*\d)/,
                  message: '密码必须包含字母和数字',
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: 'var(--text-tertiary)' }} />}
                placeholder="至少6位，包含字母和数字"
                autoComplete="new-password"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="确认密码"
              dependencies={['password']}
              rules={[
                { required: true, message: '请再次输入密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: 'var(--text-tertiary)' }} />}
                placeholder="请再次输入密码"
                autoComplete="new-password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                block
                size="large"
                style={{
                  height: 48,
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                注册
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
              已有账户？
              <Link href="/login" style={{ color: 'var(--color-primary)', marginLeft: 8, fontWeight: 500 }}>
                立即登录
              </Link>
            </div>
          </Form>
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
