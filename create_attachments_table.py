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
        # Créer la table candidate_attachments
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS candidate_attachments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                candidate_id INT NOT NULL,
                filename VARCHAR(255) NOT NULL,
                content LONGTEXT NOT NULL,
                file_type VARCHAR(50),
                file_size INT,
                uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
            )
        """)
        
        connection.commit()
        print("Table candidate_attachments creee avec succes")

except Exception as e:
    print(f"Erreur: {e}")
finally:
    if 'connection' in locals():
        connection.close()