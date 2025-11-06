import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
from typing import Optional
import os
from io import BytesIO

class EmailService:
    """Service d'envoi d'emails pour les bulletins de paie"""
    
    def __init__(self):
        self.smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_username = os.getenv("SMTP_USERNAME", "")
        self.smtp_password = os.getenv("SMTP_PASSWORD", "")
        self.from_email = os.getenv("FROM_EMAIL", "noreply@novacore.com")
    
    def send_payslip_email(self, 
                          to_email: str, 
                          employee_name: str, 
                          period: str, 
                          pdf_buffer: BytesIO) -> bool:
        """Envoie un bulletin de paie par email"""
        
        try:
            # Création du message
            msg = MIMEMultipart()
            msg['From'] = self.from_email
            msg['To'] = to_email
            msg['Subject'] = f"Bulletin de paie - {period}"
            
            # Corps du message
            body = f"""
            Bonjour {employee_name},
            
            Veuillez trouver ci-joint votre bulletin de paie pour la période {period}.
            
            Cordialement,
            L'équipe RH NovaCore
            """
            
            msg.attach(MIMEText(body, 'plain', 'utf-8'))
            
            # Pièce jointe PDF
            pdf_buffer.seek(0)
            pdf_attachment = MIMEApplication(pdf_buffer.read(), _subtype='pdf')
            pdf_attachment.add_header(
                'Content-Disposition', 
                'attachment', 
                filename=f'bulletin_paie_{employee_name.replace(" ", "_")}_{period}.pdf'
            )
            msg.attach(pdf_attachment)
            
            # Envoi de l'email (simulation en développement)
            if os.getenv("ENVIRONMENT") == "development":
                print(f"[SIMULATION] Email envoyé à {to_email} pour {employee_name}")
                return True
            
            # Envoi réel en production
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.smtp_username, self.smtp_password)
            server.send_message(msg)
            server.quit()
            
            return True
            
        except Exception as e:
            print(f"Erreur envoi email: {e}")
            return False