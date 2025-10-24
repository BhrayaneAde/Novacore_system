#!/usr/bin/env python3
"""Seeder forcé pour peupler complètement la BDD"""

from sqlalchemy.orm import Session
from app.db.database import SessionLocal, engine
from app.db import models
from app.core.security import get_password_hash
from datetime import date, datetime
import json

def clear_and_seed():
    db: Session = SessionLocal()
    
    try:
        # 1. VIDER TOUTES LES TABLES
        print("🗑️ Vidage de la BDD...")
        db.query(models.Notification).delete()
        db.query(models.GeneratedContract).delete()
        db.query(models.ContractTemplate).delete()
        db.query(models.ManagerNomination).delete()
        db.query(models.Evaluation).delete()
        db.query(models.LeaveRequest).delete()
        db.query(models.Task).delete()
        db.query(models.EmployeeDocument).delete()
        db.query(models.Employee).delete()
        db.query(models.Department).delete()
        db.query(models.User).delete()
        db.query(models.Company).delete()
        db.commit()
        
        # 2. CRÉER 2 ENTREPRISES
        print("🏢 Création des entreprises...")
        company1 = models.Company(
            name="TechCorp",
            email="admin@techcorp.com", 
            plan="premium",
            max_employees=-1,
            is_active=True
        )
        company2 = models.Company(
            name="InnovaCorp",
            email="admin@innovacorp.com",
            plan="standard", 
            max_employees=50,
            is_active=True
        )
        db.add_all([company1, company2])
        db.commit()
        db.refresh(company1)
        db.refresh(company2)
        
        # 3. CRÉER UTILISATEURS (rôles différents)
        print("👥 Création des utilisateurs...")
        password = get_password_hash("NovaCore123")
        
        users = [
            # TechCorp
            models.User(email="admin@techcorp.com", hashed_password=password, first_name="Marie", last_name="Lefebvre", role="employer", company_id=company1.id, is_active=True),
            models.User(email="hr@techcorp.com", hashed_password=password, first_name="Sophie", last_name="Martin", role="hr_admin", company_id=company1.id, is_active=True),
            models.User(email="manager1@techcorp.com", hashed_password=password, first_name="Thomas", last_name="Dubois", role="manager", company_id=company1.id, is_active=True),
            models.User(email="manager2@techcorp.com", hashed_password=password, first_name="Emma", last_name="Rousseau", role="manager", company_id=company1.id, is_active=True),
            models.User(email="emp1@techcorp.com", hashed_password=password, first_name="Lucas", last_name="Bernard", role="employee", company_id=company1.id, is_active=True),
            # InnovaCorp
            models.User(email="admin@innovacorp.com", hashed_password=password, first_name="Pierre", last_name="Moreau", role="employer", company_id=company2.id, is_active=True),
            models.User(email="hr@innovacorp.com", hashed_password=password, first_name="Camille", last_name="Durand", role="hr_admin", company_id=company2.id, is_active=True),
            models.User(email="manager@innovacorp.com", hashed_password=password, first_name="Antoine", last_name="Leroy", role="manager", company_id=company2.id, is_active=True),
        ]
        
        db.add_all(users)
        db.commit()
        for user in users:
            db.refresh(user)
        
        # 4. CRÉER DÉPARTEMENTS
        print("🏢 Création des départements...")
        departments = [
            # TechCorp
            models.Department(name="Ressources Humaines", company_id=company1.id, manager_id=users[1].id),
            models.Department(name="Design", company_id=company1.id, manager_id=users[2].id),
            models.Department(name="Marketing", company_id=company1.id, manager_id=users[3].id),
            # InnovaCorp  
            models.Department(name="IT", company_id=company2.id, manager_id=users[7].id),
            models.Department(name="Ventes", company_id=company2.id, manager_id=users[6].id),
        ]
        
        db.add_all(departments)
        db.commit()
        for dept in departments:
            db.refresh(dept)
        
        # 5. CRÉER EMPLOYÉS
        print("👨‍💼 Création des employés...")
        employees = [
            # TechCorp
            models.Employee(name="Sophie Martin", email="sophie.martin@techcorp.com", role="Admin RH", company_id=company1.id, department_id=departments[0].id, hire_date=date(2022,3,15), salary=55000),
            models.Employee(name="Thomas Dubois", email="thomas.dubois@techcorp.com", role="Designer", company_id=company1.id, department_id=departments[1].id, hire_date=date(2021,6,20), salary=48000),
            models.Employee(name="Emma Rousseau", email="emma.rousseau@techcorp.com", role="Chef Marketing", company_id=company1.id, department_id=departments[2].id, hire_date=date(2020,1,10), salary=62000),
            models.Employee(name="Lucas Bernard", email="lucas.bernard@techcorp.com", role="Designer Junior", company_id=company1.id, department_id=departments[1].id, hire_date=date(2023,2,1), salary=38000),
            # InnovaCorp
            models.Employee(name="Pierre Moreau", email="pierre.moreau@innovacorp.com", role="Directeur", company_id=company2.id, department_id=departments[3].id, hire_date=date(2019,9,15), salary=85000),
            models.Employee(name="Camille Durand", email="camille.durand@innovacorp.com", role="RH Manager", company_id=company2.id, department_id=departments[4].id, hire_date=date(2023,5,15), salary=42000),
        ]
        
        db.add_all(employees)
        db.commit()
        for emp in employees:
            db.refresh(emp)
        
        # 6. LIER USERS ET EMPLOYEES
        print("🔗 Liaison users-employees...")
        users[1].employee_id = employees[0].id  # Sophie
        users[2].employee_id = employees[1].id  # Thomas  
        users[3].employee_id = employees[2].id  # Emma
        users[4].employee_id = employees[3].id  # Lucas
        users[5].employee_id = employees[4].id  # Pierre
        users[6].employee_id = employees[5].id  # Camille
        db.commit()
        
        # 7. CRÉER TÂCHES
        print("📋 Création des tâches...")
        tasks = [
            models.Task(title="Rapport mensuel RH", description="Compiler les données", assigned_to_id=employees[0].id, assigned_by_id=users[0].id, priority="urgent", status="in_progress", due_date=datetime(2025,1,25)),
            models.Task(title="Design interface", description="Revoir les maquettes", assigned_to_id=employees[1].id, assigned_by_id=users[2].id, priority="important", status="todo", due_date=datetime(2025,1,30)),
            models.Task(title="Campagne marketing", description="Lancer la campagne", assigned_to_id=employees[2].id, assigned_by_id=users[3].id, priority="normal", status="in_review", due_date=datetime(2025,2,1)),
        ]
        
        db.add_all(tasks)
        db.commit()
        
        # 8. CRÉER CONGÉS
        print("🏖️ Création des congés...")
        leaves = [
            models.LeaveRequest(type="vacation", start_date=date(2025,2,15), end_date=date(2025,2,22), days=6, status="pending", reason="Vacances", employee_id=employees[0].id),
            models.LeaveRequest(type="sick", start_date=date(2025,1,18), end_date=date(2025,1,19), days=2, status="approved", reason="Maladie", employee_id=employees[1].id),
        ]
        
        db.add_all(leaves)
        db.commit()
        
        # 9. CRÉER NOTIFICATIONS
        print("🔔 Création des notifications...")
        notifications = [
            models.Notification(title="Nouvelle demande de congé", message="Sophie a demandé des congés", type="info", user_id=users[0].id, created_by_id=users[1].id),
            models.Notification(title="Tâche assignée", message="Nouvelle tâche de design", type="info", user_id=users[2].id, created_by_id=users[0].id),
        ]
        
        db.add_all(notifications)
        db.commit()
        
        print("✅ SEEDING COMPLET TERMINÉ !")
        print(f"   - 2 entreprises")
        print(f"   - 8 utilisateurs (rôles variés)")
        print(f"   - 5 départements") 
        print(f"   - 6 employés")
        print(f"   - 3 tâches")
        print(f"   - 2 congés")
        print(f"   - 2 notifications")
        
    except Exception as e:
        print(f"❌ Erreur: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    clear_and_seed()