"""
添加视频封面字段迁移脚本
"""
import sys
import os

# 添加项目根目录到 Python 路径
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from sqlalchemy import create_engine, text
from app.core.config import settings

def migrate():
    """添加 video_thumbnails 字段"""
    engine = create_engine(settings.DATABASE_URL)
    
    with engine.connect() as conn:
        try:
            # 检查字段是否已存在
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='contents' AND column_name='video_thumbnails'
            """))
            
            if result.fetchone():
                print("✅ video_thumbnails 字段已存在，无需迁移")
                return
            
            # 添加字段
            conn.execute(text("""
                ALTER TABLE contents 
                ADD COLUMN video_thumbnails TEXT[] DEFAULT '{}'
            """))
            conn.commit()
            
            print("✅ 成功添加 video_thumbnails 字段")
            
        except Exception as e:
            print(f"❌ 迁移失败: {str(e)}")
            conn.rollback()
            raise

if __name__ == "__main__":
    print("🔄 开始数据库迁移...")
    migrate()
    print("✅ 迁移完成!")

