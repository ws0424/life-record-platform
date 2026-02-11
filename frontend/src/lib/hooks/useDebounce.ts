/**
 * Debounce Hook
 */
import { useMemo, useEffect } from 'react';
import debounce from 'lodash/debounce';

/**
 * 创建防抖函数
 * @param fn 要防抖的函数
 * @param delay 延迟时间（毫秒）
 * @returns 防抖后的函数
 */
export function useDebounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
) {
  const debouncedFn = useMemo(() => debounce(fn, delay), [fn, delay]);

  // 组件卸载时取消待执行的函数
  useEffect(() => {
    return () => {
      debouncedFn.cancel();
    };
  }, [debouncedFn]);

  return debouncedFn;
}

