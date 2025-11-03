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
from app.db.models import User, Candidate, Department, CandidateStatus, JobOpening, CandidateAttachment
import logging

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



@router.post("/test-email-with-cv")
async def test_email_with_cv(
    candidate_name: str = "Alice Martin"
):
    """Envoyer un email de test avec CV attaché"""
    try:
        import smtplib
        from email.mime.multipart import MIMEMultipart
        from email.mime.text import MIMEText
        from email.mime.base import MIMEBase
        from email import encoders
        import io
        
        email_config = {
            "email": "yenfreudel01@gmail.com",
            "password": "booo sbej vykx lliq"
        }
        
        # Créer plusieurs faux fichiers
        fake_cv_content = b"%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n>>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \ntrailer\n<<\n/Size 4\n/Root 1 0 R\n>>\nstartxref\n174\n%%EOF"
        
        fake_letter_content = f"""Lettre de motivation

Madame, Monsieur,

Je souhaite postuler pour le poste de développeur full stack.
Mon expérience en React et Node.js me permettra de contribuer efficacement à vos projets.

Cordialement,
{candidate_name}""".encode('utf-8')
        
        fake_portfolio_content = "Portfolio - Mes realisations en developpement web".encode('utf-8')
        
        # Créer le message avec PLUSIEURS pièces jointes
        msg = MIMEMultipart()
        msg['From'] = email_config["email"]
        msg['To'] = email_config["email"]
        msg['Subject'] = "Candidature développeur - Poste full stack senior"
        
        # Corps du message
        body = f"""Bonjour,

Je me permets de vous adresser ma candidature développeur pour un poste full stack.

Nom: {candidate_name}
Téléphone: 06 12 34 56 78
Expérience: 5 ans en développement web

Je maîtrise React Node.js et le développement web moderne.
Veuillez trouver mes documents en pièces jointes : CV, lettre de motivation et portfolio.

Cordialement,
{candidate_name}"""
        
        msg.attach(MIMEText(body, 'plain', 'utf-8'))
        
        # 1. CV PDF
        cv_part = MIMEBase('application', 'pdf')
        cv_part.set_payload(fake_cv_content)
        encoders.encode_base64(cv_part)
        cv_part.add_header('Content-Disposition', f'attachment; filename="CV_{candidate_name.replace(" ", "_")}.pdf"')
        msg.attach(cv_part)
        
        # 2. Lettre de motivation TXT
        letter_part = MIMEBase('text', 'plain')
        letter_part.set_payload(fake_letter_content)
        encoders.encode_base64(letter_part)
        letter_part.add_header('Content-Disposition', f'attachment; filename="Lettre_motivation_{candidate_name.replace(" ", "_")}.txt"')
        msg.attach(letter_part)
        
        # 3. Portfolio DOC
        portfolio_part = MIMEBase('application', 'msword')
        portfolio_part.set_payload(fake_portfolio_content)
        encoders.encode_base64(portfolio_part)
        portfolio_part.add_header('Content-Disposition', f'attachment; filename="Portfolio_{candidate_name.replace(" ", "_")}.doc"')
        msg.attach(portfolio_part)
        
        # Envoyer l'email
        smtp_server = smtplib.SMTP('smtp.gmail.com', 587)
        smtp_server.starttls()
        smtp_server.login(email_config["email"], email_config["password"])
        smtp_server.send_message(msg)
        smtp_server.quit()
        
        return {
            "status": "success",
            "message": f"Email avec CV envoyé pour {candidate_name}",
            "files_sent": 3,
            "cv_size": len(fake_cv_content),
            "letter_size": len(fake_letter_content),
            "portfolio_size": len(fake_portfolio_content)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur envoi email: {str(e)}")

@router.post("/test-email")
async def test_email(
    job_keywords: str = "développeur,frontend,react",
    candidate_name: str = "Jean Dupont"
):
    """Test endpoint pour envoyer un email de candidature avec mots-clés spécifiques"""
    try:
        email_config = {
            "email": "yenfreudel01@gmail.com",
            "password": "booo sbej vykx lliq"
        }
        
        smtp_server = smtplib.SMTP('smtp.gmail.com', 587)
        smtp_server.starttls()
        smtp_server.login(email_config["email"], email_config["password"])
        
        # Créer un email avec les mots-clés spécifiés
        keywords_list = [k.strip() for k in job_keywords.split(',')]
        keywords_text = ' '.join(keywords_list)
        
        subject = f"Candidature - Poste {keywords_text}"
        body = f"""Bonjour,

Je me permets de vous adresser ma candidature pour un poste de {keywords_text}.

Nom: {candidate_name}
Téléphone: 06 12 34 56 78
Expérience: 3 ans en {keywords_list[0] if keywords_list else 'développement'}

Je maîtrise les technologies suivantes: {', '.join(keywords_list)}

Cordialement,
{candidate_name}
test.candidat@example.com"""
        
        msg = f"Subject: {subject}\r\n\r\n{body}"
        smtp_server.sendmail(email_config["email"], email_config["email"], msg.encode('utf-8'))
        smtp_server.quit()
        
        return {
            "status": "success",
            "message": f"Email de test envoyé avec mots-clés: {keywords_list}",
            "subject": subject,
            "keywords": keywords_list
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur envoi email: {str(e)}")

@router.post("/send-test-emails")
async def send_multiple_test_emails():
    """Envoie plusieurs emails de test avec différents mots-clés"""
    test_cases = [
        {"keywords": "développeur,python,backend", "name": "Alice Martin"},
        {"keywords": "designer,ui,ux,figma", "name": "Bob Durand"},
        {"keywords": "marketing,digital,seo", "name": "Claire Moreau"},
        {"keywords": "commercial,vente,b2b", "name": "David Leroy"}
    ]
    
    results = []
    for test in test_cases:
        try:
            result = await test_email(test["keywords"], test["name"])
            results.append(result)
        except Exception as e:
            results.append({"error": str(e), "test": test})
    
    return {"sent_emails": len(results), "results": results}

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
        
        # Email d'exemple de candidature avec les bons mots-clés
        subject = "Candidature développeur - Poste full stack senior"
        body = f"""Bonjour,

Je me permets de vous adresser ma candidature développeur pour un poste full stack au sein de votre entreprise.

Nom: Marie Dubois
Téléphone: 06 12 34 56 78
Expérience: 5 ans en développement web

Je maîtrise React Node.js, le développement web moderne et les architectures full stack.

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
    """Recherche intelligente des candidatures dans les emails avec mots-clés des offres"""
    import logging
    from app.db.models import JobOpening
    
    # Configuration du logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)
    
    try:
        # Récupérer la configuration email (pour l'instant en dur)
        email_config = {
            "email": "yenfreudel01@gmail.com",
            "password": "booo sbej vykx lliq",
            "server": "imap.gmail.com",
            "port": 993
        }
        
        logger.info(f"🔍 DÉBUT SYNCHRONISATION pour entreprise {current_user.company_id}")
        
        # Récupérer les offres d'emploi actives avec leurs mots-clés
        active_jobs = db.query(JobOpening).filter(
            JobOpening.company_id == current_user.company_id,
            JobOpening.status == "open",
            JobOpening.auto_screening_enabled == True
        ).all()
        
        logger.info(f"📋 Offres d'emploi actives trouvées: {len(active_jobs)}")
        for job in active_jobs:
            keywords = job.email_keywords or []
            logger.info(f"  - {job.title} (ID: {job.id}) | Mots-clés: {keywords} | Dept: {job.department_id}")
        
        if not active_jobs:
            logger.warning("⚠️ Aucune offre d'emploi active avec surveillance activée")
            return {
                "status": "warning",
                "processed": 0,
                "message": "Aucune offre d'emploi active avec surveillance email activée"
            }
        
        # Connexion IMAP
        mail = imaplib.IMAP4_SSL(email_config["server"], email_config["port"])
        mail.login(email_config["email"], email_config["password"])
        mail.select('inbox')
        
        # Rechercher les emails avec "candidature" dans le sujet
        status, messages = mail.search(None, 'SUBJECT "candidature"')
        email_ids = messages[0].split()
        
        logger.info(f"📧 Emails trouvés avec 'candidature': {len(email_ids)}")
        
        processed_count = 0
        matched_jobs_log = []
        
        # Traiter les 10 derniers emails
        for email_id in email_ids[-10:]:
            try:
                status, msg_data = mail.fetch(email_id, '(RFC822)')
                email_body = msg_data[0][1]
                email_message = email.message_from_bytes(email_body)
                
                subject = email_message['subject'] or ""
                from_email = email_message['from'] or ""
                
                # Extraire l'adresse email
                email_match = re.search(r'<(.+?)>', from_email)
                sender_email = email_match.group(1) if email_match else from_email
                
                # Extraire le contenu et les pièces jointes
                content = ""
                attachments = []
                
                if email_message.is_multipart():
                    for part in email_message.walk():
                        content_type = part.get_content_type()
                        content_disposition = str(part.get("Content-Disposition"))
                        
                        # Extraire le texte
                        if content_type == "text/plain" and "attachment" not in content_disposition:
                            content = part.get_payload(decode=True).decode('utf-8', errors='ignore')
                        
                        # Extraire toutes les pièces jointes
                        elif "attachment" in content_disposition:
                            filename = part.get_filename()
                            if filename and any(ext in filename.lower() for ext in ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.png', '.jpeg', '.gif', '.zip', '.rar']):
                                try:
                                    file_data = part.get_payload(decode=True)
                                    attachments.append({
                                        "filename": filename,
                                        "content": base64.b64encode(file_data).decode('utf-8'),
                                        "size": len(file_data)
                                    })
                                    logger.info(f"  📎 Pièce jointe: {filename} ({len(file_data)} bytes)")
                                except Exception as e:
                                    logger.error(f"  ❌ Erreur extraction {filename}: {e}")
                else:
                    content = email_message.get_payload(decode=True).decode('utf-8', errors='ignore')
                
                # Préparer les données des fichiers pour la base
                cv_filename = attachments[0]["filename"] if attachments else None
                cv_content = attachments[0]["content"] if attachments else None
                
                logger.info(f"  📎 FICHIERS EXTRAITS: {len(attachments)} fichiers")
                for i, att in enumerate(attachments):
                    logger.info(f"    {i+1}. {att['filename']} ({att['size']} bytes)")
                
                logger.info(f"\n📨 EMAIL ANALYSÉ:")
                logger.info(f"  De: {sender_email}")
                logger.info(f"  Sujet: {subject}")
                logger.info(f"  Contenu (100 premiers chars): {content[:100]}...")
                
                # Vérifier si le candidat existe déjà
                existing = db.query(Candidate).filter(
                    Candidate.email == sender_email,
                    Candidate.company_id == current_user.company_id
                ).first()
                
                if existing:
                    logger.info(f"  ⚠️ Candidat déjà existant: {existing.name}")
                    continue
                
                # NOUVELLE LOGIQUE: Correspondance avec les mots-clés des offres
                email_text = f"{subject} {content}".lower()
                matched_job = None
                best_match_score = 0
                
                logger.info(f"  🔍 RECHERCHE DE CORRESPONDANCES:")
                logger.info(f"  📧 Texte email à analyser: {email_text[:200]}...")
                
                for job in active_jobs:
                    keywords = job.email_keywords or []
                    if not keywords:
                        logger.info(f"    - Offre '{job.title}': AUCUN MOT-CLÉ CONFIGURÉ")
                        continue
                        
                    match_score = 0
                    matched_keywords = []
                    
                    for keyword in keywords:
                        if keyword.lower() in email_text:
                            match_score += 1
                            matched_keywords.append(keyword)
                    
                    logger.info(f"    - Offre '{job.title}': {match_score}/{len(keywords)} mots-clés trouvés: {matched_keywords}")
                    logger.info(f"      Mots-clés configurés: {keywords}")
                    
                    if match_score > best_match_score:
                        best_match_score = match_score
                        matched_job = job
                
                # Si aucune correspondance trouvée, assigner au premier département par défaut
                if not matched_job and active_jobs:
                    logger.info(f"  ⚠️ AUCUNE CORRESPONDANCE - Attribution au premier département disponible")
                    matched_job = active_jobs[0]  # Prendre la première offre comme fallback
                    best_match_score = 0
                
                if matched_job:
                    if best_match_score > 0:
                        logger.info(f"  ✅ CORRESPONDANCE TROUVÉE: {matched_job.title} (score: {best_match_score})")
                    else:
                        logger.info(f"  ⚠️ ATTRIBUTION PAR DÉFAUT: {matched_job.title} (aucun mot-clé correspondant)")
                    
                    # Extraire les infos candidat
                    name_match = re.search(r'(?:je suis|nom|name)[\s:]*([A-Za-zÀ-ÿ\s]+)', content, re.IGNORECASE)
                    phone_match = re.search(r'(?:téléphone|phone|tel|mobile)[\s:]*([0-9\s\-\+\.]{10,})', content, re.IGNORECASE)
                    
                    candidate_name = name_match.group(1).strip() if name_match else sender_email.split('@')[0]
                    candidate_phone = phone_match.group(1).strip() if phone_match else None
                    
                    # Créer le candidat avec l'offre correspondante et les pièces jointes
                    candidate = Candidate(
                        name=candidate_name,
                        email=sender_email,
                        phone=candidate_phone,
                        position=matched_job.title,  # Utiliser le titre de l'offre
                        department_id=matched_job.department_id,  # Département de l'offre
                        company_id=current_user.company_id,
                        email_subject=subject,
                        email_content=content[:1000],
                        cv_filename=cv_filename,
                        cv_content=cv_content,
                        status=CandidateStatus.nouveau,
                        job_opening_id=matched_job.id  # Lier à l'offre
                    )
                    
                    db.add(candidate)
                    db.flush()  # Pour obtenir l'ID du candidat
                    
                    # Ajouter TOUS les fichiers joints (pas seulement le premier)
                    files_added = 0
                    for attachment in attachments:
                        try:
                            file_attachment = CandidateAttachment(
                                candidate_id=candidate.id,
                                filename=attachment["filename"],
                                content=attachment["content"],
                                file_type=attachment["filename"].split(".")[-1].lower() if "." in attachment["filename"] else "unknown",
                                file_size=attachment["size"]
                            )
                            db.add(file_attachment)
                            files_added += 1
                            logger.info(f"    ✅ Fichier ajouté: {attachment['filename']}")
                        except Exception as e:
                            logger.error(f"    ❌ Erreur ajout fichier {attachment['filename']}: {e}")
                    
                    logger.info(f"  💾 TOTAL FICHIERS AJOUTÉS: {files_added}/{len(attachments)}")
                    processed_count += 1
                    
                    # Incrémenter le compteur de l'offre
                    matched_job.candidates_count = (matched_job.candidates_count or 0) + 1
                    
                    matched_jobs_log.append({
                        "job_title": matched_job.title,
                        "candidate_name": candidate_name,
                        "match_score": best_match_score,
                        "keywords_used": matched_job.email_keywords,
                        "match_type": "keyword_match" if best_match_score > 0 else "default_assignment"
                    })
                    
                    logger.info(f"  ✅ Candidat créé: {candidate_name} → {matched_job.title} (CV + {len(attachments)} fichiers)")
                else:
                    logger.info(f"  ❌ Aucune correspondance trouvée pour cet email")
                    
            except Exception as e:
                logger.error(f"❌ Erreur traitement email: {e}")
                continue
        
        mail.logout()
        db.commit()
        
        logger.info(f"\n🎯 RÉSUMÉ SYNCHRONISATION:")
        logger.info(f"  - Candidats traités: {processed_count}")
        logger.info(f"  - Correspondances trouvées: {len(matched_jobs_log)}")
        for match in matched_jobs_log:
            logger.info(f"    * {match['candidate_name']} → {match['job_title']} (score: {match['match_score']})")
        
        return {
            "status": "completed",
            "processed": processed_count,
            "message": f"{processed_count} nouvelles candidatures trouvées et classées par mots-clés",
            "matches": matched_jobs_log
        }
        
    except Exception as e:
        db.rollback()
        logger.error(f"❌ Erreur synchronisation: {str(e)}")
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
        # Compter les fichiers attachés
        attachments_count = db.query(CandidateAttachment).filter(
            CandidateAttachment.candidate_id == candidate.id
        ).count()
        
        total_files = attachments_count + (1 if candidate.cv_content else 0)
        
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
            "has_cv": bool(candidate.cv_content),
            "attachments_count": total_files,
            "notes": candidate.notes
        })
    
    return {"candidates": result}

@router.put("/candidates/{candidate_id}/status")
async def update_candidate_status(
    candidate_id: int,
    request_data: dict,
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
    
    status = request_data.get("status")
    notes = request_data.get("notes")
    
    if not status:
        raise HTTPException(status_code=400, detail="Statut requis")
    
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
    except ValueError as e:
        raise HTTPException(status_code=422, detail=f"Statut invalide: {status}. Valeurs acceptées: nouveau, en_cours, entretien, accepte, rejete")

@router.get("/candidates/{candidate_id}/attachments")
async def get_candidate_attachments(
    candidate_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Lister tous les fichiers d'un candidat"""
    candidate = db.query(Candidate).filter(
        Candidate.id == candidate_id,
        Candidate.company_id == current_user.company_id
    ).first()
    
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidat non trouvé")
    
    attachments = db.query(CandidateAttachment).filter(
        CandidateAttachment.candidate_id == candidate_id
    ).all()
    
    files = []
    for att in attachments:
        files.append({
            "id": att.id,
            "filename": att.filename,
            "file_type": att.file_type,
            "file_size": att.file_size,
            "uploaded_at": att.uploaded_at.isoformat() if att.uploaded_at else datetime.utcnow().isoformat()
        })
    
    # Ajouter le CV principal s'il existe
    if candidate.cv_content:
        files.insert(0, {
            "id": "main_cv",
            "filename": candidate.cv_filename or "CV.pdf",
            "file_type": "pdf",
            "file_size": len(candidate.cv_content) * 3 // 4,  # Estimation base64
            "uploaded_at": candidate.received_at.isoformat() if candidate.received_at else datetime.utcnow().isoformat()
        })
    
    return {"files": files}

@router.get("/candidates/{candidate_id}/attachments/{attachment_id}")
async def download_attachment(
    candidate_id: int,
    attachment_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Télécharger un fichier spécifique"""
    from fastapi.responses import Response
    
    candidate = db.query(Candidate).filter(
        Candidate.id == candidate_id,
        Candidate.company_id == current_user.company_id
    ).first()
    
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidat non trouvé")
    
    # CV principal
    if attachment_id == "main_cv" and candidate.cv_content:
        cv_data = base64.b64decode(candidate.cv_content)
        return Response(
            content=cv_data,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={candidate.cv_filename or 'CV.pdf'}"}
        )
    
    # Autres fichiers
    attachment = db.query(CandidateAttachment).filter(
        CandidateAttachment.id == int(attachment_id),
        CandidateAttachment.candidate_id == candidate_id
    ).first()
    
    if not attachment:
        raise HTTPException(status_code=404, detail="Fichier non trouvé")
    
    file_data = base64.b64decode(attachment.content)
    content_type = "application/octet-stream"
    
    if attachment.file_type == "pdf":
        content_type = "application/pdf"
    elif attachment.file_type in ["doc", "docx"]:
        content_type = "application/msword"
    elif attachment.file_type in ["jpg", "jpeg", "png"]:
        content_type = f"image/{attachment.file_type}"
    
    return Response(
        content=file_data,
        media_type=content_type,
        headers={"Content-Disposition": f"attachment; filename={attachment.filename}"}
    )

@router.get("/candidates/{candidate_id}/cv")
async def get_candidate_cv(
    candidate_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Télécharger le CV d'un candidat"""
    from fastapi.responses import Response
    
    candidate = db.query(Candidate).filter(
        Candidate.id == candidate_id,
        Candidate.company_id == current_user.company_id
    ).first()
    
    if not candidate or not candidate.cv_content:
        raise HTTPException(status_code=404, detail="CV non trouvé")
    
    # Décoder le contenu base64
    try:
        cv_data = base64.b64decode(candidate.cv_content)
        
        # Déterminer le type de contenu
        content_type = "application/pdf"
        if candidate.cv_filename:
            if candidate.cv_filename.lower().endswith('.doc'):
                content_type = "application/msword"
            elif candidate.cv_filename.lower().endswith('.docx'):
                content_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        
        return Response(
            content=cv_data,
            media_type=content_type,
            headers={"Content-Disposition": f"attachment; filename={candidate.cv_filename or 'cv.pdf'}"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lecture CV: {str(e)}")

@router.delete("/candidates/{candidate_id}")
async def delete_auto_candidate(
    candidate_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Supprimer un candidat automatique"""
    candidate = db.query(Candidate).filter(
        Candidate.id == candidate_id,
        Candidate.company_id == current_user.company_id
    ).first()
    
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidat non trouvé")
    
    db.delete(candidate)
    db.commit()
    
    return {"message": "Candidat supprimé avec succès"}

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

@router.get("/debug-jobs")
async def debug_active_jobs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Debug: Voir les offres d'emploi actives et leurs mots-clés"""
    active_jobs = db.query(JobOpening).filter(
        JobOpening.company_id == current_user.company_id,
        JobOpening.status == "open"
    ).all()
    
    jobs_info = []
    for job in active_jobs:
        jobs_info.append({
            "id": job.id,
            "title": job.title,
            "department_id": job.department_id,
            "email_keywords": job.email_keywords,
            "auto_screening_enabled": job.auto_screening_enabled,
            "candidates_count": job.candidates_count or 0,
            "status": job.status
        })
    
    return {
        "company_id": current_user.company_id,
        "total_jobs": len(active_jobs),
        "jobs_with_keywords": len([j for j in active_jobs if j.email_keywords]),
        "jobs_with_screening": len([j for j in active_jobs if j.auto_screening_enabled]),
        "jobs": jobs_info
    }

@router.post("/fix-job-keywords/{job_id}")
async def fix_job_keywords(
    job_id: int,
    keywords: list = ["développeur", "full stack", "senior", "react", "node"],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Corriger les mots-clés d'une offre d'emploi"""
    job = db.query(JobOpening).filter(
        JobOpening.id == job_id,
        JobOpening.company_id == current_user.company_id
    ).first()
    
    if not job:
        raise HTTPException(status_code=404, detail="Offre d'emploi non trouvée")
    
    # Mettre à jour les mots-clés et activer la surveillance
    job.email_keywords = keywords
    job.auto_screening_enabled = True
    
    db.commit()
    
    return {
        "status": "updated",
        "job_id": job_id,
        "title": job.title,
        "keywords": keywords,
        "auto_screening_enabled": True
    }