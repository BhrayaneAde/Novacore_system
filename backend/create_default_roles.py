#!/usr/bin/env python3
"""Script pour créer les rôles par défaut avec permissions"""

from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.db import models

def create_default_roles():
    db: Session = SessionLocal()
    
    try:
        # Définir les permissions par défaut pour chaque rôle
        roles_permissions = {
            "employer": {
                "name": "Employeur",
                "description": "Accès complet à toutes les fonctionnalités",
                "permissions": {
                    "dashboard": {"read": True, "write": True},
                    "employees": {"read": True, "write": True, "delete": True},
                    "users": {"read": True, "write": True, "delete": True},
                    "departments": {"read": True, "write": True, "delete": True},
                    "tasks": {"read": True, "write": True, "delete": True},
                    "payroll": {"read": True, "write": True, "delete": True},
                    "reports": {"read": True, "write": True},
                    "settings": {"read": True, "write": True},
                    "integrations": {"read": True, "write": True},
                    "analytics": {"read": True, "write": True},
                    "workflows": {"read": True, "write": True, "delete": True},
                    "contracts": {"read": True, "write": True, "delete": True},
                    "recruitment": {"read": True, "write": True, "delete": True},
                    "performance": {"read": True, "write": True},
                    "assets": {"read": True, "write": True, "delete": True},
                    "notifications": {"read": True, "write": True}
                }
            },
            "hr_admin": {
                "name": "Administrateur RH",
                "description": "Accès complet aux fonctions RH",
                "permissions": {
                    "dashboard": {"read": True, "write": True},
                    "employees": {"read": True, "write": True, "delete": True},
                    "users": {"read": True, "write": True},
                    "departments": {"read": True, "write": True},
                    "tasks": {"read": True, "write": True},
                    "payroll": {"read": True, "write": True},
                    "reports": {"read": True, "write": True},
                    "settings": {"read": True, "write": False},
                    "integrations": {"read": True, "write": False},
                    "analytics": {"read": True, "write": True},
                    "workflows": {"read": True, "write": True},
                    "contracts": {"read": True, "write": True},
                    "recruitment": {"read": True, "write": True},
                    "performance": {"read": True, "write": True},
                    "assets": {"read": True, "write": True},
                    "notifications": {"read": True, "write": True}
                }
            },
            "manager": {
                "name": "Manager",
                "description": "Gestion d'équipe et accès limité",
                "permissions": {
                    "dashboard": {"read": True, "write": False},
                    "employees": {"read": True, "write": True},
                    "users": {"read": True, "write": False},
                    "departments": {"read": True, "write": False},
                    "tasks": {"read": True, "write": True},
                    "payroll": {"read": True, "write": False},
                    "reports": {"read": True, "write": False},
                    "settings": {"read": False, "write": False},
                    "integrations": {"read": False, "write": False},
                    "analytics": {"read": True, "write": False},
                    "workflows": {"read": True, "write": False},
                    "contracts": {"read": True, "write": False},
                    "recruitment": {"read": True, "write": True},
                    "performance": {"read": True, "write": True},
                    "assets": {"read": True, "write": False},
                    "notifications": {"read": True, "write": False}
                }
            },
            "employee": {
                "name": "Employé",
                "description": "Accès limité aux fonctions personnelles",
                "permissions": {
                    "dashboard": {"read": True, "write": False},
                    "employees": {"read": True, "write": False},
                    "users": {"read": False, "write": False},
                    "departments": {"read": True, "write": False},
                    "tasks": {"read": True, "write": False},
                    "payroll": {"read": True, "write": False},
                    "reports": {"read": False, "write": False},
                    "settings": {"read": False, "write": False},
                    "integrations": {"read": False, "write": False},
                    "analytics": {"read": False, "write": False},
                    "workflows": {"read": True, "write": False},
                    "contracts": {"read": True, "write": False},
                    "recruitment": {"read": False, "write": False},
                    "performance": {"read": True, "write": False},
                    "assets": {"read": True, "write": False},
                    "notifications": {"read": True, "write": False}
                }
            }
        }
        
        for role_key, role_data in roles_permissions.items():
            # Vérifier si le rôle existe déjà
            existing_role = db.query(models.Role).filter(models.Role.name == role_key).first()
            if existing_role:
                print(f"[OK] Rôle {role_key} existe déjà")
                # Mettre à jour les permissions
                existing_role.permissions = role_data["permissions"]
                existing_role.description = role_data["description"]
                db.commit()
                print(f"[OK] Permissions mises à jour pour {role_key}")
            else:
                # Créer le nouveau rôle
                new_role = models.Role(
                    name=role_key,
                    description=role_data["description"],
                    permissions=role_data["permissions"],
                    is_system_role=True
                )
                db.add(new_role)
                db.commit()
                db.refresh(new_role)
                print(f"[OK] Rôle {role_key} créé avec succès")
        
        print("[OK] Tous les rôles par défaut ont été créés/mis à jour")
        
    except Exception as e:
        print(f"[ERREUR] Erreur: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_default_roles()