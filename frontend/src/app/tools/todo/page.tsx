'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Button, Card, Modal, Form, Input, Select, DatePicker, Tag, message, Empty, Spin, Checkbox, Progress, Statistic, Row, Col
} from 'antd';
import {
  PlusOutlined, DeleteOutlined, EditOutlined, CheckCircleOutlined, ClockCircleOutlined
} from '@ant-design/icons';
import dayjs from '@/lib/dayjs';
import { useAuthStore } from '@/lib/store/authStore';
import {
  getTodoList,
  createTodo,
  updateTodo,
  deleteTodo,
  getTodoStats,
  type Todo,
  type TodoCreate,
  type TodoStats,
} from '@/lib/api/tools';
import styles from './page.module.css';

const priorityColors = {
  low: '#52c41a',
  medium: '#1890ff',
  high: '#faad14',
  urgent: '#f5222d',
};

const priorityLabels = {
  low: '低',
  medium: '中',
  high: '高',
  urgent: '紧急',
};

const statusLabels = {
  todo: '待办',
  in_progress: '进行中',
  done: '已完成',
  cancelled: '已取消',
};

export default function TodoPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [stats, setStats] = useState<TodoStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [form] = Form.useForm();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=' + encodeURIComponent('/tools/todo'));
      return;
    }
    loadData();
  }, [isAuthenticated, router, filterStatus]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [todosRes, statsRes] = await Promise.all([
        getTodoList({
          status: filterStatus === 'all' ? undefined : filterStatus as any,
          page: 1,
          page_size: 100,
        }),
        getTodoStats(),
      ]);

      if (todosRes.code === 200) {
        setTodos(todosRes.data.items);
      }
      if (statsRes.code === 200) {
        setStats(statsRes.data);
      }
    } catch (error: any) {
      message.error(error.message || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingTodo(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    form.setFieldsValue({
      ...todo,
      due_date: todo.due_date ? dayjs(todo.due_date) : null,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteTodo(id);
      if (response.code === 200) {
        message.success('删除成功');
        loadData();
      }
    } catch (error: any) {
      message.error(error.message || '删除失败');
    }
  };

  const handleToggleStatus = async (todo: Todo) => {
    try {
      const newStatus = todo.status === 'done' ? 'todo' : 'done';
      const response = await updateTodo(todo.id, { status: newStatus });
      if (response.code === 200) {
        message.success(newStatus === 'done' ? '已完成' : '标记为待办');
        loadData();
      }
    } catch (error: any) {
      message.error(error.message || '操作失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const data: TodoCreate = {
        ...values,
        due_date: values.due_date ? values.due_date.toISOString() : undefined,
      };

      if (editingTodo) {
        const response = await updateTodo(editingTodo.id, data);
        if (response.code === 200) {
          message.success('更新成功');
        }
      } else {
        const response = await createTodo(data);
        if (response.code === 200) {
          message.success('创建成功');
        }
      }

      setModalVisible(false);
      loadData();
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
          <h1 className={styles.title}>待办清单</h1>
          <p className={styles.subtitle}>管理你的任务和目标</p>
        </motion.div>

        {stats && (
          <Row gutter={16} style={{ marginBottom: 32 }}>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic title="总任务" value={stats.total} />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic title="待办" value={stats.todo} valueStyle={{ color: '#1890ff' }} />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic title="已完成" value={stats.done} valueStyle={{ color: '#52c41a' }} />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="完成率"
                  value={stats.completion_rate}
                  suffix="%"
                  valueStyle={{ color: '#3f8600' }}
                />
              </Card>
            </Col>
          </Row>
        )}

        <div style={{ marginBottom: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            创建待办
          </Button>

          <Select
            value={filterStatus}
            onChange={setFilterStatus}
            style={{ width: 150 }}
            size="large"
          >
            <Select.Option value="all">全部</Select.Option>
            <Select.Option value="todo">待办</Select.Option>
            <Select.Option value="in_progress">进行中</Select.Option>
            <Select.Option value="done">已完成</Select.Option>
          </Select>
        </div>

        {todos.length === 0 ? (
          <Empty
            description="还没有待办事项"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
              创建第一个待办
            </Button>
          </Empty>
        ) : (
          <div className={styles.todoList}>
            {todos.map((todo, index) => (
              <motion.div
                key={todo.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className={`${styles.todoCard} ${todo.status === 'done' ? styles.completed : ''}`}>
                  <div className={styles.todoContent}>
                    <Checkbox
                      checked={todo.status === 'done'}
                      onChange={() => handleToggleStatus(todo)}
                      className={styles.checkbox}
                    />

                    <div className={styles.todoInfo}>
                      <h3 className={styles.todoTitle}>{todo.title}</h3>
                      {todo.description && (
                        <p className={styles.todoDescription}>{todo.description}</p>
                      )}

                      <div className={styles.todoMeta}>
                        <Tag color={priorityColors[todo.priority]}>
                          {priorityLabels[todo.priority]}
                        </Tag>
                        <Tag>{statusLabels[todo.status]}</Tag>
                        {todo.due_date && (
                          <span className={styles.dueDate}>
                            <ClockCircleOutlined />
                            {dayjs(todo.due_date).format('YYYY-MM-DD HH:mm:ss')}
                          </span>
                        )}
                        {todo.tags.map(tag => (
                          <Tag key={tag}>#{tag}</Tag>
                        ))}
                      </div>
                    </div>

                    <div className={styles.todoActions}>
                      <Button
                        type="text"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(todo)}
                      />
                      <Button
                        type="text"
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(todo.id)}
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <Modal
          title={editingTodo ? '编辑待办' : '创建待办'}
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
              <Input placeholder="要做什么..." />
            </Form.Item>

            <Form.Item name="description" label="描述">
              <Input.TextArea rows={3} placeholder="添加详细描述..." />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="priority"
                  label="优先级"
                  initialValue="medium"
                >
                  <Select>
                    <Select.Option value="low">低</Select.Option>
                    <Select.Option value="medium">中</Select.Option>
                    <Select.Option value="high">高</Select.Option>
                    <Select.Option value="urgent">紧急</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="due_date" label="截止日期时间">
                  <DatePicker 
                    showTime 
                    format="YYYY-MM-DD HH:mm:ss"
                    style={{ width: '100%' }} 
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="category" label="分类">
              <Input placeholder="工作、学习、生活..." />
            </Form.Item>

            <Form.Item name="tags" label="标签">
              <Select mode="tags" placeholder="添加标签..." />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}

