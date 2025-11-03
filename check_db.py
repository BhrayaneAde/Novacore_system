#!/usr/bin/env python3
import pymysql
import json

try:
    # Connexion à la base de données
    connection = pymysql.connect(
        host='localhost',
        user='root',
        password='',
        database='novadb',
        charset='utf8mb4'
    )
    
    with connection.cursor() as cursor:
        # Vérifier les offres d'emploi actives
        cursor.execute("""
            SELECT id, title, email_keywords, auto_screening_enabled, 
                   department_id, status, candidates_count 
            FROM job_openings 
            WHERE status = 'open'
        """)
        
        jobs = cursor.fetchall()
        
        print("=== OFFRES D'EMPLOI ACTIVES ===")
        for job in jobs:
            job_id, title, keywords, auto_enabled, dept_id, status, count = job
            print(f"ID: {job_id}")
            print(f"Titre: {title}")
            print(f"Mots-clés: {keywords}")
            print(f"Auto-screening: {auto_enabled}")
            print(f"Département ID: {dept_id}")
            print(f"Statut: {status}")
            print(f"Candidats: {count}")
            print("-" * 50)
        
        # Vérifier les candidats récents
        cursor.execute("""
            SELECT c.id, c.name, c.email, c.position, c.department_id, 
                   d.name as dept_name, c.job_opening_id, c.received_at
            FROM candidates c
            LEFT JOIN departments d ON c.department_id = d.id
            ORDER BY c.received_at DESC
            LIMIT 10
        """)
        
        candidates = cursor.fetchall()
        
        print("\n=== CANDIDATS RÉCENTS ===")
        for candidate in candidates:
            cand_id, name, email, position, dept_id, dept_name, job_id, received = candidate
            print(f"ID: {cand_id}")
            print(f"Nom: {name}")
            print(f"Email: {email}")
            print(f"Poste: {position}")
            print(f"Département: {dept_name} (ID: {dept_id})")
            print(f"Offre liée: {job_id}")
            print(f"Reçu: {received}")
            print("-" * 50)
            
        # Vérifier les départements
        cursor.execute("SELECT id, name FROM departments")
        departments = cursor.fetchall()
        
        print("\n=== DÉPARTEMENTS ===")
        for dept in departments:
            dept_id, dept_name = dept
            print(f"ID: {dept_id} - {dept_name}")

except Exception as e:
    print(f"Erreur: {e}")
finally:
    if 'connection' in locals():
        connection.close()