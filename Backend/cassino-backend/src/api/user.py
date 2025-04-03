from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
#from src.models.database import SessionLocal
from src.models.database import AsyncSessionLocal
from src.models.user import User
from src.services.balance import get_balance
from src.services.user_service import create_user

router = APIRouter()

def get_db():
    db = AsyncSessionLocal()
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

@router.post("/user_service/inser_user")
def insert_user(id:int,username:str, balance:float,db:Session = Depends(get_db)):
    
    id = id
    balance = balance
    username = username
    new_user = create_user(db,username,id,balance)
    return new_user
