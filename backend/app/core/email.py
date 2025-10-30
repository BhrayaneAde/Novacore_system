import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List, Optional
import logging

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self):
        self.smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_user = os.getenv("SMTP_USER")
        self.smtp_password = os.getenv("SMTP_PASSWORD")
        self.from_email = os.getenv("SMTP_FROM_EMAIL")
        self.from_name = os.getenv("SMTP_FROM_NAME", "NovaCore")
        self.frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
        
    def get_frontend_url(self):
        """Récupère l'URL du frontend depuis les variables d'environnement"""
        return self.frontend_url

    def send_email(self, to_email: str, subject: str, html_content: str, text_content: str = None):
        """Envoie un email via SMTP"""
        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = f"{self.from_name} <{self.from_email}>"
            msg['To'] = to_email

            if text_content:
                msg.attach(MIMEText(text_content, 'plain', 'utf-8'))
            msg.attach(MIMEText(html_content, 'html', 'utf-8'))

            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_user, self.smtp_password)
                server.send_message(msg)
            
            logger.info(f"Email envoyé à {to_email}")
            return True
        except Exception as e:
            logger.error(f"Erreur envoi email à {to_email}: {e}")
            return False

    def send_invitation_email(self, to_email: str, first_name: str, last_name: str, 
                            company_name: str, role: str, invitation_token: str, company_logo: str = None):
        """Envoie un email d'invitation"""
        invitation_link = f"{self.frontend_url}/accept-invitation?token={invitation_token}"
        
        subject = f"Invitation à rejoindre {company_name} sur NovaCore"
        
        logo_section = f'<img src="{company_logo}" alt="Logo {company_name}" style="height: 40px; margin-bottom: 20px;" />' if company_logo else ''
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #f59e0b 0%, #055169 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                .button {{ display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #055169 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                .footer {{ text-align: center; margin-top: 30px; color: #666; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    {logo_section}
                    <h1>🎉 Bienvenue sur NovaCore !</h1>
                </div>
                <div class="content">
                    <p>Bonjour <strong>{first_name} {last_name}</strong>,</p>
                    
                    <p>Vous avez été invité(e) à rejoindre <strong>{company_name}</strong> sur NovaCore en tant que <strong>{role}</strong>.</p>
                    
                    <p>NovaCore est la plateforme de gestion RH qui va simplifier votre quotidien professionnel :</p>
                    <ul>
                        <li>✅ Gestion des congés et absences</li>
                        <li>✅ Suivi des tâches et projets</li>
                        <li>✅ Évaluations de performance</li>
                        <li>✅ Communication d'équipe</li>
                    </ul>
                    
                    <p>Cliquez sur le bouton ci-dessous pour créer votre mot de passe et accéder à votre espace :</p>
                    
                    <div style="text-align: center;">
                        <a href="{invitation_link}" class="button">Créer mon compte</a>
                    </div>
                    
                    <p><small>Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br>
                    <a href="{invitation_link}">{invitation_link}</a></small></p>
                    
                    <p>À bientôt sur NovaCore ! 🚀</p>
                </div>
                <div class="footer">
                    <p>Cet email a été envoyé par {company_name} via NovaCore</p>
                </div>
            </div>
            <!-- Pixel de tracking -->
            <img src="{self.frontend_url.replace('5173', '8000')}/api/v1/email/track/{invitation_token}" width="1" height="1" style="display:none;" />
        </body>
        </html>
        """
        
        text_content = f"""
        Bonjour {first_name} {last_name},
        
        Vous avez été invité(e) à rejoindre {company_name} sur NovaCore en tant que {role}.
        
        Cliquez sur ce lien pour créer votre compte : {invitation_link}
        
        À bientôt sur NovaCore !
        """
        
        return self.send_email(to_email, subject, html_content, text_content)

    def send_welcome_email(self, to_email: str, first_name: str, company_name: str):
        """Envoie un email de bienvenue après inscription"""
        subject = f"Bienvenue sur NovaCore, {first_name} !"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 Félicitations {first_name} !</h1>
                </div>
                <div class="content">
                    <p>Votre entreprise <strong>{company_name}</strong> est maintenant configurée sur NovaCore.</p>
                    
                    <p>Vous pouvez maintenant :</p>
                    <ul>
                        <li>✅ Inviter vos employés</li>
                        <li>✅ Configurer vos départements</li>
                        <li>✅ Gérer les tâches et projets</li>
                        <li>✅ Suivre les performances</li>
                    </ul>
                    
                    <p>Connectez-vous à votre tableau de bord : <a href="{self.frontend_url}/login">{self.frontend_url}/login</a></p>
                </div>
            </div>
        </body>
        </html>
        """
        
        return self.send_email(to_email, subject, html_content)

    def send_password_reset_email(self, to_email: str, first_name: str, reset_link: str, company_logo: str = None):
        """Envoie un email de réinitialisation de mot de passe"""
        subject = "Réinitialisation de votre mot de passe NovaCore"
        
        logo_section = f'<img src="{company_logo}" alt="Logo" style="height: 40px; margin-bottom: 20px;" />' if company_logo else ''
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #f59e0b 0%, #055169 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                .button {{ display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #055169 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                .warning {{ background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    {logo_section}
                    <h1>🔒 Réinitialisation de mot de passe</h1>
                </div>
                <div class="content">
                    <p>Bonjour <strong>{first_name}</strong>,</p>
                    
                    <p>Vous avez demandé la réinitialisation de votre mot de passe NovaCore.</p>
                    
                    <p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
                    
                    <div style="text-align: center;">
                        <a href="{reset_link}" class="button">Réinitialiser mon mot de passe</a>
                    </div>
                    
                    <div class="warning">
                        <p><strong>⚠️ Important :</strong></p>
                        <ul>
                            <li>Ce lien expire dans <strong>1 heure</strong></li>
                            <li>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email</li>
                            <li>Ne partagez jamais ce lien avec personne</li>
                        </ul>
                    </div>
                    
                    <p><small>Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br>
                    <a href="{reset_link}">{reset_link}</a></small></p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_content = f"""
        Bonjour {first_name},
        
        Vous avez demandé la réinitialisation de votre mot de passe NovaCore.
        
        Cliquez sur ce lien pour créer un nouveau mot de passe : {reset_link}
        
        Ce lien expire dans 1 heure.
        
        Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
        """
        
        return self.send_email(to_email, subject, html_content, text_content)

# Instance globale
email_service = EmailService()