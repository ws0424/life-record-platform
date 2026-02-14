from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, JSON, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
import enum

from app.core.database import Base


class CountdownType(str, enum.Enum):
    """倒计时类型"""
    BIRTHDAY = "birthday"  # 生日
    ANNIVERSARY = "anniversary"  # 纪念日
    EXAM = "exam"  # 考试
    VACATION = "vacation"  # 假期
    EVENT = "event"  # 活动
    OTHER = "other"  # 其他


class TodoStatus(str, enum.Enum):
    """待办状态"""
    TODO = "todo"  # 待办
    IN_PROGRESS = "in_progress"  # 进行中
    DONE = "done"  # 已完成
    CANCELLED = "cancelled"  # 已取消


class TodoPriority(str, enum.Enum):
    """待办优先级"""
    LOW = "low"  # 低
    MEDIUM = "medium"  # 中
    HIGH = "high"  # 高
    URGENT = "urgent"  # 紧急


class ExpenseType(str, enum.Enum):
    """记账类型"""
    INCOME = "income"  # 收入
    EXPENSE = "expense"  # 支出


class ExpenseCategory(str, enum.Enum):
    """记账分类"""
    # 支出分类
    FOOD = "food"  # 餐饮
    TRANSPORT = "transport"  # 交通
    SHOPPING = "shopping"  # 购物
    ENTERTAINMENT = "entertainment"  # 娱乐
    HOUSING = "housing"  # 住房
    HEALTHCARE = "healthcare"  # 医疗
    EDUCATION = "education"  # 教育
    UTILITIES = "utilities"  # 水电
    OTHER_EXPENSE = "other_expense"  # 其他支出
    
    # 收入分类
    SALARY = "salary"  # 工资
    BONUS = "bonus"  # 奖金
    INVESTMENT = "investment"  # 投资
    GIFT = "gift"  # 礼物
    OTHER_INCOME = "other_income"  # 其他收入


class Countdown(Base):
    """倒计时模型"""
    __tablename__ = "countdowns"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    title = Column(String(200), nullable=False)  # 标题
    description = Column(Text, nullable=True)  # 描述
    target_date = Column(DateTime(timezone=True), nullable=False)  # 目标日期
    type = Column(SQLEnum(CountdownType), default=CountdownType.OTHER)  # 类型
    color = Column(String(50), default="#667eea")  # 颜色
    icon = Column(String(50), nullable=True)  # 图标
    is_repeat = Column(Boolean, default=False)  # 是否重复（每年）
    is_completed = Column(Boolean, default=False)  # 是否已完成
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class Todo(Base):
    """待办清单模型"""
    __tablename__ = "todos"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    title = Column(String(500), nullable=False)  # 标题
    description = Column(Text, nullable=True)  # 描述
    status = Column(SQLEnum(TodoStatus), default=TodoStatus.TODO, index=True)  # 状态
    priority = Column(SQLEnum(TodoPriority), default=TodoPriority.MEDIUM)  # 优先级
    
    due_date = Column(DateTime(timezone=True), nullable=True)  # 截止日期
    completed_at = Column(DateTime(timezone=True), nullable=True)  # 完成时间
    
    tags = Column(JSON, default=list)  # 标签
    category = Column(String(100), nullable=True)  # 分类
    
    # 子任务
    parent_id = Column(UUID(as_uuid=True), nullable=True, index=True)  # 父任务ID
    order = Column(Integer, default=0)  # 排序
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class Expense(Base):
    """记账模型"""
    __tablename__ = "expenses"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    type = Column(SQLEnum(ExpenseType), nullable=False, index=True)  # 类型：收入/支出
    category = Column(SQLEnum(ExpenseCategory), nullable=False, index=True)  # 分类
    amount = Column(Float, nullable=False)  # 金额
    
    title = Column(String(200), nullable=False)  # 标题
    description = Column(Text, nullable=True)  # 描述
    date = Column(DateTime(timezone=True), nullable=False, index=True)  # 日期
    
    tags = Column(JSON, default=list)  # 标签
    images = Column(JSON, default=list)  # 图片（凭证）
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class Habit(Base):
    """习惯打卡模型"""
    __tablename__ = "habits"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    name = Column(String(200), nullable=False)  # 习惯名称
    description = Column(Text, nullable=True)  # 描述
    icon = Column(String(50), nullable=True)  # 图标
    color = Column(String(50), default="#43e97b")  # 颜色
    
    target_days = Column(Integer, default=21)  # 目标天数
    current_streak = Column(Integer, default=0)  # 当前连续天数
    longest_streak = Column(Integer, default=0)  # 最长连续天数
    total_days = Column(Integer, default=0)  # 总打卡天数
    
    frequency = Column(String(50), default="daily")  # 频率：daily/weekly/custom
    reminder_time = Column(String(10), nullable=True)  # 提醒时间 HH:MM
    
    is_active = Column(Boolean, default=True)  # 是否激活
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class HabitRecord(Base):
    """习惯打卡记录"""
    __tablename__ = "habit_records"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    habit_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    date = Column(DateTime(timezone=True), nullable=False, index=True)  # 打卡日期
    note = Column(Text, nullable=True)  # 备注
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Note(Base):
    """笔记模型"""
    __tablename__ = "notes"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    title = Column(String(500), nullable=False)  # 标题
    content = Column(Text, nullable=False)  # 内容（Markdown）
    
    tags = Column(JSON, default=list)  # 标签
    category = Column(String(100), nullable=True)  # 分类
    
    is_pinned = Column(Boolean, default=False)  # 是否置顶
    is_archived = Column(Boolean, default=False)  # 是否归档
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


