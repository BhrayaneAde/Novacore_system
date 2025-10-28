from pydantic import BaseModel, Field, validator
from typing import Optional, Dict, List, Any
from datetime import datetime
from enum import Enum

class PayrollFrequency(str, Enum):
    WEEKLY = "weekly"
    BIWEEKLY = "biweekly"
    MONTHLY = "monthly"
    QUARTERLY = "quarterly"

class TaxCalculationMethod(str, Enum):
    PROGRESSIVE = "progressive"
    FLAT_RATE = "flat_rate"
    BRACKETS = "brackets"

class ContributionType(str, Enum):
    EMPLOYEE = "employee"
    EMPLOYER = "employer"
    SHARED = "shared"

# Payroll Configuration Base
class PayrollConfigBase(BaseModel):
    country_code: str = Field(..., min_length=2, max_length=3, description="ISO country code (BJ, FR, etc.)")
    country_name: str = Field(..., min_length=1, max_length=100)
    currency_code: str = Field(..., min_length=3, max_length=3, description="ISO currency code")
    currency_symbol: str = Field(..., max_length=5)
    
    # Payroll Settings
    payroll_frequency: PayrollFrequency = PayrollFrequency.MONTHLY
    minimum_wage: Optional[float] = Field(None, ge=0)
    working_hours_per_week: float = Field(40.0, ge=1, le=80)
    working_days_per_week: int = Field(5, ge=1, le=7)
    
    # Tax Settings
    tax_calculation_method: TaxCalculationMethod = TaxCalculationMethod.PROGRESSIVE
    tax_year_start_month: int = Field(1, ge=1, le=12)
    
    # Compliance
    requires_social_security: bool = True
    requires_income_tax: bool = True
    requires_pension: bool = True
    
    # Date Formats
    date_format: str = "DD/MM/YYYY"
    decimal_places: int = Field(2, ge=0, le=4)

class SocialContributionRule(BaseModel):
    name: str = Field(..., description="Contribution name (e.g., 'Sécurité Sociale')")
    code: str = Field(..., description="Unique code (e.g., 'SS_EMPLOYEE')")
    rate_percentage: float = Field(..., ge=0, le=100, description="Contribution rate as percentage")
    contribution_type: ContributionType
    
    # Calculation Rules
    applies_to_gross: bool = True
    min_salary_threshold: Optional[float] = Field(None, ge=0)
    max_salary_threshold: Optional[float] = Field(None, ge=0)
    max_annual_contribution: Optional[float] = Field(None, ge=0)
    
    # Categories
    category: str = Field(..., description="Category (social_security, pension, family, etc.)")
    is_mandatory: bool = True
    is_active: bool = True

class TaxBracket(BaseModel):
    min_amount: float = Field(0, ge=0)
    max_amount: Optional[float] = Field(None, ge=0)
    rate_percentage: float = Field(..., ge=0, le=100)
    fixed_amount: float = Field(0, ge=0)

class IncomeTaxRule(BaseModel):
    name: str = Field(..., description="Tax rule name")
    code: str = Field(..., description="Unique code")
    calculation_method: TaxCalculationMethod
    
    # For progressive/brackets
    tax_brackets: List[TaxBracket] = []
    
    # For flat rate
    flat_rate_percentage: Optional[float] = Field(None, ge=0, le=100)
    
    # Deductions
    standard_deduction: float = Field(0, ge=0)
    personal_allowance: float = Field(0, ge=0)
    
    is_active: bool = True

class PayrollConfigCreate(PayrollConfigBase):
    social_contributions: List[SocialContributionRule] = []
    income_tax_rules: List[IncomeTaxRule] = []

class PayrollConfigUpdate(BaseModel):
    country_name: Optional[str] = None
    currency_code: Optional[str] = None
    currency_symbol: Optional[str] = None
    payroll_frequency: Optional[PayrollFrequency] = None
    minimum_wage: Optional[float] = None
    working_hours_per_week: Optional[float] = None
    working_days_per_week: Optional[int] = None
    tax_calculation_method: Optional[TaxCalculationMethod] = None
    social_contributions: Optional[List[SocialContributionRule]] = None
    income_tax_rules: Optional[List[IncomeTaxRule]] = None

