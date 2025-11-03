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
        # Supprimer tous les attachments
        cursor.execute("DELETE FROM candidate_attachments")
        attachments_deleted = cursor.rowcount
        
        # Supprimer tous les candidats
        cursor.execute("DELETE FROM candidates")
        candidates_deleted = cursor.rowcount
        
        connection.commit()
        print(f"Supprime {candidates_deleted} candidats et {attachments_deleted} fichiers")

except Exception as e:
    print(f"Erreur: {e}")
finally:
    if 'connection' in locals():
        connection.close()