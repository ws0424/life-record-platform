"""
为所有用户设置默认密码（用于测试和紧急情况）
警告：仅用于开发环境！
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.models.user import User
from app.utils.security import get_password_hash
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def reset_all_passwords(default_password: str = "Test123456"):
    """为所有用户设置默认密码"""
    engine = create_engine(settings.DATABASE_URL)
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()
    
    try:
        # 获取所有用户
        users = db.query(User).all()
        logger.info(f"📊 找到 {len(users)} 个用户")
        
        # 生成新的密码哈希
        new_password_hash = get_password_hash(default_password)
        logger.info(f"🔐 新密码哈希: {new_password_hash[:50]}...")
        
        success_count = 0
        
        for user in users:
            try:
                old_hash = user.password_hash[:50]
                user.password_hash = new_password_hash
                logger.info(f"✅ 更新用户 {user.username} (ID: {user.id})")
                logger.info(f"   旧哈希: {old_hash}...")
                logger.info(f"   新哈希: {new_password_hash[:50]}...")
                success_count += 1
            except Exception as e:
                logger.error(f"❌ 更新用户 {user.username} 失败: {str(e)}")
        
        db.commit()
        logger.info(f"✅ 密码重置完成 - 成功: {success_count}/{len(users)}")
        logger.info(f"💡 所有用户的新密码: {default_password}")
        
    except Exception as e:
        logger.error(f"❌ 密码重置失败: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        password = sys.argv[1]
    else:
        password = "Test123456"
    
    logger.warning("⚠️  警告：此操作将重置所有用户密码！")
    logger.info(f"🔐 新密码将设置为: {password}")
    
    confirm = input("确认继续？(yes/no): ")
    if confirm.lower() == 'yes':
        reset_all_passwords(password)
    else:
        logger.info("❌ 操作已取消")

