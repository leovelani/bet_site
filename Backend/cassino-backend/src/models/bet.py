from sqlalchemy import Column, Integer, Float, String, ForeignKey
#from sqlalchemy.orm import relationship
from .database import Base

class Bet(Base):
    __tablename__ = "bets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    game = Column(String)  # 'coinflip' ou 'roleta'
    amount = Column(Float)
    result = Column(String)  # 'win' ou 'lose'

    # Relacionamento com o usuário
   # user = relationship("User")
