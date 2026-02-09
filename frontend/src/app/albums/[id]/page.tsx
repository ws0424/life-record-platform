'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

export default function AlbumDetailPage() {
  const params = useParams();
  const router = useRouter();
  const albumId = params.id as string;
  
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  // TODO: 从 API 获取数据
  const album = {
    id: albumId,
    title: '春日樱花',
    description: '2024年春天的樱花季，记录了最美的粉色时光',
    author: {
      username: 'photographer',
      name: '摄影师',
      avatar: 'P',
    },
    date: '2024-03-15',
    location: '日本京都',
    tags: ['樱花', '春天', '京都', '摄影'],
    likes: 156,
    views: 892,
    photoCount: 24,
    photos: Array.from({ length: 24 }, (_, i) => ({
      id: i + 1,
      title: `照片 ${i + 1}`,
      description: '美丽的樱花',
    })),
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

        {/* 相册头部 */}
        <motion.header
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.headerContent}>
            <h1 className={styles.title}>{album.title}</h1>
            <p className={styles.description}>{album.description}</p>

            <div className={styles.meta}>
              <Link href={`/profile/${album.author.username}`} className={styles.author}>
                <div className={styles.avatar}>{album.author.avatar}</div>
                <div className={styles.authorInfo}>
                  <span className={styles.authorName}>{album.author.name}</span>
                  <span className={styles.date}>{album.date}</span>
                </div>
              </Link>

              <div className={styles.info}>
                {album.location && (
                  <span className={styles.infoItem}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {album.location}
                  </span>
                )}
                <span className={styles.infoItem}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  {album.photoCount} 张照片
                </span>
                <span className={styles.infoItem}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  {album.views} 浏览
                </span>
              </div>
            </div>

            <div className={styles.tags}>
              {album.tags.map((tag) => (
                <Link key={tag} href={`/explore?tag=${tag}`} className={styles.tag}>
                  #{tag}
                </Link>
              ))}
            </div>

            <div className={styles.actions}>
              <button
                className={`${styles.actionBtn} ${isLiked ? styles.actionBtnActive : ''}`}
                onClick={() => setIsLiked(!isLiked)}
              >
                <svg viewBox="0 0 24 24" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <span>{isLiked ? album.likes + 1 : album.likes}</span>
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
        </motion.header>

        {/* 照片网格 */}
        <div className={styles.photoGrid}>
          {album.photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              className={styles.photoItem}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedImage(index)}
            >
              <div className={styles.photoPlaceholder}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <div className={styles.photoOverlay}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v8m-4-4h8" />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 图片查看器 */}
        {selectedImage !== null && (
          <motion.div
            className={styles.lightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <button className={styles.closeBtn} onClick={() => setSelectedImage(null)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <button
              className={styles.navBtn}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(selectedImage > 0 ? selectedImage - 1 : album.photos.length - 1);
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.lightboxImage}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <div className={styles.lightboxInfo}>
                <h3>{album.photos[selectedImage].title}</h3>
                <p>{selectedImage + 1} / {album.photos.length}</p>
              </div>
            </div>

            <button
              className={`${styles.navBtn} ${styles.navBtnNext}`}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(selectedImage < album.photos.length - 1 ? selectedImage + 1 : 0);
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

