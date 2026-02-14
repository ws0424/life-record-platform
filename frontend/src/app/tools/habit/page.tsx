'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button, Card, Modal, Form, Input, message, Empty, Spin, Progress } from 'antd';
import { PlusOutlined, DeleteOutlined, CheckOutlined, FireOutlined, TrophyOutlined } from '@ant-design/icons';
import dayjs from '@/lib/dayjs';
import { useAuthStore } from '@/lib/store/authStore';
import {
  getHabitList,
  createHabit,
  deleteHabit,
  checkInHabit,
  type Habit,
  type HabitCreate,
} from '@/lib/api/tools';
import styles from './page.module.css';

const habitIcons = ['💪', '📚', '🏃', '🧘', '💧', '🥗', '😴', '✍️', '🎯', '🎨'];
const habitColors = ['#fa709a', '#667eea', '#f093fb', '#4facfe', '#43e97b', '#ffecd2', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24'];

export default function HabitPage() {
  const router = useRouter();
  const { isAuthenticated, isInitialized } = useAuthStore();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    // 等待初始化完成
    if (!isInitialized) {
      return;
    }
    
    // 初始化完成后，检查认证状态
    if (!isAuthenticated) {
      router.push('/login?redirect=' + encodeURIComponent('/tools/habit'));
      return;
    }
    
    loadHabits();
  }, [isAuthenticated, isInitialized, router]);

  const loadHabits = async () => {
    try {
      setLoading(true);
      const response = await getHabitList();
      console.log('习惯列表响应:', response);
      if (response.code === 200) {
        // 数据在 response.data.items 中
        const habitsData = response.data?.items || [];
        setHabits(Array.isArray(habitsData) ? habitsData : []);
      }
    } catch (error: any) {
      console.error('加载习惯失败:', error);
      if (error.code === 401 || error.code === 403 || error.message?.includes('认证') || error.message?.includes('授权')) {
        message.error('登录已过期，请重新登录');
        setTimeout(() => {
          router.push('/login?redirect=' + encodeURIComponent('/tools/habit'));
        }, 1500);
      } else {
        message.error(error.message || '加载失败');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    form.resetFields();
    form.setFieldsValue({
      icon: '💪',
      color: '#667eea',
      target_days: 21,
      frequency: 'daily',
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteHabit(id);
      if (response.code === 200) {
        message.success('删除成功');
        loadHabits();
      }
    } catch (error: any) {
      message.error(error.message || '删除失败');
    }
  };

  const handleCheckIn = async (habit: Habit) => {
    if (habit.checked_today) {
      message.info('今天已经打卡了');
      return;
    }

    try {
      const response = await checkInHabit(habit.id, {
        date: dayjs().toISOString(),
      });
      if (response.code === 200) {
        message.success('打卡成功！');
        loadHabits();
      }
    } catch (error: any) {
      message.error(error.message || '打卡失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const data: HabitCreate = {
        ...values,
      };

      const response = await createHabit(data);
      if (response.code === 200) {
        message.success('创建成功');
        setModalVisible(false);
        loadHabits();
      }
    } catch (error: any) {
      message.error(error.message || '操作失败');
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <Spin size="large" />
          </div>
        </div>
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
          <h1 className={styles.title}>习惯打卡</h1>
          <p className={styles.subtitle}>养成好习惯，坚持每日打卡</p>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            创建习惯
          </Button>
        </motion.div>

        {!Array.isArray(habits) || habits.length === 0 ? (
          <Empty
            description="还没有习惯"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <div className={styles.grid}>
            {habits.map((habit, index) => {
              const progress = habit.target_days > 0 ? (habit.current_streak / habit.target_days) * 100 : 0;
              
              return (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className={styles.habitCard}>
                    <div className={styles.cardHeader}>
                      <div className={styles.habitIcon} style={{ background: habit.color }}>
                        {habit.icon || '💪'}
                      </div>
                      <Button
                        type="text"
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(habit.id)}
                      />
                    </div>

                    <h3 className={styles.habitName}>{habit.name}</h3>
                    {habit.description && (
                      <p className={styles.habitDescription}>{habit.description}</p>
                    )}

                    <div className={styles.stats}>
                      <div className={styles.statItem}>
                        <FireOutlined style={{ color: '#ff6b6b' }} />
                        <span>连续 {habit.current_streak} 天</span>
                      </div>
                      <div className={styles.statItem}>
                        <TrophyOutlined style={{ color: '#f9ca24' }} />
                        <span>最长 {habit.longest_streak} 天</span>
                      </div>
                    </div>

                    <div className={styles.progress}>
                      <Progress
                        percent={Math.min(progress, 100)}
                        strokeColor={{
                          '0%': habit.color,
                          '100%': '#52c41a',
                        }}
                        format={(percent) => `${habit.current_streak}/${habit.target_days}`}
                      />
                    </div>

                    <Button
                      type="primary"
                      size="large"
                      block
                      icon={<CheckOutlined />}
                      onClick={() => handleCheckIn(habit)}
                      disabled={habit.checked_today}
                      style={{
                        background: habit.checked_today ? '#52c41a' : habit.color,
                        borderColor: habit.checked_today ? '#52c41a' : habit.color,
                      }}
                    >
                      {habit.checked_today ? '今日已打卡' : '打卡'}
                    </Button>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        <Modal
          title="创建习惯"
          open={modalVisible}
          onOk={handleSubmit}
          onCancel={() => setModalVisible(false)}
          width={600}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="习惯名称"
              rules={[{ required: true, message: '请输入习惯名称' }]}
            >
              <Input placeholder="例如：每天阅读30分钟" />
            </Form.Item>

            <Form.Item name="description" label="描述">
              <Input.TextArea rows={3} placeholder="添加一些描述..." />
            </Form.Item>

            <Form.Item
              name="icon"
              label="图标"
              initialValue="💪"
            >
              <div className={styles.iconSelector}>
                {habitIcons.map((icon) => (
                  <Button
                    key={icon}
                    className={styles.iconButton}
                    onClick={() => form.setFieldValue('icon', icon)}
                  >
                    {icon}
                  </Button>
                ))}
              </div>
            </Form.Item>

            <Form.Item
              name="color"
              label="颜色"
              initialValue="#667eea"
            >
              <div className={styles.colorSelector}>
                {habitColors.map((color) => (
                  <div
                    key={color}
                    className={styles.colorButton}
                    style={{ background: color }}
                    onClick={() => form.setFieldValue('color', color)}
                  />
                ))}
              </div>
            </Form.Item>

            <Form.Item
              name="target_days"
              label="目标天数"
              initialValue={21}
              rules={[{ required: true, message: '请输入目标天数' }]}
            >
              <Input type="number" min={1} placeholder="21" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}

