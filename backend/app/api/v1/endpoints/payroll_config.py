from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import json
import os
from datetime import datetime

from app.api import deps
from app.db import models
from app.schemas import payroll_config as payroll_schema
from app.core.auth import get_current_user

router = APIRouter()

def load_payroll_templates() -> Dict[str, Any]:
    """Charger les templates de paie depuis le fichier JSON"""
    try:
        template_path = os.path.join(os.path.dirname(__file__), "../../../data/payroll_templates.json")
        with open(template_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Fichier templates de paie non trouvé")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Erreur format fichier templates")

def load_tax_rates() -> Dict[str, Any]:
    """Charger les barèmes fiscaux depuis le fichier JSON"""
    try:
        tax_path = os.path.join(os.path.dirname(__file__), "../../../data/tax_rates.json")
        with open(tax_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Fichier barèmes fiscaux non trouvé")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Erreur format fichier barèmes")

@router.get("/templates")
async def get_payroll_templates():
    """Récupérer tous les templates de paie disponibles"""
    try:
        return load_payroll_templates()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur chargement templates: {str(e)}")

@router.get("/templates/{company_type}")
async def get_payroll_template(company_type: str):
    """Récupérer un template spécifique par type d'entreprise"""
    try:
        templates = load_payroll_templates()
        if company_type not in templates:
            raise HTTPException(status_code=404, detail="Template non trouvé")
        return templates[company_type]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur chargement template: {str(e)}")

@router.get("/tax-rates")
async def get_tax_rates():
    """Récupérer les barèmes fiscaux et sociaux"""
    try:
        return load_tax_rates()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur chargement barèmes: {str(e)}")

@router.get("/test")
async def test_payroll_config():
    """Endpoint de test pour vérifier la configuration de paie"""
    return {
        "status": "ok",
        "message": "Configuration de paie disponible",
        "templates_available": list(load_payroll_templates().keys()),
        "tax_rates_available": list(load_tax_rates().keys()),
        "endpoints": {
            "config": "/api/v1/payroll-config/",
            "status": "/api/v1/payroll-config/status",
            "variables": "/api/v1/payroll-config/variables",
            "variable_types": "/api/v1/payroll-config/variable-types",
            "variable_templates": "/api/v1/payroll-config/variables/templates",
            "quick_setup": "/api/v1/payroll-config/quick-setup",
            "templates": "/api/v1/payroll-config/templates",
            "tax_rates": "/api/v1/payroll-config/tax-rates",
            "setup": "/api/v1/payroll-config/setup",
            "initialize": "/api/v1/payroll-config/initialize"
        }
    }

