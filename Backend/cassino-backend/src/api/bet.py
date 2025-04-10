from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.models.database import AsyncSessionLocal
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from src.models.bet import Bet
from src.services.balance import update_balance
from src.services.bet_service import register_bet
from src.services.user_service import get_user_by_username
import random

router = APIRouter()

async def get_db():
    db = AsyncSessionLocal()
    try:
        yield db
    finally:
       await db.close()


@router.get("/bets")
async def list_bets(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Bet))  
    bets = result.scalars().all()  

    # 🟢 Transformar os objetos SQLAlchemy em dicionários serializáveis
    return [bet.__dict__ for bet in bets]


@router.post("/bet/coinflip")
async def coinflip( amount: float, choice: str,nome:str,multiplier:int ,db: AsyncSession = Depends(get_db)):
    user = await get_user_by_username(db,nome)
    user_id = user.id
    if choice not in ["cara", "coroa"]:
        return {"erro": "Escolha 'cara' ou 'coroa'"}

    new_balance = await update_balance(db, user_id, -amount)
    if new_balance is None:
        return {"erro": "Saldo insuficiente"}

    resultado = random.choice(["cara", "coroa"])
    won = choice == resultado

    if won:
        new_balance = await update_balance(db, user_id, amount * multiplier)
        await register_bet(db, user_id, "coinflip", amount, "win")
    else:
        await register_bet(db, user_id, "coinflip", amount, "lose")

    return {"resultado": resultado, "ganhou": won, "new_balance": new_balance}

@router.post("/bet/roleta")
async def roleta(nome:str, amount: float, choice: int,multiplier: int ,db: AsyncSession = Depends(get_db)):
    import random
    user = await get_user_by_username(db,nome)
    user_id = user.id
    # Validação do número escolhido
    if not (1 <= choice <= 36):
        return {"erro": "Escolha um número entre 1 e 36"}

    # Desconta saldo
    new_balance = await update_balance(db, user_id, -amount)
    if new_balance is None:
        return {"erro": "Saldo insuficiente"}

    # Sorteia número da roleta
    resultado = random.randint(1, 36)
    won = choice == resultado

    # Se ganhou, dobra o valor apostado
    if won:
        new_balance = await update_balance(db, user_id, amount * multiplier)
        await register_bet(db, user_id, "roleta", amount, "win")
    else:
        await register_bet(db, user_id, "roleta", amount, "lose")

    return {
        "resultado": resultado,
        "ganhou": won,
        "new_balance": new_balance
    }
