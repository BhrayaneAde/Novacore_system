from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.graphics.shapes import Drawing, Rect
from io import BytesIO
import base64
from datetime import datetime

class PayslipGenerator:
    def __init__(self, company_info):
        self.company_info = company_info
        self.styles = getSampleStyleSheet()
        
    def generate_payslip(self, employee_data, payroll_data, period):
        """Génère un bulletin de paie PDF selon le modèle béninois"""
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=1*cm, bottomMargin=1*cm)
        
        story = []
        
        # En-tête avec logos (simulé)
        header_data = [[
            f"RÉPUBLIQUE DU BÉNIN\n{self.company_info.get('name', 'ENTREPRISE')}\nAdresse: {self.company_info.get('address', '')}",
            "DIRECTION GÉNÉRALE DU TRÉSOR\nET DE LA COMPTABILITÉ PUBLIQUE\nBP: 48 COTONOU - ROUTE DE L'AÉROPORT"
        ]]
        
        header_table = Table(header_data, colWidths=[9*cm, 9*cm])
        header_table.setStyle(TableStyle([
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('ALIGN', (0, 0), (0, 0), 'LEFT'),
            ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ]))
        story.append(header_table)
        story.append(Spacer(1, 20))
        
        # Titre BULLETIN DE PAIE
        title_style = ParagraphStyle('Title', fontSize=16, alignment=1, spaceAfter=10, fontName='Helvetica-Bold')
        story.append(Paragraph("<b>BULLETIN DE PAIE</b>", title_style))
        
        # Période
        period_style = ParagraphStyle('Period', fontSize=12, alignment=1, spaceAfter=20)
        story.append(Paragraph(f"Salaire de : {period}", period_style))
        story.append(Spacer(1, 10))
        
        # Informations employé dans un cadre
        emp_info = f"""
        N° Matricule: {employee_data.get('id', 'N/A')}    Grade: {employee_data.get('grade', 'N/A')}    N°: {employee_data.get('id', 'N/A')}    Ech: {employee_data.get('level', 'N/A')}    NB Mois: 1    Indic.
        
        CORPS: {employee_data.get('department', 'N/A')}
        
        FONCTION: {employee_data.get('role', 'AGENT')}
        
        DIRECTION: {self.company_info.get('name', 'ENTREPRISE')}
        """
        
        emp_data = [[emp_info]]
        emp_table = Table(emp_data, colWidths=[18*cm])
        emp_table.setStyle(TableStyle([
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('LEFTPADDING', (0, 0), (-1, -1), 10),
            ('RIGHTPADDING', (0, 0), (-1, -1), 10),
            ('TOPPADDING', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ]))
        story.append(emp_table)
        story.append(Spacer(1, 15))
        
        # Tableau des éléments de paie selon le modèle béninois
        payroll_breakdown = payroll_data.get('breakdown', {})
        
        pay_data = [
            ['Code', 'Élément payé', 'Gain', 'Retenue', 'Rappel'],
            ['111N', 'SOLDE BRUTE', f"{payroll_breakdown.get('base_salary', 0):,.0f}", '', ''],
            ['202N', 'IND. LOGEMENT', f"{payroll_breakdown.get('prime_transport', 0):,.0f}", '', ''],
            ['203N', 'IND. RÉSIDENCE', f"{payroll_breakdown.get('custom_allowances', 0):,.0f}", '', ''],
            ['569N', 'IND LOGEMENT 3', '', '', ''],
            ['562N', 'IND LOGEMENT ENSEIGNTS', '', '', ''],
            ['541N', 'RISQUE ENSEIGNANTS', '', '', ''],
            ['856C', 'TPS', '', f"{payroll_breakdown.get('cnss_employee', 0):,.0f}", ''],
            ['532C', 'VERSEMENT PATRONAL SUR SALAIRE', '', f"{payroll_breakdown.get('cnss_employer', 0):,.0f}", ''],
            ['60P015', 'PRIME DE JOURNEE PEDAGOGIQUE', '', '', ''],
            ['990N', 'SURSALAIRE', '', '', ''],
            ['60P019', 'PRIME DE RENDEMENT', '', '', ''],
            ['830C', 'FONDS NAT DE RET PART OUVR', '', f"{int(payroll_breakdown.get('cnss_employee', 0) * 0.1):,.0f}", ''],
            ['831C', 'FONDS NAT DE RET PART PATRONA', '', f"{int(payroll_breakdown.get('cnss_employer', 0) * 0.1):,.0f}", ''],
            ['60P014', 'PRIME DE RENTREE', '', '', ''],
            ['706N', 'ALLOCATION FAMILIALE', f"{employee_data.get('children_count', 0) * 2500:,.0f}", '', ''],
            ['905N', 'SALAIRE DU MOIS', f"{payroll_data.get('net_salary', 0):,.0f}", '', '']
        ]
        
        pay_table = Table(pay_data, colWidths=[2*cm, 8*cm, 3*cm, 3*cm, 2*cm])
        pay_table.setStyle(TableStyle([
            ('FONTSIZE', (0, 0), (-1, -1), 8),
            ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.black),
            ('ALIGN', (2, 0), (-1, -1), 'RIGHT'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ]))
        story.append(pay_table)
        story.append(Spacer(1, 15))
        
        # Période et totaux
        period_data = [[
            f"Période du 01/{period[-2:]}/{period[:4]} au 31/{period[-2:]}/{period[:4]}"
        ]]
        period_table = Table(period_data, colWidths=[18*cm])
        period_table.setStyle(TableStyle([
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ]))
        story.append(period_table)
        story.append(Spacer(1, 10))
        
        # Résumé final
        summary_data = [[
            'Salaire du mois',
            f"{payroll_data.get('net_salary', 0):,.0f}",
            'Rappel',
            '',
            'Net à payer',
            f"{payroll_data.get('net_salary', 0):,.0f}"
        ]]
        
        summary_table = Table(summary_data, colWidths=[3*cm, 3*cm, 3*cm, 3*cm, 3*cm, 3*cm])
        summary_table.setStyle(TableStyle([
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
            ('ALIGN', (5, 0), (5, 0), 'RIGHT'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
        ]))
        story.append(summary_table)
        story.append(Spacer(1, 10))
        
        # Montant en lettres
        amount_text = f"Montant: Trois Cent Trente-neuf Mille Huit Cent Vingt-trois Francs CFA"
        story.append(Paragraph(amount_text, self.styles['Normal']))
        story.append(Spacer(1, 20))
        
        # Zone informations complémentaires
        info_data = [['Informations complémentaires:']]
        info_table = Table(info_data, colWidths=[18*cm], rowHeights=[3*cm])
        info_table.setStyle(TableStyle([
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ]))
        story.append(info_table)
        
        doc.build(story)
        buffer.seek(0)
        return buffer.getvalue()
    
    def generate_payroll_journal(self, payroll_records, period):
        """Génère le journal de paie"""
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4)
        
        story = []
        
        # Titre
        title_style = ParagraphStyle('Title', fontSize=16, alignment=1, spaceAfter=20)
        story.append(Paragraph(f"<b>JOURNAL DE PAIE - {period}</b>", title_style))
        story.append(Spacer(1, 20))
        
        # Tableau récapitulatif
        journal_data = [['Employé', 'Brut', 'CNSS Emp.', 'IRPP', 'Net', 'CNSS Pat.', 'Coût Total']]
        
        totals = {'brut': 0, 'cnss_emp': 0, 'irpp': 0, 'net': 0, 'cnss_pat': 0, 'cout': 0}
        
        for record in payroll_records:
            breakdown = record.get('salary_breakdown', {})
            journal_data.append([
                record['employee_name'][:20],
                f"{record['gross_salary']:,.0f}",
                f"{breakdown.get('cnss_employee', 0):,.0f}",
                f"{record['tax_amount']:,.0f}",
                f"{record['net_salary']:,.0f}",
                f"{breakdown.get('cnss_employer', 0):,.0f}",
                f"{breakdown.get('cout_total', 0):,.0f}"
            ])
            
            totals['brut'] += record['gross_salary']
            totals['cnss_emp'] += breakdown.get('cnss_employee', 0)
            totals['irpp'] += record['tax_amount']
            totals['net'] += record['net_salary']
            totals['cnss_pat'] += breakdown.get('cnss_employer', 0)
            totals['cout'] += breakdown.get('cout_total', 0)
        
        # Ligne totaux
        journal_data.append([
            'TOTAUX',
            f"{totals['brut']:,.0f}",
            f"{totals['cnss_emp']:,.0f}",
            f"{totals['irpp']:,.0f}",
            f"{totals['net']:,.0f}",
            f"{totals['cnss_pat']:,.0f}",
            f"{totals['cout']:,.0f}"
        ])
        
        journal_table = Table(journal_data, colWidths=[4*cm, 2.5*cm, 2*cm, 2*cm, 2.5*cm, 2*cm, 2.5*cm])
        journal_table.setStyle(TableStyle([
            ('FONTSIZE', (0, 0), (-1, -1), 8),
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('BACKGROUND', (0, -1), (-1, -1), colors.lightgrey),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.black),
            ('ALIGN', (1, 0), (-1, -1), 'RIGHT'),
        ]))
        story.append(journal_table)
        
        doc.build(story)
        buffer.seek(0)
        return buffer.getvalue()