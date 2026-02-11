'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useDebounce } from '@/lib/hooks/useDebounce';
import styles from './page.module.css';

type Category = 'all' | 'daily' | 'album' | 'travel' | 'popular';

export default function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all' as Category, label: '全部', icon: '🌟' },
    { id: 'daily' as Category, label: '日常', icon: '📝' },
    { id: 'album' as Category, label: '相册', icon: '📷' },
    { id: 'travel' as Category, label: '旅行', icon: '✈️' },
    { id: 'popular' as Category, label: '热门', icon: '🔥' },
  ];

  // 使用 debounce 优化搜索
  const debouncedSearch = useDebounce((value: string) => {
    setSearchQuery(value);
  }, 300);

  const filteredPosts = mockPosts.filter(post => {
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className={styles.title}>探索发现</h1>
          <p className={styles.subtitle}>发现更多精彩内容</p>
        </motion.div>

        <motion.div
          className={styles.searchBar}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="搜索内容、标签或用户..."
            onChange={(e) => debouncedSearch(e.target.value)}
          />
        </motion.div>

        <motion.div
          className={styles.categories}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {categories.map((category) => (
            <button
              key={category.id}
              className={`${styles.categoryBtn} ${activeCategory === category.id ? styles.categoryBtnActive : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              <span className={styles.categoryIcon}>{category.icon}</span>
              <span className={styles.categoryLabel}>{category.label}</span>
            </button>
          ))}
        </motion.div>

        <div className={styles.grid}>
          {filteredPosts.map((post, index) => (
            <motion.article
              key={post.id}
              className={styles.card}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ y: -8, boxShadow: 'var(--shadow-lg)' }}
            >
              <Link href={`/posts/${post.id}`} className={styles.cardLink}>
                <div className={styles.cardImage}>
                  <div className={styles.imagePlaceholder}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                  {post.featured && (
                    <div className={styles.featuredBadge}>
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      精选
                    </div>
                  )}
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <div className={styles.author}>
                      <div className={styles.avatar}>
                        {post.author.charAt(0)}
                      </div>
                      <div className={styles.authorInfo}>
                        <span className={styles.authorName}>{post.author}</span>
                        <span className={styles.date}>{post.date}</span>
                      </div>
                    </div>
                  </div>
                  <h2 className={styles.cardTitle}>{post.title}</h2>
                  <p className={styles.cardDescription}>{post.description}</p>
                  <div className={styles.cardTags}>
                    {post.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className={styles.cardFooter}>
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
                      <span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        {post.views}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <motion.div
            className={styles.empty}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <h3>没有找到相关内容</h3>
            <p>试试其他关键词或分类</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

const mockPosts = [
  {
    id: 1,
    title: '春日京都赏樱之旅',
    description: '在樱花盛开的季节，漫步在京都的古街小巷，感受日本传统文化的魅力',
    author: '旅行达人',
    date: '2024-03-15',
    category: 'travel' as Category,
    tags: ['旅行', '日本', '樱花'],
    likes: 456,
    comments: 89,
    views: 2341,
    featured: true,
  },
  {
    id: 2,
    title: '今天的美食记录',
    description: '尝试了一家新开的餐厅，味道超级棒！分享给大家',
    author: '美食家',
    date: '2024-03-14',
    category: 'daily' as Category,
    tags: ['美食', '生活', '分享'],
    likes: 234,
    comments: 45,
    views: 1567,
    featured: false,
  },
  {
    id: 3,
    title: '夏日海边写真集',
    description: '阳光、沙滩、海浪，记录这个美好的夏天',
    author: '摄影师',
    date: '2024-03-13',
    category: 'album' as Category,
    tags: ['摄影', '海边', '夏天'],
    likes: 678,
    comments: 123,
    views: 3456,
    featured: true,
  },
  {
    id: 4,
    title: '川藏线自驾攻略',
    description: '15天川藏线自驾游完整攻略，包含路线、住宿、注意事项',
    author: '自驾游侠',
    date: '2024-03-12',
    category: 'travel' as Category,
    tags: ['自驾', '西藏', '攻略'],
    likes: 892,
    comments: 234,
    views: 5678,
    featured: true,
  },
  {
    id: 5,
    title: '周末的悠闲时光',
    description: '在家煮咖啡、看书、听音乐，享受难得的放松时刻',
    author: '文艺青年',
    date: '2024-03-11',
    category: 'daily' as Category,
    tags: ['生活', '周末', '放松'],
    likes: 345,
    comments: 67,
    views: 1890,
    featured: false,
  },
  {
    id: 6,
    title: '城市夜景摄影作品',
    description: '用镜头记录城市的夜晚，霓虹灯下的另一种美',
    author: '夜景猎人',
    date: '2024-03-10',
    category: 'album' as Category,
    tags: ['摄影', '夜景', '城市'],
    likes: 567,
    comments: 98,
    views: 2789,
    featured: false,
  },
  {
    id: 7,
    title: '新疆伊犁环线游记',
    description: '薰衣草、草原、雪山、湖泊，新疆最美的季节',
    author: '风景猎人',
    date: '2024-03-09',
    category: 'travel' as Category,
    tags: ['新疆', '草原', '自然'],
    likes: 723,
    comments: 156,
    views: 4123,
    featured: true,
  },
  {
    id: 8,
    title: '今天的心情很好',
    description: '阳光明媚，心情也跟着好起来了，分享一下今天的快乐',
    author: '快乐小子',
    date: '2024-03-08',
    category: 'daily' as Category,
    tags: ['心情', '阳光', '快乐'],
    likes: 189,
    comments: 34,
    views: 987,
    featured: false,
  },
];

