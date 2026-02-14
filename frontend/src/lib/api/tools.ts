import apiClient from './client';

// ==================== 倒计时相关接口 ====================

export interface Countdown {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  target_date: string;
  type: 'birthday' | 'anniversary' | 'exam' | 'vacation' | 'event' | 'other';
  color: string;
  icon?: string;
  is_repeat: boolean;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
  days_remaining?: number;
}

export interface CountdownCreate {
  title: string;
  description?: string;
  target_date: string;
  type?: 'birthday' | 'anniversary' | 'exam' | 'vacation' | 'event' | 'other';
  color?: string;
  icon?: string;
  is_repeat?: boolean;
}

export interface CountdownUpdate {
  title?: string;
  description?: string;
  target_date?: string;
  type?: 'birthday' | 'anniversary' | 'exam' | 'vacation' | 'event' | 'other';
  color?: string;
  icon?: string;
  is_repeat?: boolean;
  is_completed?: boolean;
}

/**
 * 创建倒计时
 */
export async function createCountdown(data: CountdownCreate) {
  const response = await apiClient.post('/v1/tools/countdown', data);
  return response.data;
}

/**
 * 获取倒计时列表
 */
export async function getCountdownList(params?: { page?: number; page_size?: number }) {
  const response = await apiClient.get('/v1/tools/countdown', { params });
  return response.data;
}

/**
 * 更新倒计时
 */
export async function updateCountdown(id: string, data: CountdownUpdate) {
  const response = await apiClient.put(`/v1/tools/countdown/${id}`, data);
  return response.data;
}

/**
 * 删除倒计时
 */
export async function deleteCountdown(id: string) {
  const response = await apiClient.delete(`/v1/tools/countdown/${id}`);
  return response.data;
}

// ==================== 待办清单相关接口 ====================

export interface Todo {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  completed_at?: string;
  tags: string[];
  category?: string;
  parent_id?: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface TodoCreate {
  title: string;
  description?: string;
  status?: 'todo' | 'in_progress' | 'done' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  tags?: string[];
  category?: string;
  parent_id?: string;
  order?: number;
}

export interface TodoUpdate {
  title?: string;
  description?: string;
  status?: 'todo' | 'in_progress' | 'done' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  tags?: string[];
  category?: string;
  parent_id?: string;
  order?: number;
}

export interface TodoStats {
  total: number;
  todo: number;
  in_progress: number;
  done: number;
  cancelled: number;
  completion_rate: number;
}

/**
 * 创建待办
 */
export async function createTodo(data: TodoCreate) {
  const response = await apiClient.post('/v1/tools/todo', data);
  return response.data;
}

/**
 * 获取待办列表
 */
export async function getTodoList(params?: {
  status?: 'todo' | 'in_progress' | 'done' | 'cancelled';
  page?: number;
  page_size?: number;
}) {
  const response = await apiClient.get('/v1/tools/todo', { params });
  return response.data;
}

/**
 * 获取待办统计
 */
export async function getTodoStats() {
  const response = await apiClient.get('/v1/tools/todo/stats');
  return response.data;
}

/**
 * 更新待办
 */
export async function updateTodo(id: string, data: TodoUpdate) {
  const response = await apiClient.put(`/v1/tools/todo/${id}`, data);
  return response.data;
}

/**
 * 删除待办
 */
export async function deleteTodo(id: string) {
  const response = await apiClient.delete(`/v1/tools/todo/${id}`);
  return response.data;
}

// ==================== 记账相关接口 ====================

export interface Expense {
  id: string;
  user_id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  title: string;
  description?: string;
  date: string;
  tags: string[];
  images: string[];
  created_at: string;
  updated_at: string;
}

export interface ExpenseCreate {
  type: 'income' | 'expense';
  category: string;
  amount: number;
  title: string;
  description?: string;
  date: string;
  tags?: string[];
  images?: string[];
}

export interface ExpenseUpdate {
  type?: 'income' | 'expense';
  category?: string;
  amount?: number;
  title?: string;
  description?: string;
  date?: string;
  tags?: string[];
  images?: string[];
}

export interface ExpenseStats {
  total_income: number;
  total_expense: number;
  balance: number;
  category_stats: Array<{
    category: string;
    type: string;
    total: number;
    count: number;
  }>;
  monthly_trend: Array<{
    year: number;
    month: number;
    type: string;
    total: number;
  }>;
}

/**
 * 创建记账
 */
export async function createExpense(data: ExpenseCreate) {
  const response = await apiClient.post('/v1/tools/expense', data);
  return response.data;
}

/**
 * 获取记账列表
 */
export async function getExpenseList(params?: {
  type?: 'income' | 'expense';
  start_date?: string;
  end_date?: string;
  page?: number;
  page_size?: number;
}) {
  const response = await apiClient.get('/v1/tools/expense', { params });
  return response.data;
}

/**
 * 获取记账统计
 */
export async function getExpenseStats(params?: {
  start_date?: string;
  end_date?: string;
}) {
  const response = await apiClient.get('/v1/tools/expense/stats', { params });
  return response.data;
}

/**
 * 更新记账
 */
export async function updateExpense(id: string, data: ExpenseUpdate) {
  const response = await apiClient.put(`/v1/tools/expense/${id}`, data);
  return response.data;
}

/**
 * 删除记账
 */
export async function deleteExpense(id: string) {
  const response = await apiClient.delete(`/v1/tools/expense/${id}`);
  return response.data;
}

// ==================== 习惯打卡相关接口 ====================

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  icon?: string;
  color: string;
  target_days: number;
  current_streak: number;
  longest_streak: number;
  total_days: number;
  frequency: string;
  reminder_time?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  checked_today: boolean;
}

