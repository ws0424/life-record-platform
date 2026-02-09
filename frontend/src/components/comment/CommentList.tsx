'use client';

import React, { useState } from 'react';
import { useComments } from '@/lib/hooks/useComments';
import { Loading } from '../ui/Loading';
import styles from './CommentList.module.css';

interface CommentListProps {
  postId: string;
}

export const CommentList: React.FC<CommentListProps> = ({ postId }) => {
  const { comments, isLoading, addComment, deleteComment, likeComment } = useComments(postId);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setIsSubmitting(true);
      await addComment(newComment);
      setNewComment('');
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loading text="加载评论中..." />;
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>评论 ({comments.length})</h3>

      {/* 评论表单 */}
      <form className={styles.form} onSubmit={handleSubmit}>
        <textarea
          className={styles.textarea}
          placeholder="写下你的评论..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
        />
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={!newComment.trim() || isSubmitting}
        >
          {isSubmitting ? '发表中...' : '发表评论'}
        </button>
      </form>

      {/* 评论列表 */}
      <div className={styles.list}>
        {comments.map((comment) => (
          <div key={comment.id} className={styles.comment}>
            <div className={styles.avatar}>
              {comment.author?.username.charAt(0).toUpperCase()}
            </div>
            <div className={styles.content}>
              <div className={styles.header}>
                <span className={styles.author}>{comment.author?.username}</span>
                <span className={styles.date}>{comment.created_at}</span>
              </div>
              <p className={styles.text}>{comment.content}</p>
              <div className={styles.actions}>
                <button
                  className={styles.actionBtn}
                  onClick={() => likeComment(comment.id)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  {comment.like_count}
                </button>
                <button className={styles.actionBtn}>回复</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {comments.length === 0 && (
        <div className={styles.empty}>
          <p>还没有评论，来发表第一条评论吧！</p>
        </div>
      )}
    </div>
  );
};

