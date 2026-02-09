'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

type TabType = 'posts' | 'albums' | 'travel' | 'likes';

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;
  
  const [activeTab, setActiveTab] = useState<TabType>('posts');
  const [isFollowing, setIsFollowing] = useState(false);

  // TODO: 从 API 获取数据
  const user = {
    username,
    name: '旅行达人',
    avatar: 'T',
    bio: '热爱旅行，用镜头记录世界的美好。已走过30个国家，100+城市。',
    stats: {
      posts: 156,
      followers: 2341,
      following: 432,
    },
  };

  const mockPosts = [
    {
      id: 1,
      title: '春日京都赏樱之旅',
      description: '在樱花盛开的季节，漫步在京都的古街小巷',
      date: '2024-03-15',
      likes: 456,
      comments: 89,
    },
    {
      id: 2,
      title: '川藏线自驾攻略',
      description: '15天川藏线自驾游完整攻略',
      date: '2024-03-12',
      likes: 892,
      comments: 234,
    },
    {
      id: 3,
      title: '新疆伊犁环线游记',
      description: '薰衣草、草原、雪山、湖泊',
      date: '2024-03-09',
      likes: 723,
      comments: 156,
    },
  ];

  const tabs = [
    { id: 'posts' as TabType, label: '动态', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    )},
    { id: 'albums' as TabType, label: '相册', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    )},
    { id: 'travel' as TabType, label: '旅行', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    )},
    { id: 'likes' as TabType, label: '喜欢', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    )},
  ];

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

        {/* 个人资料头部 */}
        <motion.header
          className={styles.profileHeader}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.profileBg} />
          <div className={styles.profileContent}>
            <div className={styles.avatar}>{user.avatar}</div>
            <div className={styles.profileInfo}>
              <h1 className={styles.username}>{user.name}</h1>
              <p className={styles.bio}>{user.bio}</p>
              
              <div className={styles.stats}>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{user.stats.posts}</span>
                  <span className={styles.statLabel}>动态</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{user.stats.followers}</span>
                  <span className={styles.statLabel}>粉丝</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{user.stats.following}</span>
                  <span className={styles.statLabel}>关注</span>
                </div>
              </div>

              <div className={styles.actions}>
                <button
                  className={`${styles.followBtn} ${isFollowing ? styles.followBtnActive : ''}`}
                  onClick={() => setIsFollowing(!isFollowing)}
                >
                  {isFollowing ? (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      已关注
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="8.5" cy="7" r="4" />
                        <line x1="20" y1="8" x2="20" y2="14" />
                        <line x1="23" y1="11" x2="17" y2="11" />
                      </svg>
                      关注
                    </>
                  )}
                </button>
                <button className={styles.messageBtn}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  私信
                </button>
              </div>
            </div>
          </div>
        </motion.header>

        {/* 标签页 */}
        <motion.div
          className={styles.tabs}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* 内容区域 */}
        <div className={styles.contentGrid}>
          {mockPosts.map((post, index) => (
            <motion.article
              key={post.id}
              className={styles.card}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -4 }}
              onClick={() => router.push(`/posts/${post.id}`)}
            >
              <div className={styles.cardImage}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{post.title}</h3>
                <p className={styles.cardDescription}>{post.description}</p>
                <div className={styles.cardFooter}>
                  <span className={styles.cardDate}>{post.date}</span>
                  <div className={styles.cardStats}>
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
            </motion.article>
          ))}
        </div>

        {mockPosts.length === 0 && (
          <motion.div
            className={styles.empty}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <h3>暂无内容</h3>
            <p>这里还没有发布任何内容</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

