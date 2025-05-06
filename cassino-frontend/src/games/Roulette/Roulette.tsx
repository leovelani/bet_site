
import React, { useState, useContext, useRef } from "react";
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
  const wheelRef = useRef<HTMLDivElement>(null);

  if (!gameContext) return null;
  const { balance, setBalance } = gameContext;

  const spinWheel = (winningNumber: number) => {
    const anglePerSlot = 360 / 37;
    const baseRotation = 360 * 10;
    const finalAngle = 360 - (winningNumber * anglePerSlot);
    const totalRotation = baseRotation + finalAngle;

    if (wheelRef.current) {
      wheelRef.current.style.transition = "transform 5s cubic-bezier(0.25, 0.1, 0.25, 1)";
      wheelRef.current.style.transform = `rotate(${totalRotation}deg)`;
    }
  };

  const handlePlay = async () => {
    if (betAmount > balance) {
      alert("Saldo insuficiente!");
      return;
    }

    if (selectedNumber < 0 || selectedNumber > 36) {
      alert("Escolha um número entre 0 e 36");
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
      const response = await api.post("/bet/bet/roleta", null, {
        params: {
          amount: Number(betAmount),
          choice: Number(selectedNumber),
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

      spinWheel(data.resultado);

      setTimeout(() => {
        const won = data.resultado === selectedNumber;
        setResult(data.resultado);
        setWin(won);
        setBalance(data.new_balance);
        localStorage.setItem("balance", String(data.new_balance));
        setShowResult(true);
        setIsSpinning(false);
      }, 5200);

    } catch (err: any) {
      alert("Erro ao processar aposta: " + (err.response?.data?.detail || err.message));
      setIsSpinning(false);
    }
  };

  const renderNumbers = () => {
    const numbers = Array.from({ length: 37 }, (_, i) => i);
    const anglePerSlot = 360 / 37;

    return numbers.map((num, index) => {
      const angle = index * anglePerSlot;
      return (
        <div
          key={num}
          className="number-slice"
          style={{
            transform: `rotate(${angle}deg) translate(0, -50%)`,
          }}
        >
          <span>{num}</span>
        </div>
      );
    });
  };

  return (
    <div className="roulette-pizza-page">
      <h2>Roleta</h2>

      <div className="bet-options">
        <label>
          Valor da Aposta:
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            min="1"
            max={balance}
          />
        </label>

        <label>
          Escolha um número:
          <input
            type="number"
            value={selectedNumber}
            onChange={(e) => setSelectedNumber(Number(e.target.value))}
            min="0"
            max="36"
          />
        </label>
      </div>

      <div className="pizza-container">
        <div className="wheel" ref={wheelRef}>
          {renderNumbers()}
        </div>
      </div>

      <button onClick={handlePlay} disabled={isSpinning}>
        {isSpinning ? "Girando..." : "Girar Roleta"}
      </button>

      {showResult && result !== null && (
        <div className={`resultado ${win ? "ganhou" : "perdeu"}`}>
          <p>Número sorteado: <strong>{result}</strong></p>
          <p>{win ? "Você ganhou!" : "Você perdeu!"}</p>
          {win && <p>Prêmio: ${betAmount * 36}</p>}
        </div>
      )}
    </div>
  );
};

export default Roulette;
