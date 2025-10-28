from sqlalchemy.orm import Session
from app.db.database import SessionLocal, engine
from app.db.models import Department

def seed_departments():
    """Seed departments data"""
    db = SessionLocal()
    
    try:
        # Check if departments already exist
        if db.query(Department).first():
            print("Departments already exist, skipping seed...")
            return
        
        # Get or create a default company
        from app.db.models import Company
        company = db.query(Company).first()
        if not company:
            company = Company(name="NovaCore Demo", email="demo@novacore.com")
            db.add(company)
            db.commit()
            db.refresh(company)
        
        departments = [
            Department(name="Ressources Humaines", company_id=company.id),
            Department(name="Informatique", company_id=company.id),
            Department(name="Marketing", company_id=company.id),
            Department(name="Finance", company_id=company.id),
            Department(name="Commercial", company_id=company.id),
            Department(name="Production", company_id=company.id),
        ]
        
        for dept in departments:
            db.add(dept)
        
        db.commit()
        print(f"Successfully seeded {len(departments)} departments")
        
    except Exception as e:
        print(f"Error seeding departments: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_departments()