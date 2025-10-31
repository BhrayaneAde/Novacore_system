from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
import imaplib
import email
import base64
import re
import smtplib
from datetime import datetime

from app.db.database import get_db
from app.core.auth import get_current_user
from app.db.models import User, Candidate, Department, CandidateStatus

router = APIRouter()

# Mots-clés pour classification automatique
DEPARTMENT_KEYWORDS = {
    "informatique": ["développeur", "dev", "programmeur", "tech", "it", "software", "backend", "frontend", "fullstack", "data", "devops"],
    "marketing": ["marketing", "communication", "digital", "social media", "seo", "content", "brand"],
    "commercial": ["commercial", "vente", "sales", "business", "account", "client"],
    "rh": ["rh", "ressources humaines", "hr", "recrutement", "talent"],
    "finance": ["finance", "comptable", "comptabilité", "audit", "contrôle", "budget"],
    "design": ["design", "graphique", "ui", "ux", "créatif", "artistique"],
    "juridique": ["juridique", "legal", "droit", "avocat", "compliance"]
}



@router.post("/test-email")
async def test_email(
    email_address: str = "awarrisw@gmail.com",
    password: str = "zjcuqitovwjpfuqb",
    imap_server: str = "imap.gmail.com",
    imap_port: int = 993
):
    """Test endpoint pour envoyer un email d'exemple sans authentification"""
    # Test de connexion IMAP
    try:
        mail = imaplib.IMAP4_SSL(imap_server, imap_port)
        mail.login(email_address, password)
        mail.logout()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Connexion IMAP échouée: {str(e)}")
    
    # Envoyer un email d'exemple de candidature pour tester
    try:
        smtp_server = smtplib.SMTP('smtp.gmail.com', 587)
        smtp_server.starttls()
        smtp_server.login(email_address, password)
        
        # Email d'exemple de candidature
        subject = "Candidature - Poste de Designer UI/UX"
        body = f"""Bonjour,

Je me permets de vous adresser ma candidature pour le poste de Designer UI/UX au sein de votre entreprise.

Nom: Marie Dubois
Téléphone: 06 12 34 56 78
Expérience: 3 ans en design d'interfaces

Passionnée par le design centré utilisateur, j'aimerais contribuer à vos projets créatifs.

Cordialement,
Marie Dubois
marie.dubois@example.com"""
        
        msg = f"Subject: {subject}\r\n\r\n{body}"
        smtp_server.sendmail(email_address, email_address, msg.encode('utf-8'))
        smtp_server.quit()
        
        print(f"Email d'exemple envoyé à {email_address}")
    except Exception as e:
        print(f"Erreur envoi email d'exemple: {e}")
    
    return {
        "status": "success",
        "email": email_address,
        "message": "Email d'exemple de candidature envoyé avec succès !"
    }

