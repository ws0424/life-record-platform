'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button, Card, Modal, Form, Input, DatePicker, Select, message, Empty, Spin } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, ClockCircleOutlined } from '@ant-design/icons';
import dayjs from '@/lib/dayjs';
import { useAuthStore } from '@/lib/store/authStore';
import {
  getCountdownList,
  createCountdown,
  updateCountdown,
  deleteCountdown,
  type Countdown,
  type CountdownCreate,
} from '@/lib/api/tools';
import styles from './page.module.css';

const countdownTypes = [
  { value: 'birthday', label: '生日', color: '#fa709a' },
  { value: 'anniversary', label: '纪念日', color: '#667eea' },
  { value: 'exam', label: '考试', color: '#f093fb' },
  { value: 'vacation', label: '假期', color: '#4facfe' },
  { value: 'event', label: '活动', color: '#43e97b' },
  { value: 'other', label: '其他', color: '#ffecd2' },
];

// 预设类型选项（用于 AutoComplete）
const typeOptions = countdownTypes.map(type => ({
  value: type.value,
  label: type.label,
}));

export default function CountdownPage() {
  const router = useRouter();
  const { isAuthenticated, isInitialized } = useAuthStore();
  const [countdowns, setCountdowns] = useState<Countdown[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCountdown, setEditingCountdown] = useState<Countdown | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    // 等待初始化完成
    if (!isInitialized) {
      return;
    }
    
    // 初始化完成后，检查认证状态
    if (!isAuthenticated) {
      router.push('/login?redirect=' + encodeURIComponent('/tools/countdown'));
      return;
    }
    
    loadCountdowns();
  }, [isAuthenticated, isInitialized, router]);

  const loadCountdowns = async () => {
    try {
      setLoading(true);
      const response = await getCountdownList({ page: 1, page_size: 100 });
      if (response.code === 200) {
        setCountdowns(response.data.items);
      }
    } catch (error: any) {
      console.error('加载倒计时失败:', error);
      
      // 如果是认证错误，跳转到登录页
      if (error.code === 401 || error.code === 403 || error.message?.includes('认证') || error.message?.includes('授权')) {
        message.error('登录已过期，请重新登录');
        setTimeout(() => {
          router.push('/login?redirect=' + encodeURIComponent('/tools/countdown'));
        }, 1500);
      } else {
        message.error(error.message || '加载失败');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCountdown(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (countdown: Countdown) => {
    setEditingCountdown(countdown);
    form.setFieldsValue({
      ...countdown,
      target_date: dayjs(countdown.target_date),
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteCountdown(id);
      if (response.code === 200) {
        message.success('删除成功');
        loadCountdowns();
      }
    } catch (error: any) {
      message.error(error.message || '删除失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const data: CountdownCreate = {
        ...values,
        target_date: values.target_date.toISOString(),
      };

      if (editingCountdown) {
        const response = await updateCountdown(editingCountdown.id, data);
        if (response.code === 200) {
          message.success('更新成功');
        }
      } else {
        const response = await createCountdown(data);
        if (response.code === 200) {
          message.success('创建成功');
        }
      }

      setModalVisible(false);
      loadCountdowns();
    } catch (error: any) {
      message.error(error.message || '操作失败');
    }
  };

  const calculateDaysRemaining = (targetDate: string) => {
    const now = dayjs();
    const target = dayjs(targetDate);
    const days = target.diff(now, 'day');
    return days;
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
          <h1 className={styles.title}>倒计时</h1>
          <p className={styles.subtitle}>记录每一个值得期待的时刻</p>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            创建倒计时
          </Button>
        </motion.div>

        {countdowns.length === 0 ? (
          <Empty
            description="还没有倒计时"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <div className={styles.grid}>
            {countdowns.map((countdown, index) => {
              const daysRemaining = calculateDaysRemaining(countdown.target_date);
              const typeInfo = countdownTypes.find(t => t.value === countdown.type);
              const displayType = typeInfo?.label || countdown.type;
              const typeColor = typeInfo?.color || countdown.color;
              
              return (
                <motion.div
                  key={countdown.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className={styles.countdownCard}>
                    <div className={styles.cardHeader}>
                      <div className={styles.typeTag} style={{ background: typeColor }}>
                        {displayType}
                      </div>
                      <div className={styles.actions}>
                        <Button
                          type="text"
                          size="small"
                          icon={<EditOutlined />}
                          onClick={() => handleEdit(countdown)}
                        />
                        <Button
                          type="text"
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleDelete(countdown.id)}
                        />
                      </div>
                    </div>

                    <h3 className={styles.countdownTitle}>{countdown.title}</h3>
                    {countdown.description && (
                      <p className={styles.countdownDescription}>{countdown.description}</p>
                    )}

                    <div className={styles.daysContainer}>
                      <div className={styles.daysNumber}>
                        {daysRemaining >= 0 ? daysRemaining : 0}
                      </div>
                      <div className={styles.daysLabel}>
                        {daysRemaining > 0 ? '天后' : daysRemaining === 0 ? '今天' : '已过期'}
                      </div>
                    </div>

                    <div className={styles.targetDate}>
                      <ClockCircleOutlined />
                      <span>{dayjs(countdown.target_date).format('YYYY年MM月DD日 HH:mm:ss')}</span>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        <Modal
          title={editingCountdown ? '编辑倒计时' : '创建倒计时'}
          open={modalVisible}
          onOk={handleSubmit}
          onCancel={() => setModalVisible(false)}
          width={600}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="title"
              label="标题"
              rules={[{ required: true, message: '请输入标题' }]}
            >
              <Input placeholder="例如：生日、考试、旅行..." />
            </Form.Item>

            <Form.Item name="description" label="描述">
              <Input.TextArea rows={3} placeholder="添加一些描述..." />
            </Form.Item>

            <Form.Item
              name="target_date"
              label="目标日期时间"
              rules={[{ required: true, message: '请选择目标日期时间' }]}
            >
              <DatePicker 
                showTime 
                format="YYYY-MM-DD HH:mm:ss"
                style={{ width: '100%' }} 
              />
            </Form.Item>

            <Form.Item
              name="type"
              label="类型"
              initialValue="other"
            >
              <Select
                options={typeOptions}
                placeholder="选择类型"
              />
            </Form.Item>

            <Form.Item
              name="color"
              label="颜色"
              initialValue="#667eea"
            >
              <Input type="color" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}

