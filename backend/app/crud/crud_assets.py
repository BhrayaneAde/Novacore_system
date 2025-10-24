from sqlalchemy.orm import Session
from typing import Optional, List
from app.db import models
from app.schemas import assets as assets_schema

def get_asset(db: Session, asset_id: int) -> Optional[models.CompanyAsset]:
    return db.query(models.CompanyAsset).filter(models.CompanyAsset.id == asset_id).first()

def get_assets(db: Session, company_id: int, skip: int = 0, limit: int = 100) -> List[models.CompanyAsset]:
    return db.query(models.CompanyAsset).filter(models.CompanyAsset.company_id == company_id).offset(skip).limit(limit).all()

def create_asset(db: Session, asset: assets_schema.CompanyAssetCreate) -> models.CompanyAsset:
    db_asset = models.CompanyAsset(**asset.dict())
    db.add(db_asset)
    db.commit()
    db.refresh(db_asset)
    return db_asset

def update_asset(db: Session, db_asset: models.CompanyAsset, asset_in: assets_schema.CompanyAssetUpdate) -> models.CompanyAsset:
    update_data = asset_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_asset, key, value)
    db.add(db_asset)
    db.commit()
    db.refresh(db_asset)
    return db_asset