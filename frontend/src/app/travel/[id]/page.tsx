'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

export default function TravelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const routeId = params.id as string;
  
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // TODO: 从 API 获取数据
  const route = {
    id: routeId,
    title: '京都古都三日游',
    description: '探索京都的古寺、神社和传统街区，体验日本传统文化的魅力',
    content: `这是一条精心设计的京都三日游路线，带你深度体验这座千年古都的魅力。

**第一天：东山区探索**
- 上午：清水寺 → 二年坂、三年坂
- 下午：八坂神社 → 祇园
- 晚上：鸭川边散步

**第二天：岚山之旅**
- 上午：竹林小径 → 天龙寺
- 下午：渡月桥 → 岚山公园
- 晚上：嵯峨野小火车

**第三天：金阁寺与北区**
- 上午：金阁寺 → 龙安寺
- 下午：哲学之道 → 银阁寺
- 晚上：锦市场购物

每个景点都有详细的交通指南和游玩建议，让你的京都之旅更加顺利！`,
    author: {
      username: 'traveler',
      name: '旅行达人',
      avatar: 'T',
      bio: '热爱旅行，用脚步丈量世界',
    },
    date: '2024-03-15',
    duration: '3天2夜',
    locations: 8,
    budget: '¥5000',
    difficulty: '简单',
    tags: ['文化', '历史', '美食', '京都'],
    likes: 234,
    views: 1567,
    saves: 89,
    waypoints: [
      { name: '清水寺', description: '京都最著名的寺庙之一', time: '2小时' },
      { name: '二年坂、三年坂', description: '传统街区，有很多特色小店', time: '1小时' },
      { name: '八坂神社', description: '祇园的守护神社', time: '1小时' },
      { name: '祇园', description: '京都最有名的艺伎区', time: '2小时' },
      { name: '竹林小径', description: '岚山标志性景点', time: '30分钟' },
      { name: '天龙寺', description: '世界文化遗产', time: '1.5小时' },
      { name: '金阁寺', description: '金碧辉煌的寺庙', time: '1.5小时' },
      { name: '哲学之道', description: '樱花季最美的散步道', time: '1小时' },
    ],
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* 返回按钮 */}
        <button className={styles.backBtn} onClick={() => router.back()}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          返回
        </button>

        {/* 路线头部 */}
        <motion.header
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.headerBg}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>

          <div className={styles.headerContent}>
            <div className={styles.badge}>{route.difficulty}</div>
            <h1 className={styles.title}>{route.title}</h1>
            <p className={styles.description}>{route.description}</p>

            <div className={styles.meta}>
              <Link href={`/profile/${route.author.username}`} className={styles.author}>
                <div className={styles.avatar}>{route.author.avatar}</div>
                <div className={styles.authorInfo}>
                  <span className={styles.authorName}>{route.author.name}</span>
                  <span className={styles.date}>{route.date}</span>
                </div>
              </Link>

              <div className={styles.stats}>
                <span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  {route.views}
                </span>
                <span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                  {route.saves}
                </span>
              </div>
            </div>
          </div>
        </motion.header>

        <div className={styles.content}>
          {/* 路线信息 */}
          <motion.section
            className={styles.infoSection}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className={styles.sectionTitle}>路线信息</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoCard}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                <div>
                  <div className={styles.infoLabel}>行程时长</div>
                  <div className={styles.infoValue}>{route.duration}</div>
                </div>
              </div>

              <div className={styles.infoCard}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <div>
                  <div className={styles.infoLabel}>途经地点</div>
                  <div className={styles.infoValue}>{route.locations} 个</div>
                </div>
              </div>

              <div className={styles.infoCard}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                <div>
                  <div className={styles.infoLabel}>预算费用</div>
                  <div className={styles.infoValue}>{route.budget}</div>
                </div>
              </div>

              <div className={styles.infoCard}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
                <div>
                  <div className={styles.infoLabel}>难度等级</div>
                  <div className={styles.infoValue}>{route.difficulty}</div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* 地图区域 */}
          <motion.section
            className={styles.mapSection}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className={styles.sectionTitle}>路线地图</h2>
            <div className={styles.mapPlaceholder}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z" />
                <line x1="8" y1="2" x2="8" y2="18" />
                <line x1="16" y1="6" x2="16" y2="22" />
              </svg>
              <p>地图功能开发中...</p>
            </div>
          </motion.section>

          {/* 途经点 */}
          <motion.section
            className={styles.waypointsSection}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className={styles.sectionTitle}>途经地点</h2>
            <div className={styles.waypoints}>
              {route.waypoints.map((waypoint, index) => (
                <motion.div
                  key={index}
                  className={styles.waypoint}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                >
                  <div className={styles.waypointNumber}>{index + 1}</div>
                  <div className={styles.waypointContent}>
                    <h3 className={styles.waypointName}>{waypoint.name}</h3>
                    <p className={styles.waypointDescription}>{waypoint.description}</p>
                    <div className={styles.waypointTime}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                      建议游玩时间：{waypoint.time}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* 详细内容 */}
          <motion.section
            className={styles.detailSection}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className={styles.sectionTitle}>详细攻略</h2>
            <div className={styles.detailContent}>
              {route.content.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </motion.section>

          {/* 标签 */}
          <div className={styles.tags}>
            {route.tags.map((tag) => (
              <Link key={tag} href={`/explore?tag=${tag}`} className={styles.tag}>
                #{tag}
              </Link>
            ))}
          </div>

          {/* 操作按钮 */}
          <div className={styles.actions}>
            <button
              className={`${styles.actionBtn} ${isLiked ? styles.actionBtnActive : ''}`}
              onClick={() => setIsLiked(!isLiked)}
            >
              <svg viewBox="0 0 24 24" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span>{isLiked ? route.likes + 1 : route.likes}</span>
            </button>

            <button
              className={`${styles.actionBtn} ${isSaved ? styles.actionBtnActive : ''}`}
              onClick={() => setIsSaved(!isSaved)}
            >
              <svg viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              <span>{isSaved ? '已收藏' : '收藏'}</span>
            </button>

            <button className={styles.actionBtn}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              <span>分享</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

