from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session # Não usado com AsyncSession
from src.models.database import AsyncSessionLocal
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from src.models.bet import Bet
from src.models.user import User # Certifique-se que este import está correto e User é seu modelo SQLAlchemy
# VERIFIQUE O NOME DESTE ARQUIVO/FUNÇÃO - balance_service.py ou balance.py?
from src.services.balance_service import update_balance 
from src.services.bet_service import register_bet
from src.services.user_service import get_user_by_username
import random
import logging 

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/bet") # O prefixo /bet já está aqui

async def get_db():
    # Certifique-se que AsyncSessionLocal está configurado corretamente em database.py
    db = AsyncSessionLocal() 
    try:
        yield db
    finally:
        await db.close()


@router.get("/bets", name="list_user_bets") 
async def list_bets(user_id: int, db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(select(Bet).filter(Bet.user_id == user_id))
        bets_result = result.scalars().all()
        bets_list = []
        for bet_obj in bets_result:
            # Serialização simples
            bet_data = {c.name: getattr(bet_obj, c.name) for c in bet_obj.__table__.columns}
            bets_list.append(bet_data)
        logger.info(f"Listando apostas para user_id {user_id}. Encontradas: {len(bets_list)}")
        return bets_list
    except Exception as e:
        logger.error(f"Erro ao listar apostas para user_id {user_id}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Erro interno ao buscar apostas.")


# --- Contadores Globais (Mantenha se for intencional) ---
# CoinFlip
coinflip_global_victory_count = 0 
coinflip_global_defeat_count = 0  
coinflip_global_required_defeats = random.randint(2, 10)
# Roleta
roleta_global_victory_count = 0
roleta_global_defeat_count = 0
roleta_global_required_defeats = random.randint(2, 10) 

@router.post("/coinflip", name="coinflip_bet") 
async def coinflip_bet_endpoint(amount: float, choice: str, nome: str, multiplier: int, db: AsyncSession = Depends(get_db)):
    # ===> Esta é a função onde o erro ocorria <===
    global coinflip_global_victory_count, coinflip_global_defeat_count, coinflip_global_required_defeats
    
    logger.info(f"CoinFlip - Recebido: Usuário={nome}, Valor={amount}, Escolha={choice}, Multiplicador={multiplier}")

    # --- Busca e Validação do Usuário/Saldo ---
    user = await get_user_by_username(db, nome)
    if not user:
        logger.warning(f"CoinFlip - Usuário não encontrado: {nome}")
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    user_id = user.id
    current_balance = user.balance
    logger.info(f"CoinFlip - Saldo atual {nome} (ID: {user_id}): {current_balance}")

    if current_balance < amount:
        logger.warning(f"CoinFlip - Saldo insuficiente para {nome}. Saldo: {current_balance}, Aposta: {amount}")
        raise HTTPException(status_code=400, detail="Saldo insuficiente")

    # --- Lógica "Viciada" e Resultado ---
    if coinflip_global_victory_count >= 1:
        resultado = "cara" if choice == "coroa" else "coroa"
        won = False
        coinflip_global_victory_count = 0; coinflip_global_defeat_count += 1
        logger.info("CoinFlip - Lógica: Forçando derrota.")
    elif coinflip_global_defeat_count >= coinflip_global_required_defeats:
        resultado = choice
        won = True
        coinflip_global_defeat_count = 0; coinflip_global_victory_count += 1
        coinflip_global_required_defeats = random.randint(2, 10)
        logger.info(f"CoinFlip - Lógica: Forçando vitória. Próximo limite: {coinflip_global_required_defeats}")
    else:
        resultado = random.choice(["cara", "coroa"])
        won = choice == resultado
        if won: coinflip_global_victory_count += 1; coinflip_global_defeat_count = 0
        else: coinflip_global_defeat_count += 1
        logger.info("CoinFlip - Lógica: Resultado aleatório.")
    logger.info(f"CoinFlip - Resultado final: {resultado}, Ganhou: {won}")

    # --- Atualização de Saldo e Registro no Banco ---
    new_balance_variable_for_return = current_balance # Inicializa com valor conhecido

    try:
        if won:
            net_gain = (amount * multiplier) - amount
            # Atualiza saldo com ganho líquido
            new_balance_variable_for_return = await update_balance(db, user_id, net_gain) 
            await register_bet(db, user_id, "coinflip", amount, "win")
            logger.info(f"CoinFlip - {nome} ganhou. Ganho líquido: {net_gain}.")
        else:
            # Atualiza saldo deduzindo a aposta
            new_balance_variable_for_return = await update_balance(db, user_id, -amount) 
            await register_bet(db, user_id, "coinflip", amount, "lose")
            logger.info(f"CoinFlip - {nome} perdeu. Aposta: {amount}")

        await db.commit() # Persiste as alterações
        logger.info(f"CoinFlip - Transação comitada para aposta de {nome}.")
        
        # Opcional: Recarregar usuário se update_balance não retornar o saldo comitado
        # updated_user = await db.get(User, user_id)
        # if updated_user: new_balance_variable_for_return = updated_user.balance

    except Exception as e:
        await db.rollback() 
        logger.error(f"CoinFlip - Erro no processamento DB para {nome}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Erro interno ao atualizar saldo/aposta: {str(e)}")

    # Garante que a variável está definida antes de retornar
    logger.info(f"CoinFlip - Retornando saldo final para {nome}: {new_balance_variable_for_return}")
    return {"resultado": resultado, "ganhou": won, "new_balance": new_balance_variable_for_return} 


@router.post("/roleta", name="roleta_bet") 
async def roleta_bet_endpoint(amount: float, choice: int, nome: str, multiplier: int, db: AsyncSession = Depends(get_db)):
    global roleta_global_victory_count, roleta_global_defeat_count, roleta_global_required_defeats
    
    logger.info(f"Roleta - Recebido: Usuário={nome}, Valor={amount}, Escolha={choice}, Multiplicador={multiplier}")

    # --- Busca e Validação do Usuário/Saldo ---
    user = await get_user_by_username(db, nome)
    if not user:
        logger.warning(f"Roleta - Usuário não encontrado: {nome}")
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    user_id = user.id
    current_balance = user.balance
    logger.info(f"Roleta - Saldo atual {nome} (ID: {user_id}): {current_balance}")

    if current_balance < amount:
        logger.warning(f"Roleta - Saldo insuficiente para {nome}. Saldo: {current_balance}, Aposta: {amount}")
        raise HTTPException(status_code=400, detail="Saldo insuficiente")

    # --- Validação da Escolha (Ajuste o range 0-36 se necessário) ---
    ROULETTE_NUMBERS = list(range(0, 37)) # Exemplo: 0 a 36
    if choice not in ROULETTE_NUMBERS: 
        logger.warning(f"Roleta - Escolha inválida para {nome}: {choice}")
        raise HTTPException(status_code=400, detail="Escolha inválida para a roleta (deve ser entre 0 e 36).") 

    # --- Lógica "Viciada" e Resultado ---
    if roleta_global_victory_count >= 1:
        possible_results = [i for i in ROULETTE_NUMBERS if i != choice] 
        resultado = random.choice(possible_results) if possible_results else choice # Fallback
        won = False
        roleta_global_victory_count = 0; roleta_global_defeat_count += 1
        logger.info("Roleta - Lógica: Forçando derrota.")
    elif roleta_global_defeat_count >= roleta_global_required_defeats:
        resultado = choice
        won = True
        roleta_global_defeat_count = 0; roleta_global_victory_count += 1
        roleta_global_required_defeats = random.randint(2, 10)
        logger.info(f"Roleta - Lógica: Forçando vitória. Próximo limite: {roleta_global_required_defeats}")
    else:
        resultado = random.choice(ROULETTE_NUMBERS) 
        won = choice == resultado
        if won: roleta_global_victory_count += 1; roleta_global_defeat_count = 0
        else: roleta_global_defeat_count += 1
        logger.info("Roleta - Lógica: Resultado aleatório.")
    logger.info(f"Roleta - Resultado final: {resultado}, Ganhou: {won}")

    # --- Atualização de Saldo e Registro no Banco ---
    new_balance_variable_for_return = current_balance # Inicializa

    try:
        if won:
            net_gain = (amount * multiplier) - amount
            new_balance_variable_for_return = await update_balance(db, user_id, net_gain)
            await register_bet(db, user_id, "roleta", amount, "win")
            logger.info(f"Roleta - {nome} ganhou. Ganho líquido: {net_gain}.")
        else:
            new_balance_variable_for_return = await update_balance(db, user_id, -amount)
            await register_bet(db, user_id, "roleta", amount, "lose")
            logger.info(f"Roleta - {nome} perdeu. Aposta: {amount}")
        
        await db.commit()
        logger.info(f"Roleta - Transação comitada para aposta de {nome}.")

        # Opcional: Recarregar usuário
        # updated_user = await db.get(User, user_id)
        # if updated_user: new_balance_variable_for_return = updated_user.balance

    except Exception as e:
        await db.rollback()
        logger.error(f"Roleta - Erro no processamento DB para {nome}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Erro interno ao atualizar saldo/aposta Roleta: {str(e)}")

    # Garante que a variável está definida
    logger.info(f"Roleta - Retornando saldo final para {nome}: {new_balance_variable_for_return}")
    return {"resultado": resultado, "ganhou": won, "new_balance": new_balance_variable_for_return}