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

@router.post("/bet/coinflip")
def coinflip(user_id: int, amount: float, choice: str, db: Session = Depends(get_db)):
    if choice not in ["cara", "coroa"]:
        return {"error": "Escolha 'cara' ou 'coroa'"}
    else if choice not in["1","2"]:
        return {"error": "Escolha 'cara' ou 'coroa'"}

    new_balance = update_balance(db, user_id, -amount)
    if new_balance is None:
        return {"error": "Saldo insuficiente"}
    if choice in ["cara","coroa"]
        resultado = random.choice(["cara", "coroa"])
    won = choice == resultado
    if won:
        new_balance = update_balance(db, user_id, amount * 2)

    return {"resultado": resultado, "ganhou": won, "new_balance": new_balance}
