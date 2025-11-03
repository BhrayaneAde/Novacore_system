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
        # Mettre à jour Alice Martin pour qu'elle soit dans la bonne company
        cursor.execute("UPDATE candidates SET company_id = 4 WHERE id = 30")
        connection.commit()
        print("Alice Martin mise a jour pour company_id = 4")

except Exception as e:
    print(f"Erreur: {e}")
finally:
    if 'connection' in locals():
        connection.close()