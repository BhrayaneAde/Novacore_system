import requests
from typing import Dict, Any, List
from datetime import datetime

class SageIntegration:
    def __init__(self, config: Dict[str, Any]):
        self.api_url = config.get('api_url')
        self.username = config.get('username')
        self.password = config.get('password')
        self.company_code = config.get('company_code')
        self.session = requests.Session()
        self.token = None

    def authenticate(self) -> bool:
        """Authentification avec l'API Sage"""
        try:
            response = self.session.post(f"{self.api_url}/auth/login", json={
                "username": self.username,
                "password": self.password,
                "company": self.company_code
            })
            if response.status_code == 200:
                self.token = response.json().get('token')
                self.session.headers.update({'Authorization': f'Bearer {self.token}'})
                return True
            return False
        except Exception:
            return False

    def test_connection(self) -> Dict[str, Any]:
        """Test de connexion"""
        if self.authenticate():
            return {"status": "success", "message": "Connexion réussie"}
        return {"status": "error", "message": "Échec de l'authentification"}

    def sync_employees(self) -> Dict[str, Any]:
        """Synchronisation des employés"""
        if not self.authenticate():
            return {"status": "error", "message": "Authentification échouée"}
        
        try:
            response = self.session.get(f"{self.api_url}/employees")
            if response.status_code == 200:
                employees = response.json()
                return {
                    "status": "success",
                    "data": employees,
                    "count": len(employees)
                }
            return {"status": "error", "message": f"Erreur API: {response.status_code}"}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    def sync_payroll(self, period: str) -> Dict[str, Any]:
        """Synchronisation de la paie"""
        if not self.authenticate():
            return {"status": "error", "message": "Authentification échouée"}
        
        try:
            response = self.session.get(f"{self.api_url}/payroll/{period}")
            if response.status_code == 200:
                payroll_data = response.json()
                return {
                    "status": "success",
                    "data": payroll_data,
                    "period": period
                }
            return {"status": "error", "message": f"Erreur API: {response.status_code}"}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    def export_payroll(self, payroll_data: List[Dict]) -> Dict[str, Any]:
        """Export vers Sage"""
        if not self.authenticate():
            return {"status": "error", "message": "Authentification échouée"}
        
        try:
            response = self.session.post(f"{self.api_url}/payroll/import", json={
                "data": payroll_data,
                "company": self.company_code
            })
            if response.status_code == 200:
                return {"status": "success", "message": "Export réussi"}
            return {"status": "error", "message": f"Erreur export: {response.status_code}"}
        except Exception as e:
            return {"status": "error", "message": str(e)}