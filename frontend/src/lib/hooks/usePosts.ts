import { useState, useEffect } from 'react';
import * as postsApi from '../api/posts';

export const usePosts = (query: postsApi.PostsQuery = {}) => {
  const [posts, setPosts] = useState<postsApi.Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchPosts();
  }, [JSON.stringify(query), page]);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await postsApi.getPosts({ ...query, page });
      
      if (page === 1) {
        setPosts(response.items || []);
      } else {
        setPosts(prev => [...prev, ...(response.items || [])]);
      }
      
      setHasMore(response.has_more || false);
    } catch (err: any) {
      setError(err.response?.data?.message || '获取文章失败');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const refresh = () => {
    setPage(1);
    setPosts([]);
    fetchPosts();
  };

  return {
    posts,
    isLoading,
    error,
    hasMore,
    loadMore,
    refresh,
  };
};

export const usePost = (id: string) => {
  const [post, setPost] = useState<postsApi.Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await postsApi.getPost(id);
      setPost(data);
    } catch (err: any) {
      setError(err.response?.data?.message || '获取文章失败');
    } finally {
      setIsLoading(false);
    }
  };

  const likePost = async () => {
    try {
      await postsApi.likePost(id);
      setPost(prev => prev ? { ...prev, like_count: prev.like_count + 1 } : null);
    } catch (err) {
      console.error('Like failed:', err);
    }
  };

  const unlikePost = async () => {
    try {
      await postsApi.unlikePost(id);
      setPost(prev => prev ? { ...prev, like_count: prev.like_count - 1 } : null);
    } catch (err) {
      console.error('Unlike failed:', err);
    }
  };

  return {
    post,
    isLoading,
    error,
    likePost,
    unlikePost,
    refresh: fetchPost,
  };
};

