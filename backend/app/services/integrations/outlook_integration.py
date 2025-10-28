import requests
from typing import Dict, Any, List
from datetime import datetime

class OutlookIntegration:
    def __init__(self, config: Dict[str, Any]):
        self.tenant_id = config.get('tenant_id')
        self.client_id = config.get('client_id')
        self.client_secret = config.get('client_secret')
        self.access_token = None
        self.graph_url = "https://graph.microsoft.com/v1.0"

    def authenticate(self, access_token: str) -> bool:
        """Authentification avec Microsoft Graph"""
        try:
            self.access_token = access_token
            headers = {'Authorization': f'Bearer {access_token}'}
            response = requests.get(f"{self.graph_url}/me", headers=headers)
            return response.status_code == 200
        except Exception:
            return False

    def test_connection(self) -> Dict[str, Any]:
        """Test de connexion"""
        if not self.access_token:
            return {"status": "error", "message": "Token d'accès manquant"}
        
        try:
            headers = {'Authorization': f'Bearer {self.access_token}'}
            response = requests.get(f"{self.graph_url}/me", headers=headers)
            
            if response.status_code == 200:
                user_info = response.json()
                return {
                    "status": "success", 
                    "message": f"Connexion réussie: {user_info.get('displayName')}"
                }
            return {"status": "error", "message": f"Erreur API: {response.status_code}"}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    def create_event(self, event_data: Dict[str, Any]) -> Dict[str, Any]:
        """Création d'événement Outlook"""
        try:
            headers = {
                'Authorization': f'Bearer {self.access_token}',
                'Content-Type': 'application/json'
            }
            
            event = {
                "subject": event_data.get('title'),
                "body": {
                    "contentType": "HTML",
                    "content": event_data.get('description', '')
                },
                "start": {
                    "dateTime": event_data.get('start_time'),
                    "timeZone": "Europe/Paris"
                },
                "end": {
                    "dateTime": event_data.get('end_time'),
                    "timeZone": "Europe/Paris"
                },
                "attendees": [
                    {
                        "emailAddress": {"address": email, "name": email}
                    } for email in event_data.get('attendees', [])
                ]
            }
            
            response = requests.post(
                f"{self.graph_url}/me/events",
                headers=headers,
                json=event
            )
            
            if response.status_code == 201:
                created_event = response.json()
                return {
                    "status": "success",
                    "event_id": created_event.get('id'),
                    "link": created_event.get('webLink')
                }
            return {"status": "error", "message": f"Erreur création: {response.status_code}"}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    def sync_calendar(self, start_date: datetime, end_date: datetime) -> Dict[str, Any]:
        """Synchronisation du calendrier"""
        try:
            headers = {'Authorization': f'Bearer {self.access_token}'}
            
            params = {
                'startDateTime': start_date.isoformat(),
                'endDateTime': end_date.isoformat()
            }
            
            response = requests.get(
                f"{self.graph_url}/me/calendarView",
                headers=headers,
                params=params
            )
            
            if response.status_code == 200:
                events = response.json().get('value', [])
                return {
                    "status": "success",
                    "events": events,
                    "count": len(events)
                }
            return {"status": "error", "message": f"Erreur sync: {response.status_code}"}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    def send_email(self, email_data: Dict[str, Any]) -> Dict[str, Any]:
        """Envoi d'email via Outlook"""
        try:
            headers = {
                'Authorization': f'Bearer {self.access_token}',
                'Content-Type': 'application/json'
            }
            
            message = {
                "message": {
                    "subject": email_data.get('subject'),
                    "body": {
                        "contentType": "HTML",
                        "content": email_data.get('body')
                    },
                    "toRecipients": [
                        {
                            "emailAddress": {"address": email}
                        } for email in email_data.get('to', [])
                    ]
                }
            }
            
            response = requests.post(
                f"{self.graph_url}/me/sendMail",
                headers=headers,
                json=message
            )
            
            if response.status_code == 202:
                return {"status": "success", "message": "Email envoyé"}
            return {"status": "error", "message": f"Erreur envoi: {response.status_code}"}
        except Exception as e:
            return {"status": "error", "message": str(e)}