export interface HabitCreate {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  target_days?: number;
  frequency?: string;
  reminder_time?: string;
}

export interface HabitUpdate {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
  target_days?: number;
  frequency?: string;
  reminder_time?: string;
  is_active?: boolean;
}

/**
 * 创建习惯
 */
export async function createHabit(data: HabitCreate) {
  const response = await apiClient.post('/v1/tools/habit', data);
  return response.data;
}

/**
 * 获取习惯列表
 */
export async function getHabitList() {
  const response = await apiClient.get('/v1/tools/habit');
  return response.data;
}

/**
 * 习惯打卡
 */
export async function checkInHabit(id: string, data: { date: string; note?: string }) {
  const response = await apiClient.post(`/v1/tools/habit/${id}/checkin`, data);
  return response.data;
}

/**
 * 删除习惯
 */
export async function deleteHabit(id: string) {
  const response = await apiClient.delete(`/v1/tools/habit/${id}`);
  return response.data;
}

// ==================== 笔记相关接口 ====================

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  tags: string[];
  category?: string;
  is_pinned: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface NoteCreate {
  title: string;
  content: string;
  tags?: string[];
  category?: string;
  is_pinned?: boolean;
  is_archived?: boolean;
}

export interface NoteUpdate {
  title?: string;
  content?: string;
  tags?: string[];
  category?: string;
  is_pinned?: boolean;
  is_archived?: boolean;
}

/**
 * 创建笔记
 */
export async function createNote(data: NoteCreate) {
  const response = await apiClient.post('/v1/tools/note', data);
  return response.data;
}

/**
 * 获取笔记列表
 */
export async function getNoteList(params?: {
  keyword?: string;
  category?: string;
  is_archived?: boolean;
  page?: number;
  page_size?: number;
}) {
  const response = await apiClient.get('/v1/tools/note', { params });
  return response.data;
}

/**
 * 更新笔记
 */
export async function updateNote(id: string, data: NoteUpdate) {
  const response = await apiClient.put(`/v1/tools/note/${id}`, data);
  return response.data;
}

/**
 * 删除笔记
 */
export async function deleteNote(id: string) {
  const response = await apiClient.delete(`/v1/tools/note/${id}`);
  return response.data;
}


