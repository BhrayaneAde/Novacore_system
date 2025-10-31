from sqlalchemy.orm import Session, joinedload
from typing import Optional, List
from app.db import models
from app.schemas import assets as assets_schema
from datetime import datetime

def generate_asset_id(db: Session, company_id: int) -> str:
    """Generate unique asset ID like EQ001, EQ002, etc."""
    last_asset = db.query(models.Asset).filter(
        models.Asset.company_id == company_id
    ).order_by(models.Asset.id.desc()).first()
    
    if last_asset and last_asset.asset_id:
        try:
            last_num = int(last_asset.asset_id[2:])
            new_num = last_num + 1
        except:
            new_num = 1
    else:
        new_num = 1
    
    return f"EQ{new_num:03d}"

def get_asset(db: Session, asset_id: int) -> Optional[models.Asset]:
    return db.query(models.Asset).options(
        joinedload(models.Asset.assigned_to),
        joinedload(models.Asset.tags),
        joinedload(models.Asset.asset_history)
    ).filter(models.Asset.id == asset_id).first()

def get_assets(db: Session, company_id: int, skip: int = 0, limit: int = 100) -> List[models.Asset]:
    return db.query(models.Asset).options(
        joinedload(models.Asset.assigned_to),
        joinedload(models.Asset.tags)
    ).filter(models.Asset.company_id == company_id).offset(skip).limit(limit).all()

def create_asset(db: Session, asset: assets_schema.AssetCreate, company_id: int) -> models.Asset:
    asset_data = asset.dict(exclude={'tags'})
    asset_data['company_id'] = company_id
    asset_data['asset_id'] = generate_asset_id(db, company_id)
    
    db_asset = models.Asset(**asset_data)
    db.add(db_asset)
    db.flush()
    
    # Add tags
    if asset.tags:
        for tag_name in asset.tags:
            tag = models.AssetTag(asset_id=db_asset.id, tag_name=tag_name)
            db.add(tag)
    
    # Add history entry
    history = models.AssetHistory(
        asset_id=db_asset.id,
        action="created",
        notes="Équipement créé"
    )
    db.add(history)
    
    db.commit()
    db.refresh(db_asset)
    return db_asset

def update_asset(db: Session, db_asset: models.Asset, asset_in: assets_schema.AssetUpdate) -> models.Asset:
    update_data = asset_in.dict(exclude_unset=True, exclude={'tags'})
    
    # Track changes for history
    changes = []
    for key, value in update_data.items():
        if hasattr(db_asset, key) and getattr(db_asset, key) != value:
            old_value = getattr(db_asset, key)
            changes.append(f"{key}: {old_value} → {value}")
            setattr(db_asset, key, value)
    
    # Update tags if provided
    if asset_in.tags is not None:
        # Remove existing tags
        db.query(models.AssetTag).filter(models.AssetTag.asset_id == db_asset.id).delete()
        # Add new tags
        for tag_name in asset_in.tags:
            tag = models.AssetTag(asset_id=db_asset.id, tag_name=tag_name)
            db.add(tag)
    
    # Add history entry if there were changes
    if changes:
        history = models.AssetHistory(
            asset_id=db_asset.id,
            action="updated",
            notes=f"Modifications: {', '.join(changes)}"
        )
        db.add(history)
    
    db.commit()
    db.refresh(db_asset)
    return db_asset

def assign_asset(db: Session, asset_id: int, employee_id: int, location: str = None) -> models.Asset:
    db_asset = get_asset(db, asset_id)
    if not db_asset:
        return None
    
    old_employee_id = db_asset.assigned_to_id
    db_asset.assigned_to_id = employee_id
    db_asset.status = models.AssetStatus.ASSIGNED
    if location:
        db_asset.location = location
    
    # Add history entry
    history = models.AssetHistory(
        asset_id=asset_id,
        action="assigned",
        employee_id=employee_id,
        location=location,
        notes=f"Assigné à l'employé ID {employee_id}"
    )
    db.add(history)
    
    db.commit()
    db.refresh(db_asset)
    return db_asset

def unassign_asset(db: Session, asset_id: int) -> models.Asset:
    db_asset = get_asset(db, asset_id)
    if not db_asset:
        return None
    
    old_employee_id = db_asset.assigned_to_id
    db_asset.assigned_to_id = None
    db_asset.status = models.AssetStatus.AVAILABLE
    
    # Add history entry
    history = models.AssetHistory(
        asset_id=asset_id,
        action="returned",
        employee_id=old_employee_id,
        notes="Équipement retourné"
    )
    db.add(history)
    
    db.commit()
    db.refresh(db_asset)
    return db_asset

def delete_asset(db: Session, asset_id: int) -> bool:
    db_asset = get_asset(db, asset_id)
    if not db_asset:
        return False
    
    db.delete(db_asset)
    db.commit()
    return True

def get_asset_history(db: Session, asset_id: int) -> List[models.AssetHistory]:
    return db.query(models.AssetHistory).filter(
        models.AssetHistory.asset_id == asset_id
    ).order_by(models.AssetHistory.created_at.desc()).all()

# Legacy functions for compatibility
def get_company_asset(db: Session, asset_id: int) -> Optional[models.CompanyAsset]:
    return db.query(models.CompanyAsset).filter(models.CompanyAsset.id == asset_id).first()

def get_company_assets(db: Session, company_id: int, skip: int = 0, limit: int = 100) -> List[models.CompanyAsset]:
    return db.query(models.CompanyAsset).filter(models.CompanyAsset.company_id == company_id).offset(skip).limit(limit).all()

def create_company_asset(db: Session, asset: assets_schema.CompanyAssetCreate) -> models.CompanyAsset:
    db_asset = models.CompanyAsset(**asset.dict())
    db.add(db_asset)
    db.commit()
    db.refresh(db_asset)
    return db_asset

def update_company_asset(db: Session, db_asset: models.CompanyAsset, asset_in: assets_schema.CompanyAssetUpdate) -> models.CompanyAsset:
    update_data = asset_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_asset, key, value)
    db.add(db_asset)
    db.commit()
    db.refresh(db_asset)
    return db_asset