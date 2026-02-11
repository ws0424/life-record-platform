'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getLoginLogs } from '@/lib/api/auth';
import { ActivitySkeleton } from './Skeleton';
import styles from '../page.module.css';

interface LoginLog {
  id: string;
  ip_address: string;
  user_agent: string;
  device_type: string;
  browser: string;
  os: string;
  location: string | null;
  login_type: string;
  status: string;
  created_at: string;
}

const PAGE_SIZE = 10;
const MAX_PAGE_BUTTONS = 5;

export function ActivitySection() {
  const [activities, setActivities] = useState<LoginLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  const loadActivities = useCallback(async () => {
    try {
      setIsLoading(true);
      const logs = await getLoginLogs(currentPage, PAGE_SIZE);
      setActivities(logs);
      // 假设后端会返回总数，如果没有则估算
      setTotal(logs.length >= PAGE_SIZE ? currentPage * PAGE_SIZE + 1 : currentPage * PAGE_SIZE);
    } catch (err) {
      console.error('Load activities error:', err);
      setActivities([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  const totalPages = useMemo(() => Math.ceil(total / PAGE_SIZE), [total]);

  const handlePageChange = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
    }
  }, [totalPages, currentPage]);

  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const maxButtons = Math.min(MAX_PAGE_BUTTONS, totalPages);
    
    if (totalPages <= MAX_PAGE_BUTTONS) {
      // 总页数少于最大按钮数，显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (currentPage <= 3) {
      // 当前页在前面，显示前5页
      for (let i = 1; i <= maxButtons; i++) {
        pages.push(i);
      }
    } else if (currentPage >= totalPages - 2) {
      // 当前页在后面，显示后5页
      for (let i = totalPages - maxButtons + 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 当前页在中间，显示当前页前后各2页
      for (let i = currentPage - 2; i <= currentPage + 2; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }, [currentPage, totalPages]);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }, []);

  const getActivityIcon = useCallback((activity: LoginLog) => {
    if (activity.login_type === 'password') {
      return activity.status === 'success' ? '🔑✅' : '🔑❌';
    }
    return activity.status === 'success' ? '✅' : '❌';
  }, []);

  const getActivityTitle = useCallback((activity: LoginLog) => {
    const status = activity.status === 'success' ? '登录成功' : '登录失败';
    const browser = activity.browser ? ` - ${activity.browser}` : '';
    const os = activity.os ? ` on ${activity.os}` : '';
    return `${status}${browser}${os}`;
  }, []);

  if (isLoading && currentPage === 1) {
    return <ActivitySkeleton />;
  }

  return (
    <div className={styles.section}>
      <div className={styles.sectionContent}>
        <h2 className={styles.sectionTitle}>最新动态</h2>
        
        <div className={styles.activityList}>
          {activities.length === 0 ? (
            <p className={styles.emptyText}>暂无登录记录</p>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className={styles.activityItem}>
                <div className={styles.activityIcon}>
                  {getActivityIcon(activity)}
                </div>
                <div className={styles.activityContent}>
                  <h4>{getActivityTitle(activity)}</h4>
                  <p className={styles.activityMeta}>
                    {formatDate(activity.created_at)} · IP: {activity.ip_address}
                    {activity.location && ` · ${activity.location}`}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {activities.length > 0 && totalPages > 1 && (
        <div className={styles.sectionFooter}>
          <div className={styles.pagination}>
            <button
              className={styles.pageBtn}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
              aria-label="上一页"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              上一页
            </button>
            
            <div className={styles.pageNumbers} role="navigation" aria-label="分页导航">
              {pageNumbers.map((pageNum) => (
                <button
                  key={pageNum}
                  className={`${styles.pageNumber} ${currentPage === pageNum ? styles.active : ''}`}
                  onClick={() => handlePageChange(pageNum)}
                  disabled={isLoading}
                  aria-label={`第 ${pageNum} 页`}
                  aria-current={currentPage === pageNum ? 'page' : undefined}
                >
                  {pageNum}
                </button>
              ))}
            </div>
            
            <button
              className={styles.pageBtn}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
              aria-label="下一页"
            >
              下一页
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

