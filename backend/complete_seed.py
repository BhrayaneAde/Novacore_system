#!/usr/bin/env python3
"""Seeder complet basé sur seed.py mais forcé"""

import json
import logging
from datetime import date, datetime
from sqlalchemy.orm import Session
from app.db.database import SessionLocal, engine, Base
from app.db import models
from app.core.security import get_password_hash

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Données complètes du seed.py original + 2ème entreprise
companies = [
    {"id": 1, "name": "TechCorp", "email": "admin@techcorp.com", "plan": "premium", "maxEmployees": -1, "createdDate": "2023-01-15", "isActive": True},
    {"id": 2, "name": "InnovaCorp", "email": "admin@innovacorp.com", "plan": "standard", "maxEmployees": 100, "createdDate": "2023-06-01", "isActive": True}
]

departments_data = [
    {"id": 1, "name": "Ressources Humaines", "managerId": 2, "companyId": 1},
    {"id": 2, "name": "Design", "managerId": 3, "companyId": 1},
    {"id": 3, "name": "Marketing", "managerId": 5, "companyId": 1},
    {"id": 4, "name": "Ventes", "managerId": 4, "companyId": 1},
    {"id": 5, "name": "Support", "managerId": 1, "companyId": 1},
    {"id": 6, "name": "IT", "managerId": 10, "companyId": 2},
    {"id": 7, "name": "Commercial", "managerId": 11, "companyId": 2},
]

users_data = [
    # TechCorp
    {"id": 1, "email": "admin@techcorp.com", "firstName": "Marie", "lastName": "Lefebvre", "role": "employer", "companyId": 1, "isActive": True, "employeeId": 5},
    {"id": 2, "email": "hr@techcorp.com", "firstName": "Sophie", "lastName": "Martin", "role": "hr_admin", "companyId": 1, "isActive": True, "employeeId": 1},
    {"id": 3, "email": "thomas.dubois@techcorp.com", "firstName": "Thomas", "lastName": "Dubois", "role": "manager", "companyId": 1, "isActive": True, "employeeId": 2},
    {"id": 4, "email": "pierre.moreau@techcorp.com", "firstName": "Pierre", "lastName": "Moreau", "role": "manager", "companyId": 1, "isActive": True, "employeeId": 4},
    {"id": 5, "email": "emma.rousseau@techcorp.com", "firstName": "Emma", "lastName": "Rousseau", "role": "manager", "companyId": 1, "isActive": True, "employeeId": 3},
    {"id": 6, "email": "lucas.bernard@techcorp.com", "firstName": "Lucas", "lastName": "Bernard", "role": "employee", "companyId": 1, "isActive": True, "employeeId": 6},
    {"id": 7, "email": "camille.durand@techcorp.com", "firstName": "Camille", "lastName": "Durand", "role": "employee", "companyId": 1, "isActive": True, "employeeId": 7},
    {"id": 8, "email": "antoine.leroy@techcorp.com", "firstName": "Antoine", "lastName": "Leroy", "role": "employee", "companyId": 1, "isActive": True, "employeeId": 8},
    {"id": 9, "email": "sarah.petit@techcorp.com", "firstName": "Sarah", "lastName": "Petit", "role": "employee", "companyId": 1, "isActive": True, "employeeId": 9},
    # InnovaCorp
    {"id": 10, "email": "admin@innovacorp.com", "firstName": "Jean", "lastName": "Dupont", "role": "employer", "companyId": 2, "isActive": True, "employeeId": 10},
    {"id": 11, "email": "manager@innovacorp.com", "firstName": "Alice", "lastName": "Robert", "role": "manager", "companyId": 2, "isActive": True, "employeeId": 11},
    {"id": 12, "email": "dev@innovacorp.com", "firstName": "Bob", "lastName": "Wilson", "role": "employee", "companyId": 2, "isActive": True, "employeeId": 12},
]

