/**
 * 内容卡片封面组件
 * 支持图片和视频封面的轮播展示
 */

import { useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { LazyImage } from '@/components/LazyImage';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import styles from './ContentCover.module.css';

interface ContentCoverProps {
  images?: string[];
  videos?: string[];
  videoThumbnails?: string[];
  title: string;
  height?: number;
}

interface MediaItem {
  type: 'image' | 'video';
  url: string;
  videoUrl?: string;
}

export function ContentCover({
  images = [],
  videos = [],
  videoThumbnails = [],
  title,
  height = 200,
}: ContentCoverProps) {
  // 使用 useMemo 缓存媒体列表计算
  const allMedia = useMemo<MediaItem[]>(() => {
    const media: MediaItem[] = [];
    
    // 添加视频封面
    videoThumbnails.forEach((thumbnail, index) => {
      if (thumbnail && videos[index]) {
        media.push({
          type: 'video',
          url: thumbnail,
          videoUrl: videos[index],
        });
      }
    });
    
    // 添加图片
    images.forEach((image) => {
      if (image) {
        media.push({
          type: 'image',
          url: image,
        });
      }
    });
    
    return media;
  }, [images, videos, videoThumbnails]);

  // 使用 useMemo 缓存媒体计数
  const mediaCounts = useMemo(() => ({
    images: allMedia.filter(m => m.type === 'image').length,
    videos: allMedia.filter(m => m.type === 'video').length,
  }), [allMedia]);

  // 如果没有任何媒体，显示默认封面
  if (allMedia.length === 0) {
    return (
      <div
        className={styles.defaultCover}
        style={{ height }}
      >
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </div>
    );
  }

  // 如果只有一张图片/封面，不使用轮播
  if (allMedia.length === 1) {
    const media = allMedia[0];
    return (
      <div className={styles.singleCover} style={{ height }}>
        <LazyImage
          src={media.url}
          alt={title}
          width="100%"
          height="100%"
          style={{ objectFit: 'cover' }}
        />
        {media.type === 'video' && (
          <div className={styles.videoIndicator}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )}
      </div>
    );
  }

  // 多张图片/封面，使用轮播
  return (
    <div className={styles.swiperContainer} style={{ height }}>
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation
        loop={true}
        className={styles.swiper}
      >
        {allMedia.map((media, index) => (
          <SwiperSlide key={index}>
            <div className={styles.slide}>
              <LazyImage
                src={media.url}
                alt={`${title} - ${index + 1}`}
                width="100%"
                height="100%"
                style={{ objectFit: 'cover' }}
              />
              {media.type === 'video' && (
                <div className={styles.videoIndicator}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* 媒体数量指示器 */}
      <div className={styles.mediaCount}>
        {mediaCounts.images > 0 && (
          <span className={styles.countBadge}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            {mediaCounts.images}
          </span>
        )}
        {mediaCounts.videos > 0 && (
          <span className={styles.countBadge}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            {mediaCounts.videos}
          </span>
        )}
      </div>
    </div>
  );
}

