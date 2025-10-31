#!/usr/bin/env python3
"""Service de surveillance email pour les offres d'emploi"""

import logging
from typing import List, Dict, Optional
from sqlalchemy.orm import Session
from app.db import models
from app.db.database import SessionLocal

logger = logging.getLogger(__name__)

class EmailSurveillanceService:
    """Service pour gérer la surveillance email des offres d'emploi"""
    
    def __init__(self):
        self.active_surveillances: Dict[int, Dict] = {}  # job_opening_id -> config
    
    def start_surveillance_for_job(self, job_opening_id: int, db: Session):
        """Démarre la surveillance email pour une offre d'emploi"""
        job_opening = db.query(models.JobOpening).filter(
            models.JobOpening.id == job_opening_id
        ).first()
        
        if not job_opening or not job_opening.auto_screening_enabled:
            return False
        
        # Configuration de surveillance
        surveillance_config = {
            "job_opening_id": job_opening_id,
            "company_id": job_opening.company_id,
            "keywords": job_opening.email_keywords or [],
            "department": job_opening.department,
            "screening_criteria": job_opening.screening_criteria or {},
            "is_active": True
        }
        
        self.active_surveillances[job_opening_id] = surveillance_config
        logger.info(f"🔍 Surveillance démarrée pour l'offre {job_opening_id}")
        return True
    
    def stop_surveillance_for_job(self, job_opening_id: int):
        """Arrête la surveillance email pour une offre d'emploi"""
        if job_opening_id in self.active_surveillances:
            del self.active_surveillances[job_opening_id]
            logger.info(f"⏹️ Surveillance arrêtée pour l'offre {job_opening_id}")
    
    def check_email_matches_job(self, email_subject: str, email_content: str) -> List[int]:
        """Vérifie si un email correspond à une ou plusieurs offres d'emploi"""
        matching_jobs = []
        
        email_text = f"{email_subject} {email_content}".lower()
        
        for job_id, config in self.active_surveillances.items():
            keywords = config.get("keywords", [])
            
            # Vérifier si l'email contient les mots-clés
            for keyword in keywords:
                if keyword.lower() in email_text:
                    matching_jobs.append(job_id)
                    break
        
        return matching_jobs
    
    def increment_candidates_count(self, job_opening_id: int, db: Session):
        """Incrémente le compteur de candidatures pour une offre"""
        job_opening = db.query(models.JobOpening).filter(
            models.JobOpening.id == job_opening_id
        ).first()
        
        if job_opening:
            job_opening.candidates_count = (job_opening.candidates_count or 0) + 1
            db.commit()
            logger.info(f"📈 Compteur candidatures incrémenté pour l'offre {job_opening_id}: {job_opening.candidates_count}")
    
    def get_active_surveillances(self) -> Dict[int, Dict]:
        """Retourne la liste des surveillances actives"""
        return self.active_surveillances
    
    def load_all_active_jobs(self):
        """Charge toutes les offres d'emploi actives au démarrage"""
        db = SessionLocal()
        try:
            active_jobs = db.query(models.JobOpening).filter(
                models.JobOpening.status == "open",
                models.JobOpening.auto_screening_enabled == True
            ).all()
            
            for job in active_jobs:
                self.start_surveillance_for_job(job.id, db)
            
            logger.info(f"🚀 {len(active_jobs)} surveillances chargées au démarrage")
        finally:
            db.close()

# Instance globale du service
email_surveillance_service = EmailSurveillanceService()