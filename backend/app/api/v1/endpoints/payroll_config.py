from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ....db.database import get_db
from ....db.models import PayrollConfig
from ....schemas.payroll_config import (
    PayrollConfigCreate, PayrollConfigUpdate, PayrollConfigResponse, COUNTRY_CONFIGS
)
from ....core.auth import get_current_user
from ....db.models import User

router = APIRouter()

@router.get("/", response_model=List[PayrollConfigResponse])
def get_payroll_configs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all payroll configurations for company"""
    configs = db.query(PayrollConfig).filter(
        PayrollConfig.company_id == current_user.company_id
    ).all()
    return configs

@router.get("/countries")
def get_available_countries():
    """Get available country configurations"""
    return {
        "countries": [
            {
                "code": code,
                "name": config["country_name"],
                "currency": config["currency_code"],
                "currency_symbol": config["currency_symbol"]
            }
            for code, config in COUNTRY_CONFIGS.items()
        ]
    }

@router.get("/countries/{country_code}")
def get_country_template(country_code: str):
    """Get predefined configuration template for a country"""
    if country_code.upper() not in COUNTRY_CONFIGS:
        raise HTTPException(status_code=404, detail="Country configuration not found")
    
    return COUNTRY_CONFIGS[country_code.upper()]

@router.post("/", response_model=PayrollConfigResponse)
def create_payroll_config(
    config: PayrollConfigCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create new payroll configuration"""
    # Check if config already exists for this country
    existing = db.query(PayrollConfig).filter(
        PayrollConfig.company_id == current_user.company_id,
        PayrollConfig.country_code == config.country_code.upper()
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=400, 
            detail=f"Payroll configuration already exists for {config.country_code}"
        )
    
    db_config = PayrollConfig(
        **config.dict(),
        company_id=current_user.company_id,
        country_code=config.country_code.upper()
    )
    
    db.add(db_config)
    db.commit()
    db.refresh(db_config)
    
    return db_config

@router.put("/{config_id}", response_model=PayrollConfigResponse)
def update_payroll_config(
    config_id: int,
    config_update: PayrollConfigUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update payroll configuration"""
    db_config = db.query(PayrollConfig).filter(
        PayrollConfig.id == config_id,
        PayrollConfig.company_id == current_user.company_id
    ).first()
    
    if not db_config:
        raise HTTPException(status_code=404, detail="Payroll configuration not found")
    
    update_data = config_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_config, field, value)
    
    db.commit()
    db.refresh(db_config)
    
    return db_config

@router.delete("/{config_id}")
def delete_payroll_config(
    config_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete payroll configuration"""
    db_config = db.query(PayrollConfig).filter(
        PayrollConfig.id == config_id,
        PayrollConfig.company_id == current_user.company_id
    ).first()
    
    if not db_config:
        raise HTTPException(status_code=404, detail="Payroll configuration not found")
    
    db.delete(db_config)
    db.commit()
    
    return {"message": "Payroll configuration deleted successfully"}

@router.post("/{config_id}/activate")
def activate_payroll_config(
    config_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Activate a payroll configuration (deactivate others)"""
    # Deactivate all configs for company
    db.query(PayrollConfig).filter(
        PayrollConfig.company_id == current_user.company_id
    ).update({"is_active": False})
    
    # Activate selected config
    db_config = db.query(PayrollConfig).filter(
        PayrollConfig.id == config_id,
        PayrollConfig.company_id == current_user.company_id
    ).first()
    
    if not db_config:
        raise HTTPException(status_code=404, detail="Payroll configuration not found")
    
    db_config.is_active = True
    db.commit()
    
    return {"message": f"Payroll configuration for {db_config.country_name} activated"}

@router.get("/active", response_model=PayrollConfigResponse)
def get_active_payroll_config(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get currently active payroll configuration"""
    config = db.query(PayrollConfig).filter(
        PayrollConfig.company_id == current_user.company_id,
        PayrollConfig.is_active == True
    ).first()
    
    if not config:
        raise HTTPException(status_code=404, detail="No active payroll configuration found")
    
    return config

@router.post("/calculate-sample")
def calculate_sample_payroll(
    gross_salary: float,
    config_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Calculate sample payroll with given configuration"""
    config = db.query(PayrollConfig).filter(
        PayrollConfig.id == config_id,
        PayrollConfig.company_id == current_user.company_id
    ).first()
    
    if not config:
        raise HTTPException(status_code=404, detail="Payroll configuration not found")
    
    # Calculate contributions
    employee_contributions = []
    employer_contributions = []
    total_employee_deductions = 0
    total_employer_costs = 0
    
    for contrib in config.social_contributions or []:
        amount = gross_salary * (contrib["rate_percentage"] / 100)
        
        contribution_detail = {
            "name": contrib["name"],
            "rate": contrib["rate_percentage"],
            "amount": round(amount, config.decimal_places)
        }
        
        if contrib["contribution_type"] == "employee":
            employee_contributions.append(contribution_detail)
            total_employee_deductions += amount
        elif contrib["contribution_type"] == "employer":
            employer_contributions.append(contribution_detail)
            total_employer_costs += amount
    
    # Calculate income tax (simplified)
    income_tax = 0
    taxable_income = gross_salary - total_employee_deductions
    
    if config.income_tax_rules:
        tax_rule = config.income_tax_rules[0]  # Use first rule
        if tax_rule.get("calculation_method") == "brackets":
            for bracket in tax_rule.get("tax_brackets", []):
                if taxable_income > bracket["min_amount"]:
                    bracket_max = bracket.get("max_amount", taxable_income)
                    taxable_in_bracket = min(taxable_income, bracket_max) - bracket["min_amount"]
                    income_tax += (taxable_in_bracket * bracket["rate_percentage"] / 100) + bracket.get("fixed_amount", 0)
    
    net_salary = gross_salary - total_employee_deductions - income_tax
    total_cost = gross_salary + total_employer_costs
    
    return {
        "gross_salary": round(gross_salary, config.decimal_places),
        "employee_contributions": employee_contributions,
        "employer_contributions": employer_contributions,
        "total_employee_deductions": round(total_employee_deductions, config.decimal_places),
        "total_employer_costs": round(total_employer_costs, config.decimal_places),
        "income_tax": round(income_tax, config.decimal_places),
        "net_salary": round(net_salary, config.decimal_places),
        "total_cost_to_company": round(total_cost, config.decimal_places),
        "currency": config.currency_symbol,
        "country": config.country_name
    }