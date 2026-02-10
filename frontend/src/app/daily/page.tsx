'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from './page.module.css';

export default function DailyPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className={styles.title}>日常记录</h1>
          <p className={styles.subtitle}>记录生活的点点滴滴</p>
        </motion.div>

        <div className={styles.grid}>
          {mockPosts.map((post, index) => (
            <motion.article
              key={post.id}
              className={styles.card}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, boxShadow: 'var(--shadow-lg)' }}
            >
              <Link href={`/daily/${post.id}`} className={styles.cardLink}>
                <div className={styles.cardImage}>
                  <div className={styles.imagePlaceholder}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                </div>
                <div className={styles.cardContent}>
                  <h2 className={styles.cardTitle}>{post.title}</h2>
                  <p className={styles.cardDescription}>{post.description}</p>
                  <div className={styles.cardMeta}>
                    <span className={styles.date}>{post.date}</span>
                    <div className={styles.stats}>
                      <span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                        {post.likes}
                      </span>
                      <span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        {post.comments}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}

const mockPosts = [
  {
    id: 1,
    title: '美好的一天',
    description: '今天天气很好，和朋友一起去公园散步，心情愉悦。',
    date: '2024-02-09',
    likes: 42,
    comments: 8,
  },
  {
    id: 2,
    title: '学习新技能',
    description: '开始学习 Next.js 14，感觉很有趣，期待做出更多项目。',
    date: '2024-02-08',
    likes: 35,
    comments: 5,
  },
  {
    id: 3,
    title: '美食分享',
    description: '尝试了一家新开的餐厅，味道很不错，推荐给大家。',
    date: '2024-02-07',
    likes: 58,
    comments: 12,
  },
  {
    id: 4,
    title: '周末计划',
    description: '这个周末打算去爬山，呼吸新鲜空气，放松心情。',
    date: '2024-02-06',
    likes: 28,
    comments: 6,
  },
  {
    id: 5,
    title: '读书笔记',
    description: '最近在读一本很有意思的书，收获颇多，值得推荐。',
    date: '2024-02-05',
    likes: 45,
    comments: 9,
  },
  {
    id: 6,
    title: '运动打卡',
    description: '坚持运动第30天，感觉身体状态越来越好了。',
    date: '2024-02-04',
    likes: 52,
    comments: 11,
  },
];

