from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.api import deps
from app.crud import crud_assets
from app.schemas import assets as assets_schema
from app.db import models

router = APIRouter()

@router.get("/", response_model=List[assets_schema.Asset])
def read_assets(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_user)
):
    """Récupérer tous les équipements de l'entreprise"""
    assets = crud_assets.get_assets(db, company_id=current_user.company_id, skip=skip, limit=limit)
    
    # Format response with employee info
    result = []
    for asset in assets:
        asset_dict = {
            "id": asset.id,
            "asset_id": asset.asset_id,
            "name": asset.name,
            "category": asset.category,
            "brand": asset.brand,
            "model": asset.model,
            "serial_number": asset.serial_number,
            "purchase_date": asset.purchase_date,
            "warranty_end": asset.warranty_end,
            "status": asset.status,
            "condition": asset.condition,
            "location": asset.location,
            "value": asset.value,
            "description": asset.description,
            "company_id": asset.company_id,
            "assigned_to_id": asset.assigned_to_id,
            "assigned_to": {
                "id": asset.assigned_to.id,
                "name": asset.assigned_to.name,
                "email": asset.assigned_to.email
            } if asset.assigned_to else None,
            "tags": [{"id": tag.id, "asset_id": tag.asset_id, "tag_name": tag.tag_name} for tag in asset.tags],
            "created_at": asset.created_at,
            "updated_at": asset.updated_at
        }
        result.append(asset_dict)
    
    return result

@router.post("/", response_model=assets_schema.Asset)
def create_asset(
    asset: assets_schema.AssetCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user)
):
    """Créer un nouvel équipement"""
    return crud_assets.create_asset(db=db, asset=asset, company_id=current_user.company_id)

@router.get("/{asset_id}", response_model=assets_schema.AssetWithHistory)
def read_asset(
    asset_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user)
):
    """Récupérer un équipement avec son historique"""
    asset = crud_assets.get_asset(db, asset_id=asset_id)
    if asset is None or asset.company_id != current_user.company_id:
        raise HTTPException(status_code=404, detail="Équipement non trouvé")
    return asset

@router.put("/{asset_id}", response_model=assets_schema.Asset)
def update_asset(
    asset_id: int,
    asset: assets_schema.AssetUpdate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user)
):
    """Mettre à jour un équipement"""
    db_asset = crud_assets.get_asset(db, asset_id=asset_id)
    if db_asset is None or db_asset.company_id != current_user.company_id:
        raise HTTPException(status_code=404, detail="Équipement non trouvé")
    return crud_assets.update_asset(db=db, db_asset=db_asset, asset_in=asset)

@router.delete("/{asset_id}")
def delete_asset(
    asset_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user)
):
    """Supprimer un équipement"""
    db_asset = crud_assets.get_asset(db, asset_id=asset_id)
    if db_asset is None or db_asset.company_id != current_user.company_id:
        raise HTTPException(status_code=404, detail="Équipement non trouvé")
    
    success = crud_assets.delete_asset(db=db, asset_id=asset_id)
    if not success:
        raise HTTPException(status_code=400, detail="Erreur lors de la suppression")
    
    return {"message": "Équipement supprimé avec succès"}

@router.post("/{asset_id}/assign/{employee_id}")
def assign_asset(
    asset_id: int,
    employee_id: int,
    location: str = None,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user)
):
    """Assigner un équipement à un employé"""
    db_asset = crud_assets.get_asset(db, asset_id=asset_id)
    if db_asset is None or db_asset.company_id != current_user.company_id:
        raise HTTPException(status_code=404, detail="Équipement non trouvé")
    
    # Vérifier que l'employé existe et appartient à la même entreprise
    employee = db.query(models.Employee).filter(
        models.Employee.id == employee_id,
        models.Employee.company_id == current_user.company_id
    ).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employé non trouvé")
    
    updated_asset = crud_assets.assign_asset(db=db, asset_id=asset_id, employee_id=employee_id, location=location)
    return {"message": f"Équipement assigné à {employee.name}", "asset": updated_asset}

@router.post("/{asset_id}/unassign")
def unassign_asset(
    asset_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user)
):
    """Désassigner un équipement"""
    db_asset = crud_assets.get_asset(db, asset_id=asset_id)
    if db_asset is None or db_asset.company_id != current_user.company_id:
        raise HTTPException(status_code=404, detail="Équipement non trouvé")
    
    updated_asset = crud_assets.unassign_asset(db=db, asset_id=asset_id)
    return {"message": "Équipement désassigné", "asset": updated_asset}

@router.get("/{asset_id}/history", response_model=List[assets_schema.AssetHistory])
def get_asset_history(
    asset_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user)
):
    """Récupérer l'historique d'un équipement"""
    db_asset = crud_assets.get_asset(db, asset_id=asset_id)
    if db_asset is None or db_asset.company_id != current_user.company_id:
        raise HTTPException(status_code=404, detail="Équipement non trouvé")
    
    return crud_assets.get_asset_history(db=db, asset_id=asset_id)

@router.get("/{asset_id}/qr-code")
def generate_qr_code(
    asset_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user)
):
    """Générer un QR code pour l'équipement"""
    db_asset = crud_assets.get_asset(db, asset_id=asset_id)
    if db_asset is None or db_asset.company_id != current_user.company_id:
        raise HTTPException(status_code=404, detail="Équipement non trouvé")
    
    # Ici vous pourriez intégrer une vraie génération de QR code
    qr_data = {
        "asset_id": db_asset.asset_id,
        "name": db_asset.name,
        "company_id": db_asset.company_id,
        "url": f"/assets/{asset_id}"
    }
    
    return {"message": "QR Code généré", "data": qr_data}

@router.get("/{asset_id}/label")
def generate_label(
    asset_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user)
):
    """Générer une étiquette pour l'équipement"""
    db_asset = crud_assets.get_asset(db, asset_id=asset_id)
    if db_asset is None or db_asset.company_id != current_user.company_id:
        raise HTTPException(status_code=404, detail="Équipement non trouvé")
    
    label_data = {
        "asset_id": db_asset.asset_id,
        "name": db_asset.name,
        "category": db_asset.category,
        "serial_number": db_asset.serial_number,
        "company": current_user.company.name if current_user.company else "NovaCore"
    }
    
    return {"message": "Étiquette générée", "data": label_data}