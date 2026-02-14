from sqlalchemy.orm import Session
from sqlalchemy import desc, and_, func, extract
from typing import List, Optional
from fastapi import HTTPException, status
from datetime import datetime, timedelta, timezone
import logging

from app.models.tools import (
    Countdown, Todo, Expense, Habit, HabitRecord, Note,
    TodoStatus, ExpenseType
)
from app.schemas.tools import (
    CountdownCreate, CountdownUpdate, CountdownResponse, CountdownListResponse,
    TodoCreate, TodoUpdate, TodoResponse, TodoListResponse, TodoStatsResponse,
    ExpenseCreate, ExpenseUpdate, ExpenseResponse, ExpenseListResponse, ExpenseStatsResponse,
    HabitCreate, HabitUpdate, HabitResponse, HabitListResponse, HabitRecordCreate, HabitRecordResponse,
    NoteCreate, NoteUpdate, NoteResponse, NoteListResponse,
)
from app.schemas import ApiResponse

logger = logging.getLogger(__name__)


class ToolsService:
    """工具服务"""
    
    def __init__(self, db: Session):
        self.db = db
    
    # ==================== 倒计时相关 ====================
    
    def create_countdown(self, user_id: str, data: CountdownCreate) -> ApiResponse[CountdownResponse]:
        """创建倒计时"""
        try:
            countdown = Countdown(
                user_id=user_id,
                **data.dict()
            )
            self.db.add(countdown)
            self.db.commit()
            self.db.refresh(countdown)
            
            response = CountdownResponse.from_orm(countdown)
            now = datetime.now(timezone.utc)
            response.days_remaining = (countdown.target_date - now).days
            
            return ApiResponse(code=200, data=response, msg="创建成功")
        except Exception as e:
            logger.error(f"创建倒计时失败: {str(e)}")
            self.db.rollback()
            raise HTTPException(status_code=500, detail=str(e))
    
    def get_countdown_list(
        self, user_id: str, page: int = 1, page_size: int = 20
    ) -> ApiResponse[CountdownListResponse]:
        """获取倒计时列表"""
        try:
            query = self.db.query(Countdown).filter(Countdown.user_id == user_id)
            
            total = query.count()
            offset = (page - 1) * page_size
            countdowns = query.order_by(Countdown.target_date).offset(offset).limit(page_size).all()
            
            items = []
            now = datetime.now(timezone.utc)
            for countdown in countdowns:
                item = CountdownResponse.from_orm(countdown)
                item.days_remaining = (countdown.target_date - now).days
                items.append(item)
            
            total_pages = (total + page_size - 1) // page_size
            
            return ApiResponse(
                code=200,
                data=CountdownListResponse(
                    items=items,
                    total=total,
                    page=page,
                    page_size=page_size,
                    total_pages=total_pages
                ),
                msg="获取成功"
            )
        except Exception as e:
            logger.error(f"获取倒计时列表失败: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))
    
    def update_countdown(
        self, countdown_id: str, user_id: str, data: CountdownUpdate
    ) -> ApiResponse[CountdownResponse]:
        """更新倒计时"""
        try:
            countdown = self.db.query(Countdown).filter(
                and_(Countdown.id == countdown_id, Countdown.user_id == user_id)
            ).first()
            
            if not countdown:
                raise HTTPException(status_code=404, detail="倒计时不存在")
            
            update_data = data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(countdown, field, value)
            
            self.db.commit()
            self.db.refresh(countdown)
            
            response = CountdownResponse.from_orm(countdown)
            now = datetime.now(timezone.utc)
            response.days_remaining = (countdown.target_date - now).days
            
            return ApiResponse(code=200, data=response, msg="更新成功")
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"更新倒计时失败: {str(e)}")
            self.db.rollback()
            raise HTTPException(status_code=500, detail=str(e))
    
    def delete_countdown(self, countdown_id: str, user_id: str) -> ApiResponse[None]:
        """删除倒计时"""
        try:
            countdown = self.db.query(Countdown).filter(
                and_(Countdown.id == countdown_id, Countdown.user_id == user_id)
            ).first()
            
            if not countdown:
                raise HTTPException(status_code=404, detail="倒计时不存在")
            
            self.db.delete(countdown)
            self.db.commit()
            
            return ApiResponse(code=200, data=None, msg="删除成功")
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"删除倒计时失败: {str(e)}")
            self.db.rollback()
            raise HTTPException(status_code=500, detail=str(e))
    
    # ==================== 待办清单相关 ====================
    
    def create_todo(self, user_id: str, data: TodoCreate) -> ApiResponse[TodoResponse]:
        """创建待办"""
        try:
            todo = Todo(
                user_id=user_id,
                **data.dict()
            )
            self.db.add(todo)
            self.db.commit()
            self.db.refresh(todo)
            
            return ApiResponse(code=200, data=TodoResponse.from_orm(todo), msg="创建成功")
        except Exception as e:
            logger.error(f"创建待办失败: {str(e)}")
            self.db.rollback()
            raise HTTPException(status_code=500, detail=str(e))
    
    def get_todo_list(
        self, 
        user_id: str, 
        status: Optional[TodoStatus] = None,
        page: int = 1, 
        page_size: int = 50
    ) -> ApiResponse[TodoListResponse]:
        """获取待办列表"""
        try:
            query = self.db.query(Todo).filter(Todo.user_id == user_id)
            
            if status:
                query = query.filter(Todo.status == status)
            
            total = query.count()
            offset = (page - 1) * page_size
            todos = query.order_by(desc(Todo.created_at)).offset(offset).limit(page_size).all()
            
            items = [TodoResponse.from_orm(todo) for todo in todos]
            total_pages = (total + page_size - 1) // page_size
            
            return ApiResponse(
                code=200,
                data=TodoListResponse(
                    items=items,
                    total=total,
                    page=page,
                    page_size=page_size,
                    total_pages=total_pages
                ),
                msg="获取成功"
            )
        except Exception as e:
            logger.error(f"获取待办列表失败: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))
    
    def update_todo(
        self, todo_id: str, user_id: str, data: TodoUpdate
    ) -> ApiResponse[TodoResponse]:
        """更新待办"""
        try:
            todo = self.db.query(Todo).filter(
                and_(Todo.id == todo_id, Todo.user_id == user_id)
            ).first()
            
            if not todo:
                raise HTTPException(status_code=404, detail="待办不存在")
            
            update_data = data.dict(exclude_unset=True)
            
            # 如果状态变为完成，记录完成时间
            if 'status' in update_data and update_data['status'] == TodoStatus.DONE:
                update_data['completed_at'] = datetime.now(timezone.utc)
            
            for field, value in update_data.items():
                setattr(todo, field, value)
            
            self.db.commit()
            self.db.refresh(todo)
            
            return ApiResponse(code=200, data=TodoResponse.from_orm(todo), msg="更新成功")
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"更新待办失败: {str(e)}")
            self.db.rollback()
            raise HTTPException(status_code=500, detail=str(e))
    
    def delete_todo(self, todo_id: str, user_id: str) -> ApiResponse[None]:
        """删除待办"""
        try:
            todo = self.db.query(Todo).filter(
                and_(Todo.id == todo_id, Todo.user_id == user_id)
            ).first()
            
            if not todo:
                raise HTTPException(status_code=404, detail="待办不存在")
            
            self.db.delete(todo)
            self.db.commit()
            
            return ApiResponse(code=200, data=None, msg="删除成功")
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"删除待办失败: {str(e)}")
            self.db.rollback()
            raise HTTPException(status_code=500, detail=str(e))
    
    def get_todo_stats(self, user_id: str) -> ApiResponse[TodoStatsResponse]:
        """获取待办统计"""
        try:
            total = self.db.query(Todo).filter(Todo.user_id == user_id).count()
            todo = self.db.query(Todo).filter(
                and_(Todo.user_id == user_id, Todo.status == TodoStatus.TODO)
            ).count()
            in_progress = self.db.query(Todo).filter(
                and_(Todo.user_id == user_id, Todo.status == TodoStatus.IN_PROGRESS)
            ).count()
            done = self.db.query(Todo).filter(
                and_(Todo.user_id == user_id, Todo.status == TodoStatus.DONE)
            ).count()
            cancelled = self.db.query(Todo).filter(
                and_(Todo.user_id == user_id, Todo.status == TodoStatus.CANCELLED)
            ).count()
            
            completion_rate = (done / total * 100) if total > 0 else 0
            
            return ApiResponse(
                code=200,
                data=TodoStatsResponse(
                    total=total,
                    todo=todo,
                    in_progress=in_progress,
                    done=done,
                    cancelled=cancelled,
                    completion_rate=round(completion_rate, 2)
                ),
                msg="获取成功"
            )
        except Exception as e:
            logger.error(f"获取待办统计失败: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))
    
    # ==================== 记账相关 ====================
    
    def create_expense(self, user_id: str, data: ExpenseCreate) -> ApiResponse[ExpenseResponse]:
        """创建记账"""
        try:
            expense = Expense(
                user_id=user_id,
                **data.dict()
            )
            self.db.add(expense)
            self.db.commit()
            self.db.refresh(expense)
            
            return ApiResponse(code=200, data=ExpenseResponse.from_orm(expense), msg="创建成功")
        except Exception as e:
            logger.error(f"创建记账失败: {str(e)}")
            self.db.rollback()
            raise HTTPException(status_code=500, detail=str(e))
    
    def get_expense_list(
        self,
        user_id: str,
        type: Optional[ExpenseType] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        page: int = 1,
        page_size: int = 50
    ) -> ApiResponse[ExpenseListResponse]:
        """获取记账列表"""
        try:
            query = self.db.query(Expense).filter(Expense.user_id == user_id)
            
            if type:
                query = query.filter(Expense.type == type)
            if start_date:
                query = query.filter(Expense.date >= start_date)
            if end_date:
                query = query.filter(Expense.date <= end_date)
            
            total = query.count()
            offset = (page - 1) * page_size
            expenses = query.order_by(desc(Expense.date)).offset(offset).limit(page_size).all()
            
            items = [ExpenseResponse.from_orm(expense) for expense in expenses]
            total_pages = (total + page_size - 1) // page_size
            
            return ApiResponse(
                code=200,
                data=ExpenseListResponse(
                    items=items,
                    total=total,
                    page=page,
                    page_size=page_size,
                    total_pages=total_pages
                ),
                msg="获取成功"
            )
        except Exception as e:
            logger.error(f"获取记账列表失败: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))
    
    def update_expense(
        self, expense_id: str, user_id: str, data: ExpenseUpdate
    ) -> ApiResponse[ExpenseResponse]:
        """更新记账"""
        try:
            expense = self.db.query(Expense).filter(
                and_(Expense.id == expense_id, Expense.user_id == user_id)
            ).first()
            
            if not expense:
                raise HTTPException(status_code=404, detail="记账不存在")
            
            update_data = data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(expense, field, value)
            
            self.db.commit()
            self.db.refresh(expense)
            
            return ApiResponse(code=200, data=ExpenseResponse.from_orm(expense), msg="更新成功")
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"更新记账失败: {str(e)}")
            self.db.rollback()
            raise HTTPException(status_code=500, detail=str(e))
    
    def delete_expense(self, expense_id: str, user_id: str) -> ApiResponse[None]:
        """删除记账"""
        try:
            expense = self.db.query(Expense).filter(
                and_(Expense.id == expense_id, Expense.user_id == user_id)
            ).first()
            
            if not expense:
                raise HTTPException(status_code=404, detail="记账不存在")
            
            self.db.delete(expense)
            self.db.commit()
            
            return ApiResponse(code=200, data=None, msg="删除成功")
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"删除记账失败: {str(e)}")
            self.db.rollback()
            raise HTTPException(status_code=500, detail=str(e))
    
    def get_expense_stats(
        self,
        user_id: str,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> ApiResponse[ExpenseStatsResponse]:
        """获取记账统计"""
        try:
            query = self.db.query(Expense).filter(Expense.user_id == user_id)
            
            if start_date:
                query = query.filter(Expense.date >= start_date)
            if end_date:
                query = query.filter(Expense.date <= end_date)
            
            # 总收入
            total_income = self.db.query(func.sum(Expense.amount)).filter(
                and_(Expense.user_id == user_id, Expense.type == ExpenseType.INCOME)
            ).scalar() or 0
            
            # 总支出
            total_expense = self.db.query(func.sum(Expense.amount)).filter(
                and_(Expense.user_id == user_id, Expense.type == ExpenseType.EXPENSE)
            ).scalar() or 0
            
            # 按分类统计
            category_stats = self.db.query(
                Expense.category,
                Expense.type,
                func.sum(Expense.amount).label('total'),
                func.count(Expense.id).label('count')
            ).filter(Expense.user_id == user_id).group_by(
                Expense.category, Expense.type
            ).all()
            
            category_list = [
                {
                    'category': stat.category,
                    'type': stat.type,
                    'total': float(stat.total),
                    'count': stat.count
                }
                for stat in category_stats
            ]
            
            # 月度趋势（最近6个月）
            monthly_trend = self.db.query(
                extract('year', Expense.date).label('year'),
                extract('month', Expense.date).label('month'),
                Expense.type,
                func.sum(Expense.amount).label('total')
            ).filter(Expense.user_id == user_id).group_by(
                'year', 'month', Expense.type
            ).order_by(desc('year'), desc('month')).limit(12).all()
            
            trend_list = [
                {
                    'year': int(trend.year),
                    'month': int(trend.month),
                    'type': trend.type,
                    'total': float(trend.total)
                }
                for trend in monthly_trend
            ]
            
            return ApiResponse(
                code=200,
                data=ExpenseStatsResponse(
                    total_income=float(total_income),
                    total_expense=float(total_expense),
                    balance=float(total_income - total_expense),
                    category_stats=category_list,
                    monthly_trend=trend_list
                ),
                msg="获取成功"
            )
        except Exception as e:
            logger.error(f"获取记账统计失败: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))
    
    # ==================== 习惯打卡相关 ====================
    
    def create_habit(self, user_id: str, data: HabitCreate) -> ApiResponse[HabitResponse]:
        """创建习惯"""
        try:
            habit = Habit(
                user_id=user_id,
                **data.dict()
            )
            self.db.add(habit)
            self.db.commit()
            self.db.refresh(habit)
            
            response = HabitResponse.from_orm(habit)
            response.checked_today = False
            
            return ApiResponse(code=200, data=response, msg="创建成功")
        except Exception as e:
            logger.error(f"创建习惯失败: {str(e)}")
            self.db.rollback()
            raise HTTPException(status_code=500, detail=str(e))
    
    def get_habit_list(self, user_id: str) -> ApiResponse[HabitListResponse]:
        """获取习惯列表"""
        try:
            habits = self.db.query(Habit).filter(Habit.user_id == user_id).order_by(
                desc(Habit.is_active), desc(Habit.created_at)
            ).all()
            
            today = datetime.now(timezone.utc).date()
            items = []
            
            for habit in habits:
                item = HabitResponse.from_orm(habit)
                # 检查今天是否已打卡
                record = self.db.query(HabitRecord).filter(
                    and_(
                        HabitRecord.habit_id == habit.id,
                        func.date(HabitRecord.date) == today
                    )
                ).first()
                item.checked_today = record is not None
                items.append(item)
            
            return ApiResponse(
                code=200,
                data=HabitListResponse(items=items, total=len(items)),
                msg="获取成功"
            )
        except Exception as e:
            logger.error(f"获取习惯列表失败: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))
    
    def check_in_habit(
        self, habit_id: str, user_id: str, data: HabitRecordCreate
    ) -> ApiResponse[HabitRecordResponse]:
        """习惯打卡"""
        try:
            habit = self.db.query(Habit).filter(
                and_(Habit.id == habit_id, Habit.user_id == user_id)
            ).first()
            
            if not habit:
                raise HTTPException(status_code=404, detail="习惯不存在")
            
            # 检查今天是否已打卡
            today = data.date.date()
            existing = self.db.query(HabitRecord).filter(
                and_(
                    HabitRecord.habit_id == habit_id,
                    func.date(HabitRecord.date) == today
                )
            ).first()
            
            if existing:
                raise HTTPException(status_code=400, detail="今天已经打卡了")
            
            # 创建打卡记录
            record = HabitRecord(
                habit_id=habit_id,
                user_id=user_id,
                date=data.date,
                note=data.note
            )
            self.db.add(record)
            
            # 更新习惯统计
            habit.total_days += 1
            
            # 检查连续天数
            yesterday = today - timedelta(days=1)
            yesterday_record = self.db.query(HabitRecord).filter(
                and_(
                    HabitRecord.habit_id == habit_id,
                    func.date(HabitRecord.date) == yesterday
                )
            ).first()
            
            if yesterday_record:
                habit.current_streak += 1
            else:
                habit.current_streak = 1
            
            if habit.current_streak > habit.longest_streak:
                habit.longest_streak = habit.current_streak
            
            self.db.commit()
            self.db.refresh(record)
            
            return ApiResponse(
                code=200,
                data=HabitRecordResponse.from_orm(record),
                msg="打卡成功"
            )
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"习惯打卡失败: {str(e)}")
            self.db.rollback()
            raise HTTPException(status_code=500, detail=str(e))
    
    def delete_habit(self, habit_id: str, user_id: str) -> ApiResponse[None]:
        """删除习惯"""
        try:
            habit = self.db.query(Habit).filter(
                and_(Habit.id == habit_id, Habit.user_id == user_id)
            ).first()
            
            if not habit:
                raise HTTPException(status_code=404, detail="习惯不存在")
            
            # 删除相关打卡记录
            self.db.query(HabitRecord).filter(HabitRecord.habit_id == habit_id).delete()
            
            self.db.delete(habit)
            self.db.commit()
            
            return ApiResponse(code=200, data=None, msg="删除成功")
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"删除习惯失败: {str(e)}")
            self.db.rollback()
            raise HTTPException(status_code=500, detail=str(e))
    
    # ==================== 笔记相关 ====================
    
    def create_note(self, user_id: str, data: NoteCreate) -> ApiResponse[NoteResponse]:
        """创建笔记"""
        try:
            note = Note(
                user_id=user_id,
                **data.dict()
            )
            self.db.add(note)
            self.db.commit()
            self.db.refresh(note)
            
            return ApiResponse(code=200, data=NoteResponse.from_orm(note), msg="创建成功")
        except Exception as e:
            logger.error(f"创建笔记失败: {str(e)}")
            self.db.rollback()
            raise HTTPException(status_code=500, detail=str(e))
    
    def get_note_list(
        self,
        user_id: str,
        keyword: Optional[str] = None,
        category: Optional[str] = None,
        is_archived: bool = False,
        page: int = 1,
        page_size: int = 50
    ) -> ApiResponse[NoteListResponse]:
        """获取笔记列表"""
        try:
            query = self.db.query(Note).filter(
                and_(Note.user_id == user_id, Note.is_archived == is_archived)
            )
            
            if keyword:
                query = query.filter(
                    (Note.title.ilike(f"%{keyword}%")) | (Note.content.ilike(f"%{keyword}%"))
                )
            
            if category:
                query = query.filter(Note.category == category)
            
            total = query.count()
            offset = (page - 1) * page_size
            notes = query.order_by(
                desc(Note.is_pinned), desc(Note.updated_at)
            ).offset(offset).limit(page_size).all()
            
            items = [NoteResponse.from_orm(note) for note in notes]
            total_pages = (total + page_size - 1) // page_size
            
            return ApiResponse(
                code=200,
                data=NoteListResponse(
                    items=items,
                    total=total,
                    page=page,
                    page_size=page_size,
                    total_pages=total_pages
                ),
                msg="获取成功"
            )
        except Exception as e:
            logger.error(f"获取笔记列表失败: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))
    
    def update_note(
        self, note_id: str, user_id: str, data: NoteUpdate
    ) -> ApiResponse[NoteResponse]:
        """更新笔记"""
        try:
            note = self.db.query(Note).filter(
                and_(Note.id == note_id, Note.user_id == user_id)
            ).first()
            
            if not note:
                raise HTTPException(status_code=404, detail="笔记不存在")
            
            update_data = data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(note, field, value)
            
            self.db.commit()
            self.db.refresh(note)
            
            return ApiResponse(code=200, data=NoteResponse.from_orm(note), msg="更新成功")
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"更新笔记失败: {str(e)}")
            self.db.rollback()
            raise HTTPException(status_code=500, detail=str(e))
    
    def delete_note(self, note_id: str, user_id: str) -> ApiResponse[None]:
        """删除笔记"""
        try:
            note = self.db.query(Note).filter(
                and_(Note.id == note_id, Note.user_id == user_id)
            ).first()
            
            if not note:
                raise HTTPException(status_code=404, detail="笔记不存在")
            
            self.db.delete(note)
            self.db.commit()
            
            return ApiResponse(code=200, data=None, msg="删除成功")
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"删除笔记失败: {str(e)}")
            self.db.rollback()
            raise HTTPException(status_code=500, detail=str(e))


