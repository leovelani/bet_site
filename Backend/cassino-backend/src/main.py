from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from src.api import user, bet
from src.models.database import engine, Base



# Criação do lifespan para eventos de inicialização e finalização
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Iniciando aplicação...")
#    Base.metadata.create_all(bind=engine)
    yield  # O servidor roda enquanto não sair desse `yield`
    print("🛑 Encerrando aplicação...")
    await close_db_connection()

# Função para fechar conexão com o banco
async def close_db_connection():
    print("🔌 Fechando conexão com o banco de dados...")
    await engine.dispose()

app = FastAPI(lifespan=lifespan)

# ✅ Adicionando o Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite todas as origens (use domínios específicos em produção)
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos os métodos HTTP
    allow_headers=["*"],  # Permite todos os cabeçalhos
)


# Adicionar rotas
app.include_router(user.router, prefix="/user", tags=["User"])
app.include_router(bet.router, prefix="/bet", tags=["Bet"])