import apiClient from './client';
import { ContentListItem } from './content';

interface ListResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

interface CommentItem {
  id: string;
  comment_text: string;
  created_at: string;
  like_count: number;
  content: {
    id: string;
    title: string;
    type: string;
  };
}

class MyWorksApi {
  /**
   * 获取我的作品
   */
  async getMyWorks(page: number = 1, pageSize: number = 12, type?: string) {
    const params: any = {
      page,
      page_size: pageSize,
    };
    
    if (type) {
      params.type = type;
    }

    const response = await apiClient.get('/content/my/works', { params });
    return response.data.data as ListResponse<ContentListItem>;
  }

  /**
   * 获取浏览记录
   */
  async getMyViews(page: number = 1, pageSize: number = 12) {
    const response = await apiClient.get('/content/my/views', {
      params: { page, page_size: pageSize }
    });
    return response.data.data as ListResponse<ContentListItem>;
  }

  /**
   * 获取点赞记录
   */
  async getMyLikes(page: number = 1, pageSize: number = 12) {
    const response = await apiClient.get('/content/my/likes', {
      params: { page, page_size: pageSize }
    });
    return response.data.data as ListResponse<ContentListItem>;
  }

  /**
   * 获取评论记录
   */
  async getMyComments(page: number = 1, pageSize: number = 12) {
    const response = await apiClient.get('/content/my/comments', {
      params: { page, page_size: pageSize }
    });
    return response.data.data as ListResponse<CommentItem>;
  }

  /**
   * 隐藏作品
   */
  async hideContent(contentId: string) {
    const response = await apiClient.post(`/content/${contentId}/hide`);
    return response.data;
  }

  /**
   * 公开作品
   */
  async showContent(contentId: string) {
    const response = await apiClient.post(`/content/${contentId}/show`);
    return response.data;
  }

  /**
   * 删除作品
   */
  async deleteContent(contentId: string) {
    const response = await apiClient.delete(`/content/${contentId}`);
    return response.data;
  }

  /**
   * 删除浏览记录
   */
  async deleteViewRecord(contentId: string) {
    const response = await apiClient.delete(`/content/my/views/${contentId}`);
    return response.data;
  }

  /**
   * 获取统计信息
   */
  async getStats() {
    const [works, views, likes, comments] = await Promise.all([
      this.getMyWorks(1, 1),
      this.getMyViews(1, 1),
      this.getMyLikes(1, 1),
      this.getMyComments(1, 1),
    ]);

    return {
      worksCount: works.total,
      viewsCount: views.total,
      likesCount: likes.total,
      commentsCount: comments.total,
    };
  }
}

export const myWorksApi = new MyWorksApi();
export type { CommentItem };

