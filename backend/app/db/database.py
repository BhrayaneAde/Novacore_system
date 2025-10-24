from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

# Crée le moteur SQLAlchemy
engine = create_engine(
    settings.DATABASE_URL
    # connect_args={"check_same_thread": False} # Uniquement nécessaire pour SQLite
)

# Crée une session locale
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Classe de base pour les modèles
Base = declarative_base()

# Dépendance FastAPI pour obtenir une session BDD
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()