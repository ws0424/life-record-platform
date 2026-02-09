import { useState, useEffect } from 'react';
import * as commentsApi from '../api/comments';

export const useComments = (postId: string) => {
  const [comments, setComments] = useState<commentsApi.Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await commentsApi.getComments(postId);
      setComments(data);
    } catch (err: any) {
      setError(err.response?.data?.message || '获取评论失败');
    } finally {
      setIsLoading(false);
    }
  };

  const addComment = async (content: string, parentId?: string) => {
    try {
      const newComment = await commentsApi.createComment({
        post_id: postId,
        content,
        parent_id: parentId,
      });
      
      if (parentId) {
        // 添加到父评论的回复中
        setComments(prev => prev.map(comment => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newComment],
            };
          }
          return comment;
        }));
      } else {
        // 添加到顶级评论
        setComments(prev => [newComment, ...prev]);
      }
      
      return newComment;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || '发表评论失败');
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      await commentsApi.deleteComment(commentId);
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || '删除评论失败');
    }
  };

  const likeComment = async (commentId: string) => {
    try {
      await commentsApi.likeComment(commentId);
      setComments(prev => prev.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, like_count: comment.like_count + 1 };
        }
        return comment;
      }));
    } catch (err) {
      console.error('Like comment failed:', err);
    }
  };

  return {
    comments,
    isLoading,
    error,
    addComment,
    deleteComment,
    likeComment,
    refresh: fetchComments,
  };
};

