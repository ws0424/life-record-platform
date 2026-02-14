import apiClient from './client';

// ==================== 相册相关接口 ====================

/**
 * 获取相册列表
 */
export async function getAlbumList(params: {
  page?: number;
  page_size?: number;
  keyword?: string;
}) {
  const response = await apiClient.get('/v1/content/albums/list', { params });
  return response.data;
}

/**
 * 获取相册详情
 */
export async function getAlbumDetail(albumId: string) {
  const response = await apiClient.get(`/v1/content/${albumId}`);
  return response.data;
}

/**
 * 按地点统计相册
 */
export async function getAlbumStatsByLocation(userId?: string) {
  const response = await apiClient.get('/v1/content/albums/stats/location', {
    params: userId ? { user_id: userId } : {},
  });
  return response.data;
}

/**
 * 按标签统计相册
 */
export async function getAlbumStatsByTag(userId?: string) {
  const response = await apiClient.get('/v1/content/albums/stats/tag', {
    params: userId ? { user_id: userId } : {},
  });
  return response.data;
}

/**
 * 按时间轴统计相册
 */
export async function getAlbumStatsByTimeline(params: {
  userId?: string;
  groupBy?: 'year' | 'month' | 'day';
}) {
  const response = await apiClient.get('/v1/content/albums/stats/timeline', {
    params: {
      user_id: params.userId,
      group_by: params.groupBy || 'month',
    },
  });
  return response.data;
}

/**
 * 搜索内容
 */
export async function searchContents(params: {
  keyword?: string;
  author?: string;
  type?: 'daily' | 'album' | 'travel';
  page?: number;
  page_size?: number;
}) {
  const response = await apiClient.get('/v1/content/search', { params });
  return response.data;
}

/**
 * 点赞相册
 */
export async function toggleAlbumLike(albumId: string) {
  const response = await apiClient.post(`/v1/content/${albumId}/like`);
  return response.data;
}

/**
 * 收藏相册
 */
export async function toggleAlbumSave(albumId: string) {
  const response = await apiClient.post(`/v1/content/${albumId}/save`);
  return response.data;
}

/**
 * 创建评论
 */
export async function createComment(
  contentId: string,
  commentText: string,
  parentId?: string
) {
  const response = await apiClient.post(`/v1/content/${contentId}/comments`, {
    comment_text: commentText,
    parent_id: parentId || null,
  });
  return response.data;
}

/**
 * 获取评论列表
 */
export async function getComments(contentId: string, params: {
  page?: number;
  page_size?: number;
}) {
  const response = await apiClient.get(`/v1/content/${contentId}/comments`, { params });
  return response.data;
}

