"""
添加评论点赞表
"""
from sqlalchemy import create_engine, text
from app.core.config import settings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def migrate():
    """执行迁移"""
    engine = create_engine(settings.DATABASE_URL)
    
    with engine.connect() as conn:
        try:
            # 创建评论点赞表
            logger.info("创建 comment_likes 表...")
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS comment_likes (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
                    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE(comment_id, user_id)
                )
            """))
            
            # 创建索引
            logger.info("创建索引...")
            conn.execute(text("""
                CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON comment_likes(comment_id)
            """))
            conn.execute(text("""
                CREATE INDEX IF NOT EXISTS idx_comment_likes_user_id ON comment_likes(user_id)
            """))
            
            conn.commit()
            logger.info("✅ 迁移完成")
            
        except Exception as e:
            logger.error(f"❌ 迁移失败: {str(e)}")
            conn.rollback()
            raise

if __name__ == "__main__":
    migrate()

