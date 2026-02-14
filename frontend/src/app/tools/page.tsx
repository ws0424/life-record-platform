'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from './page.module.css';

export default function ToolsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className={styles.title}>生活小工具</h1>
          <p className={styles.subtitle}>实用工具，让生活更便捷</p>
        </motion.div>

        <div className={styles.grid}>
          {tools.map((tool, index) => (
            <motion.div
              key={tool.id}
              className={styles.toolCard}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, boxShadow: 'var(--shadow-lg)' }}
            >
              <Link href={tool.href} className={styles.toolLink}>
                <div className={styles.toolIcon} style={{ background: tool.color }}>
                  {tool.icon}
                </div>
                <h2 className={styles.toolTitle}>{tool.title}</h2>
                <p className={styles.toolDescription}>{tool.description}</p>
                <div className={styles.toolFooter}>
                  <span className={styles.category}>{tool.category}</span>
                  <span className={styles.arrow}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

const tools = [
  {
    id: 1,
    title: '倒计时',
    description: '重要日子倒计时，记录每一个值得期待的时刻',
    category: '时间管理',
    href: '/tools/countdown',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    id: 2,
    title: '待办清单',
    description: '管理你的任务和目标，提高工作效率',
    category: '效率工具',
    href: '/tools/todo',
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    id: 3,
    title: '记账本',
    description: '记录日常收支，管理个人财务',
    category: '财务管理',
    href: '/tools/expense',
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    id: 4,
    title: '习惯打卡',
    description: '养成好习惯，坚持每日打卡',
    category: '自我提升',
    href: '/tools/habit',
    color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  {
    id: 5,
    title: '密码生成器',
    description: '生成安全的随机密码',
    category: '安全工具',
    href: '/tools/password',
    color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    id: 6,
    title: '单位转换',
    description: '长度、重量、温度等单位快速转换',
    category: '实用工具',
    href: '/tools/converter',
    color: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="17 1 21 5 17 9" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <polyline points="7 23 3 19 7 15" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
      </svg>
    ),
  },
  {
    id: 7,
    title: '番茄钟',
    description: '专注工作，提高效率的时间管理工具',
    category: '效率工具',
    href: '/tools/pomodoro',
    color: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    id: 8,
    title: '每日一句',
    description: '发现生活中的美好句子，每日一句心灵鸡汤',
    category: '生活美学',
    href: '/tools/hitokoto',
    color: 'linear-gradient(135deg, #E11D48 0%, #FB7185 100%)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <path d="M8 10h8" />
        <path d="M8 14h4" />
      </svg>
    ),
  },
];

