'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            记录生活的
            <span className={styles.highlight}>每一个精彩瞬间</span>
          </motion.h1>
          
          <motion.p
            className={styles.heroDescription}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            分享你的故事、相册和旅程，与世界连接
          </motion.p>

          <motion.div
            className={styles.heroActions}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link href="/register" className={styles.primaryBtn}>
              开始记录
            </Link>
            <Link href="/explore" className={styles.secondaryBtn}>
              探索更多
            </Link>
          </motion.div>
        </div>

        <motion.div
          className={styles.heroImage}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className={styles.imageCard}>
            <svg viewBox="0 0 200 200" className={styles.illustration}>
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#1890ff', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#722ed1', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              <circle cx="100" cy="100" r="80" fill="url(#grad1)" opacity="0.2" />
              <circle cx="100" cy="100" r="60" fill="url(#grad1)" opacity="0.4" />
              <circle cx="100" cy="100" r="40" fill="url(#grad1)" />
            </svg>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <motion.h2
          className={styles.sectionTitle}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          强大的功能
        </motion.h2>

        <div className={styles.featureGrid}>
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className={styles.featureCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, boxShadow: 'var(--shadow-lg)' }}
            >
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <motion.div
          className={styles.ctaContent}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.ctaTitle}>准备好开始了吗？</h2>
          <p className={styles.ctaDescription}>
            加入我们，开始记录你的精彩生活
          </p>
          <Link href="/register" className={styles.ctaBtn}>
            立即开始
          </Link>
        </motion.div>
      </section>
    </div>
  );
}

const features = [
  {
    title: '日常记录',
    description: '记录生活中的点点滴滴，支持文字、图片、视频等多种形式',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
  },
  {
    title: '相册管理',
    description: '整理和展示你的照片，创建精美的相册集',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
  },
  {
    title: '旅游路线',
    description: '分享你的旅行路线和攻略，帮助他人探索世界',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    title: '生活小工具',
    description: '实用的生活工具，让生活更便捷',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    title: '互动社区',
    description: '评论、点赞、收藏，与朋友互动分享',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
];

