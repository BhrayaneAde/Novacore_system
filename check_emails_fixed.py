#!/usr/bin/env python3
import pymysql

try:
    connection = pymysql.connect(
        host='localhost',
        user='root',
        password='',
        database='novadb',
        charset='utf8mb4'
    )
    
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT id, name, email_subject, email_content
            FROM candidates 
            WHERE name LIKE '%Marie Dubois%'
            ORDER BY received_at DESC
            LIMIT 2
        """)
        
        candidates = cursor.fetchall()
        
        print("=== CONTENU DES EMAILS ===")
        for candidate in candidates:
            cand_id, name, subject, content = candidate
            print(f"Candidat ID: {cand_id}")
            print(f"Nom: {name}")
            print(f"Sujet: {subject}")
            print(f"Contenu: {content[:300]}...")
            
            email_text = f"{subject} {content}".lower()
            keywords = ["candidature developpeur", "poste full stack", "developpement web", "react node"]
            
            print("\nANALYSE DES MOTS-CLES:")
            for keyword in keywords:
                found = keyword.lower() in email_text
                status = "TROUVE" if found else "NON TROUVE"
                print(f"  - '{keyword}': {status}")
                
            individual_words = ["developpeur", "dev", "full", "stack", "react", "node", "designer", "design"]
            print("\nMOTS INDIVIDUELS:")
            for word in individual_words:
                found = word.lower() in email_text
                status = "TROUVE" if found else "NON TROUVE"
                print(f"  - '{word}': {status}")
            
            print("=" * 60)

except Exception as e:
    print(f"Erreur: {e}")
finally:
    if 'connection' in locals():
        connection.close()