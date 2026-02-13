import { ContentListItem } from './content';

// 使用相对路径，Next.js 会自动代理到后端
const API_BASE_URL = '';

interface ApiResponse<T> {
  code: number;
  data: T;
  msg: string;
  errMsg: string | null;
}

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
  private getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * 获取我的作品
   */
  async getMyWorks(page: number = 1, pageSize: number = 12, type?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });
    
    if (type) {
      params.append('type', type);
    }

    const response = await fetch(
      `${API_BASE_URL}/api/content/my/works?${params}`,
      {
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error('获取我的作品失败');
    }

    const result: ApiResponse<ListResponse<ContentListItem>> = await response.json();
    return result.data;
  }

  /**
   * 获取浏览记录
   */
  async getMyViews(page: number = 1, pageSize: number = 12) {
    const response = await fetch(
      `${API_BASE_URL}/api/content/my/views?page=${page}&page_size=${pageSize}`,
      {
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error('获取浏览记录失败');
    }

    const result: ApiResponse<ListResponse<ContentListItem>> = await response.json();
    return result.data;
  }

  /**
   * 获取点赞记录
   */
  async getMyLikes(page: number = 1, pageSize: number = 12) {
    const response = await fetch(
      `${API_BASE_URL}/api/content/my/likes?page=${page}&page_size=${pageSize}`,
      {
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error('获取点赞记录失败');
    }

    const result: ApiResponse<ListResponse<ContentListItem>> = await response.json();
    return result.data;
  }

  /**
   * 获取评论记录
   */
  async getMyComments(page: number = 1, pageSize: number = 12) {
    const response = await fetch(
      `${API_BASE_URL}/api/content/my/comments?page=${page}&page_size=${pageSize}`,
      {
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error('获取评论记录失败');
    }

    const result: ApiResponse<ListResponse<CommentItem>> = await response.json();
    return result.data;
  }

  /**
   * 隐藏作品
   */
  async hideContent(contentId: string) {
    const response = await fetch(
      `${API_BASE_URL}/api/content/${contentId}/hide`,
      {
        method: 'POST',
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error('隐藏作品失败');
    }

    return await response.json();
  }

  /**
   * 公开作品
   */
  async showContent(contentId: string) {
    const response = await fetch(
      `${API_BASE_URL}/api/content/${contentId}/show`,
      {
        method: 'POST',
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error('公开作品失败');
    }

    return await response.json();
  }

  /**
   * 删除作品
   */
  async deleteContent(contentId: string) {
    const response = await fetch(
      `${API_BASE_URL}/api/content/${contentId}`,
      {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error('删除作品失败');
    }

    return await response.json();
  }

  /**
   * 删除浏览记录
   */
  async deleteViewRecord(contentId: string) {
    const response = await fetch(
      `${API_BASE_URL}/api/content/my/views/${contentId}`,
      {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error('删除浏览记录失败');
    }

    return await response.json();
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

