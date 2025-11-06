from typing import Dict, Any, List
import json

class PayrollCalculationEngine:
    def __init__(self, config):
        self.config = config
        self.variables = config.payroll_variables or {}
        self.tax_rates = config.tax_rates or self._default_tax_rates()
        
    def _default_tax_rates(self):
        return {
            "irpp_brackets": [
                {"min": 0, "max": 30000, "rate": 0},
                {"min": 30001, "max": 100000, "rate": 0.1},
                {"min": 100001, "max": 300000, "rate": 0.15},
                {"min": 300001, "max": 1000000, "rate": 0.25},
                {"min": 1000001, "max": float('inf'), "rate": 0.35}
            ],
            "cnss_employee": 0.036,
            "cnss_employer": 0.165
        }
    
    def calculate_full_payroll(self, base_salary: float, employee_data: Dict, variable_data: Dict = None, attendance_data: Dict = None):
        """Calcul complet de paie avec données avancées"""
        variable_data = variable_data or {}
        attendance_data = attendance_data or {}
        
        # Ajustement salaire selon présence
        worked_days = attendance_data.get('worked_days', 22)
        absent_days = attendance_data.get('absent_days', 0)
        paid_leave_days = attendance_data.get('paid_leave_days', 0)
        
        # Salaire ajusté selon présence
        total_expected_days = 22  # Jours ouvrables standard
        actual_paid_days = worked_days + paid_leave_days
        attendance_ratio = actual_paid_days / total_expected_days
        adjusted_base_salary = base_salary * attendance_ratio
        
        # Calcul des éléments variables
        overtime_hours = variable_data.get('overtime_hours', 0)
        overtime_rate = base_salary / (22 * 8) * 1.5  # Taux majoré 50%
        overtime_amount = overtime_hours * overtime_rate
        
        bonus = variable_data.get('bonus', 0)
        advance = variable_data.get('advance', 0)
        other_deductions = variable_data.get('other_deductions', 0)
        
        # Primes et indemnités personnalisées
        custom_allowances = employee_data.get('custom_allowances', [])
        total_custom_allowances = sum(item.get('amount', 0) for item in custom_allowances)
        
        custom_deductions = employee_data.get('custom_deductions', [])
        total_custom_deductions = sum(item.get('amount', 0) for item in custom_deductions)
        
        # Salaire brut total
        gross_salary = adjusted_base_salary + overtime_amount + bonus + total_custom_allowances
        
        # Calcul CNSS
        cnss_employee = gross_salary * self.tax_rates["cnss_employee"]
        cnss_employer = gross_salary * self.tax_rates["cnss_employer"]
        
        # Revenu imposable
        taxable_income = gross_salary - cnss_employee
        
        # Calcul IRPP avec abattements familiaux
        children_count = employee_data.get('children_count', 0)
        marital_status = employee_data.get('marital_status', '')
        
        # Abattements
        family_allowance = 0
        if marital_status in ['marié', 'married']:
            family_allowance += 25000  # Abattement conjoint
        family_allowance += children_count * 10000  # Abattement par enfant
        
        taxable_after_allowances = max(0, taxable_income - family_allowance)
        tax_amount = self._calculate_progressive_tax(taxable_after_allowances)
        
        # Total des retenues
        total_deductions = cnss_employee + tax_amount + advance + other_deductions + total_custom_deductions
        
        # Salaire net
        net_salary = gross_salary - total_deductions
        
        # Coût total employeur
        total_cost = gross_salary + cnss_employer
        
        return {
            "gross_salary": round(gross_salary, 0),
            "taxable_income": round(taxable_income, 0),
            "tax_amount": round(tax_amount, 0),
            "social_contributions": round(cnss_employee, 0),
            "employer_contributions": round(cnss_employer, 0),
            "net_salary": round(net_salary, 0),
            "total_cost": round(total_cost, 0),
            "total_allowances": round(overtime_amount + bonus + total_custom_allowances, 0),
            "total_deductions": round(total_deductions, 0),
            "breakdown": {
                "base_salary": round(adjusted_base_salary, 0),
                "overtime": round(overtime_amount, 0),
                "bonus": round(bonus, 0),
                "custom_allowances": round(total_custom_allowances, 0),
                "cnss_employee": round(cnss_employee, 0),
                "cnss_employer": round(cnss_employer, 0),
                "irpp": round(tax_amount, 0),
                "advance": round(advance, 0),
                "other_deductions": round(other_deductions, 0),
                "custom_deductions": round(total_custom_deductions, 0),
                "family_allowance": round(family_allowance, 0),
                "attendance_ratio": round(attendance_ratio, 2)
            }
        }
    
    def _calculate_progressive_tax(self, taxable_income: float) -> float:
        """Calcul IRPP progressif"""
        tax = 0
        for bracket in self.tax_rates["irpp_brackets"]:
            if taxable_income <= bracket["min"]:
                break
            
            bracket_income = min(taxable_income, bracket["max"]) - bracket["min"]
            if bracket_income > 0:
                tax += bracket_income * bracket["rate"]
        
        return tax