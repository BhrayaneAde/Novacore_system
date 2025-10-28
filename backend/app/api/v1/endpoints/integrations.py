from typing import List
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from datetime import datetime

from ....db.database import get_db
from ....db.models import ExternalIntegration, IntegrationSyncLog
from ....schemas.integration import (
    ExternalIntegrationCreate, ExternalIntegrationUpdate, ExternalIntegrationResponse,
    SyncLogResponse, INTEGRATION_CONFIGS, IntegrationStatus
)
from ....core.auth import get_current_user
from ....db.models import User
from ....services.integrations.integration_manager import integration_manager

router = APIRouter()

@router.get("/", response_model=List[ExternalIntegrationResponse])
def get_integrations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all integrations for company"""
    integrations = db.query(ExternalIntegration).filter(
        ExternalIntegration.company_id == current_user.company_id
    ).all()
    return integrations

@router.get("/configs")
def get_integration_configs():
    """Get available integration configurations"""
    return INTEGRATION_CONFIGS

@router.post("/", response_model=ExternalIntegrationResponse)
def create_integration(
    integration: ExternalIntegrationCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create new integration"""
    db_integration = ExternalIntegration(
        **integration.dict(),
        company_id=current_user.company_id
    )
    db.add(db_integration)
    db.commit()
    db.refresh(db_integration)
    
    # Test connection in background
    background_tasks.add_task(_test_integration_connection, db_integration.id)
    
    return db_integration

@router.put("/{integration_id}", response_model=ExternalIntegrationResponse)
def update_integration(
    integration_id: int,
    integration_update: ExternalIntegrationUpdate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update integration"""
    db_integration = db.query(ExternalIntegration).filter(
        ExternalIntegration.id == integration_id,
        ExternalIntegration.company_id == current_user.company_id
    ).first()
    
    if not db_integration:
        raise HTTPException(status_code=404, detail="Integration not found")
    
    update_data = integration_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_integration, field, value)
    
    db.commit()
    db.refresh(db_integration)
    
    # Test connection if config changed
    if "config" in update_data:
        background_tasks.add_task(_test_integration_connection, integration_id)
    
    return db_integration

@router.delete("/{integration_id}")
def delete_integration(
    integration_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete integration"""
    db_integration = db.query(ExternalIntegration).filter(
        ExternalIntegration.id == integration_id,
        ExternalIntegration.company_id == current_user.company_id
    ).first()
    
    if not db_integration:
        raise HTTPException(status_code=404, detail="Integration not found")
    
    db.delete(db_integration)
    db.commit()
    
    return {"message": "Integration deleted successfully"}

@router.post("/{integration_id}/test")
def test_integration(
    integration_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Test integration connection"""
    db_integration = db.query(ExternalIntegration).filter(
        ExternalIntegration.id == integration_id,
        ExternalIntegration.company_id == current_user.company_id
    ).first()
    
    if not db_integration:
        raise HTTPException(status_code=404, detail="Integration not found")
    
    background_tasks.add_task(_test_integration_connection, integration_id)
    
    return {"message": "Connection test started"}

@router.post("/{integration_id}/sync")
def sync_integration(
    integration_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Manually sync integration"""
    db_integration = db.query(ExternalIntegration).filter(
        ExternalIntegration.id == integration_id,
        ExternalIntegration.company_id == current_user.company_id
    ).first()
    
    if not db_integration:
        raise HTTPException(status_code=404, detail="Integration not found")
    
    if not db_integration.is_active:
        raise HTTPException(status_code=400, detail="Integration is not active")
    
    background_tasks.add_task(_sync_integration_data, integration_id)
    
    return {"message": "Sync started"}

@router.get("/{integration_id}/logs", response_model=List[SyncLogResponse])
def get_integration_logs(
    integration_id: int,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get integration sync logs"""
    # Verify integration belongs to user's company
    db_integration = db.query(ExternalIntegration).filter(
        ExternalIntegration.id == integration_id,
        ExternalIntegration.company_id == current_user.company_id
    ).first()
    
    if not db_integration:
        raise HTTPException(status_code=404, detail="Integration not found")
    
    logs = db.query(IntegrationSyncLog).filter(
        IntegrationSyncLog.integration_id == integration_id
    ).order_by(IntegrationSyncLog.started_at.desc()).limit(limit).all()
    
    return logs

# Background tasks
def _test_integration_connection(integration_id: int):
    """Test integration connection"""
    from ....db.database import SessionLocal
    
    db = SessionLocal()
    try:
        integration = db.query(ExternalIntegration).filter(
            ExternalIntegration.id == integration_id
        ).first()
        
        if not integration:
            return
        
        # Test connection
        result = integration_manager.test_connection(
            integration.provider, 
            integration.config
        )
        
        # Update status
        if result["status"] == "success":
            integration.status = IntegrationStatus.ACTIVE
            integration.last_error = None
        else:
            integration.status = IntegrationStatus.ERROR
            integration.last_error = result["message"]
        
        integration.last_sync = datetime.utcnow()
        db.commit()
        
    except Exception as e:
        if integration:
            integration.status = IntegrationStatus.ERROR
            integration.last_error = str(e)
            db.commit()
    finally:
        db.close()

def _sync_integration_data(integration_id: int):
    """Sync integration data"""
    from ....db.database import SessionLocal
    
    db = SessionLocal()
    try:
        integration = db.query(ExternalIntegration).filter(
            ExternalIntegration.id == integration_id
        ).first()
        
        if not integration:
            return
        
        # Create sync log
        sync_log = IntegrationSyncLog(
            integration_id=integration_id,
            status="running",
            started_at=datetime.utcnow()
        )
        db.add(sync_log)
        db.commit()
        
        # Update integration status
        integration.status = IntegrationStatus.SYNCING
        db.commit()
        
        # Perform sync
        result = integration_manager.sync_data(
            integration.provider,
            integration.config
        )
        
        # Update sync log
        sync_log.completed_at = datetime.utcnow()
        sync_log.duration_seconds = (sync_log.completed_at - sync_log.started_at).total_seconds()
        
        if result["status"] == "success":
            sync_log.status = "completed"
            sync_log.records_processed = result.get("count", 0)
            sync_log.records_success = result.get("count", 0)
            integration.status = IntegrationStatus.ACTIVE
            integration.last_error = None
        else:
            sync_log.status = "failed"
            sync_log.error_message = result["message"]
            integration.status = IntegrationStatus.ERROR
            integration.last_error = result["message"]
        
        integration.last_sync = datetime.utcnow()
        db.commit()
        
    except Exception as e:
        if 'sync_log' in locals():
            sync_log.status = "failed"
            sync_log.error_message = str(e)
            sync_log.completed_at = datetime.utcnow()
        if integration:
            integration.status = IntegrationStatus.ERROR
            integration.last_error = str(e)
        db.commit()
    finally:
        db.close()