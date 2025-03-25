from fastapi import FastAPI
from src.api import user, bet
from src.models.database import Base, engine

# Criar as tabelas no banco de dados
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Adicionar rotas
app.include_router(user.router, prefix="/user", tags=["User"])
app.include_router(bet.router, prefix="/bet", tags=["Bet"])
