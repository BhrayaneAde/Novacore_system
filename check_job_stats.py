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
        # Vérifier les offres d'emploi et leurs compteurs
        cursor.execute("""
            SELECT id, title, candidates_count, status 
            FROM job_openings 
            ORDER BY id
        """)
        
        jobs = cursor.fetchall()
        
        print("=== OFFRES D'EMPLOI ET COMPTEURS ===")
        total_count = 0
        for job in jobs:
            job_id, title, count, status = job
            total_count += count or 0
            print(f"ID: {job_id} | {title} | Compteur: {count} | Statut: {status}")
        
        print(f"\nTOTAL AFFICHÉ: {total_count}")
        
        # Vérifier les vrais candidats
        cursor.execute("SELECT COUNT(*) FROM candidates")
        real_candidates = cursor.fetchone()[0]
        print(f"VRAIS CANDIDATS: {real_candidates}")
        
        # Remettre les compteurs à zéro
        cursor.execute("UPDATE job_openings SET candidates_count = 0")
        connection.commit()
        print("\nCompteurs remis à zéro")

except Exception as e:
    print(f"Erreur: {e}")
finally:
    if 'connection' in locals():
        connection.close()