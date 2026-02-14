'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Button, Card, Modal, Form, Input, Select, DatePicker, InputNumber, message, Empty, Spin, Statistic, Row, Col, Tag, Tabs
} from 'antd';
import {
  PlusOutlined, DeleteOutlined, EditOutlined, ArrowUpOutlined, ArrowDownOutlined, BarChartOutlined, LineChartOutlined, PieChartOutlined
} from '@ant-design/icons';
import dayjs from '@/lib/dayjs';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { useAuthStore } from '@/lib/store/authStore';
import {
  getExpenseList,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseStats,
  type Expense,
  type ExpenseCreate,
  type ExpenseStats,
} from '@/lib/api/tools';
import styles from './page.module.css';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const expenseCategories = [
  { value: 'food', label: '餐饮', color: '#ff6b6b' },
  { value: 'transport', label: '交通', color: '#4ecdc4' },
  { value: 'shopping', label: '购物', color: '#45b7d1' },
  { value: 'entertainment', label: '娱乐', color: '#f9ca24' },
  { value: 'housing', label: '住房', color: '#6c5ce7' },
  { value: 'healthcare', label: '医疗', color: '#fd79a8' },
  { value: 'education', label: '教育', color: '#00b894' },
  { value: 'utilities', label: '水电', color: '#fdcb6e' },
  { value: 'other_expense', label: '其他支出', color: '#b2bec3' },
];

const incomeCategories = [
  { value: 'salary', label: '工资', color: '#00b894' },
  { value: 'bonus', label: '奖金', color: '#00cec9' },
  { value: 'investment', label: '投资', color: '#0984e3' },
  { value: 'gift', label: '礼物', color: '#6c5ce7' },
  { value: 'other_income', label: '其他收入', color: '#b2bec3' },
];

// 用于 Select 的选项
const expenseCategoryOptions = expenseCategories.map(c => ({ value: c.value, label: c.label }));
const incomeCategoryOptions = incomeCategories.map(c => ({ value: c.value, label: c.label }));

// 分类映射（用于显示）
const categoryMap = [...expenseCategories, ...incomeCategories].reduce((acc, cat) => {
  acc[cat.value] = cat.label;
  return acc;
}, {} as Record<string, string>);

