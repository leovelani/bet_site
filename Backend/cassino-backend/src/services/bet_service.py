from sqlalchemy.orm import Session
from src.models.bet import Bet

from sqlalchemy.ext.asyncio import AsyncSession

async def register_bet(db: AsyncSession, user_id: str, game: str, amount: float, result: str):
    bet = Bet(

        user_id=user_id,
        game=game,
        amount=amount,
        result=result,
    )
    db.add(bet)
    await db.commit()
    await db.refresh(bet)
    return bet
