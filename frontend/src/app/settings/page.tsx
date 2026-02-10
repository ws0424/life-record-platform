'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import styles from './page.module.css';

export default function SettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    setIsLoading(false);
  }, [isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>加载中...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className={styles.title}>账户设置</h1>
          <p className={styles.subtitle}>管理你的账户偏好和隐私设置</p>
        </motion.div>

        <div className={styles.content}>
          {/* 通知设置 */}
          <motion.section
            className={styles.section}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className={styles.sectionTitle}>通知设置</h2>
            <div className={styles.settingsList}>
              <SettingItem
                title="邮件通知"
                description="接收重要更新和活动通知"
                type="toggle"
                defaultValue={true}
              />
              <SettingItem
                title="评论通知"
                description="有人评论你的内容时通知你"
                type="toggle"
                defaultValue={true}
              />
              <SettingItem
                title="点赞通知"
                description="有人点赞你的内容时通知你"
                type="toggle"
                defaultValue={false}
              />
              <SettingItem
                title="关注通知"
                description="有新关注者时通知你"
                type="toggle"
                defaultValue={true}
              />
            </div>
          </motion.section>

          {/* 隐私设置 */}
          <motion.section
            className={styles.section}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className={styles.sectionTitle}>隐私设置</h2>
            <div className={styles.settingsList}>
              <SettingItem
                title="个人资料可见性"
                description="控制谁可以查看你的个人资料"
                type="select"
                options={[
                  { value: 'public', label: '所有人' },
                  { value: 'friends', label: '仅好友' },
                  { value: 'private', label: '仅自己' },
                ]}
                defaultValue="public"
              />
              <SettingItem
                title="显示在线状态"
                description="让其他用户看到你是否在线"
                type="toggle"
                defaultValue={true}
              />
              <SettingItem
                title="允许搜索"
                description="允许其他用户通过搜索找到你"
                type="toggle"
                defaultValue={true}
              />
              <SettingItem
                title="显示邮箱"
                description="在个人资料中显示邮箱地址"
                type="toggle"
                defaultValue={false}
              />
            </div>
          </motion.section>

          {/* 语言和地区 */}
          <motion.section
            className={styles.section}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className={styles.sectionTitle}>语言和地区</h2>
            <div className={styles.settingsList}>
              <SettingItem
                title="语言"
                description="选择界面显示语言"
                type="select"
                options={[
                  { value: 'zh-CN', label: '简体中文' },
                  { value: 'zh-TW', label: '繁體中文' },
                  { value: 'en', label: 'English' },
                  { value: 'ja', label: '日本語' },
                ]}
                defaultValue="zh-CN"
              />
              <SettingItem
                title="时区"
                description="设置你的时区"
                type="select"
                options={[
                  { value: 'Asia/Shanghai', label: '北京时间 (UTC+8)' },
                  { value: 'Asia/Tokyo', label: '东京时间 (UTC+9)' },
                  { value: 'America/New_York', label: '纽约时间 (UTC-5)' },
                  { value: 'Europe/London', label: '伦敦时间 (UTC+0)' },
                ]}
                defaultValue="Asia/Shanghai"
              />
            </div>
          </motion.section>

          {/* 数据和存储 */}
          <motion.section
            className={styles.section}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className={styles.sectionTitle}>数据和存储</h2>
            <div className={styles.settingsList}>
              <div className={styles.settingItem}>
                <div className={styles.settingInfo}>
                  <h3>下载我的数据</h3>
                  <p>下载你在平台上的所有数据副本</p>
                </div>
                <button className={styles.actionBtn}>下载</button>
              </div>
              <div className={styles.settingItem}>
                <div className={styles.settingInfo}>
                  <h3>清除缓存</h3>
                  <p>清除本地缓存数据以释放空间</p>
                </div>
                <button className={styles.actionBtn}>清除</button>
              </div>
              <div className={styles.settingItem}>
                <div className={styles.settingInfo}>
                  <h3>存储使用情况</h3>
                  <p>查看你的存储空间使用情况</p>
                </div>
                <div className={styles.storageInfo}>
                  <div className={styles.storageBar}>
                    <div className={styles.storageUsed} style={{ width: '35%' }} />
                  </div>
                  <span className={styles.storageText}>350 MB / 1 GB</span>
                </div>
              </div>
            </div>
          </motion.section>

          {/* 危险区域 */}
          <motion.section
            className={`${styles.section} ${styles.dangerSection}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className={styles.sectionTitle}>危险区域</h2>
            <div className={styles.settingsList}>
              <div className={styles.settingItem}>
                <div className={styles.settingInfo}>
                  <h3>注销账户</h3>
                  <p>永久删除你的账户和所有数据，此操作不可恢复</p>
                </div>
                <button className={styles.dangerBtn}>注销账户</button>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}

// 设置项组件
interface SettingItemProps {
  title: string;
  description: string;
  type: 'toggle' | 'select';
  defaultValue?: boolean | string;
  options?: { value: string; label: string }[];
}

function SettingItem({ title, description, type, defaultValue, options }: SettingItemProps) {
  const [value, setValue] = useState(defaultValue);

  const handleToggle = () => {
    setValue(!value);
    // TODO: 保存设置到后端
  };

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value);
    // TODO: 保存设置到后端
  };

  return (
    <div className={styles.settingItem}>
      <div className={styles.settingInfo}>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      {type === 'toggle' && (
        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={value as boolean}
            onChange={handleToggle}
          />
          <span className={styles.toggleSlider} />
        </label>
      )}
      {type === 'select' && options && (
        <select
          className={styles.select}
          value={value as string}
          onChange={handleSelect}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

