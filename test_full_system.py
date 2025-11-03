#!/usr/bin/env python3
import requests
import json

# Configuration
BASE_URL = "http://127.0.0.1:8000/api/v1"
TOKEN = "your_token_here"  # Remplacez par votre token

def test_system():
    headers = {"Authorization": f"Bearer {TOKEN}"}
    
    print("=== TEST COMPLET DU SYSTÈME ===\n")
    
    # 1. Envoyer email de test
    print("1. Envoi email de test avec fichiers...")
    try:
        response = requests.post(f"{BASE_URL}/auto-recruitment/test-email-with-cv", headers=headers)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Email envoyé: {data.get('files_sent', 0)} fichiers")
        else:
            print(f"❌ Erreur envoi: {response.status_code}")
            return
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return
    
    # 2. Attendre un peu
    import time
    print("⏳ Attente 3 secondes...")
    time.sleep(3)
    
    # 3. Synchroniser
    print("\n2. Synchronisation des emails...")
    try:
        response = requests.post(f"{BASE_URL}/auto-recruitment/search-candidates", headers=headers)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Synchronisation: {data.get('processed', 0)} candidats traités")
            matches = data.get('matches', [])
            for match in matches:
                print(f"   - {match.get('candidate_name')} → {match.get('job_title')} (score: {match.get('match_score')})")
        else:
            print(f"❌ Erreur sync: {response.status_code}")
            return
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return
    
    # 4. Vérifier les candidats
    print("\n3. Vérification des candidats...")
    try:
        response = requests.get(f"{BASE_URL}/auto-recruitment/candidates", headers=headers)
        if response.status_code == 200:
            data = response.json()
            candidates = data.get('candidates', [])
            print(f"✅ Candidats trouvés: {len(candidates)}")
            
            for candidate in candidates:
                name = candidate.get('name', 'Inconnu')
                attachments = candidate.get('attachments_count', 0)
                print(f"   - {name}: {attachments} fichiers")
                
                # Tester les fichiers du premier candidat
                if candidate.get('id'):
                    candidate_id = candidate['id']
                    print(f"\n4. Test fichiers pour {name}...")
                    
                    files_response = requests.get(f"{BASE_URL}/auto-recruitment/candidates/{candidate_id}/attachments", headers=headers)
                    if files_response.status_code == 200:
                        files_data = files_response.json()
                        files = files_data.get('files', [])
                        print(f"✅ Fichiers détaillés: {len(files)}")
                        for file in files:
                            print(f"     - {file.get('filename')} ({file.get('file_type')}, {file.get('file_size')} bytes)")
                    else:
                        print(f"❌ Erreur fichiers: {files_response.status_code}")
                    break
        else:
            print(f"❌ Erreur candidats: {response.status_code}")
    except Exception as e:
        print(f"❌ Erreur: {e}")

if __name__ == "__main__":
    print("⚠️  ATTENTION: Vous devez d'abord obtenir un token d'authentification")
    print("1. Connectez-vous sur l'interface web")
    print("2. Ouvrez la console (F12)")
    print("3. Tapez: localStorage.getItem('access_token')")
    print("4. Copiez le token et remplacez 'your_token_here' dans ce script")
    print("\nVoulez-vous continuer avec un token factice ? (y/n)")
    
    choice = input().lower()
    if choice == 'y':
        test_system()
    else:
        print("Test annulé. Obtenez d'abord un token valide.")