class PayrollConfigResponse(PayrollConfigBase):
    id: int
    created_at: datetime
    updated_at: datetime
    social_contributions: List[SocialContributionRule] = []
    income_tax_rules: List[IncomeTaxRule] = []
    is_active: bool = True

    class Config:
        from_attributes = True

# Predefined Country Configurations
BENIN_CONFIG = {
    "country_code": "BJ",
    "country_name": "Bénin",
    "currency_code": "XOF",
    "currency_symbol": "CFA",
    "payroll_frequency": "monthly",
    "minimum_wage": 40000,  # CFA per month
    "working_hours_per_week": 40,
    "working_days_per_week": 5,
    "tax_calculation_method": "progressive",
    "social_contributions": [
        {
            "name": "Sécurité Sociale Employé",
            "code": "SS_EMPLOYEE_BJ",
            "rate_percentage": 3.6,
            "contribution_type": "employee",
            "category": "social_security",
            "applies_to_gross": True,
            "is_mandatory": True
        },
        {
            "name": "Sécurité Sociale Employeur",
            "code": "SS_EMPLOYER_BJ", 
            "rate_percentage": 15.4,
            "contribution_type": "employer",
            "category": "social_security",
            "applies_to_gross": True,
            "is_mandatory": True
        },
        {
            "name": "Retraite Employeur",
            "code": "PENSION_EMPLOYER_BJ",
            "rate_percentage": 6.4,
            "contribution_type": "employer",
            "category": "pension",
            "applies_to_gross": True,
            "is_mandatory": True
        },
        {
            "name": "Allocations Familiales",
            "code": "FAMILY_ALLOWANCE_BJ",
            "rate_percentage": 9.0,
            "contribution_type": "employer",
            "category": "family",
            "applies_to_gross": True,
            "is_mandatory": True
        },
        {
            "name": "Accident du Travail",
            "code": "WORK_ACCIDENT_BJ",
            "rate_percentage": 2.5,  # Average between 1-4%
            "contribution_type": "employer",
            "category": "work_accident",
            "applies_to_gross": True,
            "is_mandatory": True
        }
    ],
    "income_tax_rules": [
        {
            "name": "Impôt sur le Revenu Bénin",
            "code": "INCOME_TAX_BJ",
            "calculation_method": "brackets",
            "tax_brackets": [
                {"min_amount": 0, "max_amount": 130000, "rate_percentage": 0, "fixed_amount": 0},
                {"min_amount": 130001, "max_amount": 350000, "rate_percentage": 10, "fixed_amount": 0},
                {"min_amount": 350001, "max_amount": 1500000, "rate_percentage": 20, "fixed_amount": 22000},
                {"min_amount": 1500001, "max_amount": None, "rate_percentage": 35, "fixed_amount": 252000}
            ],
            "standard_deduction": 0,
            "personal_allowance": 130000
        }
    ]
}

FRANCE_CONFIG = {
    "country_code": "FR",
    "country_name": "France",
    "currency_code": "EUR",
    "currency_symbol": "€",
    "payroll_frequency": "monthly",
    "minimum_wage": 1766.92,  # SMIC 2024
    "working_hours_per_week": 35,
    "working_days_per_week": 5,
    "tax_calculation_method": "progressive",
    "social_contributions": [
        {
            "name": "Sécurité Sociale",
            "code": "SS_EMPLOYEE_FR",
            "rate_percentage": 22.0,
            "contribution_type": "employee",
            "category": "social_security",
            "applies_to_gross": True,
            "is_mandatory": True
        },
        {
            "name": "Charges Patronales",
            "code": "SS_EMPLOYER_FR",
            "rate_percentage": 42.0,
            "contribution_type": "employer", 
            "category": "social_security",
            "applies_to_gross": True,
            "is_mandatory": True
        }
    ]
}

COUNTRY_CONFIGS = {
    "BJ": BENIN_CONFIG,
    "FR": FRANCE_CONFIG
}