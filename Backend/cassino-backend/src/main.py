from fastapi import FastAPI
from contextlib import asynccontextmanager
from src.api import user, bet
from src.models.database import engine

# Criação do lifespan para eventos de inicialização e finalização
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Iniciando aplicação...")
    yield  # O servidor roda enquanto não sair desse `yield`
    print("🛑 Encerrando aplicação...")
    await close_db_connection()

# Função para fechar conexão com o banco
async def close_db_connection():
    print("🔌 Fechando conexão com o banco de dados...")
    await engine.dispose()

app = FastAPI(lifespan=lifespan)

# Adicionar rotas
app.include_router(user.router, prefix="/user", tags=["User"])
app.include_router(bet.router, prefix="/bet", tags=["Bet"])
