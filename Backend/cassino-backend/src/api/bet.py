from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.models.database import SessionLocal
from src.models.bet import Bet
from src.services.balance import update_balance
import random

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/bets")
def list_bets(db: Session = Depends(get_db)):
    from src.models.bet import Bet
    return db.query(Bet).all()

@router.post("/bet/coinflip")
def coinflip(user_id: int, amount: float, choice: str, db: Session = Depends(get_db)):
    if choice not in ["cara", "coroa"]:
        return {"erro": "Escolha 'cara' ou 'coroa'"}
    
    new_balance = update_balance(db, user_id, -amount)
    if new_balance is None:
        return {"erro": "Saldo insuficiente"}
    if choice in ["cara","coroa"]:
        resultado = random.choice(["cara", "coroa"])
    won = choice == resultado
    if won:
        new_balance = update_balance(db, user_id, amount * 2)

    return {"resultado": resultado, "ganhou": won, "new_balance": new_balance}

@router.post("/bet/roleta")
def roleta(user_id: int, amount:float, choice: str, db: Session = Depends(get_db)):
    if choice not in ["1","36"]:
        return {"erro": "Escolha um numero entre 1 a 36"}

    new_balance = update_balance(db,user_id, -amount)

    if new_balance is None:
        return{"erro":"Saldo insuficiente"}
    if choice in ["1","36"]:
        resultado = random.choice([1,36])
    won = choice == resultado
    if won:
        new_balance = update_balance(db,user_id,amount*2)
    return{"resultado":resultado,"ganhou":won,"new_balance":new_balance}