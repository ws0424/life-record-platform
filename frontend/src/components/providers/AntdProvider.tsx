'use client';

import { ConfigProvider, App } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { antdTheme, antdDarkTheme } from '@/lib/theme/antd';
import { useEffect, useState } from 'react';

export function AntdProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // 检测当前主题
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      setIsDark(theme === 'dark');
    };

    checkTheme();

    // 监听主题变化
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <ConfigProvider
      locale={zhCN}
      theme={isDark ? antdDarkTheme : antdTheme}
    >
      <App>
        {children}
      </App>
    </ConfigProvider>
  );
}

