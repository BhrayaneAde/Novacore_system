from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func, desc, asc
from ..db.models import AdvancedTask, TaskAssignment, TaskComment, TaskTag, Employee, User, Department
from ..schemas.task import TaskCreate, TaskUpdate, TaskAssignmentCreate, TaskCommentCreate

class CRUDTask:
    def create_task(self, db: Session, task: TaskCreate, created_by: int) -> AdvancedTask:
        """Create a new task"""
        db_task = AdvancedTask(
            **task.dict(),
            created_by=created_by
        )
        
        # Auto-assign based on department if no specific assignee
        if not task.assigned_to and task.department_id:
            auto_assignee = self._auto_assign_task(db, task.department_id, task.category)
            if auto_assignee:
                db_task.assigned_to = auto_assignee.id
        
        db.add(db_task)
        db.commit()
        db.refresh(db_task)
        
        # Create assignment record
        if db_task.assigned_to:
            self.assign_task(db, db_task.id, db_task.assigned_to, created_by)
        
        # Add tags
        if task.tags:
            self._add_tags(db, db_task.id, task.tags)
        
        return db_task
    
    def get_task(self, db: Session, task_id: int) -> Optional[AdvancedTask]:
        """Get task by ID with relationships"""
        return db.query(AdvancedTask).filter(AdvancedTask.id == task_id).first()
    
    def get_tasks(
        self, 
        db: Session, 
        skip: int = 0, 
        limit: int = 100,
        filters: Optional[Dict[str, Any]] = None
    ) -> List[AdvancedTask]:
        """Get tasks with filters"""
        query = db.query(AdvancedTask)
        
        if filters:
            if filters.get("status"):
                query = query.filter(AdvancedTask.status == filters["status"])
            if filters.get("priority"):
                query = query.filter(AdvancedTask.priority == filters["priority"])
            if filters.get("category"):
                query = query.filter(AdvancedTask.category == filters["category"])
            if filters.get("assigned_to"):
                query = query.filter(AdvancedTask.assigned_to == filters["assigned_to"])
            if filters.get("department_id"):
                query = query.filter(AdvancedTask.department_id == filters["department_id"])
            if filters.get("due_date_from"):
                query = query.filter(AdvancedTask.due_date >= filters["due_date_from"])
            if filters.get("due_date_to"):
                query = query.filter(AdvancedTask.due_date <= filters["due_date_to"])
            if filters.get("overdue"):
                query = query.filter(
                    and_(
                        AdvancedTask.due_date < datetime.utcnow(),
                        AdvancedTask.status.in_(["pending", "in_progress"])
                    )
                )
        
        return query.offset(skip).limit(limit).all()
    
    def update_task(self, db: Session, task_id: int, task_update: TaskUpdate) -> Optional[AdvancedTask]:
        """Update task"""
        db_task = self.get_task(db, task_id)
        if not db_task:
            return None
        
        update_data = task_update.dict(exclude_unset=True)
        
        # Handle status changes
        if "status" in update_data:
            if update_data["status"] == "completed" and db_task.status != "completed":
                update_data["completed_at"] = datetime.utcnow()
                update_data["progress"] = 100
            elif update_data["status"] != "completed" and db_task.status == "completed":
                update_data["completed_at"] = None
        
        # Handle assignment changes
        if "assigned_to" in update_data and update_data["assigned_to"] != db_task.assigned_to:
            # Create new assignment record
            if update_data["assigned_to"]:
                self.assign_task(db, task_id, update_data["assigned_to"], db_task.created_by)
        
        # Handle tags
        if "tags" in update_data:
            self._update_tags(db, task_id, update_data["tags"])
            del update_data["tags"]
        
        for field, value in update_data.items():
            setattr(db_task, field, value)
        
        db_task.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(db_task)
        return db_task
    
    def delete_task(self, db: Session, task_id: int) -> bool:
        """Delete task"""
        db_task = self.get_task(db, task_id)
        if not db_task:
            return False
        
        db.delete(db_task)
        db.commit()
        return True
    
    def assign_task(self, db: Session, task_id: int, assigned_to: int, assigned_by: int, notes: str = None) -> TaskAssignment:
        """Assign task to user"""
        assignment = TaskAssignment(
            task_id=task_id,
            assigned_to=assigned_to,
            assigned_by=assigned_by,
            notes=notes
        )
        db.add(assignment)
        
        # Update task
        db_task = self.get_task(db, task_id)
        if db_task:
            db_task.assigned_to = assigned_to
            db_task.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(assignment)
        return assignment
    
    def add_comment(self, db: Session, comment: TaskCommentCreate, created_by: int) -> TaskComment:
        """Add comment to task"""
        db_comment = TaskComment(
            **comment.dict(),
            created_by=created_by
        )
        db.add(db_comment)
        db.commit()
        db.refresh(db_comment)
        return db_comment
    
    def get_task_comments(self, db: Session, task_id: int) -> List[TaskComment]:
        """Get all comments for a task"""
        return db.query(TaskComment).filter(TaskComment.task_id == task_id).order_by(TaskComment.created_at.desc()).all()
    
    def get_user_tasks(self, db: Session, user_id: int, status: Optional[str] = None) -> List[AdvancedTask]:
        """Get tasks assigned to user"""
        query = db.query(AdvancedTask).filter(AdvancedTask.assigned_to == user_id)
        if status:
            query = query.filter(AdvancedTask.status == status)
        return query.order_by(AdvancedTask.due_date.asc()).all()
    
    def get_overdue_tasks(self, db: Session) -> List[AdvancedTask]:
        """Get all overdue tasks"""
        return db.query(AdvancedTask).filter(
            and_(
                AdvancedTask.due_date < datetime.utcnow(),
                AdvancedTask.status.in_(["pending", "in_progress"])
            )
        ).all()
    
    def get_task_analytics(self, db: Session, department_id: Optional[int] = None) -> Dict[str, Any]:
        """Get task analytics"""
        query = db.query(AdvancedTask)
        if department_id:
            query = query.filter(AdvancedTask.department_id == department_id)
        
        total_tasks = query.count()
        completed_tasks = query.filter(AdvancedTask.status == "completed").count()
        pending_tasks = query.filter(AdvancedTask.status == "pending").count()
        overdue_tasks = query.filter(
            and_(
                AdvancedTask.due_date < datetime.utcnow(),
                AdvancedTask.status.in_(["pending", "in_progress"])
            )
        ).count()
        
        completion_rate = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
        
        # Tasks by priority
        priority_stats = db.query(
            AdvancedTask.priority,
            func.count(AdvancedTask.id).label("count")
        ).group_by(AdvancedTask.priority).all()
        
        # Tasks by category
        category_stats = db.query(
            AdvancedTask.category,
            func.count(AdvancedTask.id).label("count")
        ).group_by(AdvancedTask.category).all()
        
        # Tasks by status
        status_stats = db.query(
            AdvancedTask.status,
            func.count(AdvancedTask.id).label("count")
        ).group_by(AdvancedTask.status).all()
        
        return {
            "total_tasks": total_tasks,
            "completed_tasks": completed_tasks,
            "pending_tasks": pending_tasks,
            "overdue_tasks": overdue_tasks,
            "completion_rate": round(completion_rate, 2),
            "tasks_by_priority": {stat.priority: stat.count for stat in priority_stats},
            "tasks_by_category": {stat.category: stat.count for stat in category_stats},
            "tasks_by_status": {stat.status: stat.count for stat in status_stats}
        }
    
    def get_user_task_stats(self, db: Session, user_id: int) -> Dict[str, Any]:
        """Get task statistics for a specific user"""
        query = db.query(AdvancedTask).filter(AdvancedTask.assigned_to == user_id)
        
        total_assigned = query.count()
        completed = query.filter(AdvancedTask.status == "completed").count()
        pending = query.filter(AdvancedTask.status == "pending").count()
        overdue = query.filter(
            and_(
                AdvancedTask.due_date < datetime.utcnow(),
                AdvancedTask.status.in_(["pending", "in_progress"])
            )
        ).count()
        
        completion_rate = (completed / total_assigned * 100) if total_assigned > 0 else 0
        
        # Average completion time
        completed_tasks = query.filter(
            and_(
                AdvancedTask.status == "completed",
                AdvancedTask.completed_at.isnot(None)
            )
        ).all()
        
        avg_completion_time = None
        if completed_tasks:
            total_time = sum([
                (task.completed_at - task.created_at).total_seconds() / 3600
                for task in completed_tasks
                if task.completed_at and task.created_at
            ])
            avg_completion_time = total_time / len(completed_tasks)
        
        return {
            "total_assigned": total_assigned,
            "completed": completed,
            "pending": pending,
            "overdue": overdue,
            "completion_rate": round(completion_rate, 2),
            "average_completion_time": round(avg_completion_time, 2) if avg_completion_time else None
        }
    
    def _auto_assign_task(self, db: Session, department_id: int, category: str) -> Optional[Employee]:
        """Auto-assign task based on department and category"""
        # Simple logic: assign to least loaded employee in department
        employees = db.query(Employee).filter(Employee.department_id == department_id).all()
        
        if not employees:
            return None
        
        # Find employee with least pending tasks
        min_tasks = float('inf')
        selected_employee = None
        
        for employee in employees:
            pending_count = db.query(AdvancedTask).filter(
                and_(
                    AdvancedTask.assigned_to == employee.id,
                    AdvancedTask.status.in_(["pending", "in_progress"])
                )
            ).count()
            
            if pending_count < min_tasks:
                min_tasks = pending_count
                selected_employee = employee
        
        return selected_employee
    
    def _add_tags(self, db: Session, task_id: int, tags: List[str]):
        """Add tags to task"""
        for tag_name in tags:
            tag = TaskTag(task_id=task_id, tag_name=tag_name.strip())
            db.add(tag)
        db.commit()
    
    def _update_tags(self, db: Session, task_id: int, tags: List[str]):
        """Update task tags"""
        # Remove existing tags
        db.query(TaskTag).filter(TaskTag.task_id == task_id).delete()
        
        # Add new tags
        if tags:
            self._add_tags(db, task_id, tags)

crud_task = CRUDTask()