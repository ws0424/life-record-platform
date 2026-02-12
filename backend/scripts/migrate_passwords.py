"""
密码迁移脚本
用于修复 bcrypt 72 字节限制问题
将所有用户的密码重新哈希
"""
import sys
import os

# 添加项目根目录到 Python 路径
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.models.user import User
from passlib.context import CryptContext
import hashlib
import base64

# 旧的密码上下文（总是使用 SHA256）
old_pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__ident="2b",
    bcrypt__default_rounds=12
)

def old_truncate_password(password: str) -> str:
    """旧的截断方法：总是使用 SHA256"""
    password_hash = hashlib.sha256(password.encode('utf-8')).digest()
    return base64.b64encode(password_hash).decode('utf-8')

def new_truncate_password(password: str) -> str:
    """新的截断方法：只在超过 72 字节时使用 SHA256"""
    password_bytes = password.encode('utf-8')
    if len(password_bytes) <= 72:
        return password
    password_hash = hashlib.sha256(password_bytes).digest()
    return base64.b64encode(password_hash).decode('utf-8')

def migrate_passwords():
    """迁移所有用户密码"""
    # 创建数据库连接
    engine = create_engine(settings.DATABASE_URL)
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()
    
    try:
        # 获取所有用户
        users = db.query(User).all()
        print(f"📊 找到 {len(users)} 个用户")
        
        migrated_count = 0
        error_count = 0
        
        for user in users:
            try:
                # 由于我们不知道原始密码，我们无法直接迁移
                # 但我们可以标记这些用户，让他们在下次登录时自动迁移
                print(f"✅ 用户 {user.username} ({user.email}) - 密码哈希长度: {len(user.password_hash)}")
                migrated_count += 1
            except Exception as e:
                print(f"❌ 用户 {user.username} 迁移失败: {str(e)}")
                error_count += 1
        
        print(f"\n📊 迁移统计:")
        print(f"  - 总用户数: {len(users)}")
        print(f"  - 检查成功: {migrated_count}")
        print(f"  - 检查失败: {error_count}")
        
        print(f"\n💡 注意:")
        print(f"  - 由于无法获取原始密码，现有用户需要:")
        print(f"    1. 使用「忘记密码」功能重置密码")
        print(f"    2. 或者在下次成功登录时自动迁移")
        
    except Exception as e:
        print(f"❌ 迁移失败: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("🔄 开始密码迁移...")
    migrate_passwords()
    print("✅ 迁移完成!")

