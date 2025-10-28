#!/usr/bin/env python3
"""
Complete seeder for NovaCore application
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.db.models import Company, Department, Employee, User, Evaluation
import json
from app.core.security import get_password_hash
from datetime import datetime, date

def run_complete_seeder():
    """Run complete seeder for all data"""
    db = SessionLocal()
    
    try:
        print("Starting complete database seeding...")
        
        # 1. Create company
        company = db.query(Company).first()
        if not company:
            company = Company(
                name="NovaCore Demo",
                email="demo@novacore.com",
                plan="premium",
                max_employees=100,
                is_active=True
            )
            db.add(company)
            db.commit()
            db.refresh(company)
            print("Company created")
        else:
            print("Company already exists")
        
        # 2. Create departments
        if not db.query(Department).first():
            departments_data = [
                {"name": "Ressources Humaines", "company_id": company.id},
                {"name": "Informatique", "company_id": company.id},
                {"name": "Marketing", "company_id": company.id},
                {"name": "Finance", "company_id": company.id},
                {"name": "Commercial", "company_id": company.id},
            ]
            
            for dept_data in departments_data:
                dept = Department(**dept_data)
                db.add(dept)
            
            db.commit()
            print("Departments created")
        else:
            print("Departments already exist")
        
        # 3. Create users
        if not db.query(User).first():
            users_data = [
                {
                    "email": "admin@novacore.com",
                    "hashed_password": get_password_hash("admin123"),
                    "first_name": "Admin",
                    "last_name": "NovaCore",
                    "role": "employer",
                    "company_id": company.id,
                    "is_active": True
                },
                {
                    "email": "hr@novacore.com",
                    "hashed_password": get_password_hash("hr123"),
                    "first_name": "Marie",
                    "last_name": "Dupont",
                    "role": "hr_admin",
                    "company_id": company.id,
                    "is_active": True
                },
                {
                    "email": "manager@novacore.com",
                    "hashed_password": get_password_hash("manager123"),
                    "first_name": "Pierre",
                    "last_name": "Martin",
                    "role": "manager",
                    "company_id": company.id,
                    "is_active": True
                }
            ]
            
            for user_data in users_data:
                user = User(**user_data)
                db.add(user)
            
            db.commit()
            print("Users created")
        else:
            print("Users already exist")
        
        # 4. Create employees (including managers)
        departments = db.query(Department).all()
        if not db.query(Employee).first() and departments:
            employees_data = [
                # Managers
                {
                    "name": "Pierre Martin",
                    "email": "pierre.martin@novacore.com",
                    "role": "Manager IT",
                    "company_id": company.id,
                    "department_id": departments[1].id,  # IT
                    "hire_date": date(2022, 1, 1),
                    "salary": 55000.0,
                    "status": "active"
                },
                {
                    "name": "Marie Dubois",
                    "email": "marie.dubois@novacore.com",
                    "role": "Manager Marketing",
                    "company_id": company.id,
                    "department_id": departments[2].id,  # Marketing
                    "hire_date": date(2022, 2, 1),
                    "salary": 52000.0,
                    "status": "active"
                },
                {
                    "name": "Paul Leroy",
                    "email": "paul.leroy@novacore.com",
                    "role": "Manager Finance",
                    "company_id": company.id,
                    "department_id": departments[3].id,  # Finance
                    "hire_date": date(2022, 3, 1),
                    "salary": 53000.0,
                    "status": "active"
                },
                # Employés réguliers
                {
                    "name": "Jean Martin",
                    "email": "jean.martin@novacore.com",
                    "role": "Développeur Senior",
                    "company_id": company.id,
                    "department_id": departments[1].id,  # IT
                    "hire_date": date(2023, 1, 15),
                    "salary": 45000.0,
                    "status": "active"
                },
                {
                    "name": "Sophie Bernard",
                    "email": "sophie.bernard@novacore.com",
                    "role": "Responsable Marketing",
                    "company_id": company.id,
                    "department_id": departments[2].id,  # Marketing
                    "hire_date": date(2022, 6, 1),
                    "salary": 42000.0,
                    "status": "active"
                },
                {
                    "name": "Lucas Dubois",
                    "email": "lucas.dubois@novacore.com",
                    "role": "Comptable",
                    "company_id": company.id,
                    "department_id": departments[3].id,  # Finance
                    "hire_date": date(2023, 3, 10),
                    "salary": 38000.0,
                    "status": "active"
                },
                {
                    "name": "Emma Rousseau",
                    "email": "emma.rousseau@novacore.com",
                    "role": "Chargée de Recrutement",
                    "company_id": company.id,
                    "department_id": departments[0].id,  # RH
                    "hire_date": date(2023, 9, 1),
                    "salary": 35000.0,
                    "status": "active"
                },
                {
                    "name": "Thomas Leroy",
                    "email": "thomas.leroy@novacore.com",
                    "role": "Commercial Senior",
                    "company_id": company.id,
                    "department_id": departments[4].id,  # Commercial
                    "hire_date": date(2022, 11, 15),
                    "salary": 40000.0,
                    "status": "active"
                }
            ]
            
            for emp_data in employees_data:
                emp = Employee(**emp_data)
                db.add(emp)
            
            db.commit()
            print("Employees created")
        else:
            print("Employees already exist")
        
        # 5. Create sample evaluations
        employees = db.query(Employee).all()
        users = db.query(User).all()
        manager_user = next((u for u in users if u.role == "manager"), users[0])
        
        if not db.query(Evaluation).first() and employees and len(employees) >= 3:
            evaluations_data = [
                {
                    "employee_id": employees[0].id,  # Jean Martin
                    "manager_id": manager_user.id,
                    "period": "2024-Q4",
                    "global_score": 85.0,
                    "manager_comments": "Excellent développeur avec de solides compétences techniques. Très fiable sur les délais et la qualité du code.",
                    "strengths": ["Compétences techniques avancées", "Respect des délais", "Qualité du code", "Résolution de problèmes"],
                    "improvements": ["Prise d'initiative sur nouveaux projets", "Mentoring des juniors", "Communication avec les clients"],
                    "next_objectives": ["Formation React avancée", "Lead technique sur projet mobile", "Certification AWS"],
                    "automatic_metrics": {
                        "taskCompletion": 92,
                        "deadlineRespect": 88,
                        "quality": 90,
                        "workload": 85
                    },
                    "manual_evaluation": {
                        "communication": 8,
                        "teamwork": 9,
                        "initiative": 7,
                        "problemSolving": 9
                    }
                },
                {
                    "employee_id": employees[1].id,  # Sophie Bernard
                    "manager_id": manager_user.id,
                    "period": "2024-Q4",
                    "global_score": 78.0,
                    "manager_comments": "Très créative et organisée. Excellente dans la gestion des campagnes marketing et l'analyse des résultats.",
                    "strengths": ["Créativité", "Analyse de données", "Gestion de projet", "Relations clients"],
                    "improvements": ["Gestion du stress", "Délégation d'équipe", "Veille technologique"],
                    "next_objectives": ["Formation marketing digital", "Certification Google Ads", "Management d'équipe"],
                    "automatic_metrics": {
                        "taskCompletion": 85,
                        "deadlineRespect": 75,
                        "quality": 88,
                        "workload": 82
                    },
                    "manual_evaluation": {
                        "communication": 9,
                        "teamwork": 8,
                        "initiative": 8,
                        "problemSolving": 7
                    }
                },
                {
                    "employee_id": employees[2].id,  # Lucas Dubois
                    "manager_id": manager_user.id,
                    "period": "2024-Q4",
                    "global_score": 92.0,
                    "manager_comments": "Comptable exemplaire avec une précision remarquable. Très apprécié pour sa rigueur et sa disponibilité.",
                    "strengths": ["Précision comptable", "Rigueur", "Disponibilité", "Connaissance réglementaire"],
                    "improvements": ["Automatisation des processus", "Formation continue", "Communication transversale"],
                    "next_objectives": ["Certification comptable avancée", "Formation Excel VBA", "Optimisation des processus"],
                    "automatic_metrics": {
                        "taskCompletion": 95,
                        "deadlineRespect": 92,
                        "quality": 98,
                        "workload": 88
                    },
                    "manual_evaluation": {
                        "communication": 8,
                        "teamwork": 9,
                        "initiative": 8,
                        "problemSolving": 9
                    }
                }
            ]
            
            for eval_data in evaluations_data:
                # Convertir les dictionnaires en JSON pour les champs JSON
                eval_data_copy = eval_data.copy()
                eval_data_copy["automatic_metrics"] = json.dumps(eval_data["automatic_metrics"])
                eval_data_copy["manual_evaluation"] = json.dumps(eval_data["manual_evaluation"])
                eval_data_copy["strengths"] = json.dumps(eval_data["strengths"])
                eval_data_copy["improvements"] = json.dumps(eval_data["improvements"])
                eval_data_copy["next_objectives"] = json.dumps(eval_data["next_objectives"])
                
                evaluation = Evaluation(**eval_data_copy)
                db.add(evaluation)
            
            db.commit()
            print("Sample evaluations created")
        else:
            print("Evaluations already exist")
        
        print("\nComplete seeding finished successfully!")
        print("\nSummary:")
        print(f"   - Company: {db.query(Company).count()}")
        print(f"   - Departments: {db.query(Department).count()}")
        print(f"   - Users: {db.query(User).count()}")
        print(f"   - Employees: {db.query(Employee).count()}")
        print(f"   - Evaluations: {db.query(Evaluation).count()}")
        
        print("\nEmployees created:")
        for emp in db.query(Employee).all():
            dept_name = next((d.name for d in departments if d.id == emp.department_id), "N/A")
            print(f"   - {emp.name} ({emp.role}) - {dept_name}")
        
        print("\nEvaluations created:")
        for eval in db.query(Evaluation).all():
            emp_name = next((e.name for e in employees if e.id == eval.employee_id), "N/A")
            print(f"   - {emp_name}: {eval.global_score}/100 ({eval.period})")
        
        print("\nLogin credentials:")
        print("   - Admin: admin@novacore.com / admin123")
        print("   - HR: hr@novacore.com / hr123")
        print("   - Manager: manager@novacore.com / manager123")
        
    except Exception as e:
        print(f"Error during seeding: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    run_complete_seeder()