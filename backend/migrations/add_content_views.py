"""
添加内容浏览记录表
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine, text
from app.core.config import settings

def upgrade():
    """创建 content_views 表"""
    engine = create_engine(settings.DATABASE_URL)
    
    with engine.connect() as conn:
        # 创建 content_views 表
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS content_views (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                content_id UUID NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
                user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(content_id, user_id)
            )
        """))
        
        # 创建索引
        conn.execute(text("""
            CREATE INDEX IF NOT EXISTS idx_content_views_user_id 
            ON content_views(user_id)
        """))
        
        conn.execute(text("""
            CREATE INDEX IF NOT EXISTS idx_content_views_content_id 
            ON content_views(content_id)
        """))
        
        conn.execute(text("""
            CREATE INDEX IF NOT EXISTS idx_content_views_updated_at 
            ON content_views(updated_at DESC)
        """))
        
        conn.commit()
        print("✅ content_views 表创建成功")

def downgrade():
    """删除 content_views 表"""
    engine = create_engine(settings.DATABASE_URL)
    
    with engine.connect() as conn:
        conn.execute(text("DROP TABLE IF EXISTS content_views CASCADE"))
        conn.commit()
        print("✅ content_views 表删除成功")

if __name__ == "__main__":
    print("🔄 开始迁移...")
    upgrade()
    print("✅ 迁移完成")

