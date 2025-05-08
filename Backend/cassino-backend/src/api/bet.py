from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.models.database import AsyncSessionLocal
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from src.models.bet import Bet
from src.services.balance import update_balance
from src.services.bet_service import register_bet
from src.services.user_service import get_user_by_username
import random

router = APIRouter(prefix="/bet")

async def get_db():
    db = AsyncSessionLocal()
    try:
        yield db
    finally:
       await db.close()


@router.get("/bets")
async def list_bets(user_id:int,db: AsyncSession = Depends(get_db)):
#    result = await db.execute(select(Bet))  
    result = await db.execute(select(Bet).filter(Bet.user_id == user_id))
    bets = result.scalars().all()  

    # 🟢 Transformar os objetos SQLAlchemy em dicionários serializáveis
    return [bet.__dict__ for bet in bets]


# Adicionar contadores de vitórias e derrotas para o CoinFlip
coinflip_victory_count = 0  # Quantas vezes o sistema "ganhou" recentemente
defeat_count = 0          # Quantas vezes o sistema "perdeu" recentemente
required_defeats = random.randint(2, 10) # Número de "derrotas" do sistema antes de uma "vitória" forçada do sistema

@router.post("/coinflip")
async def coinflip(amount: float, choice: str, nome: str, multiplier: int, db: AsyncSession = Depends(get_db)):
    global coinflip_victory_count, defeat_count, required_defeats
    try:
        # Buscar o usuário
        user = await get_user_by_username(db, nome)
        user_id = user.id

        # Descontar saldo
        new_balance = await update_balance(db, user_id, -amount)
        if new_balance is None:
            return {"erro": "Saldo insuficiente"}

        # Lógica viciada
        if coinflip_victory_count >= 1:
            resultado = "cara" if choice == "coroa" else "coroa"
            won = False
            coinflip_victory_count = 0
            defeat_count += 1
        elif defeat_count >= required_defeats:
            resultado = choice
            won = True
            defeat_count = 0
            coinflip_victory_count += 1
            required_defeats = random.randint(2, 10)
        else:
            resultado = random.choice(["cara", "coroa"])
            won = (choice == resultado)
            if won:
                coinflip_victory_count += 1
                defeat_count = 0
            else:
                defeat_count += 1

        # Se ganhou, atualizar saldo com o prêmio
        if won:
            new_balance = await update_balance(db, user_id, amount * multiplier)
            await register_bet(db, user_id, "coinflip", amount, "win")
        else:
            await register_bet(db, user_id, "coinflip", amount, "lose")

        return {
            "resultado": resultado,
            "ganhou": won,
            "new_balance": new_balance
        }

    except Exception as e:
        print("❌ ERRO NO COINFLIP:", e)
        return {"erro": "Erro interno no servidor"}


# Adicionar contadores de vitórias e derrotas
victory_count = 0
defeat_count = 0

@router.post("/roleta")
async def roleta(amount: float, choice: int, nome: str, multiplier: int, db: AsyncSession = Depends(get_db)):
    # Declara que estamos usando as variáveis globais definidas fora desta função.
    global victory_count, defeat_count, required_defeats
    
    user = await get_user_by_username(db, nome)
    user_id = user.id
    
    # Validação do número escolhido pelo jogador.
    if not (1 <= choice <= 36):
        return {"erro": "Escolha um número entre 1 e 36"}

    # Desconta o valor da aposta do saldo do jogador ANTES de determinar o resultado.
    new_balance = await update_balance(db, user_id, -amount)
    if new_balance is None:
        return {"erro": "Saldo insuficiente"}

    # --- INÍCIO DA LÓGICA VICIADA ---
    
    # CONDIÇÃO 1: FORÇAR DERROTA DO JOGADOR
    # Se o sistema "ganhou" na última rodada controlada (victory_count >= 1),
    # ele força o jogador atual a perder.
    if victory_count >= 1:
        # Garante que o resultado seja DIFERENTE da escolha do jogador.
        # Cria uma lista de todos os números possíveis (1 a 36) exceto o número que o jogador escolheu.
        # Em seguida, sorteia um número dessa lista.
        resultado = random.choice([i for i in range(1, 37) if i != choice])
        won = False  # Jogador perdeu.
        victory_count = 0  # Reseta a contagem de "vitórias do sistema" para o próximo ciclo.
        defeat_count += 1  # Incrementa a contagem de "derrotas do sistema" (pois o jogador perdeu).
    
    # CONDIÇÃO 2: FORÇAR VITÓRIA DO JOGADOR
    # Se a CONDIÇÃO 1 não foi atendida E o sistema acumulou "derrotas" suficientes (defeat_count >= required_defeats),
    # ele força o jogador atual a ganhar.
    elif defeat_count >= required_defeats:
        resultado = choice  # O resultado é exatamente o número que o jogador escolheu.
        won = True  # Jogador ganhou.
        defeat_count = 0  # Reseta a contagem de "derrotas do sistema".
        victory_count += 1  # Incrementa a contagem de "vitórias do sistema" (pois o jogador ganhou, preparando uma futura derrota forçada).
        # Define um novo número aleatório de "derrotas" que o sistema precisará acumular
        # antes de forçar outra vitória para um jogador.
        required_defeats = random.randint(2, 10)
        
    # CONDIÇÃO 3: RESULTADO "ALEATÓRIO" (MAS QUE ALIMENTA O CICLO)
    # Se nenhuma das condições forçadas acima foi atendida, o resultado é determinado aleatoriamente.
    else:
        resultado = random.randint(1, 36)  # Sorteia um número aleatório entre 1 e 36.
        won = choice == resultado  # Verifica se o número sorteado é o mesmo que o jogador escolheu.
        
        if won: # Se o jogador ganhou nesta rodada "aleatória":
            victory_count += 1  # Incrementa "vitórias do sistema" (preparando para forçar derrota futura).
            defeat_count = 0    # Reseta "derrotas do sistema".
        else: # Se o jogador perdeu nesta rodada "aleatória":
            defeat_count += 1   # Incrementa "derrotas do sistema" (aproximando de uma vitória forçada futura).

    # --- FIM DA LÓGICA VICIADA ---

    # Se o jogador ganhou (seja de forma forçada ou aleatória),
    # atualiza o saldo adicionando o valor ganho (aposta * multiplicador).
    if won:
        new_balance = await update_balance(db, user_id, amount * multiplier)
        await register_bet(db, user_id, "roleta", amount, "win") # Registra a aposta como vitória.
    else:
        await register_bet(db, user_id, "roleta", amount, "lose") # Registra a aposta como derrota.

    # Retorna o resultado para o frontend.
    return {
        "resultado": resultado,
        "ganhou": won,
        "new_balance": new_balance
    }
