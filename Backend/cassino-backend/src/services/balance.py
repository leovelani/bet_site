from sqlalchemy.orm import Session

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
