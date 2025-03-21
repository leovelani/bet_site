import React, { useState, useContext } from "react";
import { flipCoin } from "./CoinFlipLogic";
import GameContext from "../../context/GameContext";
import "./CoinFlip.css"; // Importando os estilos

const CoinFlip: React.FC = () => {
  const [betAmount, setBetAmount] = useState<number>(10); // Valor da aposta
  const [betChoice, setBetChoice] = useState<string>("Cara"); // Escolha do jogador
  const [result, setResult] = useState<string | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  
  const gameContext = useContext(GameContext);
  if (!gameContext) return null;
  const { balance, setBalance } = gameContext;

  const handlePlay = () => {
    if (betAmount > balance) {
      alert("Saldo insuficiente!");
      return;
    }

    setIsFlipping(true);

    setTimeout(() => {
      const flipResult = flipCoin();
      setResult(flipResult);
      setIsFlipping(false);

      if (flipResult === betChoice) {
        setBalance(balance + betAmount); 
      } else {
        setBalance(balance - betAmount); 
      }
    }, 2000);
  };

  return (
    <div>
      <h2>Coin Flip</h2>

      {/* Opções de Aposta */}
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
          <select value={betChoice} onChange={(e) => setBetChoice(e.target.value)}>
            <option value="Cara">Cara</option>
            <option value="Coroa">Coroa</option>
          </select>
        </label>
      </div>

      {/* Animação da Moeda */}
      <div className="coin-container">
        <div className={`coin ${isFlipping ? "flip" : ""}`}>
          {result || "?"}
        </div>
      </div>

      <button onClick={handlePlay} disabled={isFlipping}>Jogar</button>
    </div>
  );
};

export default CoinFlip;
