from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from typing import Dict, Any, List
from datetime import datetime, timedelta

class GoogleCalendarIntegration:
    def __init__(self, config: Dict[str, Any]):
        self.client_id = config.get('client_id')
        self.client_secret = config.get('client_secret')
        self.calendar_id = config.get('calendar_id', 'primary')
        self.credentials = None
        self.service = None

    def authenticate(self, access_token: str) -> bool:
        """Authentification avec Google Calendar"""
        try:
            self.credentials = Credentials(
                token=access_token,
                client_id=self.client_id,
                client_secret=self.client_secret
            )
            self.service = build('calendar', 'v3', credentials=self.credentials)
            return True
        except Exception:
            return False

    def test_connection(self) -> Dict[str, Any]:
        """Test de connexion"""
        if not self.service:
            return {"status": "error", "message": "Service non initialisé"}
        
        try:
            calendar = self.service.calendars().get(calendarId=self.calendar_id).execute()
            return {"status": "success", "message": f"Connexion réussie: {calendar.get('summary')}"}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    def create_event(self, event_data: Dict[str, Any]) -> Dict[str, Any]:
        """Création d'événement"""
        try:
            event = {
                'summary': event_data.get('title'),
                'description': event_data.get('description'),
                'start': {
                    'dateTime': event_data.get('start_time'),
                    'timeZone': 'Europe/Paris',
                },
                'end': {
                    'dateTime': event_data.get('end_time'),
                    'timeZone': 'Europe/Paris',
                },
                'attendees': [{'email': email} for email in event_data.get('attendees', [])]
            }
            
            created_event = self.service.events().insert(
                calendarId=self.calendar_id, 
                body=event
            ).execute()
            
            return {
                "status": "success",
                "event_id": created_event.get('id'),
                "link": created_event.get('htmlLink')
            }
        except Exception as e:
            return {"status": "error", "message": str(e)}

    def sync_events(self, start_date: datetime, end_date: datetime) -> Dict[str, Any]:
        """Synchronisation des événements"""
        try:
            events_result = self.service.events().list(
                calendarId=self.calendar_id,
                timeMin=start_date.isoformat(),
                timeMax=end_date.isoformat(),
                singleEvents=True,
                orderBy='startTime'
            ).execute()
            
            events = events_result.get('items', [])
            
            return {
                "status": "success",
                "events": events,
                "count": len(events)
            }
        except Exception as e:
            return {"status": "error", "message": str(e)}

    def create_interview_event(self, interview_data: Dict[str, Any]) -> Dict[str, Any]:
        """Création d'événement d'entretien"""
        event_data = {
            'title': f"Entretien - {interview_data.get('candidate_name')}",
            'description': f"Entretien pour le poste: {interview_data.get('position')}",
            'start_time': interview_data.get('start_time'),
            'end_time': interview_data.get('end_time'),
            'attendees': interview_data.get('attendees', [])
        }
        return self.create_event(event_data)