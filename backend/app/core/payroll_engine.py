from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.db import models
import json
import re

class PayrollCalculationEngine:
    """Moteur de calcul de paie dynamique"""
    
    def __init__(self, db: Session, company_id: int):
        self.db = db
        self.company_id = company_id
        self.config = self._load_config()
        self.variables = self._load_variables()
        self.tax_rates = self.config.tax_rates if self.config else {}
    
    def _load_config(self) -> models.PayrollConfig:
        """Charger la configuration de paie de l'entreprise"""
        return self.db.query(models.PayrollConfig).filter(
            models.PayrollConfig.company_id == self.company_id
        ).first()
    
    def _load_variables(self) -> List[models.PayrollVariable]:
        """Charger les variables actives de l'entreprise"""
        return self.db.query(models.PayrollVariable).filter(
            models.PayrollVariable.company_id == self.company_id,
            models.PayrollVariable.is_active == True
        ).order_by(models.PayrollVariable.display_order).all()
    
    def calculate_payroll(self, employee_id: int, period: str, input_values: Dict[str, float]) -> Dict[str, Any]:
        """Calculer la paie d'un employé pour une période donnée"""
        
        if not self.config:
            raise ValueError("Configuration de paie non trouvée pour cette entreprise")
        
        # Récupérer les données de l'employé
        employee = self.db.query(models.Employee).filter(
            models.Employee.id == employee_id,
            models.Employee.company_id == self.company_id
        ).first()
        
        if not employee:
            raise ValueError("Employé non trouvé")
        
        # Initialiser les totaux
        calculation_context = {
            "employee": employee,
            "period": period,
            "input_values": input_values,
            "calculated_values": {},
            "totals": {
                "gross_salary": 0,
                "total_allowances": 0,
                "total_deductions": 0,
                "taxable_income": 0,
                "tax_amount": 0,
                "social_contributions": 0,
                "net_salary": 0
            }
        }
        
        # Calculer chaque variable
        salary_breakdown = {}
        
        for variable in self.variables:
            value = self._calculate_variable(variable, calculation_context)
            salary_breakdown[variable.code] = {
                "name": variable.name,
                "type": variable.variable_type,
                "value": value,
                "calculation_method": variable.calculation_method
            }
            
            # Ajouter aux totaux selon le type
            self._add_to_totals(variable, value, calculation_context["totals"])
        
        # Calculer l'impôt sur le revenu
        if "IRPP" in [v.code for v in self.variables]:
            tax_amount = self._calculate_irpp(calculation_context["totals"]["taxable_income"])
            calculation_context["totals"]["tax_amount"] = tax_amount
            salary_breakdown["IRPP"]["value"] = tax_amount
        
        # Calculer le net à payer
        net_salary = (
            calculation_context["totals"]["gross_salary"] + 
            calculation_context["totals"]["total_allowances"] - 
            calculation_context["totals"]["total_deductions"] - 
            calculation_context["totals"]["tax_amount"] - 
            calculation_context["totals"]["social_contributions"]
        )
        calculation_context["totals"]["net_salary"] = net_salary
        
        return {
            "employee_id": employee_id,
            "period": period,
            "gross_salary": calculation_context["totals"]["gross_salary"],
            "total_allowances": calculation_context["totals"]["total_allowances"],
            "total_deductions": calculation_context["totals"]["total_deductions"],
            "taxable_income": calculation_context["totals"]["taxable_income"],
            "tax_amount": calculation_context["totals"]["tax_amount"],
            "social_contributions": calculation_context["totals"]["social_contributions"],
            "net_salary": net_salary,
            "salary_breakdown": salary_breakdown
        }
    
    def _calculate_variable(self, variable: models.PayrollVariable, context: Dict[str, Any]) -> float:
        """Calculer la valeur d'une variable selon sa méthode"""
        
        # Valeur fournie en entrée
        if variable.code in context["input_values"]:
            return context["input_values"][variable.code]
        
        # Calcul selon la méthode
        if variable.calculation_method == "fixed":
            return variable.fixed_amount or 0
        
        elif variable.calculation_method == "percentage":
            base_salary = context["input_values"].get("SB", 0)
            return base_salary * (variable.percentage_rate / 100)
        
        elif variable.calculation_method == "formula":
            return self._evaluate_formula(variable.formula, context)
        
        elif variable.calculation_method == "progressive" and variable.code == "IRPP":
            # L'IRPP sera calculé séparément
            return 0
        
        return 0
    
    def _evaluate_formula(self, formula: str, context: Dict[str, Any]) -> float:
        """Évaluer une formule dynamique"""
        if not formula:
            return 0
        
        try:
            # Remplacer les variables dans la formule
            eval_formula = formula
            
            # Variables d'entrée
            for code, value in context["input_values"].items():
                eval_formula = eval_formula.replace(code.lower(), str(value))
            
            # Variables calculées
            for code, value in context["calculated_values"].items():
                eval_formula = eval_formula.replace(code.lower(), str(value))
            
            # Constantes communes
            eval_formula = eval_formula.replace("salaire_base", str(context["input_values"].get("SB", 0)))
            
            # Évaluer l'expression (attention : sécuriser en production)
            result = eval(eval_formula)
            return float(result)
        
        except Exception as e:
            print(f"Erreur dans l'évaluation de la formule '{formula}': {e}")
            return 0
    
    def _add_to_totals(self, variable: models.PayrollVariable, value: float, totals: Dict[str, float]):
        """Ajouter la valeur aux totaux appropriés"""
        
        if variable.variable_type == "fixe":
            totals["gross_salary"] += value
            totals["taxable_income"] += value
        
        elif variable.variable_type in ["prime", "indemnite"]:
            totals["total_allowances"] += value
            totals["taxable_income"] += value
        
        elif variable.variable_type == "retenue":
            totals["total_deductions"] += value
        
        elif variable.variable_type == "cotisation":
            totals["social_contributions"] += value
    
    def _calculate_irpp(self, taxable_income: float) -> float:
        """Calculer l'impôt sur le revenu selon le barème progressif"""
        
        if not self.tax_rates or "irpp" not in self.tax_rates:
            return 0
        
        irpp_config = self.tax_rates["irpp"]
        brackets = irpp_config.get("brackets", [])
        
        total_tax = 0
        remaining_income = taxable_income
        
        for bracket in brackets:
            if remaining_income <= 0:
                break
            
            bracket_min = bracket["min"]
            bracket_max = bracket["max"]
            rate = bracket["rate"] / 100
            
            if bracket_max is None:  # Dernière tranche
                taxable_in_bracket = remaining_income
            else:
                taxable_in_bracket = min(remaining_income, bracket_max - bracket_min + 1)
            
            if taxable_in_bracket > 0:
                total_tax += taxable_in_bracket * rate
                remaining_income -= taxable_in_bracket
        
        return total_tax
    
    def validate_calculation_inputs(self, input_values: Dict[str, float]) -> List[str]:
        """Valider les valeurs d'entrée pour le calcul"""
        errors = []
        
        # Vérifier que les variables obligatoires sont présentes
        mandatory_variables = [v for v in self.variables if v.is_mandatory]
        
        for variable in mandatory_variables:
            if variable.code not in input_values and variable.calculation_method == "fixed":
                errors.append(f"Variable obligatoire manquante: {variable.name} ({variable.code})")
        
        # Vérifier les valeurs numériques
        for code, value in input_values.items():
            if not isinstance(value, (int, float)) or value < 0:
                errors.append(f"Valeur invalide pour {code}: {value}")
        
        return errors