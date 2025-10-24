from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.db import models
from app.schemas import assets as assets_schema
from app.crud import crud_assets

router = APIRouter()

@router.get("/", response_model=List[assets_schema.CompanyAsset])
async def read_assets(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    return crud_assets.get_assets(db, company_id=current_user.company_id, skip=skip, limit=limit)

@router.post("/", response_model=assets_schema.CompanyAsset, status_code=status.HTTP_201_CREATED)
async def create_asset(
    asset_in: assets_schema.CompanyAssetCreate,
    db: Session = Depends(deps.get_db),
    current_admin: models.User = Depends(deps.get_current_active_hr_admin)
):
    asset_in.company_id = current_admin.company_id
    return crud_assets.create_asset(db=db, asset=asset_in)

@router.put("/{asset_id}", response_model=assets_schema.CompanyAsset)
async def update_asset(
    asset_id: int,
    asset_in: assets_schema.CompanyAssetUpdate,
    db: Session = Depends(deps.get_db),
    current_admin: models.User = Depends(deps.get_current_active_hr_admin)
):
    db_asset = crud_assets.get_asset(db, asset_id)
    if not db_asset or db_asset.company_id != current_admin.company_id:
        raise HTTPException(status_code=404, detail="Actif non trouvé")
    return crud_assets.update_asset(db=db, db_asset=db_asset, asset_in=asset_in)