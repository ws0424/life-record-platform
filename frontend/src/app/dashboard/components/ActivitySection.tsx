'use client';

import { useState, useEffect } from 'react';
import { getLoginLogs } from '@/lib/api/auth';
import { ActivitySkeleton } from './Skeleton';
import styles from '../page.module.css';

export function ActivitySection() {
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const logs = await getLoginLogs(1, 10);
      setActivities(logs);
    } catch (err: any) {
      console.error('Load activities error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <ActivitySkeleton />;
  }

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>最新动态</h2>
      <div className={styles.activityList}>
        {activities.length === 0 ? (
          <p className={styles.emptyText}>暂无登录记录</p>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className={styles.activityItem}>
              <div className={styles.activityIcon}>
                {activity.login_type === 'password' && '🔑'}
                {activity.status === 'success' ? '✅' : '❌'}
              </div>
              <div className={styles.activityContent}>
                <h4>
                  {activity.status === 'success' ? '登录成功' : '登录失败'}
                  {activity.browser && ` - ${activity.browser}`}
                  {activity.os && ` on ${activity.os}`}
                </h4>
                <p className={styles.activityMeta}>
                  {new Date(activity.created_at).toLocaleString('zh-CN')} · IP: {activity.ip_address}
                  {activity.location && ` · ${activity.location}`}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