@router.post("/configure-email")
async def configure_email(
    email_address: str,
    password: str,
    imap_server: str = "imap.gmail.com",
    imap_port: int = 993,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Configurer et tester la connexion email"""
    
    # Test de connexion IMAP
    try:
        mail = imaplib.IMAP4_SSL(imap_server, imap_port)
        mail.login(email_address, password)
        mail.logout()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Connexion IMAP échouée: {str(e)}")
    
    # Envoyer un email d'exemple de candidature pour tester
    try:
        smtp_server = smtplib.SMTP('smtp.gmail.com', 587)
        smtp_server.starttls()
        smtp_server.login(email_address, password)
        
        # Email d'exemple de candidature
        subject = "Candidature - Poste de Designer UI/UX"
        body = f"""Bonjour,

Je me permets de vous adresser ma candidature pour le poste de Designer UI/UX au sein de votre entreprise.

Nom: Marie Dubois
Téléphone: 06 12 34 56 78
Expérience: 3 ans en design d'interfaces

Passionnée par le design centré utilisateur, j'aimerais contribuer à vos projets créatifs.

Cordialement,
Marie Dubois
marie.dubois@example.com"""
        
        msg = f"Subject: {subject}\r\n\r\n{body}"
        smtp_server.sendmail(email_address, email_address, msg.encode('utf-8'))
        smtp_server.quit()
        
        print(f"Email d'exemple envoyé à {email_address}")
    except Exception as e:
        print(f"Erreur envoi email d'exemple: {e}")
    
    return {
        "status": "configured",
        "email": email_address,
        "server": imap_server,
        "message": "Configuration réussie ! Email d'exemple de candidature envoyé pour test."
    }

@router.post("/search-candidates")
async def search_candidates(
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Recherche intelligente des candidatures dans les emails"""
    try:
        # Récupérer la configuration email (pour l'instant en dur)
        email_config = {
            "email": "yenfreudel01@gmail.com",
            "password": "booo sbej vykx lliq",
            "server": "imap.gmail.com",
            "port": 993
        }
        
        # Connexion IMAP
        mail = imaplib.IMAP4_SSL(email_config["server"], email_config["port"])
        mail.login(email_config["email"], email_config["password"])
        mail.select('inbox')
        
        # Rechercher les emails avec "candidature" dans le sujet
        status, messages = mail.search(None, 'SUBJECT "candidature"')
        email_ids = messages[0].split()
        
        processed_count = 0
        departments = db.query(Department).filter(Department.company_id == current_user.company_id).all()
        
        if not departments:
            mail.logout()
            return {
                "status": "error",
                "processed": 0,
                "message": "Aucun département trouvé. Créez d'abord des départements."
            }
        
        # Traiter les 5 derniers emails
        for email_id in email_ids[-5:]:
            try:
                status, msg_data = mail.fetch(email_id, '(RFC822)')
                email_body = msg_data[0][1]
                email_message = email.message_from_bytes(email_body)
                
                subject = email_message['subject'] or ""
                from_email = email_message['from'] or ""
                
                # Extraire l'adresse email
                email_match = re.search(r'<(.+?)>', from_email)
                sender_email = email_match.group(1) if email_match else from_email
                
                # Extraire le contenu
                content = ""
                if email_message.is_multipart():
                    for part in email_message.walk():
                        if part.get_content_type() == "text/plain":
                            content = part.get_payload(decode=True).decode('utf-8', errors='ignore')
                            break
                else:
                    content = email_message.get_payload(decode=True).decode('utf-8', errors='ignore')
                
                # Vérifier si le candidat existe déjà
                existing = db.query(Candidate).filter(
                    Candidate.email == sender_email,
                    Candidate.company_id == current_user.company_id
                ).first()
                
                if not existing:
                    # Extraire les infos candidat
                    name_match = re.search(r'(?:je suis|nom|name)[\s:]*([A-Za-zÀ-ÿ\s]+)', content, re.IGNORECASE)
                    phone_match = re.search(r'(?:téléphone|phone|tel|mobile)[\s:]*([0-9\s\-\+\.]{10,})', content, re.IGNORECASE)
                    
                    candidate_name = name_match.group(1).strip() if name_match else sender_email.split('@')[0]
                    candidate_phone = phone_match.group(1).strip() if phone_match else None
                    
                    # Créer le candidat
                    candidate = Candidate(
                        name=candidate_name,
                        email=sender_email,
                        phone=candidate_phone,
                        position="Candidature par email",
                        department_id=departments[0].id,
                        company_id=current_user.company_id,
                        email_subject=subject,
                        email_content=content[:1000],  # Limiter à 1000 caractères
                        status=CandidateStatus.nouveau
                    )
                    
                    db.add(candidate)
                    processed_count += 1
                    
            except Exception as e:
                print(f"Erreur traitement email: {e}")
                continue
        
        mail.logout()
        db.commit()
        
        return {
            "status": "completed",
            "processed": processed_count,
            "message": f"{processed_count} nouvelles candidatures trouvées et ajoutées"
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erreur synchronisation: {str(e)}")

@router.get("/candidates")
async def get_candidates(
    department_id: Optional[int] = None,
    status: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Récupérer les candidatures"""
    query = db.query(Candidate).filter(Candidate.company_id == current_user.company_id)
    
    if department_id:
        query = query.filter(Candidate.department_id == department_id)
    if status:
        query = query.filter(Candidate.status == status)
    
    candidates = query.order_by(Candidate.received_at.desc()).all()
    
    result = []
    for candidate in candidates:
        result.append({
            "id": candidate.id,
            "name": candidate.name,
            "email": candidate.email,
            "phone": candidate.phone,
            "position": candidate.position,
            "status": candidate.status.value if candidate.status else CandidateStatus.nouveau.value,
            "department_id": candidate.department_id,
            "department": candidate.department.name if candidate.department else None,
            "received_at": candidate.received_at.isoformat() if candidate.received_at else None,
            "email_subject": candidate.email_subject,
            "cv_filename": candidate.cv_filename,
            "notes": candidate.notes
        })
    
    return {"candidates": result}

@router.put("/candidates/{candidate_id}/status")
async def update_candidate_status(
    candidate_id: int,
    status: str,
    notes: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mettre à jour le statut d'un candidat"""
    candidate = db.query(Candidate).filter(
        Candidate.id == candidate_id,
        Candidate.company_id == current_user.company_id
    ).first()
    
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidat non trouvé")
    
    try:
        candidate.status = CandidateStatus(status)
        if notes:
            candidate.notes = notes
        candidate.updated_at = datetime.utcnow()
        
        db.commit()
        
        return {
            "status": "updated",
            "candidate_id": candidate_id,
            "new_status": status
        }
    except ValueError:
        raise HTTPException(status_code=400, detail="Statut invalide")

@router.get("/candidates/{candidate_id}/cv")
async def get_candidate_cv(
    candidate_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Télécharger le CV d'un candidat"""
    candidate = db.query(Candidate).filter(
        Candidate.id == candidate_id,
        Candidate.company_id == current_user.company_id
    ).first()
    
    if not candidate or not candidate.cv_content:
        raise HTTPException(status_code=404, detail="CV non trouvé")
    
    return {
        "filename": candidate.cv_filename,
        "content": candidate.cv_content,
        "content_type": "application/pdf"
    }

@router.get("/stats")
async def get_recruitment_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Statistiques de recrutement"""
    total = db.query(Candidate).filter(Candidate.company_id == current_user.company_id).count()
    new = db.query(Candidate).filter(
        Candidate.company_id == current_user.company_id,
        Candidate.status == CandidateStatus.nouveau
    ).count()
    in_review = db.query(Candidate).filter(
        Candidate.company_id == current_user.company_id,
        Candidate.status == CandidateStatus.en_cours
    ).count()
    interview = db.query(Candidate).filter(
        Candidate.company_id == current_user.company_id,
        Candidate.status == CandidateStatus.entretien
    ).count()
    
    return {
        "total_candidates": total,
        "new_candidates": new,
        "in_review": in_review,
        "interviews": interview,
        "last_sync": datetime.utcnow().isoformat()
    }