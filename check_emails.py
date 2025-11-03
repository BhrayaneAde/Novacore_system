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
        # Vérifier le contenu des emails des candidats
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
            print(f"Contenu: {content[:500]}...")
            print("=" * 80)
            
            # Analyser les mots-clés
            email_text = f"{subject} {content}".lower()
            keywords = ["candidature développeur", "poste full stack", "développement web", "react node"]
            
            print("ANALYSE DES MOTS-CLÉS:")
            for keyword in keywords:
                found = keyword.lower() in email_text
                print(f"  - '{keyword}': {'✅ TROUVÉ' if found else '❌ NON TROUVÉ'}")
            print("=" * 80)

except Exception as e:
    print(f"Erreur: {e}")
finally:
    if 'connection' in locals():
        connection.close()