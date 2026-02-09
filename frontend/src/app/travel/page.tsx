'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from './page.module.css';

export default function TravelPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className={styles.title}>旅游路线</h1>
          <p className={styles.subtitle}>发现世界的美好，分享你的旅行故事</p>
          <Link href="/create?type=travel" className={styles.createBtn}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            创建路线
          </Link>
        </motion.div>

        <div className={styles.grid}>
          {mockRoutes.map((route, index) => (
            <motion.article
              key={route.id}
              className={styles.routeCard}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, boxShadow: 'var(--shadow-lg)' }}
            >
              <Link href={`/travel/${route.id}`} className={styles.routeLink}>
                <div className={styles.routeImage}>
                  <div className={styles.imagePlaceholder}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div className={styles.routeBadge}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                    {route.difficulty}
                  </div>
                </div>
                <div className={styles.routeContent}>
                  <h2 className={styles.routeTitle}>{route.title}</h2>
                  <p className={styles.routeDescription}>{route.description}</p>
                  
                  <div className={styles.routeInfo}>
                    <div className={styles.infoItem}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                      {route.duration}
                    </div>
                    <div className={styles.infoItem}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {route.locations} 个地点
                    </div>
                    <div className={styles.infoItem}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <line x1="12" y1="1" x2="12" y2="23" />
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                      {route.budget}
                    </div>
                  </div>

                  <div className={styles.routeTags}>
                    {route.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className={styles.routeMeta}>
                    <div className={styles.author}>
                      <div className={styles.avatar}>
                        {route.author.charAt(0)}
                      </div>
                      <span className={styles.authorName}>{route.author}</span>
                    </div>
                    <div className={styles.stats}>
                      <span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                        {route.likes}
                      </span>
                      <span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        {route.views}
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

const mockRoutes = [
  {
    id: 1,
    title: '京都古都三日游',
    description: '探索京都的古寺、神社和传统街区，体验日本传统文化的魅力',
    duration: '3天2夜',
    locations: 8,
    budget: '¥5000',
    difficulty: '简单',
    tags: ['文化', '历史', '美食'],
    author: '旅行达人',
    likes: 234,
    views: 1567,
  },
  {
    id: 2,
    title: '川藏线自驾之旅',
    description: '从成都出发，沿着318国道，穿越高原、雪山、草原，到达拉萨',
    duration: '15天',
    locations: 20,
    budget: '¥15000',
    difficulty: '困难',
    tags: ['自驾', '高原', '摄影'],
    author: '自驾游侠',
    likes: 456,
    views: 3421,
  },
  {
    id: 3,
    title: '巴厘岛度假攻略',
    description: '阳光、沙滩、海浪，享受热带海岛的悠闲时光',
    duration: '5天4夜',
    locations: 6,
    budget: '¥8000',
    difficulty: '简单',
    tags: ['海岛', '度假', '潜水'],
    author: '海岛控',
    likes: 389,
    views: 2156,
  },
  {
    id: 4,
    title: '新疆伊犁环线',
    description: '薰衣草、草原、雪山、湖泊，新疆最美的季节',
    duration: '7天6夜',
    locations: 12,
    budget: '¥6000',
    difficulty: '中等',
    tags: ['自然', '摄影', '草原'],
    author: '风景猎人',
    likes: 512,
    views: 4023,
  },
  {
    id: 5,
    title: '云南大理丽江',
    description: '苍山洱海、古城风情、玉龙雪山，云南的浪漫之旅',
    duration: '6天5夜',
    locations: 10,
    budget: '¥4500',
    difficulty: '简单',
    tags: ['古城', '自然', '文艺'],
    author: '文艺青年',
    likes: 678,
    views: 5234,
  },
  {
    id: 6,
    title: '张家界凤凰古城',
    description: '奇峰异石、玻璃栈道、古城夜景，湘西的神秘之美',
    duration: '4天3夜',
    locations: 7,
    budget: '¥3500',
    difficulty: '中等',
    tags: ['山水', '古城', '探险'],
    author: '户外爱好者',
    likes: 345,
    views: 2789,
  },
];