employees_data = [
    # TechCorp
    {"id": 1, "name": "Sophie Martin", "email": "sophie.martin@novacore.com", "role": "Administratrice RH", "department": "Ressources Humaines", "status": "active", "hireDate": "2022-03-15", "salary": 55000, "phone": "+33 6 12 34 56 78", "birthDate": "1990-05-12", "managerId": None, "companyId": 1},
    {"id": 2, "name": "Thomas Dubois", "email": "thomas.dubois@novacore.com", "role": "Designer UI/UX", "department": "Design", "status": "active", "hireDate": "2021-06-20", "salary": 48000, "phone": "+33 6 23 45 67 89", "birthDate": "1988-11-03", "managerId": None, "companyId": 1},
    {"id": 3, "name": "Emma Rousseau", "email": "emma.rousseau@novacore.com", "role": "Chef de Projet Marketing", "department": "Marketing", "status": "active", "hireDate": "2020-01-10", "salary": 62000, "phone": "+33 6 34 56 78 90", "birthDate": "1985-08-22", "managerId": None, "companyId": 1},
    {"id": 4, "name": "Pierre Moreau", "email": "pierre.moreau@novacore.com", "role": "Commercial Senior", "department": "Ventes", "status": "active", "hireDate": "2021-11-05", "salary": 54000, "phone": "+33 6 67 89 01 23", "birthDate": "1987-09-30", "managerId": None, "companyId": 1},
    {"id": 5, "name": "Marie Lefebvre", "email": "marie.lefebvre@novacore.com", "role": "Directrice Generale", "department": "Support", "status": "active", "hireDate": "2019-09-15", "salary": 85000, "phone": "+33 6 56 78 90 12", "birthDate": "1983-04-07", "managerId": None, "companyId": 1},
    {"id": 6, "name": "Lucas Bernard", "email": "lucas.bernard@novacore.com", "role": "Designer Junior", "department": "Design", "status": "active", "hireDate": "2023-02-01", "salary": 38000, "phone": "+33 6 45 67 89 01", "birthDate": "1992-12-15", "managerId": 3, "companyId": 1},
    {"id": 7, "name": "Camille Durand", "email": "camille.durand@novacore.com", "role": "UX Designer", "department": "Design", "status": "active", "hireDate": "2023-05-15", "salary": 42000, "phone": "+33 6 78 90 12 34", "birthDate": "1994-03-22", "managerId": 3, "companyId": 1},
    {"id": 8, "name": "Antoine Leroy", "email": "antoine.leroy@novacore.com", "role": "Commercial Junior", "department": "Ventes", "status": "active", "hireDate": "2023-08-01", "salary": 35000, "phone": "+33 6 89 01 23 45", "birthDate": "1995-07-10", "managerId": 4, "companyId": 1},
    {"id": 9, "name": "Sarah Petit", "email": "sarah.petit@novacore.com", "role": "Chargee de Marketing", "department": "Marketing", "status": "active", "hireDate": "2023-03-20", "salary": 40000, "phone": "+33 6 90 12 34 56", "birthDate": "1993-11-05", "managerId": 5, "companyId": 1},
    # InnovaCorp
    {"id": 10, "name": "Jean Dupont", "email": "jean.dupont@innovacorp.com", "role": "CEO", "department": "IT", "status": "active", "hireDate": "2020-01-01", "salary": 120000, "phone": "+33 6 11 22 33 44", "birthDate": "1975-03-15", "managerId": None, "companyId": 2},
    {"id": 11, "name": "Alice Robert", "email": "alice.robert@innovacorp.com", "role": "Manager Commercial", "department": "Commercial", "status": "active", "hireDate": "2021-03-01", "salary": 65000, "phone": "+33 6 22 33 44 55", "birthDate": "1985-07-20", "managerId": None, "companyId": 2},
    {"id": 12, "name": "Bob Wilson", "email": "bob.wilson@innovacorp.com", "role": "Developpeur", "department": "IT", "status": "active", "hireDate": "2022-01-15", "salary": 50000, "phone": "+33 6 33 44 55 66", "birthDate": "1990-12-10", "managerId": 10, "companyId": 2},
]

