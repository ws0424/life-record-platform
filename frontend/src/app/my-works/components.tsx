import { motion } from 'framer-motion';
import styles from './components.module.css';

interface StatsCardProps {
  icon: string;
  value: number;
  label: string;
  delay?: number;
}

export function StatsCard({ icon, value, label, delay = 0 }: StatsCardProps) {
  return (
    <motion.div
      className={styles.statCard}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className={styles.statIcon}>{icon}</div>
      <h3 className={styles.statValue}>{value.toLocaleString()}</h3>
      <p className={styles.statLabel}>{label}</p>
    </motion.div>
  );
}

interface StatsGridProps {
  stats: {
    worksCount: number;
    viewsCount: number;
    likesCount: number;
    commentsCount: number;
  };
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className={styles.statsGrid}>
      <StatsCard icon="📝" value={stats.worksCount} label="我的作品" delay={0} />
      <StatsCard icon="👀" value={stats.viewsCount} label="浏览记录" delay={0.1} />
      <StatsCard icon="❤️" value={stats.likesCount} label="点赞记录" delay={0.2} />
      <StatsCard icon="💬" value={stats.commentsCount} label="评论记录" delay={0.3} />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonCover} />
      <div className={styles.skeletonBody}>
        <div className={styles.skeletonTitle} />
        <div className={styles.skeletonText} />
        <div className={styles.skeletonText} />
      </div>
    </div>
  );
}

interface SkeletonGridProps {
  count?: number;
}

export function SkeletonGrid({ count = 6 }: SkeletonGridProps) {
  return (
    <div style={{ 
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '24px',
      marginBottom: '40px'
    }}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}

