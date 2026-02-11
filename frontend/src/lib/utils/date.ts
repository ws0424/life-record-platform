/**
 * Day.js 配置和工具函数
 */
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { DATE_FORMAT, DATETIME_FORMAT, TIME_FORMAT } from '@/lib/constants/date';

// 配置 Day.js
dayjs.locale('zh-cn');
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * 格式化日期
 */
export const formatDate = (date: string | Date | dayjs.Dayjs, format: string = DATE_FORMAT) => {
  return dayjs(date).format(format);
};

/**
 * 格式化日期时间
 */
export const formatDateTime = (date: string | Date | dayjs.Dayjs) => {
  return dayjs(date).format(DATETIME_FORMAT);
};

/**
 * 格式化时间
 */
export const formatTime = (date: string | Date | dayjs.Dayjs) => {
  return dayjs(date).format(TIME_FORMAT);
};

/**
 * 获取相对时间（如：3天前）
 */
export const getRelativeTime = (date: string | Date | dayjs.Dayjs) => {
  return dayjs(date).fromNow();
};

/**
 * 判断日期是否在今天
 */
export const isToday = (date: string | Date | dayjs.Dayjs) => {
  return dayjs(date).isSame(dayjs(), 'day');
};

/**
 * 判断日期是否在本周
 */
export const isThisWeek = (date: string | Date | dayjs.Dayjs) => {
  return dayjs(date).isSame(dayjs(), 'week');
};

/**
 * 判断日期是否在本月
 */
export const isThisMonth = (date: string | Date | dayjs.Dayjs) => {
  return dayjs(date).isSame(dayjs(), 'month');
};

export default dayjs;