tasks_data = [
    {"id": 1, "title": "Finaliser le rapport mensuel (Effectifs)", "description": "Compiler les donnees RH et rediger le rapport", "assignedTo": 1, "assignedBy": 1, "departmentId": 1, "priority": "urgent", "status": "in_progress", "dueDate": "2025-01-22T17:00:00"},
    {"id": 2, "title": "Revision design interface utilisateur", "description": "Revoir les maquettes", "assignedTo": 2, "assignedBy": 3, "departmentId": 2, "priority": "important", "status": "completed", "dueDate": "2025-01-21T18:00:00", "completedAt": "2025-01-21T16:30:00"},
    {"id": 3, "title": "Preparer l'integration (Onboarding)", "description": "Creer le planning pour le nouvel arrivant", "assignedTo": 1, "assignedBy": 1, "departmentId": 1, "priority": "urgent", "status": "todo", "dueDate": "2025-01-23T09:00:00"},
    {"id": 4, "title": "Lancer la campagne 'Printemps 2025'", "description": "Coordonner les visuels et le contenu", "assignedTo": 3, "assignedBy": 5, "departmentId": 3, "priority": "normal", "status": "in_review", "dueDate": "2025-01-24T17:00:00"},
    {"id": 5, "title": "Prospection nouveaux clients Q1", "description": "Contacter les 50 leads de la liste", "assignedTo": 8, "assignedBy": 4, "departmentId": 4, "priority": "normal", "status": "todo", "dueDate": "2025-01-25T12:00:00"},
    {"id": 6, "title": "Developper nouvelle fonctionnalite", "description": "API REST pour gestion clients", "assignedTo": 12, "assignedBy": 10, "departmentId": 6, "priority": "important", "status": "in_progress", "dueDate": "2025-02-01T17:00:00"},
]

leave_requests_data = [
    {"id": 1, "employeeId": 1, "type": "vacation", "startDate": "2025-11-15", "endDate": "2025-11-22", "days": 6, "status": "pending", "reason": "Vacances familiales", "requestDate": "2025-10-10"},
    {"id": 2, "employeeId": 3, "type": "sick", "startDate": "2025-10-18", "endDate": "2025-10-19", "days": 2, "status": "approved", "reason": "Maladie", "requestDate": "2025-10-17"},
    {"id": 3, "employeeId": 6, "type": "vacation", "startDate": "2025-12-20", "endDate": "2025-12-31", "days": 10, "status": "pending", "reason": "Conges de fin d'annee", "requestDate": "2025-10-15"},
    {"id": 4, "employeeId": 12, "type": "vacation", "startDate": "2025-03-01", "endDate": "2025-03-07", "days": 5, "status": "approved", "reason": "Vacances", "requestDate": "2025-01-15"},
]

evaluations_data = [
    {"id": 1, "employeeId": 1, "managerId": 1, "period": "2025-01", "globalScore": 89.1, "managerComments": "Excellente progression.", "strengths": ["Respect des delais", "Qualite"], "improvements": ["Prise d'initiative"], "nextObjectives": ["Mentorer un nouveau collegue"], "automaticMetrics": {"taskCompletion": 85, "deadlineRespect": 90}, "manualEvaluation": {"communication": 9, "teamwork": 8}},
    {"id": 2, "employeeId": 2, "managerId": 1, "period": "2025-01", "globalScore": 93.5, "managerComments": "Thomas excelle.", "strengths": ["Leadership", "Gestion d'equipe"], "improvements": ["Delegation"], "nextObjectives": ["Preparer la roadmap Q2"], "automaticMetrics": {"taskCompletion": 92, "deadlineRespect": 88}, "manualEvaluation": {"communication": 9, "teamwork": 10}},
    {"id": 3, "employeeId": 12, "managerId": 10, "period": "2025-01", "globalScore": 78.2, "managerComments": "Bon travail technique.", "strengths": ["Competences techniques"], "improvements": ["Communication"], "nextObjectives": ["Formation soft skills"], "automaticMetrics": {"taskCompletion": 80, "deadlineRespect": 75}, "manualEvaluation": {"communication": 7, "teamwork": 8}},
]

contract_templates_data = [
    {"id": 1, "name": "Contrat CDI Standard", "type": "CDI", "category": "standard", "content": "CONTRAT DE TRAVAIL...", "variables": [{"key": "companyName", "label": "Nom entreprise"}, {"key": "employeeName", "label": "Nom employe"}]},
    {"id": 2, "name": "Contrat CDD", "type": "CDD", "category": "temporary", "content": "CONTRAT DE TRAVAIL CDD...", "variables": [{"key": "companyName", "label": "Nom entreprise"}, {"key": "employeeName", "label": "Nom employe"}, {"key": "endDate", "label": "Date de fin"}]}
]

