from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
#from src.models.database import SessionLocal
from src.models.database import AsyncSessionLocal
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from src.models.bet import Bet
from src.services.balance import update_balance
from src.services.bet_service import register_bet
import random

router = APIRouter()

def get_db():
    db = AsyncSessionLocal()
    try:
        yield db
    finally:
        db.close()

#@router.get("/bets")
#def list_bets(db: Session = Depends(get_db)):
#    from src.models.bet import Bet
#    return db.query(Bet).all()

#@router.get("/bets")
#async def list_bets(db: AsyncSession = Depends(get_db)):  # 🟢 Agora é assíncrono
#    result = await db.execute(select(Bet))  # 🟢 Correção: Usando `select()`
#    return result.scalars().all()  # 🟢 Retorna a lista de apostas

@router.get("/bets")
async def list_bets(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Bet))  
    bets = result.scalars().all()  

    # 🟢 Transformar os objetos SQLAlchemy em dicionários serializáveis
    return [bet.__dict__ for bet in bets]

#@router.post("/bet/coinflip")
#def coinflip(user_id: int, amount: float, choice: str, db: Session = Depends(get_db)):
#    if choice not in ["cara", "coroa"]:
#        return {"erro": "Escolha 'cara' ou 'coroa'"}
#    
#    new_balance = update_balance(db, user_id, -amount)
#    if new_balance is None:
#        return {"erro": "Saldo insuficiente"}
#    if choice in ["cara","coroa"]:
#        resultado = random.choice(["cara", "coroa"])
#    won = choice == resultado
#    if won:
#        new_balance = update_balance(db, user_id, amount * 2)
#        register_bet(db,1,user_id,"coinflip",amount,"win")
#    else:
#        register_bet(db,1,user_id,"coinflip",amount,"lose")
#
#    return {"resultado": resultado, "ganhou": won, "new_balance": new_balance}

@router.post("/bet/coinflip")
async def coinflip(user_id: int, amount: float, choice: str, db: AsyncSession = Depends(get_db)):
    if choice not in ["cara", "coroa"]:
        return {"erro": "Escolha 'cara' ou 'coroa'"}

    new_balance = await update_balance(db, user_id, -amount)
    if new_balance is None:
        return {"erro": "Saldo insuficiente"}

    resultado = random.choice(["cara", "coroa"])
    won = choice == resultado

    if won:
        new_balance = await update_balance(db, user_id, amount * 2)
        await register_bet(db, 1, user_id, "coinflip", amount, "win")
    else:
        await register_bet(db, 1, user_id, "coinflip", amount, "lose")

    return {"resultado": resultado, "ganhou": won, "new_balance": new_balance}
'''
@router.post("/bet/roleta")
def roleta(user_id: int, amount:float, choice: int, db: Session = Depends(get_db)):
    if not choice.isdigit() or not (1 <= int(choice) <= 36):
        return {"erro": "Escolha um número entre 1 e 36"}

    new_balance = update_balance(db,user_id, -amount)

    if new_balance is None:
        return{"erro":"Saldo insuficiente"}

    resultado = random.choice([1,36])
    won = choice == resultado
    if won:
        new_balance = update_balance(db,user_id,amount*2)
    return{"resultado":resultado,"ganhou":won,"new_balance":new_balance}
    '''
@router.post("/bet/roleta")
async def roleta(user_id: int, amount: float, choice: int, db: AsyncSession = Depends(get_db)):
    from src.services.balance import update_balance
    from src.services.bet_service import register_bet
    import random

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
        new_balance = await update_balance(db, user_id, amount * 2)
        await register_bet(db, None, user_id, "roleta", amount, "win")
    else:
        await register_bet(db, None, user_id, "roleta", amount, "lose")

    return {
        "resultado": resultado,
        "ganhou": won,
        "new_balance": new_balance
    }
