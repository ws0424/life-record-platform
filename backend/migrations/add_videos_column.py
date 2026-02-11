"""
添加 videos 字段到 contents 表
"""
from sqlalchemy import text
from app.core.database import engine

def upgrade():
    """添加 videos 字段"""
    with engine.connect() as conn:
        # 添加 videos 字段（ARRAY 类型，默认为空数组）
        conn.execute(text("""
            ALTER TABLE contents 
            ADD COLUMN IF NOT EXISTS videos TEXT[] DEFAULT ARRAY[]::TEXT[];
        """))
        conn.commit()
        print("✅ 成功添加 videos 字段到 contents 表")

def downgrade():
    """删除 videos 字段"""
    with engine.connect() as conn:
        conn.execute(text("""
            ALTER TABLE contents 
            DROP COLUMN IF EXISTS videos;
        """))
        conn.commit()
        print("✅ 成功删除 videos 字段")

if __name__ == "__main__":
    print("🔄 开始数据库迁移...")
    try:
        upgrade()
        print("✅ 数据库迁移完成！")
    except Exception as e:
        print(f"❌ 数据库迁移失败: {e}")

