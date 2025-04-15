from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.models.database import AsyncSessionLocal
from src.models.user import User
from src.services.balance import get_balance
from src.services.user_service import create_user, get_user_by_username,update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

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

@router.get("/user")
async def get_users(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User))  
    user = result.scalars().all()  

    # 🟢 Transformar os objetos SQLAlchemy em dicionários serializáveis
    return [user.__dict__ for user in user]

@router.put("/user/atualizacao")
async def atualizacao(username:str,balance:float,db:Session = Depends(get_db)):
    user = await get_user_by_username(db,username)
    user_id = user.id
    new_info = await update(db,user_id,balance)
    return {
        "usuario":username,
        "id":user_id,
        "balance":new_info
    }