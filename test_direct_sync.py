#!/usr/bin/env python3
import imaplib
import email
import base64
import re
import pymysql
from datetime import datetime

def test_direct_sync():
    print("=== TEST DIRECT DE SYNCHRONISATION ===\n")
    
    try:
        # 1. Connexion email
        print("1. Connexion IMAP...")
        mail = imaplib.IMAP4_SSL("imap.gmail.com", 993)
        mail.login("yenfreudel01@gmail.com", "booo sbej vykx lliq")
        mail.select('inbox')
        print("OK Connecte a Gmail")
        
        # 2. Recherche emails
        print("\n2. Recherche emails avec 'candidature'...")
        status, messages = mail.search(None, 'SUBJECT "candidature"')
        email_ids = messages[0].split()
        print(f"OK {len(email_ids)} emails trouves")
        
        # 3. Analyser le dernier email
        print("\n3. Analyse du dernier email...")
        if email_ids:
            email_id = email_ids[-1]
            status, msg_data = mail.fetch(email_id, '(RFC822)')
            email_message = email.message_from_bytes(msg_data[0][1])
            
            subject = email_message['subject'] or ""
            from_email = email_message['from'] or ""
            
            print(f"De: {from_email}")
            print(f"Sujet: {subject}")
            
            # Extraire contenu et fichiers
            content = ""
            attachments = []
            
            if email_message.is_multipart():
                for part in email_message.walk():
                    content_type = part.get_content_type()
                    content_disposition = str(part.get("Content-Disposition"))
                    
                    # Texte
                    if content_type == "text/plain" and "attachment" not in content_disposition:
                        content = part.get_payload(decode=True).decode('utf-8', errors='ignore')
                    
                    # Fichiers
                    elif "attachment" in content_disposition:
                        filename = part.get_filename()
                        if filename:
                            try:
                                file_data = part.get_payload(decode=True)
                                attachments.append({
                                    "filename": filename,
                                    "content": base64.b64encode(file_data).decode('utf-8'),
                                    "size": len(file_data)
                                })
                                print(f"   Fichier: {filename} ({len(file_data)} bytes)")
                            except Exception as e:
                                print(f"   Erreur fichier {filename}: {e}")
            
            print(f"OK Contenu extrait: {len(content)} chars, {len(attachments)} fichiers")
            
            # 4. Test base de données
            print("\n4. Test insertion base de données...")
            try:
                connection = pymysql.connect(
                    host='localhost',
                    user='root',
                    password='',
                    database='novadb',
                    charset='utf8mb4'
                )
                
                with connection.cursor() as cursor:
                    # Extraire nom candidat
                    name_match = re.search(r'(?:je suis|nom|name)[\s:]*([A-Za-zÀ-ÿ\s]+)', content, re.IGNORECASE)
                    candidate_name = name_match.group(1).strip() if name_match else from_email.split('@')[0]
                    
                    # Créer candidat
                    cursor.execute("""
                        INSERT INTO candidates (name, email, phone, position, department_id, company_id, 
                                              email_subject, email_content, status, job_opening_id)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """, (
                        candidate_name, from_email, None, "Développeur Full Stack Senior",
                        15, 4, subject, content[:1000], "nouveau", 5
                    ))
                    
                    candidate_id = cursor.lastrowid
                    print(f"OK Candidat cree: ID {candidate_id}")
                    
                    # Ajouter fichiers
                    files_added = 0
                    for attachment in attachments:
                        cursor.execute("""
                            INSERT INTO candidate_attachments (candidate_id, filename, content, file_type, file_size)
                            VALUES (%s, %s, %s, %s, %s)
                        """, (
                            candidate_id,
                            attachment["filename"],
                            attachment["content"],
                            attachment["filename"].split(".")[-1].lower() if "." in attachment["filename"] else "unknown",
                            attachment["size"]
                        ))
                        files_added += 1
                    
                    connection.commit()
                    print(f"OK {files_added} fichiers ajoutes")
                    
                connection.close()
                
            except Exception as e:
                print(f"Erreur BDD: {e}")
        
        mail.logout()
        print("\nTest termine avec succes!")
        
    except Exception as e:
        print(f"Erreur generale: {e}")

if __name__ == "__main__":
    test_direct_sync()