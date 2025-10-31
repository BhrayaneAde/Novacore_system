from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
import imaplib
import email
import base64
import re
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

def classify_department(subject: str, content: str, departments: List[Department]) -> Optional[int]:
    """Classifier automatiquement le département basé sur le contenu"""
    text = f"{subject} {content}".lower()
    
    # Scores par département
    dept_scores = {}
    for dept in departments:
        dept_name = dept.name.lower()
        score = 0
        
        # Score basé sur le nom du département
        if dept_name in text:
            score += 10
            
        # Score basé sur les mots-clés
        for keyword_dept, keywords in DEPARTMENT_KEYWORDS.items():
            if keyword_dept in dept_name or dept_name in keyword_dept:
                for keyword in keywords:
                    if keyword in text:
                        score += 1
        
        if score > 0:
            dept_scores[dept.id] = score
    
    # Retourner le département avec le meilleur score
    if dept_scores:
        return max(dept_scores.items(), key=lambda x: x[1])[0]
    
    # Par défaut, retourner le premier département
    return departments[0].id if departments else None

def extract_candidate_info(email_content: str, subject: str) -> dict:
    """Extraire les informations du candidat depuis l'email"""
    # Extraction basique du nom et téléphone
    name_match = re.search(r'(?:je suis|nom|name|candidat|candidate)[\s:]*([A-Za-zÀ-ÿ\s]+)', email_content, re.IGNORECASE)
    phone_match = re.search(r'(?:téléphone|phone|tel|mobile)[\s:]*([0-9\s\-\+\.]{10,})', email_content, re.IGNORECASE)
    
    # Extraction du poste depuis le sujet
    position_match = re.search(r'(?:candidature|poste|position)[\s\-:]*(.+?)(?:\s|$)', subject, re.IGNORECASE)
    
    return {
        "name": name_match.group(1).strip() if name_match else "Candidat Inconnu",
        "phone": phone_match.group(1).strip() if phone_match else None,
        "position": position_match.group(1).strip() if position_match else "Poste non spécifié"
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
    """Configurer l'email de recrutement"""
    # Test de connexion IMAP
    try:
        mail = imaplib.IMAP4_SSL(imap_server, imap_port)
        mail.login(email_address, password)
        mail.logout()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Connexion email échouée: {str(e)}")
    
    # Sauvegarder la configuration (en production, chiffrer le mot de passe)
    # Pour la démo, on simule la sauvegarde
    return {
        "status": "configured",
        "email": email_address,
        "server": imap_server,
        "message": "Configuration email sauvegardée avec succès"
    }

@router.post("/sync-emails")
async def sync_emails(
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Synchroniser les emails et traiter les candidatures"""
    from app.services.email_surveillance import email_surveillance_service
    
    # Simulation de la synchronisation
    departments = db.query(Department).filter(Department.company_id == current_user.company_id).all()
    
    # Candidatures simulées reçues par email
    simulated_emails = [
        {
            "subject": "Candidature - Développeur Backend Python",
            "from": "jean.dupont@email.com",
            "content": "Bonjour, je suis Jean Dupont, développeur Python avec 3 ans d'expérience. Téléphone: 06.12.34.56.78",
            "attachments": [{"filename": "CV_Jean_Dupont.pdf", "content": "base64_cv_content"}]
        },
        {
            "subject": "Candidature Marketing Digital",
            "from": "marie.martin@email.com", 
            "content": "Bonjour, je candidate pour le poste de Marketing Digital. Je suis Marie Martin, spécialisée en SEO.",
            "attachments": [{"filename": "CV_Marie_Martin.pdf", "content": "base64_cv_content"}]
        }
    ]
    
    processed_count = 0
    for email_data in simulated_emails:
        # Vérifier si l'email correspond à une offre d'emploi surveillée
        matching_jobs = email_surveillance_service.check_email_matches_job(
            email_data["subject"], email_data["content"]
        )
        
        # Extraire les infos candidat
        candidate_info = extract_candidate_info(email_data["content"], email_data["subject"])
        
        # Classifier le département
        dept_id = classify_department(email_data["subject"], email_data["content"], departments)
        
        # Vérifier si le candidat existe déjà
        existing = db.query(Candidate).filter(
            Candidate.email == email_data["from"],
            Candidate.company_id == current_user.company_id
        ).first()
        
        if not existing:
            # Associer à la première offre d'emploi correspondante
            job_opening_id = matching_jobs[0] if matching_jobs else None
            
            # Créer nouveau candidat
            candidate = Candidate(
                name=candidate_info["name"],
                email=email_data["from"],
                phone=candidate_info["phone"],
                position=candidate_info["position"],
                department_id=dept_id,
                company_id=current_user.company_id,
                email_subject=email_data["subject"],
                email_content=email_data["content"],
                cv_filename=email_data["attachments"][0]["filename"] if email_data["attachments"] else None,
                cv_content=email_data["attachments"][0]["content"] if email_data["attachments"] else None,
                status=CandidateStatus.NEW,
                job_opening_id=job_opening_id
            )
            
            db.add(candidate)
            processed_count += 1
            
            # Incrémenter le compteur de candidatures pour chaque offre correspondante
            for job_id in matching_jobs:
                email_surveillance_service.increment_candidates_count(job_id, db)
    
    db.commit()
    
    return {
        "status": "completed",
        "processed": processed_count,
        "message": f"{processed_count} nouvelles candidatures traitées"
    }

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
            "department": candidate.department.name if candidate.department else None,
            "status": candidate.status.value,
            "received_at": candidate.received_at.isoformat(),
            "email_subject": candidate.email_subject,
            "cv_filename": candidate.cv_filename,
            "notes": candidate.notes
        })
    
    return result

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
        Candidate.status == CandidateStatus.NEW
    ).count()
    in_review = db.query(Candidate).filter(
        Candidate.company_id == current_user.company_id,
        Candidate.status == CandidateStatus.REVIEWING
    ).count()
    interview = db.query(Candidate).filter(
        Candidate.company_id == current_user.company_id,
        Candidate.status == CandidateStatus.INTERVIEW
    ).count()
    
    return {
        "total_candidates": total,
        "new_candidates": new,
        "in_review": in_review,
        "interviews": interview,
        "last_sync": datetime.utcnow().isoformat()
    }