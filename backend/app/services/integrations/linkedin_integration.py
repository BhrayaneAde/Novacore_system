import requests
from typing import Dict, Any, List
from datetime import datetime

class LinkedInIntegration:
    def __init__(self, config: Dict[str, Any]):
        self.client_id = config.get('client_id')
        self.client_secret = config.get('client_secret')
        self.company_id = config.get('company_id')
        self.access_token = None
        self.api_url = "https://api.linkedin.com/v2"

    def authenticate(self, access_token: str) -> bool:
        """Authentification avec LinkedIn API"""
        try:
            self.access_token = access_token
            headers = {'Authorization': f'Bearer {access_token}'}
            response = requests.get(f"{self.api_url}/me", headers=headers)
            return response.status_code == 200
        except Exception:
            return False

    def test_connection(self) -> Dict[str, Any]:
        """Test de connexion"""
        if not self.access_token:
            return {"status": "error", "message": "Token d'accès manquant"}
        
        try:
            headers = {'Authorization': f'Bearer {self.access_token}'}
            response = requests.get(f"{self.api_url}/me", headers=headers)
            
            if response.status_code == 200:
                profile = response.json()
                return {
                    "status": "success",
                    "message": f"Connexion réussie: {profile.get('localizedFirstName')} {profile.get('localizedLastName')}"
                }
            return {"status": "error", "message": f"Erreur API: {response.status_code}"}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    def post_job(self, job_data: Dict[str, Any]) -> Dict[str, Any]:
        """Publication d'offre d'emploi"""
        try:
            headers = {
                'Authorization': f'Bearer {self.access_token}',
                'Content-Type': 'application/json',
                'X-Restli-Protocol-Version': '2.0.0'
            }
            
            job_posting = {
                "companyApplyUrl": job_data.get('apply_url'),
                "description": job_data.get('description'),
                "employmentStatus": "FULL_TIME",
                "externalJobPostingId": str(job_data.get('id')),
                "listedAt": int(datetime.now().timestamp() * 1000),
                "jobPostingOperationType": "CREATE",
                "integrationContext": f"urn:li:organization:{self.company_id}",
                "title": job_data.get('title'),
                "location": job_data.get('location', 'France'),
                "workplaceTypes": ["on_site"]
            }
            
            response = requests.post(
                f"{self.api_url}/simpleJobPostings",
                headers=headers,
                json=job_posting
            )
            
            if response.status_code == 201:
                return {"status": "success", "message": "Offre publiée sur LinkedIn"}
            return {"status": "error", "message": f"Erreur publication: {response.status_code}"}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    def search_candidates(self, search_criteria: Dict[str, Any]) -> Dict[str, Any]:
        """Recherche de candidats"""
        try:
            headers = {'Authorization': f'Bearer {self.access_token}'}
            
            params = {
                'keywords': search_criteria.get('keywords', ''),
                'locationName': search_criteria.get('location', 'France'),
                'start': search_criteria.get('start', 0),
                'count': search_criteria.get('count', 25)
            }
            
            response = requests.get(
                f"{self.api_url}/peopleSearch",
                headers=headers,
                params=params
            )
            
            if response.status_code == 200:
                results = response.json()
                return {
                    "status": "success",
                    "candidates": results.get('elements', []),
                    "total": results.get('paging', {}).get('total', 0)
                }
            return {"status": "error", "message": f"Erreur recherche: {response.status_code}"}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    def get_company_followers(self) -> Dict[str, Any]:
        """Récupération des followers de l'entreprise"""
        try:
            headers = {'Authorization': f'Bearer {self.access_token}'}
            
            response = requests.get(
                f"{self.api_url}/organizationalEntityFollowerStatistics",
                headers=headers,
                params={'q': 'organizationalEntity', 'organizationalEntity': f'urn:li:organization:{self.company_id}'}
            )
            
            if response.status_code == 200:
                stats = response.json()
                return {
                    "status": "success",
                    "followers": stats.get('elements', [])
                }
            return {"status": "error", "message": f"Erreur stats: {response.status_code}"}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    def sync_applications(self, job_id: str) -> Dict[str, Any]:
        """Synchronisation des candidatures"""
        try:
            headers = {'Authorization': f'Bearer {self.access_token}'}
            
            response = requests.get(
                f"{self.api_url}/simpleJobPostings/{job_id}/jobApplications",
                headers=headers
            )
            
            if response.status_code == 200:
                applications = response.json()
                return {
                    "status": "success",
                    "applications": applications.get('elements', []),
                    "count": len(applications.get('elements', []))
                }
            return {"status": "error", "message": f"Erreur sync: {response.status_code}"}
        except Exception as e:
            return {"status": "error", "message": str(e)}