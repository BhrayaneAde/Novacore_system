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
        # Vérifier les candidats en base
        cursor.execute("""
            SELECT id, name, email, company_id, department_id, position 
            FROM candidates 
            ORDER BY id DESC 
            LIMIT 5
        """)
        
        candidates = cursor.fetchall()
        
        print("=== CANDIDATS EN BASE ===")
        for candidate in candidates:
            cand_id, name, email, company_id, dept_id, position = candidate
            print(f"ID: {cand_id} | {name} | {email} | Company: {company_id} | Dept: {dept_id} | Poste: {position}")
        
        # Vérifier les fichiers
        cursor.execute("""
            SELECT candidate_id, filename, file_size 
            FROM candidate_attachments 
            ORDER BY candidate_id DESC
        """)
        
        attachments = cursor.fetchall()
        
        print("\n=== FICHIERS EN BASE ===")
        for att in attachments:
            cand_id, filename, size = att
            print(f"Candidat {cand_id}: {filename} ({size} bytes)")

except Exception as e:
    print(f"Erreur: {e}")
finally:
    if 'connection' in locals():
        connection.close()