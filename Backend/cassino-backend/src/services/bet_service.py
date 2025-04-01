from sqlalchemy.orm import Session
from src.models.bet import Bet

def register_bet(db: Session, game: str, bet_number: int, bet_amount: float, result: int, win: bool):
    bet = Bet(
        game=game,
        bet_number=bet_number,
        bet_amount=bet_amount,
        result=result,
        win=win
    )
    db.add(bet)
    db.commit()
    db.refresh(bet)
    return bet
