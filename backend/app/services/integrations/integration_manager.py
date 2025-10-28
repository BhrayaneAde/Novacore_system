from typing import Dict, Any, Optional
from .sage_integration import SageIntegration
from .google_integration import GoogleCalendarIntegration
from .outlook_integration import OutlookIntegration
from .linkedin_integration import LinkedInIntegration

class IntegrationManager:
    """Gestionnaire central des intégrations"""
    
    def __init__(self):
        self.integrations = {}
    
    def get_integration(self, provider: str, config: Dict[str, Any]):
        """Factory pour créer les intégrations"""
        integration_classes = {
            'sage': SageIntegration,
            'google_calendar': GoogleCalendarIntegration,
            'outlook': OutlookIntegration,
            'linkedin': LinkedInIntegration
        }
        
        if provider not in integration_classes:
            raise ValueError(f"Provider {provider} non supporté")
        
        return integration_classes[provider](config)
    
    def test_connection(self, provider: str, config: Dict[str, Any]) -> Dict[str, Any]:
        """Test de connexion pour un provider"""
        try:
            integration = self.get_integration(provider, config)
            return integration.test_connection()
        except Exception as e:
            return {"status": "error", "message": str(e)}
    
    def sync_data(self, provider: str, config: Dict[str, Any], sync_type: str = "full") -> Dict[str, Any]:
        """Synchronisation des données"""
        try:
            integration = self.get_integration(provider, config)
            
            if provider == 'sage':
                if sync_type == 'employees':
                    return integration.sync_employees()
                elif sync_type == 'payroll':
                    return integration.sync_payroll('current')
                    
            elif provider == 'google_calendar':
                from datetime import datetime, timedelta
                start_date = datetime.now()
                end_date = start_date + timedelta(days=30)
                return integration.sync_events(start_date, end_date)
                
            elif provider == 'outlook':
                from datetime import datetime, timedelta
                start_date = datetime.now()
                end_date = start_date + timedelta(days=30)
                return integration.sync_calendar(start_date, end_date)
                
            elif provider == 'linkedin':
                return integration.get_company_followers()
            
            return {"status": "error", "message": "Type de sync non supporté"}
            
        except Exception as e:
            return {"status": "error", "message": str(e)}

# Instance globale
integration_manager = IntegrationManager()