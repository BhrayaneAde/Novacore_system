from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.api import deps
from app.crud import crud_user
from app.core.security import verify_token

security = HTTPBearer()

def get_current_user(
    db: Session = Depends(deps.get_db),
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """
    Récupère l'utilisateur actuel à partir du token JWT
    """
    try:
        token = credentials.credentials
        payload = verify_token(token)
        user_id = payload.get("sub")
        
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token invalide"
            )
        
        user = crud_user.get_user(db, user_id=int(user_id))
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Utilisateur non trouvé"
            )
        
        return user
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalide"
        )