import React, { useState, useContext, useEffect } from "react";
import GameContext from "../../context/GameContext";
import "./CoinFlip.css";
import api from "../../services/api";
import { useGameState } from "../../hooks/useGameState";
import { IdleState, PlayingState, ResultState } from "../../hooks/CoinFlipStates";
import { IBet } from "../../utils/helpers";

const CoinFlip: React.FC = () => {
  const [betAmount, setBetAmount] = useState<number>(10);
  const [betChoice, setBetChoice] = useState<string>("cara");

  const { state, setState } = useGameState();

  const gameContext = useContext(GameContext);
  if (!gameContext) return null;
  const { balance, setBalance } = gameContext;

  const handlePlay = async () => {
    if (betAmount > balance) {
      alert("Saldo insuficiente!");
      return;
    }

    const username = localStorage.getItem("username");
    if (!username) {
      alert("Usuário não logado!");
      return;
    }

    setState(new PlayingState());

    try {
      const lastBet = new CoinFlipBet(betAmount, betChoice, username, 2);
      const betCopy = lastBet.clone();

      const response = await api.post("bet/bet/coinflip", null, {
        params: {
          amount: betCopy.amount,
          choice: betCopy.choice,
          nome: betCopy.username,
          multiplier: betCopy.multiplier,
        },
      });      

      const data = response.data;

      setTimeout(() => {
        setState(new ResultState(data.resultado, data.ganhou));
        setBalance(data.new_balance);
        localStorage.setItem("balance", String(data.new_balance));
      }, 2000); // tempo da animação

    } catch (error) {
      alert("Erro ao processar aposta");
      console.error(error);
      setState(new IdleState());
    }
  };

  return (
    <div className="coinflip-page">
      <h2>Coin Flip</h2>

      <div className="bet-options">
        <label>
          Valor da Aposta: $
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            min="1"
            max={balance}
          />
        </label>

        <label>
          Escolha:
          <select
            value={betChoice}
            onChange={(e) => setBetChoice(e.target.value)}
          >
            <option value="cara">Cara</option>
            <option value="coroa">Coroa</option>
          </select>
        </label>
      </div>

      <div className="coin-container">
        <div className={`coin ${state instanceof PlayingState ? "flip" : ""}`}>
          {state instanceof ResultState ? state.resultado : "?"}
        </div>
      </div>

      <button onClick={handlePlay} disabled={state instanceof PlayingState}>
        Jogar
      </button>

      {state instanceof ResultState && (
        <div className={`resultado ${state.ganhou ? "ganhou" : "perdeu"}`}>
          {state.ganhou ? "Você ganhou!" : "Você perdeu!"}
        </div>
      )}
    </div>
  );
};

// Classe de aposta para CoinFlip
export class CoinFlipBet implements IBet {
  amount: number;
  choice: string;
  username: string;
  multiplier: number;

  constructor(amount: number, choice: string, username: string, multiplier: number) {
    this.amount = amount;
    this.choice = choice;
    this.username = username;
    this.multiplier = multiplier;
  }

  clone(): CoinFlipBet {
    return new CoinFlipBet(this.amount, this.choice, this.username, this.multiplier);
  }
}

export default CoinFlip;
