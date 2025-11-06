from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.pdfgen import canvas
from io import BytesIO
from datetime import datetime
from typing import Dict, Any

class PayslipPDFGenerator:
    """Générateur de bulletins de paie en PDF"""
    
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self.title_style = ParagraphStyle(
            'CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=16,
            spaceAfter=30,
            alignment=1  # Center
        )
        
    def generate_payslip_pdf(self, payslip_data: Dict[str, Any]) -> BytesIO:
        """Génère un bulletin de paie en PDF"""
        
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=2*cm, leftMargin=2*cm, 
                               topMargin=2*cm, bottomMargin=2*cm)
        
        story = []
        
        # En-tête avec logo (simulation)
        header_data = [
            ["NOVACORE SARL", "BULLETIN DE PAIE"],
            ["Système de Gestion RH", f"Période: {self._format_period(payslip_data.get('period', ''))}"],
            ["Dakar, Sénégal", f"Généré le: {datetime.now().strftime('%d/%m/%Y')}"]
        ]
        
        header_table = Table(header_data, colWidths=[8*cm, 8*cm])
        header_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.darkblue),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.whitesmoke),
            ('ALIGN', (0, 0), (0, -1), 'LEFT'),
            ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 14),
            ('FONTSIZE', (0, 1), (-1, -1), 10),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('TOPPADDING', (0, 0), (-1, -1), 8)
        ]))
        
        story.append(header_table)
        story.append(Spacer(1, 0.5*cm))
        
        # Informations entreprise et employé
        company_employee_data = [
            ["ENTREPRISE", "EMPLOYÉ"],
            ["NovaCore SARL", payslip_data.get('employee_name', 'N/A')],
            ["Dakar, Sénégal", f"ID: {payslip_data.get('employee_id', 'N/A')}"],
            ["NINEA: 123456789", f"Période: {self._format_period(payslip_data.get('period', ''))}"]
        ]
        
        company_employee_table = Table(company_employee_data, colWidths=[8*cm, 8*cm])
        company_employee_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        story.append(company_employee_table)
        story.append(Spacer(1, 1*cm))
        
        # Détails du salaire
        salary_data = [
            ["ÉLÉMENTS", "BASE", "TAUX", "MONTANT"],
            ["Salaire de base", f"{payslip_data.get('base_salary', 0):,.0f}", "100%", f"{payslip_data.get('base_salary', 0):,.0f}"],
        ]
        
        # Ajout heures supplémentaires si présentes
        if payslip_data.get('overtime_amount', 0) > 0:
            salary_data.append([
                "Heures supplémentaires", 
                f"{payslip_data.get('overtime_hours', 0)} h", 
                "150%", 
                f"{payslip_data.get('overtime_amount', 0):,.0f}"
            ])
        
        # Ajout déduction absences si présentes
        if payslip_data.get('absence_deduction', 0) > 0:
            salary_data.append([
                "Déduction absences", 
                f"{payslip_data.get('absence_hours', 0)} h", 
                "-100%", 
                f"-{payslip_data.get('absence_deduction', 0):,.0f}"
            ])
        
        salary_data.append([
            "SALAIRE BRUT", "", "", f"{payslip_data.get('gross_salary', 0):,.0f}"
        ])
        
        salary_table = Table(salary_data, colWidths=[6*cm, 3*cm, 2*cm, 5*cm])
        salary_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.darkblue),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, -1), (-1, -1), colors.lightblue),
            ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        story.append(salary_table)
        story.append(Spacer(1, 0.5*cm))
        
        # Déductions
        deductions_data = [
            ["DÉDUCTIONS", "BASE", "TAUX", "MONTANT"],
            ["CNSS Employé", f"{min(payslip_data.get('gross_salary', 0), 1800000):,.0f}", "5.6%", f"{payslip_data.get('cnss_employee', 0):,.0f}"],
            ["IRPP", f"{payslip_data.get('gross_salary', 0) - payslip_data.get('cnss_employee', 0):,.0f}", "Variable", f"{payslip_data.get('irpp_amount', 0):,.0f}"],
            ["TOTAL DÉDUCTIONS", "", "", f"{payslip_data.get('total_employee_deductions', 0):,.0f}"]
        ]
        
        deductions_table = Table(deductions_data, colWidths=[6*cm, 3*cm, 2*cm, 5*cm])
        deductions_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.darkred),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, -1), (-1, -1), colors.lightcoral),
            ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        story.append(deductions_table)
        story.append(Spacer(1, 0.5*cm))
        
        # Charges patronales
        employer_data = [
            ["CHARGES PATRONALES", "BASE", "TAUX", "MONTANT"],
            ["CNSS Employeur", f"{min(payslip_data.get('gross_salary', 0), 1800000):,.0f}", "8.4%", f"{payslip_data.get('cnss_employer', 0):,.0f}"],
            ["Accident du travail", f"{payslip_data.get('gross_salary', 0):,.0f}", "1%", f"{payslip_data.get('accident_work', 0):,.0f}"],
            ["Allocations familiales", f"{payslip_data.get('gross_salary', 0):,.0f}", "7%", f"{payslip_data.get('family_allowance', 0):,.0f}"],
            ["TOTAL CHARGES", "", "", f"{payslip_data.get('total_employer_charges', 0):,.0f}"]
        ]
        
        employer_table = Table(employer_data, colWidths=[6*cm, 3*cm, 2*cm, 5*cm])
        employer_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.darkorange),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, -1), (-1, -1), colors.orange),
            ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        story.append(employer_table)
        story.append(Spacer(1, 1*cm))
        
        # Résumé final
        summary_data = [
            ["SALAIRE BRUT", f"{payslip_data.get('gross_salary', 0):,.0f} FCFA"],
            ["TOTAL DÉDUCTIONS", f"-{payslip_data.get('total_employee_deductions', 0):,.0f} FCFA"],
            ["SALAIRE NET À PAYER", f"{payslip_data.get('net_salary', 0):,.0f} FCFA"],
            ["COÛT TOTAL EMPLOYEUR", f"{payslip_data.get('cost_to_company', 0):,.0f} FCFA"]
        ]
        
        summary_table = Table(summary_data, colWidths=[10*cm, 6*cm])
        summary_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -2), colors.lightgrey),
            ('BACKGROUND', (0, -2), (-1, -2), colors.darkgreen),
            ('TEXTCOLOR', (0, -2), (-1, -2), colors.whitesmoke),
            ('BACKGROUND', (0, -1), (-1, -1), colors.lightyellow),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, -2), (-1, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, -2), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        story.append(summary_table)
        story.append(Spacer(1, 1*cm))
        
        # Pied de page
        footer_text = f"Bulletin généré le {datetime.now().strftime('%d/%m/%Y à %H:%M')}"
        story.append(Paragraph(footer_text, self.styles['Normal']))
        
        doc.build(story)
        buffer.seek(0)
        return buffer
    
    def _format_period(self, period: str) -> str:
        """Formate la période pour l'affichage"""
        try:
            year, month = period.split('-')
            months = {
                '01': 'Janvier', '02': 'Février', '03': 'Mars', '04': 'Avril',
                '05': 'Mai', '06': 'Juin', '07': 'Juillet', '08': 'Août',
                '09': 'Septembre', '10': 'Octobre', '11': 'Novembre', '12': 'Décembre'
            }
            return f"{months.get(month, month)} {year}"
        except:
            return period