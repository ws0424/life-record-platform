'use client';

import { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { getLoginDevices, removeLoginDevice, forceLogoutDevice } from '@/lib/api/auth';
import { DevicesSkeleton } from './Skeleton';
import styles from '../page.module.css';

interface DevicesSectionProps {
  success: (msg: string) => void;
  error: (msg: string) => void;
}

export function DevicesSection({ success, error }: DevicesSectionProps) {
  const [devices, setDevices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      const deviceList = await getLoginDevices();
      setDevices(deviceList);
    } catch (err: any) {
      console.error('Load devices error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveDevice = async (deviceId: string) => {
    Modal.confirm({
      title: '确认移除设备',
      content: '确定要移除此设备吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await removeLoginDevice(deviceId);
          success('设备移除成功！');
          loadDevices();
        } catch (err: any) {
          console.error('Remove device error:', err);
          error(err.message || '设备移除失败，请重试');
        }
      },
    });
  };

  const handleForceLogout = async (deviceId: string) => {
    Modal.confirm({
      title: '强制设备下线',
      content: '确定要强制此设备下线吗？该设备将立即失去访问权限。',
      okText: '确认下线',
      cancelText: '取消',
      okType: 'danger',
      onOk: async () => {
        try {
          await forceLogoutDevice(deviceId);
          success('设备已强制下线！');
          loadDevices();
        } catch (err: any) {
          console.error('Force logout device error:', err);
          error(err.message || '强制下线失败，请重试');
        }
      },
    });
  };

  if (isLoading) {
    return <DevicesSkeleton />;
  }

  return (
    <div className={styles.section}>
      <div className={styles.sectionContent}>
        <h2 className={styles.sectionTitle}>登录设备</h2>
        <div className={styles.deviceList}>
          {devices.length === 0 ? (
            <p className={styles.emptyText}>暂无登录设备</p>
          ) : (
            devices.map((device) => (
              <div key={device.id} className={styles.deviceItem}>
                <div className={styles.deviceIcon}>
                  {device.device_type === 'mobile' && '📱'}
                  {device.device_type === 'tablet' && '📱'}
                  {device.device_type === 'desktop' && '💻'}
                  {!device.device_type && '🖥️'}
                </div>
                <div className={styles.deviceInfo}>
                  <h4>
                    {device.device_name}
                    {device.is_current && <span className={styles.currentDevice}>当前设备</span>}
                  </h4>
                  <p className={styles.deviceMeta}>
                    {device.location || device.ip_address} · 
                    最后活跃: {new Date(device.last_active).toLocaleString('zh-CN')}
                  </p>
                </div>
                {!device.is_current && (
                  <div className={styles.deviceActions}>
                    <button 
                      className={styles.logoutBtn}
                      onClick={() => handleForceLogout(device.device_id)}
                    >
                      强制下线
                    </button>
                    <button 
                      className={styles.removeBtn}
                      onClick={() => handleRemoveDevice(device.device_id)}
                    >
                      移除
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

