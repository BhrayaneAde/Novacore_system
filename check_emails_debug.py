#!/usr/bin/env python3
import imaplib
import email

try:
    # Connexion IMAP
    mail = imaplib.IMAP4_SSL("imap.gmail.com", 993)
    mail.login("yenfreudel01@gmail.com", "booo sbej vykx lliq")
    mail.select('inbox')
    
    # Chercher les emails récents avec "candidature"
    status, messages = mail.search(None, 'SUBJECT "candidature"')
    email_ids = messages[0].split()
    
    print(f"Emails trouvés: {len(email_ids)}")
    
    # Analyser les 3 derniers emails
    for email_id in email_ids[-3:]:
        status, msg_data = mail.fetch(email_id, '(RFC822)')
        email_message = email.message_from_bytes(msg_data[0][1])
        
        subject = email_message['subject'] or ""
        from_email = email_message['from'] or ""
        
        print(f"\nEmail ID: {email_id}")
        print(f"De: {from_email}")
        print(f"Sujet: {subject}")
        
        # Compter les pièces jointes
        attachments = 0
        if email_message.is_multipart():
            for part in email_message.walk():
                content_disposition = str(part.get("Content-Disposition"))
                if "attachment" in content_disposition:
                    filename = part.get_filename()
                    if filename:
                        attachments += 1
                        print(f"  - Fichier: {filename}")
        
        print(f"Total fichiers: {attachments}")
    
    mail.logout()

except Exception as e:
    print(f"Erreur: {e}")