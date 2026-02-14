from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime

from app.core.database import get_db
from app.utils.dependencies import get_current_user
from app.models.user import User
from app.models.tools import TodoStatus, ExpenseType
from app.schemas.tools import (
    CountdownCreate, CountdownUpdate, CountdownResponse, CountdownListResponse,
    TodoCreate, TodoUpdate, TodoResponse, TodoListResponse, TodoStatsResponse,
    ExpenseCreate, ExpenseUpdate, ExpenseResponse, ExpenseListResponse, ExpenseStatsResponse,
    HabitCreate, HabitUpdate, HabitResponse, HabitListResponse, HabitRecordCreate, HabitRecordResponse,
    NoteCreate, NoteUpdate, NoteResponse, NoteListResponse,
)
from app.schemas import ApiResponse, MessageResponse
from app.services.tools_service import ToolsService

router = APIRouter()


# ==================== 倒计时相关接口 ====================

@router.post(
    "/countdown",
    response_model=ApiResponse[CountdownResponse],
    summary="创建倒计时",
    description="创建新的倒计时"
)
async def create_countdown(
    data: CountdownCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """创建倒计时"""
    service = ToolsService(db)
    return service.create_countdown(str(current_user.id), data)


@router.get(
    "/countdown",
    response_model=ApiResponse[CountdownListResponse],
    summary="获取倒计时列表",
    description="获取用户的倒计时列表"
)
async def get_countdown_list(
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(20, ge=1, le=100, description="每页数量"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取倒计时列表"""
    service = ToolsService(db)
    return service.get_countdown_list(str(current_user.id), page, page_size)


@router.put(
    "/countdown/{countdown_id}",
    response_model=ApiResponse[CountdownResponse],
    summary="更新倒计时",
    description="更新指定的倒计时"
)
async def update_countdown(
    countdown_id: str,
    data: CountdownUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """更新倒计时"""
    service = ToolsService(db)
    return service.update_countdown(countdown_id, str(current_user.id), data)


@router.delete(
    "/countdown/{countdown_id}",
    response_model=ApiResponse[None],
    summary="删除倒计时",
    description="删除指定的倒计时"
)
async def delete_countdown(
    countdown_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """删除倒计时"""
    service = ToolsService(db)
    return service.delete_countdown(countdown_id, str(current_user.id))


# ==================== 待办清单相关接口 ====================

@router.post(
    "/todo",
    response_model=ApiResponse[TodoResponse],
    summary="创建待办",
    description="创建新的待办事项"
)
async def create_todo(
    data: TodoCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """创建待办"""
    service = ToolsService(db)
    return service.create_todo(str(current_user.id), data)


@router.get(
    "/todo",
    response_model=ApiResponse[TodoListResponse],
    summary="获取待办列表",
    description="获取用户的待办列表"
)
async def get_todo_list(
    status: Optional[TodoStatus] = Query(None, description="状态筛选"),
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(50, ge=1, le=100, description="每页数量"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取待办列表"""
    service = ToolsService(db)
    return service.get_todo_list(str(current_user.id), status, page, page_size)


@router.get(
    "/todo/stats",
    response_model=ApiResponse[TodoStatsResponse],
    summary="获取待办统计",
    description="获取待办事项的统计数据"
)
async def get_todo_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取待办统计"""
    service = ToolsService(db)
    return service.get_todo_stats(str(current_user.id))


@router.put(
    "/todo/{todo_id}",
    response_model=ApiResponse[TodoResponse],
    summary="更新待办",
    description="更新指定的待办事项"
)
async def update_todo(
    todo_id: str,
    data: TodoUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """更新待办"""
    service = ToolsService(db)
    return service.update_todo(todo_id, str(current_user.id), data)


@router.delete(
    "/todo/{todo_id}",
    response_model=ApiResponse[None],
    summary="删除待办",
    description="删除指定的待办事项"
)
async def delete_todo(
    todo_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """删除待办"""
    service = ToolsService(db)
    return service.delete_todo(todo_id, str(current_user.id))


# ==================== 记账相关接口 ====================

@router.post(
    "/expense",
    response_model=ApiResponse[ExpenseResponse],
    summary="创建记账",
    description="创建新的收支记录"
)
async def create_expense(
    data: ExpenseCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """创建记账"""
    service = ToolsService(db)
    return service.create_expense(str(current_user.id), data)


@router.get(
    "/expense",
    response_model=ApiResponse[ExpenseListResponse],
    summary="获取记账列表",
    description="获取用户的收支记录列表"
)
async def get_expense_list(
    type: Optional[ExpenseType] = Query(None, description="类型筛选"),
    start_date: Optional[datetime] = Query(None, description="开始日期"),
    end_date: Optional[datetime] = Query(None, description="结束日期"),
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(50, ge=1, le=100, description="每页数量"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取记账列表"""
    service = ToolsService(db)
    return service.get_expense_list(str(current_user.id), type, start_date, end_date, page, page_size)


@router.get(
    "/expense/stats",
    response_model=ApiResponse[ExpenseStatsResponse],
    summary="获取记账统计",
    description="获取收支统计数据"
)
async def get_expense_stats(
    start_date: Optional[datetime] = Query(None, description="开始日期"),
    end_date: Optional[datetime] = Query(None, description="结束日期"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取记账统计"""
    service = ToolsService(db)
    return service.get_expense_stats(str(current_user.id), start_date, end_date)


@router.put(
    "/expense/{expense_id}",
    response_model=ApiResponse[ExpenseResponse],
    summary="更新记账",
    description="更新指定的收支记录"
)
async def update_expense(
    expense_id: str,
    data: ExpenseUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """更新记账"""
    service = ToolsService(db)
    return service.update_expense(expense_id, str(current_user.id), data)


@router.delete(
    "/expense/{expense_id}",
    response_model=ApiResponse[None],
    summary="删除记账",
    description="删除指定的收支记录"
)
async def delete_expense(
    expense_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """删除记账"""
    service = ToolsService(db)
    return service.delete_expense(expense_id, str(current_user.id))


# ==================== 习惯打卡相关接口 ====================

@router.post(
    "/habit",
    response_model=ApiResponse[HabitResponse],
    summary="创建习惯",
    description="创建新的习惯"
)
async def create_habit(
    data: HabitCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """创建习惯"""
    service = ToolsService(db)
    return service.create_habit(str(current_user.id), data)


@router.get(
    "/habit",
    response_model=ApiResponse[HabitListResponse],
    summary="获取习惯列表",
    description="获取用户的习惯列表"
)
async def get_habit_list(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取习惯列表"""
    service = ToolsService(db)
    return service.get_habit_list(str(current_user.id))


@router.post(
    "/habit/{habit_id}/checkin",
    response_model=ApiResponse[HabitRecordResponse],
    summary="习惯打卡",
    description="为指定习惯打卡"
)
async def check_in_habit(
    habit_id: str,
    data: HabitRecordCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """习惯打卡"""
    service = ToolsService(db)
    return service.check_in_habit(habit_id, str(current_user.id), data)


@router.delete(
    "/habit/{habit_id}",
    response_model=ApiResponse[None],
    summary="删除习惯",
    description="删除指定的习惯"
)
async def delete_habit(
    habit_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """删除习惯"""
    service = ToolsService(db)
    return service.delete_habit(habit_id, str(current_user.id))


# ==================== 笔记相关接口 ====================

@router.post(
    "/note",
    response_model=ApiResponse[NoteResponse],
    summary="创建笔记",
    description="创建新的笔记"
)
async def create_note(
    data: NoteCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """创建笔记"""
    service = ToolsService(db)
    return service.create_note(str(current_user.id), data)


@router.get(
    "/note",
    response_model=ApiResponse[NoteListResponse],
    summary="获取笔记列表",
    description="获取用户的笔记列表"
)
async def get_note_list(
    keyword: Optional[str] = Query(None, description="搜索关键词"),
    category: Optional[str] = Query(None, description="分类筛选"),
    is_archived: bool = Query(False, description="是否归档"),
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(50, ge=1, le=100, description="每页数量"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取笔记列表"""
    service = ToolsService(db)
    return service.get_note_list(str(current_user.id), keyword, category, is_archived, page, page_size)


@router.put(
    "/note/{note_id}",
    response_model=ApiResponse[NoteResponse],
    summary="更新笔记",
    description="更新指定的笔记"
)
async def update_note(
    note_id: str,
    data: NoteUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """更新笔记"""
    service = ToolsService(db)
    return service.update_note(note_id, str(current_user.id), data)


@router.delete(
    "/note/{note_id}",
    response_model=ApiResponse[None],
    summary="删除笔记",
    description="删除指定的笔记"
)
async def delete_note(
    note_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """删除笔记"""
    service = ToolsService(db)
    return service.delete_note(note_id, str(current_user.id))


