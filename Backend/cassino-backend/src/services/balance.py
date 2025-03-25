from sqlalchemy.orm import Session
from src.models.user import User

def get_balance(db: Session, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    return user.balance if user else None

def update_balance(db: Session, user_id: int, amount: float):
    user = db.query(User).filter(User.id == user_id).first()
    if user and (user.balance + amount >= 0):  # Evita saldo negativo
        user.balance += amount
        db.commit()
        db.refresh(user)
        return user.balance
    return None
