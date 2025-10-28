from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.db.models import User, Employee, Department
import random
from datetime import datetime, timedelta

def seed_performance_data():
    """Seed performance evaluation data"""
    db = SessionLocal()
    
    try:
        # Create sample departments if they don't exist
        departments = db.query(Department).all()
        if not departments:
            dept_data = [
                {"name": "Ressources Humaines", "description": "Gestion du personnel"},
                {"name": "Informatique", "description": "Développement IT"},
                {"name": "Marketing", "description": "Promotion et communication"},
                {"name": "Finance", "description": "Comptabilité et gestion"}
            ]
            for dept in dept_data:
                db_dept = Department(**dept)
                db.add(db_dept)
            db.commit()
            departments = db.query(Department).all()
        
        # Create sample employees if they don't exist
        employees = db.query(Employee).all()
        if not employees:
            employee_data = [
                {"first_name": "Jean", "last_name": "Dupont", "email": "jean.dupont@company.com", "position": "Développeur", "department_id": departments[1].id},
                {"first_name": "Marie", "last_name": "Martin", "email": "marie.martin@company.com", "position": "RH Manager", "department_id": departments[0].id},
                {"first_name": "Pierre", "last_name": "Durand", "email": "pierre.durand@company.com", "position": "Marketing Specialist", "department_id": departments[2].id},
                {"first_name": "Sophie", "last_name": "Bernard", "email": "sophie.bernard@company.com", "position": "Comptable", "department_id": departments[3].id},
            ]
            for emp in employee_data:
                db_emp = Employee(**emp)
                db.add(db_emp)
            db.commit()
        
        print("Performance data seeded successfully")
        
    except Exception as e:
        print(f"Error seeding performance data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_performance_data()