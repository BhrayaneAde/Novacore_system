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
        # Supprimer les candidats de test
        cursor.execute("DELETE FROM candidates WHERE name LIKE '%Marie Dubois%'")
        deleted = cursor.rowcount
        
        connection.commit()
        print(f"Supprimé {deleted} candidats de test")

except Exception as e:
    print(f"Erreur: {e}")
finally:
    if 'connection' in locals():
        connection.close()