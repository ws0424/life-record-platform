"""
创建登录日志和设备表
"""
from app.core.database import engine, Base
from app.models.user import User
from app.models.login_log import LoginLog, LoginDevice

def create_tables():
    """创建所有表"""
    print("开始创建数据库表...")
    Base.metadata.create_all(bind=engine)
    print("✅ 数据库表创建成功！")
    print("已创建的表:")
    print("  - users (用户表)")
    print("  - login_logs (登录日志表)")
    print("  - login_devices (登录设备表)")

if __name__ == "__main__":
    create_tables()