export default function ExpensePage() {
  const router = useRouter();
  const { isAuthenticated, isInitialized } = useAuthStore();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [stats, setStats] = useState<ExpenseStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [statsModalVisible, setStatsModalVisible] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [statsType, setStatsType] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [form] = Form.useForm();
  const [expenseType, setExpenseType] = useState<'income' | 'expense'>('expense');

  useEffect(() => {
    // 等待初始化完成
    if (!isInitialized) {
      return;
    }
    
    // 初始化完成后，检查认证状态
    if (!isAuthenticated) {
      router.push('/login?redirect=' + encodeURIComponent('/tools/expense'));
      return;
    }
    loadData();
  }, [isAuthenticated, router, filterType, dateRange]);

  const loadData = async () => {
    try {
      setLoading(true);
      const params: any = {
        type: filterType === 'all' ? undefined : filterType as any,
        page: 1,
        page_size: 100,
      };
      
      if (dateRange) {
        params.start_date = dateRange[0].toISOString();
        params.end_date = dateRange[1].toISOString();
      }

      const [expensesRes, statsRes] = await Promise.all([
        getExpenseList(params),
        getExpenseStats(dateRange ? {
          start_date: dateRange[0].toISOString(),
          end_date: dateRange[1].toISOString(),
        } : undefined),
      ]);

      if (expensesRes.code === 200) {
        setExpenses(expensesRes.data.items);
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

  const handleCreate = (type: 'income' | 'expense') => {
    setEditingExpense(null);
    setExpenseType(type);
    form.resetFields();
    form.setFieldsValue({ type, date: dayjs() });
    setModalVisible(true);
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setExpenseType(expense.type);
    form.setFieldsValue({
      ...expense,
      date: dayjs(expense.date),
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteExpense(id);
      if (response.code === 200) {
        message.success('删除成功');
        loadData();
      }
    } catch (error: any) {
      message.error(error.message || '删除失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const data: ExpenseCreate = {
        ...values,
        date: values.date.toISOString(),
      };

      if (editingExpense) {
        const response = await updateExpense(editingExpense.id, data);
        if (response.code === 200) {
          message.success('更新成功');
        }
      } else {
        const response = await createExpense(data);
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

  // 生成图表数据
  const generateChartData = () => {
    if (!stats || !expenses.length) return null;

    // 按分类统计
    const categoryData = stats.category_stats.map(item => ({
      name: item.category,
      value: item.total,
      type: item.type,
    }));

    // 按时间统计
    const timeData = expenses.reduce((acc: any, expense) => {
      const date = dayjs(expense.date);
      let key = '';
      
      switch (statsType) {
        case 'day':
          key = date.format('YYYY-MM-DD');
          break;
        case 'week':
          key = `${date.year()}年第${date.week()}周`;
          break;
        case 'month':
          key = date.format('YYYY-MM');
          break;
        case 'year':
          key = date.format('YYYY');
          break;
      }

      if (!acc[key]) {
        acc[key] = { income: 0, expense: 0 };
      }
      
      if (expense.type === 'income') {
        acc[key].income += expense.amount;
      } else {
        acc[key].expense += expense.amount;
      }
      
      return acc;
    }, {});

    return { categoryData, timeData };
  };

  // 分类饼图
  const getCategoryPieOption = (): EChartsOption => {
    const chartData = generateChartData();
    if (!chartData) return {};

    const expenseData = chartData.categoryData.filter(item => item.type === 'expense');
    const incomeData = chartData.categoryData.filter(item => item.type === 'income');

    return {
      title: {
        text: '收支分类统计',
        left: 'center',
        textStyle: { color: 'var(--text-primary)' },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: ¥{c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center',
        textStyle: { color: 'var(--text-secondary)' },
      },
      series: [
        {
          name: '支出',
          type: 'pie',
          radius: ['40%', '55%'],
          center: ['35%', '50%'],
          data: expenseData,
          label: {
            color: 'var(--text-secondary)',
          },
          itemStyle: {
            borderRadius: 8,
          },
        },
      ],
    };
  };

  // 时间趋势图
  const getTimeTrendOption = (): EChartsOption => {
    const chartData = generateChartData();
    if (!chartData) return {};

    const dates = Object.keys(chartData.timeData).sort();
    const incomeData = dates.map(date => chartData.timeData[date].income);
    const expenseData = dates.map(date => chartData.timeData[date].expense);

    return {
      title: {
        text: '收支趋势',
        left: 'center',
        textStyle: { color: 'var(--text-primary)' },
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['收入', '支出'],
        bottom: 10,
        textStyle: { color: 'var(--text-secondary)' },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: dates,
        axisLabel: { color: 'var(--text-tertiary)' },
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: 'var(--text-tertiary)' },
      },
      series: [
        {
          name: '收入',
          type: 'line',
          data: incomeData,
          smooth: true,
          itemStyle: { color: '#52c41a' },
          areaStyle: { color: 'rgba(82, 196, 26, 0.2)' },
        },
        {
          name: '支出',
          type: 'line',
          data: expenseData,
          smooth: true,
          itemStyle: { color: '#f5222d' },
          areaStyle: { color: 'rgba(245, 34, 45, 0.2)' },
        },
      ],
    };
  };

  // 分类柱状图
  const getCategoryBarOption = (): EChartsOption => {
    const chartData = generateChartData();
    if (!chartData) return {};

    const categories = [...new Set(chartData.categoryData.map(item => item.name))];
    const data = categories.map(cat => {
      const item = chartData.categoryData.find(d => d.name === cat);
      return item ? item.value : 0;
    });

    return {
      title: {
        text: '分类支出排行',
        left: 'center',
        textStyle: { color: 'var(--text-primary)' },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: categories,
        axisLabel: { color: 'var(--text-tertiary)' },
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: 'var(--text-tertiary)' },
      },
      series: [
        {
          type: 'bar',
          data: data,
          itemStyle: {
            color: '#667eea',
            borderRadius: [4, 4, 0, 0],
          },
        },
      ],
    };
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
          <h1 className={styles.title}>记账本</h1>
          <p className={styles.subtitle}>记录日常收支，管理个人财务</p>
        </motion.div>

        {stats && (
          <Row gutter={16} style={{ marginBottom: 32 }}>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="总收入"
                  value={stats.total_income}
                  precision={2}
                  prefix="¥"
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="总支出"
                  value={stats.total_expense}
                  precision={2}
                  prefix="¥"
                  valueStyle={{ color: '#f5222d' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="结余"
                  value={stats.balance}
                  precision={2}
                  prefix="¥"
                  valueStyle={{ color: stats.balance >= 0 ? '#3f8600' : '#cf1322' }}
                />
              </Card>
            </Col>
          </Row>
        )}

        <div style={{ marginBottom: 24, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <Button
            type="primary"
            size="large"
            icon={<ArrowUpOutlined />}
            onClick={() => handleCreate('income')}
            style={{ background: '#52c41a', borderColor: '#52c41a' }}
          >
            记收入
          </Button>

          <Button
            type="primary"
            size="large"
            danger
            icon={<ArrowDownOutlined />}
            onClick={() => handleCreate('expense')}
          >
            记支出
          </Button>

          <Button
            size="large"
            icon={<BarChartOutlined />}
            onClick={() => setStatsModalVisible(true)}
          >
            统计详情
          </Button>

          <Select
            value={filterType}
            onChange={setFilterType}
            style={{ width: 150 }}
            size="large"
          >
            <Select.Option value="all">全部</Select.Option>
            <Select.Option value="income">收入</Select.Option>
            <Select.Option value="expense">支出</Select.Option>
          </Select>

          <RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates as any)}
            size="large"
            placeholder={['开始日期', '结束日期']}
          />
        </div>

        {expenses.length === 0 ? (
          <Empty
            description="还没有记账记录"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" icon={<PlusOutlined />} onClick={() => handleCreate('expense')}>
              开始记账
            </Button>
          </Empty>
        ) : (
          <div className={styles.expenseList}>
            {expenses.map((expense, index) => (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className={styles.expenseCard}>
                  <div className={styles.expenseContent}>
                    <div className={styles.expenseIcon} style={{
                      background: expense.type === 'income' ? '#52c41a' : '#f5222d'
                    }}>
                      {expense.type === 'income' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                    </div>

                    <div className={styles.expenseInfo}>
                      <h3 className={styles.expenseTitle}>{expense.title}</h3>
                      <div className={styles.expenseMeta}>
                        <Tag color={expense.type === 'income' ? 'green' : 'red'}>
                          {categoryMap[expense.category] || expense.category}
                        </Tag>
                        <span className={styles.expenseDate}>
                          {dayjs(expense.date).format('YYYY-MM-DD HH:mm:ss')}
                        </span>
                      </div>
                      {expense.description && (
                        <p className={styles.expenseDescription}>{expense.description}</p>
                      )}
                    </div>

                    <div className={styles.expenseAmount} style={{
                      color: expense.type === 'income' ? '#52c41a' : '#f5222d'
                    }}>
                      {expense.type === 'income' ? '+' : '-'}¥{expense.amount.toFixed(2)}
                    </div>

                    <div className={styles.expenseActions}>
                      <Button
                        type="text"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(expense)}
                      />
                      <Button
                        type="text"
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(expense.id)}
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <Modal
          title={editingExpense ? '编辑记账' : (expenseType === 'income' ? '记收入' : '记支出')}
          open={modalVisible}
          onOk={handleSubmit}
          onCancel={() => setModalVisible(false)}
          width={600}
        >
          <Form form={form} layout="vertical">
            <Form.Item name="type" hidden>
              <Input />
            </Form.Item>

            <Form.Item
              name="title"
              label="标题"
              rules={[{ required: true, message: '请输入标题' }]}
            >
              <Input placeholder="例如：午餐、工资..." />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="amount"
                  label="金额"
                  rules={[{ required: true, message: '请输入金额' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    precision={2}
                    prefix="¥"
                    placeholder="0.00"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="date"
                  label="日期时间"
                  rules={[{ required: true, message: '请选择日期时间' }]}
                >
                  <DatePicker 
                    showTime 
                    format="YYYY-MM-DD HH:mm:ss"
                    style={{ width: '100%' }} 
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="category"
              label="分类"
              rules={[{ required: true, message: '请选择分类' }]}
            >
              <Select
                options={expenseType === 'income' ? incomeCategoryOptions : expenseCategoryOptions}
                placeholder="选择分类"
              />
            </Form.Item>

            <Form.Item name="description" label="备注">
              <Input.TextArea rows={3} placeholder="添加备注..." />
            </Form.Item>

            <Form.Item name="tags" label="标签">
              <Select mode="tags" placeholder="添加标签..." />
            </Form.Item>
          </Form>
        </Modal>

        {/* 统计详情弹窗 */}
        <Modal
          title="统计详情"
          open={statsModalVisible}
          onCancel={() => setStatsModalVisible(false)}
          footer={null}
          width={1000}
        >
          <div style={{ marginBottom: 16 }}>
            <Select
              value={statsType}
              onChange={setStatsType}
              style={{ width: 150 }}
            >
              <Select.Option value="day">按日统计</Select.Option>
              <Select.Option value="week">按周统计</Select.Option>
              <Select.Option value="month">按月统计</Select.Option>
              <Select.Option value="year">按年统计</Select.Option>
            </Select>
          </div>

          <Tabs defaultActiveKey="trend">
            <TabPane tab={<span><LineChartOutlined /> 收支趋势</span>} key="trend">
              <ReactECharts
                option={getTimeTrendOption()}
                style={{ height: '400px' }}
                opts={{ renderer: 'svg' }}
              />
            </TabPane>
            <TabPane tab={<span><PieChartOutlined /> 分类统计</span>} key="category">
              <ReactECharts
                option={getCategoryPieOption()}
                style={{ height: '400px' }}
                opts={{ renderer: 'svg' }}
              />
            </TabPane>
            <TabPane tab={<span><BarChartOutlined /> 分类排行</span>} key="bar">
              <ReactECharts
                option={getCategoryBarOption()}
                style={{ height: '400px' }}
                opts={{ renderer: 'svg' }}
              />
            </TabPane>
          </Tabs>
        </Modal>
      </div>
    </div>
  );
}


