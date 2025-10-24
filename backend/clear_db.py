#!/usr/bin/env python3
"""Script pour vider complètement la BDD"""

from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.database import SessionLocal
from app.db import models
import os

def clear_database():
    db: Session = SessionLocal()
    
    try:
        print("[CLEAR] Vidage complet de la BDD...")
        
        # Supprimer les liens employee_id dans users d'abord
        db.execute(text("UPDATE users SET employee_id = NULL"))
        
        # Supprimer toutes les données dans l'ordre des FK
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
        
        # Supprimer le marqueur de seeding
        if os.path.exists(".seed_completed"):
            os.remove(".seed_completed")
            
        print("[OK] BDD vidée complètement !")
        print("[OK] Marqueur de seeding supprimé")
        
    except Exception as e:
        print(f"[ERROR] Erreur: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    clear_database()