from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from datetime import datetime
from uuid import UUID
from app.models.tools import (
    CountdownType, TodoStatus, TodoPriority, 
    ExpenseType, ExpenseCategory
)


# ==================== 倒计时 Schemas ====================

class CountdownBase(BaseModel):
    title: str = Field(..., max_length=200)
    description: Optional[str] = None
    target_date: datetime
    type: CountdownType = CountdownType.OTHER
    color: str = "#667eea"
    icon: Optional[str] = None
    is_repeat: bool = False


class CountdownCreate(CountdownBase):
    pass


class CountdownUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = None
    target_date: Optional[datetime] = None
    type: Optional[CountdownType] = None
    color: Optional[str] = None
    icon: Optional[str] = None
    is_repeat: Optional[bool] = None
    is_completed: Optional[bool] = None


class CountdownResponse(CountdownBase):
    id: str
    user_id: str
    is_completed: bool
    created_at: datetime
    updated_at: datetime
    days_remaining: Optional[int] = None  # 剩余天数（计算字段）
    
    @field_validator('id', 'user_id', mode='before')
    @classmethod
    def convert_uuid_to_str(cls, v):
        if isinstance(v, UUID):
            return str(v)
        return v
    
    class Config:
        from_attributes = True


class CountdownListResponse(BaseModel):
    items: List[CountdownResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


# ==================== 待办清单 Schemas ====================

class TodoBase(BaseModel):
    title: str = Field(..., max_length=500)
    description: Optional[str] = None
    status: TodoStatus = TodoStatus.TODO
    priority: TodoPriority = TodoPriority.MEDIUM
    due_date: Optional[datetime] = None
    tags: List[str] = []
    category: Optional[str] = None
    parent_id: Optional[str] = None
    order: int = 0


class TodoCreate(TodoBase):
    pass


class TodoUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=500)
    description: Optional[str] = None
    status: Optional[TodoStatus] = None
    priority: Optional[TodoPriority] = None
    due_date: Optional[datetime] = None
    tags: Optional[List[str]] = None
    category: Optional[str] = None
    parent_id: Optional[str] = None
    order: Optional[int] = None


class TodoResponse(TodoBase):
    id: str
    user_id: str
    completed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    
    @field_validator('id', 'user_id', 'parent_id', mode='before')
    @classmethod
    def convert_uuid_to_str(cls, v):
        if isinstance(v, UUID):
            return str(v)
        return v
    
    class Config:
        from_attributes = True


class TodoListResponse(BaseModel):
    items: List[TodoResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class TodoStatsResponse(BaseModel):
    total: int
    todo: int
    in_progress: int
    done: int
    cancelled: int
    completion_rate: float


# ==================== 记账 Schemas ====================

class ExpenseBase(BaseModel):
    type: ExpenseType
    category: ExpenseCategory
    amount: float = Field(..., gt=0)
    title: str = Field(..., max_length=200)
    description: Optional[str] = None
    date: datetime
    tags: List[str] = []
    images: List[str] = []


class ExpenseCreate(ExpenseBase):
    pass


class ExpenseUpdate(BaseModel):
    type: Optional[ExpenseType] = None
    category: Optional[ExpenseCategory] = None
    amount: Optional[float] = Field(None, gt=0)
    title: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = None
    date: Optional[datetime] = None
    tags: Optional[List[str]] = None
    images: Optional[List[str]] = None


class ExpenseResponse(ExpenseBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime
    
    @field_validator('id', 'user_id', mode='before')
    @classmethod
    def convert_uuid_to_str(cls, v):
        if isinstance(v, UUID):
            return str(v)
        return v
    
    class Config:
        from_attributes = True


class ExpenseListResponse(BaseModel):
    items: List[ExpenseResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class ExpenseStatsResponse(BaseModel):
    total_income: float
    total_expense: float
    balance: float
    category_stats: List[dict]  # 按分类统计
    monthly_trend: List[dict]  # 月度趋势


# ==================== 习惯打卡 Schemas ====================

class HabitBase(BaseModel):
    name: str = Field(..., max_length=200)
    description: Optional[str] = None
    icon: Optional[str] = None
    color: str = "#43e97b"
    target_days: int = 21
    frequency: str = "daily"
    reminder_time: Optional[str] = None


class HabitCreate(HabitBase):
    pass


class HabitUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None
    target_days: Optional[int] = None
    frequency: Optional[str] = None
    reminder_time: Optional[str] = None
    is_active: Optional[bool] = None


class HabitResponse(HabitBase):
    id: str
    user_id: str
    current_streak: int
    longest_streak: int
    total_days: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
    checked_today: bool = False  # 今天是否已打卡（计算字段）
    
    @field_validator('id', 'user_id', mode='before')
    @classmethod
    def convert_uuid_to_str(cls, v):
        if isinstance(v, UUID):
            return str(v)
        return v
    
    class Config:
        from_attributes = True


class HabitListResponse(BaseModel):
    items: List[HabitResponse]
    total: int


class HabitRecordCreate(BaseModel):
    date: datetime
    note: Optional[str] = None


class HabitRecordResponse(BaseModel):
    id: str
    habit_id: str
    user_id: str
    date: datetime
    note: Optional[str] = None
    created_at: datetime
    
    @field_validator('id', 'habit_id', 'user_id', mode='before')
    @classmethod
    def convert_uuid_to_str(cls, v):
        if isinstance(v, UUID):
            return str(v)
        return v
    
    class Config:
        from_attributes = True


# ==================== 笔记 Schemas ====================

class NoteBase(BaseModel):
    title: str = Field(..., max_length=500)
    content: str
    tags: List[str] = []
    category: Optional[str] = None
    is_pinned: bool = False
    is_archived: bool = False


class NoteCreate(NoteBase):
    pass


class NoteUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=500)
    content: Optional[str] = None
    tags: Optional[List[str]] = None
    category: Optional[str] = None
    is_pinned: Optional[bool] = None
    is_archived: Optional[bool] = None


class NoteResponse(NoteBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime
    
    @field_validator('id', 'user_id', mode='before')
    @classmethod
    def convert_uuid_to_str(cls, v):
        if isinstance(v, UUID):
            return str(v)
        return v
    
    class Config:
        from_attributes = True


class NoteListResponse(BaseModel):
    items: List[NoteResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


