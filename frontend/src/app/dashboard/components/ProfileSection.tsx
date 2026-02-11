'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { updateProfile } from '@/lib/api/auth';
import styles from '../page.module.css';

interface ProfileSectionProps {
  user: any;
  success: (msg: string) => void;
  error: (msg: string) => void;
}

export function ProfileSection({ user, success, error }: ProfileSectionProps) {
  const { setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const updatedUser = await updateProfile(formData);
      setUser(updatedUser);
      success('个人信息更新成功！');
      setIsEditing(false);
    } catch (err: any) {
      console.error('Update profile error:', err);
      error(err.message || '更新失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>个人信息</h2>
        <button
          className={styles.editBtn}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? '取消' : '编辑'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>用户名</label>
          <input
            type="text"
            className={styles.input}
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            disabled={!isEditing}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>邮箱</label>
          <input
            type="email"
            className={styles.input}
            value={user?.email}
            disabled
          />
          <p className={styles.hint}>邮箱不可修改</p>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>个人简介</label>
          <textarea
            className={styles.textarea}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            disabled={!isEditing}
            rows={4}
            placeholder="介绍一下自己..."
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>注册时间</label>
          <input
            type="text"
            className={styles.input}
            value={new Date(user?.created_at).toLocaleString('zh-CN')}
            disabled
          />
        </div>

        {isEditing && (
          <button type="submit" className={styles.submitBtn} disabled={isLoading}>
            {isLoading ? '保存中...' : '保存修改'}
          </button>
        )}
      </form>
    </div>
  );
}

