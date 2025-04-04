from sqlalchemy.orm import Session
from src.models.bet import Bet

#def register_bet(db: Session,id: int,user_id: str, game: str, amount: float, result: str):
#    bet = Bet(
#        id=id,
#        user_id=user_id,
#        game=game,
#        amount=amount,
#        result=result,
#    )
#    db.add(bet)
#    db.commit()
#    db.refresh(bet)
#    return bet

from sqlalchemy.ext.asyncio import AsyncSession

async def register_bet(db: AsyncSession, id: int, user_id: str, game: str, amount: float, result: str):
    bet = Bet(
        id=id,
        user_id=user_id,
        game=game,
        amount=amount,
        result=result,
    )
    db.add(bet)
    await db.commit()
    await db.refresh(bet)
    return bet
