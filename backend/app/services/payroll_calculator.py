from typing import Dict, List, Any
from decimal import Decimal, ROUND_HALF_UP

class PayrollCalculator:
    """Moteur de calcul de paie avec formules réelles IRPP et CNSS"""
    
    # Barème IRPP progressif (Sénégal 2024)
    IRPP_BRACKETS = [
        {"min": 0, "max": 630000, "rate": 0.0},
        {"min": 630000, "max": 1500000, "rate": 0.20},
        {"min": 1500000, "max": 4000000, "rate": 0.30},
        {"min": 4000000, "max": 8300000, "rate": 0.35},
        {"min": 8300000, "max": float('inf'), "rate": 0.40}
    ]
    
    # Taux CNSS
    CNSS_EMPLOYEE_RATE = 0.056  # 5.6%
    CNSS_EMPLOYER_RATE = 0.084  # 8.4%
    CNSS_MAX_SALARY = 1800000   # Plafond CNSS
    
    # Autres taux
    ACCIDENT_WORK_RATE = 0.01   # 1%
    FAMILY_ALLOWANCE_RATE = 0.07 # 7%
    
    def __init__(self):
        self.calculation_details = []
    
    def calculate_employee_payroll(self, employee_data: Dict) -> Dict[str, Any]:
        """Calcule la paie complète d'un employé"""
        
        base_salary = Decimal(str(employee_data.get('base_salary', 0)))
        overtime_hours = Decimal(str(employee_data.get('overtime_hours', 0)))
        overtime_rate = Decimal(str(employee_data.get('overtime_rate', 1.5)))
        absence_hours = Decimal(str(employee_data.get('absence_hours', 0)))
        monthly_hours = Decimal(str(employee_data.get('monthly_hours', 173.33)))
        
        # Calcul salaire brut
        hourly_rate = base_salary / monthly_hours
        overtime_amount = overtime_hours * hourly_rate * overtime_rate
        absence_deduction = absence_hours * hourly_rate
        
        gross_salary = base_salary + overtime_amount - absence_deduction
        
        # Calcul CNSS
        cnss_base = min(gross_salary, Decimal(str(self.CNSS_MAX_SALARY)))
        cnss_employee = self._round_amount(cnss_base * Decimal(str(self.CNSS_EMPLOYEE_RATE)))
        cnss_employer = self._round_amount(cnss_base * Decimal(str(self.CNSS_EMPLOYER_RATE)))
        
        # Calcul IRPP
        taxable_income = gross_salary - cnss_employee
        irpp_amount = self._calculate_irpp(taxable_income)
        
        # Autres déductions
        accident_work = self._round_amount(gross_salary * Decimal(str(self.ACCIDENT_WORK_RATE)))
        family_allowance = self._round_amount(gross_salary * Decimal(str(self.FAMILY_ALLOWANCE_RATE)))
        
        # Total déductions
        total_employee_deductions = cnss_employee + irpp_amount
        total_employer_charges = cnss_employer + accident_work + family_allowance
        
        # Salaire net
        net_salary = gross_salary - total_employee_deductions
        
        # Détails du calcul
        calculation_details = {
            "base_salary": float(base_salary),
            "overtime_amount": float(overtime_amount),
            "absence_deduction": float(absence_deduction),
            "gross_salary": float(gross_salary),
            "cnss_employee": float(cnss_employee),
            "cnss_employer": float(cnss_employer),
            "irpp_amount": float(irpp_amount),
            "accident_work": float(accident_work),
            "family_allowance": float(family_allowance),
            "total_employee_deductions": float(total_employee_deductions),
            "total_employer_charges": float(total_employer_charges),
            "net_salary": float(net_salary),
            "cost_to_company": float(gross_salary + total_employer_charges)
        }
        
        return calculation_details
    
    def _calculate_irpp(self, taxable_income: Decimal) -> Decimal:
        """Calcule l'IRPP selon le barème progressif"""
        
        if taxable_income <= 0:
            return Decimal('0')
        
        irpp_total = Decimal('0')
        remaining_income = taxable_income
        
        for bracket in self.IRPP_BRACKETS:
            bracket_min = Decimal(str(bracket["min"]))
            bracket_max = Decimal(str(bracket["max"]))
            bracket_rate = Decimal(str(bracket["rate"]))
            
            if remaining_income <= 0:
                break
            
            if taxable_income > bracket_min:
                taxable_in_bracket = min(remaining_income, bracket_max - bracket_min)
                if bracket_max != float('inf'):
                    taxable_in_bracket = min(taxable_in_bracket, bracket_max - bracket_min)
                
                bracket_tax = taxable_in_bracket * bracket_rate
                irpp_total += bracket_tax
                remaining_income -= taxable_in_bracket
        
        return self._round_amount(irpp_total)
    
    def _round_amount(self, amount: Decimal) -> Decimal:
        """Arrondit un montant à l'entier le plus proche"""
        return amount.quantize(Decimal('1'), rounding=ROUND_HALF_UP)
    
    def calculate_batch_payroll(self, employees_data: List[Dict]) -> Dict[str, Any]:
        """Calcule la paie pour plusieurs employés"""
        
        results = []
        totals = {
            "total_gross": 0,
            "total_net": 0,
            "total_cnss_employee": 0,
            "total_cnss_employer": 0,
            "total_irpp": 0,
            "total_cost_to_company": 0
        }
        
        for employee_data in employees_data:
            calculation = self.calculate_employee_payroll(employee_data)
            calculation["employee_id"] = employee_data.get("employee_id")
            calculation["employee_name"] = employee_data.get("employee_name")
            
            results.append(calculation)
            
            # Cumul des totaux
            totals["total_gross"] += calculation["gross_salary"]
            totals["total_net"] += calculation["net_salary"]
            totals["total_cnss_employee"] += calculation["cnss_employee"]
            totals["total_cnss_employer"] += calculation["cnss_employer"]
            totals["total_irpp"] += calculation["irpp_amount"]
            totals["total_cost_to_company"] += calculation["cost_to_company"]
        
        return {
            "calculations": results,
            "totals": totals,
            "employees_count": len(results)
        }
    
    def get_irpp_breakdown(self, taxable_income: float) -> List[Dict]:
        """Retourne le détail du calcul IRPP par tranche"""
        
        taxable = Decimal(str(taxable_income))
        breakdown = []
        remaining = taxable
        
        for i, bracket in enumerate(self.IRPP_BRACKETS):
            if remaining <= 0:
                break
                
            bracket_min = Decimal(str(bracket["min"]))
            bracket_max = Decimal(str(bracket["max"]))
            bracket_rate = Decimal(str(bracket["rate"]))
            
            if taxable > bracket_min:
                if bracket_max == float('inf'):
                    taxable_in_bracket = remaining
                else:
                    taxable_in_bracket = min(remaining, bracket_max - bracket_min)
                
                bracket_tax = taxable_in_bracket * bracket_rate
                
                breakdown.append({
                    "tranche": i + 1,
                    "min": float(bracket_min),
                    "max": float(bracket_max) if bracket_max != float('inf') else None,
                    "rate": float(bracket_rate * 100),
                    "taxable_amount": float(taxable_in_bracket),
                    "tax_amount": float(bracket_tax)
                })
                
                remaining -= taxable_in_bracket
        
        return breakdown