'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import styles from './page.module.css';
import * as authApi from '@/lib/api/auth';
import { useAuthStore } from '@/lib/store/authStore';

type LoginFormValues = {
  identifier: string;
  password: string;
  remember: boolean;
};

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      // 判断是邮箱还是用户名
      const isEmail = values.identifier.includes('@');
      
      const response = await authApi.login({
        identifier: values.identifier,
        password: values.password,
        remember: values.remember,
        login_type: isEmail ? 'email' : 'username',
      });
      
      // 保存 token 和用户信息
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      setAuth(response.user, response.access_token);
      
      message.success('登录成功！');
      
      // 获取 redirect 参数
      const searchParams = new URLSearchParams(window.location.search);
      const redirect = searchParams.get('redirect') || '/dashboard';
      
      // 延迟跳转，让用户看到成功提示
      setTimeout(() => {
        router.push(redirect);
      }, 1000);
    } catch (err: any) {
      console.error('Login error:', err);
      message.error(err.message || '登录失败，请检查用户名/邮箱和密码');
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
            <h1 className={styles.title}>欢迎回来</h1>
            <p className={styles.subtitle}>登录你的账户，继续记录生活</p>
          </div>

          <Form
            form={form}
            name="login"
            onFinish={handleSubmit}
            initialValues={{ remember: true }}
            size="large"
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item
              name="identifier"
              label="用户名或邮箱"
              rules={[
                { required: true, message: '请输入用户名或邮箱' },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: 'var(--text-tertiary)' }} />}
                placeholder="用户名或邮箱"
                autoComplete="username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="密码"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码至少6个字符' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: 'var(--text-tertiary)' }} />}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>记住我</Checkbox>
                </Form.Item>
                <Link href="/forgot-password" style={{ color: 'var(--color-primary)' }}>
                  忘记密码？
                </Link>
              </div>
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
                登录
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
              还没有账户？
              <Link href="/register" style={{ color: 'var(--color-primary)', marginLeft: 8, fontWeight: 500 }}>
                立即注册
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
