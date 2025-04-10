from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session
from sqlalchemy.future import select
from src.models.user import User

async def get_user_by_username(db: AsyncSession, username: str):
    result = await db.execute(select(User).filter(User.username == username))
    return result.scalars().first()

async def create_user(db: Session, username: str, balance: int):

    new_user =  User(username=username,balance=balance)
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user
