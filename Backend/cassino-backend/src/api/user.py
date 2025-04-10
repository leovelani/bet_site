from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.models.database import AsyncSessionLocal
from src.models.user import User
from src.services.balance import get_balance
from src.services.user_service import create_user

router = APIRouter()

async def get_db():
    db = AsyncSessionLocal()
    try:
        yield db
    finally:
        await db.close()

@router.get("/balance/{user_id}")
async def check_balance(user_id: int, db: Session = Depends(get_db)):
    balance = await get_balance(db, user_id)
    if balance is not None:
        return {"user_id": user_id, "balance": balance}
    return {"error": "Usuário não encontrado"}

@router.post("/user_service/inser_user")
async def insert_user(username:str, balance:float,db:Session = Depends(get_db)):
    
    balance = balance
    username = username
    new_user = await create_user(db,username,balance)
    return {
        "username": new_user.username,
        "balance":new_user.balance
    }
