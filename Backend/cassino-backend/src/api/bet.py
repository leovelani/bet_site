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

router = APIRouter(prefix="/bet")

async def get_db():
    db = AsyncSessionLocal()
    try:
        yield db
    finally:
       await db.close()


@router.get("/bets")
async def list_bets(user_id:int,db: AsyncSession = Depends(get_db)):
#    result = await db.execute(select(Bet))  
    result = await db.execute(select(Bet).filter(Bet.user_id == user_id))
    bets = result.scalars().all()  

    # 🟢 Transformar os objetos SQLAlchemy em dicionários serializáveis
    return [bet.__dict__ for bet in bets]


# Adicionar contadores de vitórias e derrotas para o CoinFlip
coinflip_victory_count = 0
defeat_count = 0

# Adicionar variável para armazenar o número de derrotas necessárias antes de uma vitória
required_defeats = random.randint(2, 10)

@router.post("/coinflip")
async def coinflip(amount: float, choice: str, nome: str, multiplier: int, db: AsyncSession = Depends(get_db)):
    global coinflip_victory_count, defeat_count, required_defeats
    user = await get_user_by_username(db, nome)
    user_id = user.id
    if choice not in ["cara", "coroa"]:
        return {"erro": "Escolha 'cara' ou 'coroa'"}

    new_balance = await update_balance(db, user_id, -amount)
    if new_balance is None:
        return {"erro": "Saldo insuficiente"}

    # Lógica viciada
    if coinflip_victory_count >= 1:
        # Forçar derrota
        resultado = "cara" if choice == "coroa" else "coroa"
        won = False
        coinflip_victory_count = 0
        defeat_count += 1
    elif defeat_count >= required_defeats:
        # Forçar vitória
        resultado = choice
        won = True
        defeat_count = 0
        coinflip_victory_count += 1
        required_defeats = random.randint(2, 10)  # Redefinir o número de derrotas necessárias
    else:
        # Sorteia resultado do coinflip
        resultado = random.choice(["cara", "coroa"])
        won = choice == resultado
        if won:
            coinflip_victory_count += 1
            defeat_count = 0
        else:
            defeat_count += 1

    if won:
        new_balance = await update_balance(db, user_id, amount * multiplier)
        await register_bet(db, user_id, "coinflip", amount, "win")
    else:
        await register_bet(db, user_id, "coinflip", amount, "lose")

    return {"resultado": resultado, "ganhou": won, "new_balance": new_balance}

# Adicionar contadores de vitórias e derrotas
victory_count = 0
defeat_count = 0

@router.post("/roleta")
async def roleta(amount: float, choice: int, nome: str, multiplier: int, db: AsyncSession = Depends(get_db)):
    global victory_count, defeat_count, required_defeats
    user = await get_user_by_username(db, nome)
    user_id = user.id
    
    # Validação do número escolhido
    if not (1 <= choice <= 36):
        return {"erro": "Escolha um número entre 1 e 36"}

    # Desconta saldo
    new_balance = await update_balance(db, user_id, -amount)
    if new_balance is None:
        return {"erro": "Saldo insuficiente"}

    # Lógica viciada
    if victory_count >= 1:
        # Forçar derrota
        resultado = random.choice([i for i in range(1, 37) if i != choice])
        won = False
        victory_count = 0
        defeat_count += 1
    elif defeat_count >= required_defeats:
        # Forçar vitória
        resultado = choice
        won = True
        defeat_count = 0
        victory_count += 1
        required_defeats = random.randint(2, 10)  # Redefinir o número de derrotas necessárias
    else:
        # Sorteia número da roleta
        resultado = random.randint(1, 36)
        won = choice == resultado
        if won:
            victory_count += 1
            defeat_count = 0
        else:
            defeat_count += 1

    # Se ganhou, multiplica o valor apostado
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
