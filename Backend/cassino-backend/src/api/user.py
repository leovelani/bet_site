from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.models.database import SessionLocal
from src.models.user import User
from src.services.balance import get_balance

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/balance/{user_id}")
def check_balance(user_id: int, db: Session = Depends(get_db)):
    balance = get_balance(db, user_id)
    if balance is not None:
        return {"user_id": user_id, "balance": balance}
    return {"error": "Usuário não encontrado"}
