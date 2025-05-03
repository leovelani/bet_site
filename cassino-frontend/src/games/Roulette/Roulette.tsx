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
      console.log("Enviando aposta:", {
        amount: betAmount,
        choice: selectedNumber,
        nome: username,
        multiplier: 36
      });

      const response = await api.post("/bet/bet/roleta", null, {
        params: {
          amount: Number(betAmount),
          choice: Number(selectedNumber),
          nome: username,
          multiplier: 36
        },
      });

      console.log("Resposta do servidor:", response.data);

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

    } catch (error: any) {
      console.error("Erro detalhado:", error.response?.data || error.message);
      alert("Erro ao processar aposta: " + (error.response?.data?.detail || error.message));
      setIsSpinning(false);
    }
  };

  const getNumberColor = (number: number): string => {
    if (number === 0) return "green";
    return number % 2 === 0 ? "red" : "black";
  };

  const renderWheelNumbers = () => {
    const numbers = Array.from({ length: 37 }, (_, i) => i);
    return numbers.map((number) => {
      const angle = (number * 360) / 37;
      const radius = 200;
      const x = Math.cos((angle * Math.PI) / 180) * radius;
      const y = Math.sin((angle * Math.PI) / 180) * radius;
      
      return (
        <div
          key={number}
          className={`wheel-number ${getNumberColor(number)}`}
          style={{
            transform: `translate(${x}px, ${y}px) rotate(${angle + 90}deg)`,
          }}
        >
          {number}
        </div>
      );
    });
  };

  const renderTrackNumbers = () => {
    const numbers = Array.from({ length: 37 }, (_, i) => i);
    return (
      <div className="roulette-track">
        {numbers.map((number) => (
          <div
            key={number}
            className={`track-number ${getNumberColor(number)}`}
          >
            {number}
          </div>
        ))}
      </div>
    );
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
               getNumberColor(selectedNumber) === "black" ? "Preto" : "Verde"}
            </span>
          </div>
        )}
      </div>

      {renderTrackNumbers()}

      <div className="roulette-wheel">
        <div className="wheel-pointer" />
        <div className={`wheel ${isSpinning ? "spinning" : ""}`}>
          <div className="wheel-numbers">
            {renderWheelNumbers()}
          </div>
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
