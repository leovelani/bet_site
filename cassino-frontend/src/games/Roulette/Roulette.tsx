import React, { useState, useContext, useEffect } from "react";
import GameContext from "../../context/GameContext";
import "./Roulette.css";
import api from "../../services/api";

const Roulette: React.FC = () => {
  const [betAmount, setBetAmount] = useState<number>(10);
  const [selectedNumber, setSelectedNumber] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [result, setResult] = useState<number | null>(null);
  const [win, setWin] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);

  const gameContext = useContext(GameContext);
  if (!gameContext) return null;
  const { balance, setBalance } = gameContext;

  const handlePlay = async () => {
    if (betAmount > balance) {
      alert("Saldo insuficiente!");
      return;
    }

    if (selectedNumber < 1 || selectedNumber > 36) {
      alert("Por favor, escolha um número entre 1 e 36!");
      return;
    }

    const username = localStorage.getItem("username");
    if (!username) {
      alert("Usuário não logado!");
      return;
    }

    setIsSpinning(true);
    setResult(null);
    setWin(null);
    setShowResult(false);

    try {
      const response = await api.post("/bet/roleta", null, {
        params: {
          amount: betAmount,
          choice: selectedNumber,
          nome: username,
          multiplier: 36
        },
      });

      const data = response.data;

      if (data.erro) {
        alert(data.erro);
        setIsSpinning(false);
        return;
      }

      // Aguarda 5 segundos para mostrar o resultado
      setTimeout(() => {
        setIsSpinning(false);
        setResult(data.resultado);
        setWin(data.ganhou);
        setBalance(data.new_balance);
        localStorage.setItem("balance", String(data.new_balance));
        setShowResult(true);
      }, 5000);

    } catch (error) {
      alert("Erro ao processar aposta");
      console.error(error);
      setIsSpinning(false);
    }
  };

  const getNumberColor = (number: number): string => {
    if (number === 0) return "green";
    return number % 2 === 0 ? "red" : "blue";
  };

  return (
    <div className="roulette-page">
      <h2>Roleta</h2>

      <div className="bet-options">
        <label>
          Valor da Aposta
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            min="1"
            max={balance}
            placeholder="Digite o valor"
          />
        </label>

        <label>
          Escolha um número
          <input
            type="number"
            value={selectedNumber}
            onChange={(e) => setSelectedNumber(Number(e.target.value))}
            min="1"
            max="36"
            placeholder="1-36"
          />
        </label>

        {selectedNumber !== null && selectedNumber !== 0 && (
          <div className="number-preview">
            <span className={`number ${getNumberColor(selectedNumber)}`}>
              {selectedNumber}
            </span>
            <span className="color-label">
              {getNumberColor(selectedNumber) === "red" ? "Vermelho" : 
               getNumberColor(selectedNumber) === "blue" ? "Azul" : "Verde"}
            </span>
          </div>
        )}
      </div>

      <div className="roulette-wheel">
        <div className={`wheel ${isSpinning ? "spinning" : ""}`}>
          {showResult && result !== null && (
            <div className={`result-number ${getNumberColor(result)}`}>
              {result}
            </div>
          )}
        </div>
      </div>

      <button 
        onClick={handlePlay} 
        disabled={isSpinning || selectedNumber === 0}
      >
        {isSpinning ? "Girando..." : "Girar Roleta"}
      </button>

      {showResult && result !== null && (
        <div className={`resultado ${win ? "ganhou" : "perdeu"}`}>
          <p>Número sorteado: <span className={getNumberColor(result)}>{result}</span></p>
          <p>{win ? "Você ganhou!" : "Você perdeu!"}</p>
          {win && <p>Prêmio: ${betAmount * 36}</p>}
        </div>
      )}
    </div>
  );
};

export default Roulette;
