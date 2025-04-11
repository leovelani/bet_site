import React, { useState, useContext } from "react";
import GameContext from "../../context/GameContext";
import "./CoinFlip.css"; // Importando os estilos
import api from "../../services/api";

const CoinFlip: React.FC = () => {
  const [betAmount, setBetAmount] = useState<number>(10); 
  const [betChoice, setBetChoice] = useState<string>("cara"); 
  const [result, setResult] = useState<string | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);

  const gameContext = useContext(GameContext);
  if (!gameContext) return null;
  const { balance, setBalance } = gameContext;

  const handlePlay = async () => {
    if (betAmount > balance) {
      alert("Saldo insuficiente!");
      return;
    }
  
    setIsFlipping(true);
  
    try {
      const username = localStorage.getItem("username");
      if (!username) {
        alert("Usuário não logado!");
        return;
      }
  
      const response = await api.post("/bet/bet/coinflip", null, {
        params: {
          amount: betAmount,
          choice: betChoice.toLowerCase(),
          nome: username,
        },
      });
  
      const data = response.data;
      setResult(data.resultado);
  
      setTimeout(() => {
        setBalance(data.new_balance);
        localStorage.setItem("balance", String(data.new_balance));
      }, 2000);
  
    } catch (error) {
      alert("Erro ao processar aposta");
      console.error(error);
    } finally {
      setTimeout(() => {
        setIsFlipping(false); 
      }, 2000);
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
          <select value={betChoice} onChange={(e) => setBetChoice(e.target.value)}>
            <option value="cara">Cara</option>
            <option value="coroa">Coroa</option>
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