def force_complete_seed():
    db: Session = SessionLocal()
    
    try:
        # VIDER TOUTES LES TABLES (ordre important pour les FK)
        logger.info("[CLEAR] Vidage complet de la BDD...")
        db.query(models.Notification).delete()
        db.query(models.GeneratedContract).delete()
        db.query(models.ContractTemplate).delete()
        db.query(models.ManagerNomination).delete()
        db.query(models.Evaluation).delete()
        db.query(models.LeaveRequest).delete()
        db.query(models.Task).delete()
        db.query(models.EmployeeDocument).delete()
        # Supprimer les liens employee_id dans users d'abord
        from sqlalchemy import text
        db.execute(text("UPDATE users SET employee_id = NULL"))
        db.query(models.Employee).delete()
        db.query(models.Department).delete()
        db.query(models.User).delete()
        db.query(models.Company).delete()
        db.commit()
        
        # Maps pour stocker les nouvelles ID créées
        company_map = {}
        department_map = {}
        user_map = {}
        employee_map = {}
        template_map = {}

        # 1. Entreprises
        logger.info("[COMPANY] Creation des entreprises...")
        for company in companies:
            db_company = models.Company(
                name=company["name"],
                email=company["email"],
                plan=company["plan"],
                max_employees=company["maxEmployees"],
                is_active=company["isActive"],
                created_date=datetime.fromisoformat(company["createdDate"])
            )
            db.add(db_company)
            db.commit()
            db.refresh(db_company)
            company_map[company["id"]] = db_company

        # 2. Utilisateurs
        logger.info("[USER] Creation des utilisateurs...")
        default_pass = get_password_hash("NovaCore123")
        for user_data in users_data:
            db_user = models.User(
                email=user_data["email"],
                hashed_password=default_pass,
                first_name=user_data["firstName"],
                last_name=user_data["lastName"],
                role=user_data["role"],
                company_id=company_map[user_data["companyId"]].id,
                is_active=user_data["isActive"],
            )
            db.add(db_user)
            db.commit()
            db.refresh(db_user)
            user_map[user_data["id"]] = db_user

        # 3. Départements
        logger.info("[DEPT] Creation des departements...")
        for dept_data in departments_data:
            manager = user_map.get(dept_data["managerId"])
            company = company_map.get(dept_data["companyId"])
            db_dept = models.Department(
                name=dept_data["name"],
                company_id=company.id,
                manager_id=manager.id if manager else None
            )
            db.add(db_dept)
            db.commit()
            db.refresh(db_dept)
            department_map[dept_data["name"]] = db_dept

        # 4. Employés
        logger.info("[EMP] Creation des employes...")
        for emp_data in employees_data:
            dept = department_map.get(emp_data["department"])
            manager = user_map.get(emp_data.get("managerId"))
            company = company_map.get(emp_data["companyId"])
            
            db_employee = models.Employee(
                name=emp_data["name"],
                email=emp_data["email"],
                role=emp_data["role"],
                status=emp_data["status"],
                hire_date=date.fromisoformat(emp_data["hireDate"]),
                salary=emp_data.get("salary"),
                phone=emp_data.get("phone"),
                birth_date=date.fromisoformat(emp_data["birthDate"]),
                company_id=company.id,
                department_id=dept.id if dept else None,
                manager_id=manager.id if manager else None,
            )
            db.add(db_employee)
            db.commit()
            db.refresh(db_employee)
            employee_map[emp_data["id"]] = db_employee

        # 5. Lier Users et Employees
        logger.info("[LINK] Liaison users-employees...")
        for user_data in users_data:
            if user_data.get("employeeId"):
                db_user = user_map.get(user_data["id"])
                db_employee = employee_map.get(user_data["employeeId"])
                if db_user and db_employee:
                    db_user.employee_id = db_employee.id
                    db.add(db_user)
        db.commit()
        
        # 6. Tâches
        logger.info("[TASK] Creation des taches...")
        dept_id_map_by_name = {d.name: d.id for d in department_map.values()}
        dept_mock_id_to_name = {d["id"]: d["name"] for d in departments_data}

        for task_data in tasks_data:
            assigned_to = employee_map.get(task_data["assignedTo"])
            assigned_by = user_map.get(task_data["assignedBy"])
            
            dept_name = dept_mock_id_to_name.get(task_data["departmentId"])
            dept_id = dept_id_map_by_name.get(dept_name)

            if assigned_to and assigned_by:
                db_task = models.Task(
                    title=task_data["title"],
                    description=task_data.get("description"),
                    priority=task_data["priority"],
                    status=task_data["status"],
                    due_date=datetime.fromisoformat(task_data["dueDate"]) if task_data.get("dueDate") else None,
                    completed_at=datetime.fromisoformat(task_data["completedAt"]) if task_data.get("completedAt") else None,
                    assigned_to_id=assigned_to.id,
                    assigned_by_id=assigned_by.id,
                    department_id=dept_id
                )
                db.add(db_task)
        db.commit()

        # 7. Demandes de Congés
        logger.info("[LEAVE] Creation des conges...")
        for req_data in leave_requests_data:
            employee = employee_map.get(req_data["employeeId"])
            if employee:
                db_req = models.LeaveRequest(
                    type=req_data["type"],
                    start_date=date.fromisoformat(req_data["startDate"]),
                    end_date=date.fromisoformat(req_data["endDate"]),
                    days=req_data["days"],
                    status=req_data["status"],
                    reason=req_data.get("reason"),
                    request_date=date.fromisoformat(req_data["requestDate"]),
                    employee_id=employee.id
                )
                db.add(db_req)
        db.commit()

        # 8. Évaluations
        logger.info("[EVAL] Creation des evaluations...")
        for eval_data in evaluations_data:
            employee = employee_map.get(eval_data["employeeId"])
            manager = user_map.get(eval_data["managerId"])
            if employee and manager:
                db_eval = models.Evaluation(
                    period=eval_data["period"],
                    global_score=eval_data["globalScore"],
                    manager_comments=eval_data.get("managerComments"),
                    strengths=json.dumps(eval_data.get("strengths", [])),
                    improvements=json.dumps(eval_data.get("improvements", [])),
                    next_objectives=json.dumps(eval_data.get("nextObjectives", [])),
                    automatic_metrics=json.dumps(eval_data.get("automaticMetrics", {})),
                    manual_evaluation=json.dumps(eval_data.get("manualEvaluation", {})),
                    employee_id=employee.id,
                    manager_id=manager.id
                )
                db.add(db_eval)
        db.commit()

        # 9. Templates de Contrat
        logger.info("[CONTRACT] Creation des templates...")
        for tmpl_data in contract_templates_data:
            db_tmpl = models.ContractTemplate(
                name=tmpl_data["name"],
                type=tmpl_data["type"],
                category=tmpl_data["category"],
                content=tmpl_data["content"],
                variables=json.dumps(tmpl_data["variables"])
            )
            db.add(db_tmpl)
            db.commit()
            db.refresh(db_tmpl)
            template_map[tmpl_data["id"]] = db_tmpl

        # 10. Notifications
        logger.info("[NOTIF] Creation des notifications...")
        notifications = [
            models.Notification(title="Nouvelle demande de conge", message="Sophie a demande des conges", type="info", user_id=user_map[1].id, created_by_id=user_map[2].id),
            models.Notification(title="Tache assignee", message="Nouvelle tache de design", type="info", user_id=user_map[3].id, created_by_id=user_map[1].id),
            models.Notification(title="Evaluation terminee", message="Votre evaluation est prete", type="success", user_id=user_map[12].id, created_by_id=user_map[10].id),
        ]
        db.add_all(notifications)
        db.commit()
        
        logger.info("[OK] SEEDING COMPLET TERMINE !")
        logger.info(f"   - {len(companies)} entreprises")
        logger.info(f"   - {len(users_data)} utilisateurs")
        logger.info(f"   - {len(departments_data)} departements")
        logger.info(f"   - {len(employees_data)} employes")
        logger.info(f"   - {len(tasks_data)} taches")
        logger.info(f"   - {len(leave_requests_data)} conges")
        logger.info(f"   - {len(evaluations_data)} evaluations")
        logger.info(f"   - {len(contract_templates_data)} templates contrats")
        logger.info(f"   - 3 notifications")
        
    except Exception as e:
        logger.error(f"[ERROR] Erreur: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    force_complete_seed()