@router.post("/initialize")
async def initialize_payroll_config(
    config_data: dict,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Initialiser la configuration de paie pour une entreprise"""
    
    try:
        # Créer les tables si elles n'existent pas
        from app.db.database import engine
        from app.db.models import Base
        Base.metadata.create_all(bind=engine)
        
        # Vérifier si une config existe déjà
        existing_config = db.query(models.PayrollConfig).filter(
            models.PayrollConfig.company_id == current_user.company_id
        ).first()
        
        if existing_config:
            raise HTTPException(status_code=400, detail="Configuration déjà existante")
        
        # Créer la configuration de base
        db_config = models.PayrollConfig(
            company_id=current_user.company_id,
            company_type=config_data.get("company_type", "PME"),
            country_code=config_data.get("country_code", "BJ"),
            currency_code=config_data.get("currency_code", "XOF"),
            payroll_variables={"variables": []},
            tax_rates=config_data.get("tax_rates", {}),
            formulas=config_data.get("formulas", {}),
            is_active=True
        )
        
        db.add(db_config)
        db.commit()
        db.refresh(db_config)
        
        return {
            "id": db_config.id,
            "company_id": db_config.company_id,
            "company_type": db_config.company_type,
            "country_code": db_config.country_code,
            "currency_code": db_config.currency_code,
            "is_active": db_config.is_active,
            "created_at": db_config.created_at,
            "message": "Configuration initialisée avec succès"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erreur initialisation: {str(e)}")

@router.post("/setup")
async def setup_company_payroll(
    setup_data: dict,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Configurer la paie d'une entreprise avec un template ou des variables personnalisées"""
    
    try:
        # Créer les tables si elles n'existent pas
        from app.db.database import engine
        from app.db.models import Base
        Base.metadata.create_all(bind=engine)
        
        # Vérifier si une config existe déjà
        existing_config = db.query(models.PayrollConfig).filter(
            models.PayrollConfig.company_id == current_user.company_id
        ).first()
        
        if existing_config:
            raise HTTPException(status_code=400, detail="Configuration de paie déjà existante")
        
        company_type = setup_data.get("company_type", "PME")
        
        # Créer la configuration
        db_config = models.PayrollConfig(
            company_id=current_user.company_id,
            company_type=company_type,
            country_code=setup_data.get("country_code", "BJ"),
            currency_code=setup_data.get("currency_code", "XOF"),
            payroll_variables={"variables": []},
            tax_rates=setup_data.get("tax_rates", {}),
            formulas=setup_data.get("formulas", {}),
            is_active=True
        )
        
        db.add(db_config)
        db.commit()
        db.refresh(db_config)
        
        # Créer les variables si fournies
        variables = setup_data.get("variables", [])
        created_variables = []
        
        for var_data in variables:
            db_variable = models.PayrollVariable(
                company_id=current_user.company_id,
                code=var_data.get("code"),
                name=var_data.get("name"),
                variable_type=var_data.get("variable_type", "FIXE"),
                is_mandatory=var_data.get("is_mandatory", False),
                is_active=var_data.get("is_active", True),
                calculation_method=var_data.get("calculation_method"),
                fixed_amount=var_data.get("fixed_amount"),
                percentage_rate=var_data.get("percentage_rate"),
                formula=var_data.get("formula"),
                description=var_data.get("description"),
                display_order=var_data.get("display_order", 0)
            )
            db.add(db_variable)
            created_variables.append(var_data.get("code"))
        
        db.commit()
        
        return {
            "config": {
                "id": db_config.id,
                "company_id": db_config.company_id,
                "company_type": db_config.company_type,
                "country_code": db_config.country_code,
                "currency_code": db_config.currency_code,
                "is_active": db_config.is_active,
                "created_at": db_config.created_at
            },
            "variables_created": len(created_variables),
            "variable_codes": created_variables,
            "message": "Configuration créée avec succès"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erreur lors de la configuration: {str(e)}")



@router.get("/")
async def get_company_payroll_config(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Récupérer la configuration de paie de l'entreprise ou retourner une config par défaut"""
    try:
        # Créer les tables si elles n'existent pas
        from app.db.database import engine
        from app.db.models import Base
        Base.metadata.create_all(bind=engine)
        
        config = db.query(models.PayrollConfig).filter(
            models.PayrollConfig.company_id == current_user.company_id
        ).first()
        
        if not config:
            # Retourner une configuration par défaut au lieu d'une erreur 404
            return {
                "id": None,
                "company_id": current_user.company_id,
                "company_type": None,
                "country_code": "BJ",
                "currency_code": "XOF",
                "payroll_variables": {"variables": []},
                "tax_rates": {},
                "formulas": {},
                "is_active": False,
                "created_at": None,
                "updated_at": None,
                "is_configured": False
            }
        
        # Ajouter un flag pour indiquer que la config existe
        config_dict = {
            "id": config.id,
            "company_id": config.company_id,
            "company_type": config.company_type,
            "country_code": config.country_code,
            "currency_code": config.currency_code,
            "payroll_variables": config.payroll_variables,
            "tax_rates": config.tax_rates,
            "formulas": config.formulas,
            "is_active": config.is_active,
            "created_at": config.created_at,
            "updated_at": config.updated_at,
            "is_configured": True
        }
        
        return config_dict
        
    except Exception as e:
        # En cas d'erreur, retourner une config par défaut
        return {
            "id": None,
            "company_id": current_user.company_id,
            "company_type": None,
            "country_code": "BJ",
            "currency_code": "XOF",
            "payroll_variables": {"variables": []},
            "tax_rates": {},
            "formulas": {},
            "is_active": False,
            "created_at": None,
            "updated_at": None,
            "is_configured": False,
            "error": str(e)
        }

@router.get("/variables")
async def get_company_payroll_variables(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Récupérer toutes les variables de paie de l'entreprise avec gestion complète"""
    try:
        # Créer les tables si elles n'existent pas
        from app.db.database import engine
        from app.db.models import Base
        Base.metadata.create_all(bind=engine)
        
        variables = db.query(models.PayrollVariable).filter(
            models.PayrollVariable.company_id == current_user.company_id
        ).order_by(models.PayrollVariable.display_order).all()
        
        # Convertir en dictionnaire avec toutes les informations nécessaires
        variables_list = []
        for var in variables:
            variables_list.append({
                "id": var.id,
                "code": var.code,
                "name": var.name,
                "variable_type": var.variable_type,
                "is_mandatory": var.is_mandatory,
                "is_active": var.is_active,
                "calculation_method": var.calculation_method,
                "fixed_amount": var.fixed_amount,
                "percentage_rate": var.percentage_rate,
                "formula": var.formula,
                "description": var.description,
                "display_order": var.display_order,
                "company_id": var.company_id,
                "created_at": var.created_at,
                "updated_at": var.updated_at
            })
        
        return {
            "variables": variables_list,
            "total_count": len(variables_list),
            "active_count": len([v for v in variables_list if v["is_active"]]),
            "mandatory_count": len([v for v in variables_list if v["is_mandatory"]])
        }
        
    except Exception as e:
        return {
            "variables": [],
            "total_count": 0,
            "active_count": 0,
            "mandatory_count": 0,
            "error": str(e)
        }

@router.post("/variables")
async def create_payroll_variable(
    variable_data: dict,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Créer une nouvelle variable de paie personnalisée"""
    
    try:
        # Créer les tables si elles n'existent pas
        from app.db.database import engine
        from app.db.models import Base
        Base.metadata.create_all(bind=engine)
        
        # Vérifier que le code n'existe pas déjà
        existing = db.query(models.PayrollVariable).filter(
            models.PayrollVariable.company_id == current_user.company_id,
            models.PayrollVariable.code == variable_data.get("code")
        ).first()
        
        if existing:
            raise HTTPException(status_code=400, detail="Code de variable déjà existant")
        
        # Créer la variable avec les données fournies
        db_variable = models.PayrollVariable(
            company_id=current_user.company_id,
            code=variable_data.get("code"),
            name=variable_data.get("name"),
            variable_type=variable_data.get("variable_type", "FIXE"),
            is_mandatory=variable_data.get("is_mandatory", False),
            is_active=variable_data.get("is_active", True),
            calculation_method=variable_data.get("calculation_method"),
            fixed_amount=variable_data.get("fixed_amount"),
            percentage_rate=variable_data.get("percentage_rate"),
            formula=variable_data.get("formula"),
            description=variable_data.get("description"),
            display_order=variable_data.get("display_order", 0)
        )
        
        db.add(db_variable)
        db.commit()
        db.refresh(db_variable)
        
        return {
            "id": db_variable.id,
            "code": db_variable.code,
            "name": db_variable.name,
            "variable_type": db_variable.variable_type,
            "is_mandatory": db_variable.is_mandatory,
            "is_active": db_variable.is_active,
            "calculation_method": db_variable.calculation_method,
            "fixed_amount": db_variable.fixed_amount,
            "percentage_rate": db_variable.percentage_rate,
            "formula": db_variable.formula,
            "description": db_variable.description,
            "display_order": db_variable.display_order,
            "company_id": db_variable.company_id,
            "created_at": db_variable.created_at,
            "updated_at": db_variable.updated_at,
            "message": "Variable créée avec succès"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erreur création variable: {str(e)}")

@router.put("/variables/{variable_id}")
async def update_payroll_variable(
    variable_id: int,
    variable_update: dict,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Mettre à jour une variable de paie"""
    
    try:
        db_variable = db.query(models.PayrollVariable).filter(
            models.PayrollVariable.id == variable_id,
            models.PayrollVariable.company_id == current_user.company_id
        ).first()
        
        if not db_variable:
            raise HTTPException(status_code=404, detail="Variable non trouvée")
        
        # Empêcher la modification des variables obligatoires
        if db_variable.is_mandatory and variable_update.get("is_active") is False:
            raise HTTPException(status_code=400, detail="Impossible de désactiver une variable obligatoire")
        
        # Mettre à jour les champs fournis
        for key, value in variable_update.items():
            if hasattr(db_variable, key) and value is not None:
                setattr(db_variable, key, value)
        
        db.commit()
        db.refresh(db_variable)
        
        return {
            "id": db_variable.id,
            "code": db_variable.code,
            "name": db_variable.name,
            "variable_type": db_variable.variable_type,
            "is_mandatory": db_variable.is_mandatory,
            "is_active": db_variable.is_active,
            "calculation_method": db_variable.calculation_method,
            "fixed_amount": db_variable.fixed_amount,
            "percentage_rate": db_variable.percentage_rate,
            "formula": db_variable.formula,
            "description": db_variable.description,
            "display_order": db_variable.display_order,
            "company_id": db_variable.company_id,
            "created_at": db_variable.created_at,
            "updated_at": db_variable.updated_at,
            "message": "Variable mise à jour avec succès"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erreur mise à jour variable: {str(e)}")

@router.delete("/variables/{variable_id}")
async def delete_payroll_variable(
    variable_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Supprimer une variable de paie (seulement si non obligatoire)"""
    
    try:
        db_variable = db.query(models.PayrollVariable).filter(
            models.PayrollVariable.id == variable_id,
            models.PayrollVariable.company_id == current_user.company_id
        ).first()
        
        if not db_variable:
            raise HTTPException(status_code=404, detail="Variable non trouvée")
        
        if db_variable.is_mandatory:
            raise HTTPException(status_code=400, detail="Impossible de supprimer une variable obligatoire")
        
        variable_info = {
            "code": db_variable.code,
            "name": db_variable.name
        }
        
        db.delete(db_variable)
        db.commit()
        
        return {
            "message": "Variable supprimée avec succès",
            "deleted_variable": variable_info
        }
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erreur suppression variable: {str(e)}")

@router.post("/variables/{variable_id}/toggle")
async def toggle_payroll_variable(
    variable_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Activer/désactiver une variable de paie"""
    
    try:
        db_variable = db.query(models.PayrollVariable).filter(
            models.PayrollVariable.id == variable_id,
            models.PayrollVariable.company_id == current_user.company_id
        ).first()
        
        if not db_variable:
            raise HTTPException(status_code=404, detail="Variable non trouvée")
        
        if db_variable.is_mandatory and db_variable.is_active:
            raise HTTPException(status_code=400, detail="Impossible de désactiver une variable obligatoire")
        
        db_variable.is_active = not db_variable.is_active
        db.commit()
        
        return {
            "message": f"Variable {'activée' if db_variable.is_active else 'désactivée'}", 
            "is_active": db_variable.is_active,
            "variable": {
                "id": db_variable.id,
                "code": db_variable.code,
                "name": db_variable.name,
                "is_active": db_variable.is_active
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erreur toggle variable: {str(e)}")

@router.get("/variable-types")
async def get_variable_types():
    """Récupérer les types de variables disponibles"""
    return {
        "variable_types": [
            {"value": "FIXE", "label": "Salaire fixe", "description": "Montant fixe mensuel"},
            {"value": "PRIME", "label": "Prime", "description": "Prime ou bonus"},
            {"value": "INDEMNITE", "label": "Indemnété", "description": "Indemnété de transport, logement, etc."},
            {"value": "RETENUE", "label": "Retenue", "description": "Retenue sur salaire"},
            {"value": "COTISATION", "label": "Cotisation", "description": "Cotisation sociale"},
            {"value": "IMPOT", "label": "Impôt", "description": "Impôt sur le revenu"}
        ],
        "calculation_methods": [
            {"value": "fixed", "label": "Montant fixe", "description": "Montant fixe en XOF"},
            {"value": "percentage", "label": "Pourcentage", "description": "Pourcentage du salaire de base"},
            {"value": "formula", "label": "Formule", "description": "Formule de calcul personnalisée"}
        ]
    }

@router.post("/variables/bulk")
async def create_bulk_variables(
    variables_data: dict,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Créer plusieurs variables en une fois"""
    
    try:
        # Créer les tables si elles n'existent pas
        from app.db.database import engine
        from app.db.models import Base
        Base.metadata.create_all(bind=engine)
        
        variables = variables_data.get("variables", [])
        created_variables = []
        errors = []
        
        for var_data in variables:
            try:
                # Vérifier que le code n'existe pas déjà
                existing = db.query(models.PayrollVariable).filter(
                    models.PayrollVariable.company_id == current_user.company_id,
                    models.PayrollVariable.code == var_data.get("code")
                ).first()
                
                if existing:
                    errors.append(f"Code {var_data.get('code')} déjà existant")
                    continue
                
                db_variable = models.PayrollVariable(
                    company_id=current_user.company_id,
                    code=var_data.get("code"),
                    name=var_data.get("name"),
                    variable_type=var_data.get("variable_type", "FIXE"),
                    is_mandatory=var_data.get("is_mandatory", False),
                    is_active=var_data.get("is_active", True),
                    calculation_method=var_data.get("calculation_method"),
                    fixed_amount=var_data.get("fixed_amount"),
                    percentage_rate=var_data.get("percentage_rate"),
                    formula=var_data.get("formula"),
                    description=var_data.get("description"),
                    display_order=var_data.get("display_order", 0)
                )
                
                db.add(db_variable)
                created_variables.append(var_data.get("code"))
                
            except Exception as e:
                errors.append(f"Erreur pour {var_data.get('code', 'variable')}: {str(e)}")
        
        if created_variables:
            db.commit()
        
        return {
            "created_count": len(created_variables),
            "created_variables": created_variables,
            "errors": errors,
            "message": f"{len(created_variables)} variables créées avec succès"
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erreur création en lot: {str(e)}")

@router.put("/variables/reorder")
async def reorder_variables(
    order_data: dict,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Réorganiser l'ordre d'affichage des variables"""
    
    try:
        variable_orders = order_data.get("variable_orders", [])
        
        for item in variable_orders:
            variable_id = item.get("id")
            new_order = item.get("display_order")
            
            db_variable = db.query(models.PayrollVariable).filter(
                models.PayrollVariable.id == variable_id,
                models.PayrollVariable.company_id == current_user.company_id
            ).first()
            
            if db_variable:
                db_variable.display_order = new_order
        
        db.commit()
        
        return {"message": "Ordre des variables mis à jour avec succès"}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erreur réorganisation: {str(e)}")

@router.get("/variables/templates")
async def get_variable_templates():
    """Récupérer des modèles de variables prédéfinies"""
    return {
        "templates": [
            {
                "code": "SB",
                "name": "Salaire de base",
                "variable_type": "FIXE",
                "calculation_method": "fixed",
                "is_mandatory": True,
                "description": "Salaire de base mensuel",
                "display_order": 1
            },
            {
                "code": "TRANSPORT",
                "name": "Indemnité de transport",
                "variable_type": "INDEMNITE",
                "calculation_method": "fixed",
                "fixed_amount": 25000,
                "description": "Indemnité forfaitaire de transport",
                "display_order": 2
            },
            {
                "code": "LOGEMENT",
                "name": "Indemnité de logement",
                "variable_type": "INDEMNITE",
                "calculation_method": "percentage",
                "percentage_rate": 20.0,
                "description": "Indemnité de logement (20% du salaire de base)",
                "display_order": 3
            },
            {
                "code": "CNSS_EMP",
                "name": "Cotisation CNSS employé",
                "variable_type": "COTISATION",
                "calculation_method": "percentage",
                "percentage_rate": 3.6,
                "description": "Cotisation CNSS employé (3.6%)",
                "display_order": 5
            },
            {
                "code": "IRPP",
                "name": "Impôt sur le revenu",
                "variable_type": "IMPOT",
                "calculation_method": "formula",
                "formula": "calculate_irpp(taxable_income)",
                "description": "Impôt progressif sur le revenu",
                "display_order": 6
            },
            {
                "code": "PRIME_ANCIENNETE",
                "name": "Prime d'ancienneté",
                "variable_type": "PRIME",
                "calculation_method": "percentage",
                "description": "Prime basée sur l'ancienneté",
                "display_order": 4
            },
            {
                "code": "AVANCE",
                "name": "Avance sur salaire",
                "variable_type": "RETENUE",
                "calculation_method": "fixed",
                "description": "Avance remboursable sur salaire",
                "display_order": 7
            }
        ]
    }

@router.post("/variables/from-template")
async def create_variables_from_template(
    template_data: dict,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Créer des variables à partir d'un template prédéfini"""
    
    try:
        # Créer les tables si elles n'existent pas
        from app.db.database import engine
        from app.db.models import Base
        Base.metadata.create_all(bind=engine)
        
        selected_codes = template_data.get("selected_variables", [])
        
        # Récupérer les templates
        templates_response = await get_variable_templates()
        templates = templates_response["templates"]
        
        created_variables = []
        errors = []
        
        for template in templates:
            if template["code"] in selected_codes or template.get("is_mandatory", False):
                # Vérifier que le code n'existe pas déjà
                existing = db.query(models.PayrollVariable).filter(
                    models.PayrollVariable.company_id == current_user.company_id,
                    models.PayrollVariable.code == template["code"]
                ).first()
                
                if existing:
                    errors.append(f"Variable {template['code']} existe déjà")
                    continue
                
                db_variable = models.PayrollVariable(
                    company_id=current_user.company_id,
                    code=template["code"],
                    name=template["name"],
                    variable_type=template["variable_type"],
                    is_mandatory=template.get("is_mandatory", False),
                    is_active=True,
                    calculation_method=template["calculation_method"],
                    fixed_amount=template.get("fixed_amount"),
                    percentage_rate=template.get("percentage_rate"),
                    formula=template.get("formula"),
                    description=template["description"],
                    display_order=template["display_order"]
                )
                
                db.add(db_variable)
                created_variables.append(template["code"])
        
        if created_variables:
            db.commit()
        
        return {
            "created_count": len(created_variables),
            "created_variables": created_variables,
            "errors": errors,
            "message": f"{len(created_variables)} variables créées à partir du template"
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erreur création depuis template: {str(e)}")

@router.get("/quick-setup")
async def get_quick_setup_options():
    """Récupérer les options de configuration rapide"""
    return {
        "company_types": [
            {"value": "PME", "label": "Petite et Moyenne Entreprise"},
            {"value": "GRANDE_ENTREPRISE", "label": "Grande Entreprise"},
            {"value": "SECTEUR_PUBLIC", "label": "Secteur Public"},
            {"value": "ONG", "label": "Organisation Non Gouvernementale"},
            {"value": "BTP_INDUSTRIE", "label": "BTP/Industrie"},
            {"value": "BANQUE_ASSURANCE", "label": "Banque/Assurance"}
        ],
        "default_configurations": {
            "PME": {
                "mandatory_variables": ["SB", "CNSS_EMP", "IRPP"],
                "recommended_variables": ["TRANSPORT", "LOGEMENT"],
                "description": "Configuration standard pour PME"
            },
            "GRANDE_ENTREPRISE": {
                "mandatory_variables": ["SB", "CNSS_EMP", "IRPP"],
                "recommended_variables": ["TRANSPORT", "LOGEMENT", "PRIME_ANCIENNETE"],
                "description": "Configuration étendue pour grande entreprise"
            }
        }
    }

@router.post("/quick-setup")
async def quick_setup_payroll(
    setup_data: dict,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Configuration rapide de la paie"""
    
    try:
        # Créer les tables si elles n'existent pas
        from app.db.database import engine
        from app.db.models import Base
        Base.metadata.create_all(bind=engine)
        
        company_type = setup_data.get("company_type", "PME")
        
        # Vérifier si une config existe déjà
        existing_config = db.query(models.PayrollConfig).filter(
            models.PayrollConfig.company_id == current_user.company_id
        ).first()
        
        if existing_config:
            return {
                "message": "Configuration existe déjà",
                "config_exists": True,
                "config_id": existing_config.id
            }
        
        # Créer la configuration
        db_config = models.PayrollConfig(
            company_id=current_user.company_id,
            company_type=company_type,
            country_code="BJ",
            currency_code="XOF",
            payroll_variables={"variables": []},
            tax_rates={
                "irpp_brackets": [
                    {"min": 0, "max": 130000, "rate": 0},
                    {"min": 130001, "max": 300000, "rate": 10},
                    {"min": 300001, "max": 1000000, "rate": 20},
                    {"min": 1000001, "max": float('inf'), "rate": 35}
                ],
                "cnss_rate": 3.6,
                "cnss_employer_rate": 16.4
            },
            formulas={},
            is_active=True
        )
        
        db.add(db_config)
        db.commit()
        db.refresh(db_config)
        
        # Créer les variables par défaut selon le type d'entreprise
        quick_options = await get_quick_setup_options()
        config_info = quick_options["default_configurations"].get(company_type, {})
        
        mandatory_vars = config_info.get("mandatory_variables", ["SB", "CNSS_EMP", "IRPP"])
        recommended_vars = config_info.get("recommended_variables", [])
        
        # Créer les variables depuis le template
        all_vars = mandatory_vars + recommended_vars
        template_result = await create_variables_from_template(
            {"selected_variables": all_vars},
            db,
            current_user
        )
        
        return {
            "config_created": True,
            "config_id": db_config.id,
            "company_type": company_type,
            "variables_created": template_result["created_count"],
            "variable_codes": template_result["created_variables"],
            "message": "Configuration rapide terminée avec succès"
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erreur configuration rapide: {str(e)}")

@router.get("/status")
async def get_payroll_status(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Récupérer le statut de la configuration de paie"""
    try:
        # Créer les tables si elles n'existent pas
        from app.db.database import engine
        from app.db.models import Base
        Base.metadata.create_all(bind=engine)
        
        # Vérifier la configuration
        config = db.query(models.PayrollConfig).filter(
            models.PayrollConfig.company_id == current_user.company_id
        ).first()
        
        # Compter les variables
        variables_count = db.query(models.PayrollVariable).filter(
            models.PayrollVariable.company_id == current_user.company_id
        ).count()
        
        active_variables_count = db.query(models.PayrollVariable).filter(
            models.PayrollVariable.company_id == current_user.company_id,
            models.PayrollVariable.is_active == True
        ).count()
        
        return {
            "is_configured": config is not None,
            "config_id": config.id if config else None,
            "company_type": config.company_type if config else None,
            "variables_count": variables_count,
            "active_variables_count": active_variables_count,
            "setup_complete": config is not None and variables_count > 0,
            "next_steps": [
                "Initialiser la configuration" if not config else None,
                "Ajouter des variables de paie" if variables_count == 0 else None,
                "Configurer les employés" if config and variables_count > 0 else None
            ]
        }
        
    except Exception as e:
        return {
            "is_configured": False,
            "error": str(e),
            "setup_complete": False
        }

@router.get("/debug")
async def debug_payroll_config():
    """Debug endpoint pour diagnostiquer les problèmes de configuration"""
    try:
        templates = load_payroll_templates()
        tax_rates = load_tax_rates()
        
        return {
            "status": "success",
            "templates_loaded": len(templates),
            "template_types": list(templates.keys()),
            "tax_countries": list(tax_rates.keys()),
            "sample_template": {
                "name": templates["PME"]["name"],
                "variables_count": len(templates["PME"]["variables"])
            },
            "file_paths": {
                "templates": "app/data/payroll_templates.json",
                "tax_rates": "app/data/tax_rates.json"
            }
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "message": "Erreur lors du chargement des fichiers de configuration"
        }

