'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from './page.module.css';

export default function AlbumsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className={styles.title}>我的相册</h1>
          <p className={styles.subtitle}>珍藏生活中的美好瞬间</p>
          <Link href="/create?type=album" className={styles.createBtn}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            创建相册
          </Link>
        </motion.div>

        <div className={styles.grid}>
          {mockAlbums.map((album, index) => (
            <motion.article
              key={album.id}
              className={styles.albumCard}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, boxShadow: 'var(--shadow-lg)' }}
            >
              <Link href={`/albums/${album.id}`} className={styles.albumLink}>
                <div className={styles.albumCover}>
                  <div className={styles.coverGrid}>
                    {album.coverImages.map((img, idx) => (
                      <div key={idx} className={styles.coverImage}>
                        <div className={styles.imagePlaceholder}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className={styles.albumOverlay}>
                    <span className={styles.photoCount}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      {album.photoCount} 张照片
                    </span>
                  </div>
                </div>
                <div className={styles.albumInfo}>
                  <h2 className={styles.albumTitle}>{album.title}</h2>
                  <p className={styles.albumDescription}>{album.description}</p>
                  <div className={styles.albumMeta}>
                    <span className={styles.date}>{album.date}</span>
                    <div className={styles.stats}>
                      <span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                        {album.likes}
                      </span>
                      <span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 6v6l4 2" />
                        </svg>
                        {album.views}
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

const mockAlbums = [
  {
    id: 1,
    title: '春日樱花',
    description: '2024年春天的樱花季，记录了最美的粉色时光',
    date: '2024-03-15',
    photoCount: 24,
    likes: 156,
    views: 892,
    coverImages: [1, 2, 3, 4],
  },
  {
    id: 2,
    title: '夏日海边',
    description: '阳光、沙滩、海浪，夏天的美好回忆',
    date: '2024-07-20',
    photoCount: 36,
    likes: 203,
    views: 1245,
    coverImages: [1, 2, 3, 4],
  },
  {
    id: 3,
    title: '秋天的童话',
    description: '金黄的银杏叶，火红的枫叶，秋天的色彩',
    date: '2024-10-10',
    photoCount: 18,
    likes: 128,
    views: 756,
    coverImages: [1, 2, 3, 4],
  },
  {
    id: 4,
    title: '冬日雪景',
    description: '纯白的世界，宁静而美好',
    date: '2024-12-25',
    photoCount: 42,
    likes: 189,
    views: 1034,
    coverImages: [1, 2, 3, 4],
  },
  {
    id: 5,
    title: '城市夜景',
    description: '霓虹灯下的都市，夜晚的另一种美',
    date: '2024-08-05',
    photoCount: 30,
    likes: 245,
    views: 1567,
    coverImages: [1, 2, 3, 4],
  },
  {
    id: 6,
    title: '美食记录',
    description: '舌尖上的美味，每一道都值得纪念',
    date: '2024-09-12',
    photoCount: 52,
    likes: 312,
    views: 2103,
    coverImages: [1, 2, 3, 4],
  },
];

