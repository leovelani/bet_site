from sqlalchemy.orm import Session
#from src.models.user import User

#def get_balance(db: Session, user_id: int):
#    user = db.query(User).filter(User.id == user_id).first()
#    return user.balance if user else None

#def update_balance(db: Session, user_id: int, amount: float):
#    user = db.query(User).filter(User.id == user_id).first()
#    if user and (user.balance + amount >= 0):  # Evita saldo negativo
#        user.balance += amount
#        db.commit()
#        db.refresh(user)
#        return user.balance
#    return None

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from src.models.user import User  # Certifique-se de importar o modelo correto

async def get_balance(db: AsyncSession, user_id: int):
    result = await db.execute(select(User).filter(User.id == user_id))
    user = result.scalars().first()
    return user.balance if user else None

async def update_balance(db: AsyncSession, user_id: int, amount: float):
    result = await db.execute(select(User).filter(User.id == user_id))
    user = result.scalars().first()
    
    if user and (user.balance + amount >= 0):  # Evita saldo negativo
        user.balance += amount
        await db.commit()  # Confirma a transação
        await db.refresh(user)  # Atualiza os dados do usuário
        return user.balance
    return None
