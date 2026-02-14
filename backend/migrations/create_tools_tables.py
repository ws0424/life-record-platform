"""
创建生活小工具相关数据表

运行方式:
python migrations/create_tools_tables.py
"""

import sys
import os

# 添加项目根目录到 Python 路径
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import engine, Base
from app.models.tools import Countdown, Todo, Expense, Habit, HabitRecord, Note
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def create_tools_tables():
    """创建生活小工具相关数据表"""
    try:
        logger.info("开始创建生活小工具数据表...")
        
        # 创建所有表
        Base.metadata.create_all(bind=engine)
        
        logger.info("✅ 生活小工具数据表创建成功！")
        logger.info("已创建的表:")
        logger.info("  - countdowns (倒计时)")
        logger.info("  - todos (待办清单)")
        logger.info("  - expenses (记账)")
        logger.info("  - habits (习惯)")
        logger.info("  - habit_records (习惯打卡记录)")
        logger.info("  - notes (笔记)")
        
    except Exception as e:
        logger.error(f"❌ 创建数据表失败: {str(e)}")
        raise


if __name__ == "__main__":
    create_tools_tables()


