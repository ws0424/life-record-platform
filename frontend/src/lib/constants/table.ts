/**
 * 表格相关常量
 */

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

/**
 * 表格分页配置
 */
export const DEFAULT_PAGINATION = {
  pageSize: DEFAULT_PAGE_SIZE,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条`,
  pageSizeOptions: PAGE_SIZE_OPTIONS,
};

