from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.db.models import Company, Department, Employee, User, Evaluation
from app.core.security import get_password_hash
import random
from datetime import datetime, date

def seed_basic_data():
    """Seed basic data for testing"""
    db = SessionLocal()
    
    try:
        # Create company if not exists
        company = db.query(Company).first()
        if not company:
            company = Company(
                name="NovaCore Demo",
                email="demo@novacore.com",
                plan="premium",
                max_employees=100
            )
            db.add(company)
            db.commit()
            db.refresh(company)
        
        # Create departments if not exist
        if not db.query(Department).first():
            departments = [
                Department(name="Ressources Humaines", company_id=company.id),
                Department(name="Informatique", company_id=company.id),
                Department(name="Marketing", company_id=company.id),
                Department(name="Finance", company_id=company.id),
            ]
            for dept in departments:
                db.add(dept)
            db.commit()
        
        # Create users if not exist
        if not db.query(User).first():
            users = [
                User(
                    email="admin@novacore.com",
                    hashed_password=get_password_hash("admin123"),
                    first_name="Admin",
                    last_name="NovaCore",
                    role="employer",
                    company_id=company.id
                ),
                User(
                    email="hr@novacore.com", 
                    hashed_password=get_password_hash("hr123"),
                    first_name="Marie",
                    last_name="Dupont",
                    role="hr_admin",
                    company_id=company.id
                )
            ]
            for user in users:
                db.add(user)
            db.commit()
        
        # Create employees if not exist
        departments = db.query(Department).all()
        if not db.query(Employee).first() and departments:
            employees = [
                Employee(
                    name="Jean Martin",
                    email="jean.martin@novacore.com",
                    role="Développeur Senior",
                    company_id=company.id,
                    department_id=departments[1].id,  # IT
                    hire_date=date(2023, 1, 15),
                    salary=45000.0
                ),
                Employee(
                    name="Sophie Bernard",
                    email="sophie.bernard@novacore.com", 
                    role="Responsable Marketing",
                    company_id=company.id,
                    department_id=departments[2].id,  # Marketing
                    hire_date=date(2022, 6, 1),
                    salary=42000.0
                )
            ]
            for emp in employees:
                db.add(emp)
            db.commit()
        
        print("✅ Basic data seeded successfully!")
        
    except Exception as e:
        print(f"❌ Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_basic_data()