from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from src.api import user, bet # Assumindo que user.py e bet.py estão em src/api/
from src.models.database import engine, Base, init_db # Assumindo caminhos corretos

# Lifespan para inicialização e finalização
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Iniciando aplicação...")
    # Base.metadata.create_all(bind=engine) # Se você usa Alembic, isso pode não ser necessário aqui
    await init_db() # Certifique-se que init_db() cria as tabelas se não existirem
    yield
    print("🛑 Encerrando aplicação...")
    await close_db_connection()

async def close_db_connection():
    print("🔌 Fechando conexão com o banco de dados...")
    # Para asyncio, o engine é geralmente fechado assim:
    if hasattr(engine, 'dispose'): # Para SQLAlchemy síncrono ou < 2.0
        await engine.dispose()
    elif hasattr(engine, 'close'): # Para SQLAlchemy >= 2.0 async
        await engine.close()


app = FastAPI(lifespan=lifespan)

# Adicionando o Middleware CORS
# Esta configuração é bastante permissiva e deve funcionar para localhost.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # SEJA MAIS ESPECÍFICO PARA SEGURANÇA
    # allow_origins=["*"], # Permite todas as origens (menos seguro, mas útil para debug)
    allow_credentials=True,
    allow_methods=["*"], # Permite GET, POST, PUT, DELETE, etc.
    allow_headers=["*"], # Permite todos os cabeçalhos
)

# Adicionar rotas
# Os prefixos aqui são importantes
app.include_router(user.router, prefix="/user_service", tags=["User Service"]) # Mantive o prefixo do seu api.ts
app.include_router(bet.router, prefix="/bet", tags=["Bet Service"]) # Mantive o prefixo do seu api.ts e endpoint /bet/coinflip

# Se seus arquivos de rota já incluem o prefixo no APIRouter,
# como `router = APIRouter(prefix="/bet")` em bet.py,
# então o prefixo no include_router pode ser redundante ou causar conflito.
# Exemplo: se bet.py tem prefix="/bet", e aqui você faz app.include_router(bet.router, prefix="/bet", ...)
# O caminho final seria /bet/bet/coinflip.
# No seu caso, o frontend chama /bet/bet/coinflip, então sua estrutura atual está correta.

# Rota de teste simples para verificar se o servidor está funcionando
@app.get("/")
async def root():
    return {"message": "Servidor de Apostas Online!"