import React, { useState, useContext, useRef } from "react"; // useEffect não é estritamente necessário aqui
import GameContext from "../../context/GameContext";
import "./Roulette.css";
import api from "../../services/api";
import { IBet } from "../../utils/helpers";

// Função getNumberColor (permanece a mesma)
const getNumberColor = (number: number): string => {
  if (number === 0) return 'number-green';
  const redNumbers = [
    1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
  ];
  if (redNumbers.includes(number)) return 'number-red';
  return 'number-black';
};

const Roulette: React.FC = () => {
  const [betAmount, setBetAmount] = useState<number>(10);
  const [selectedNumber, setSelectedNumber] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [result, setResult] = useState<number | null>(null);
  const [win, setWin] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);

  const gameContext = useContext(GameContext);
  const wheelRef = useRef<HTMLDivElement>(null);
  // Guarda o ângulo de rotação acumulado da roleta para garantir giros progressivos
  const currentRotationRef = useRef<number>(0);

  if (!gameContext) return null;
  const { balance, setBalance } = gameContext;

  const spinWheel = (winningNumber: number) => {
    if (!wheelRef.current) return;

    const anglePerSlot = 360 / 37; // 37 números (0-36)
    
    // 1. Calcula o ângulo de destino normalizado (0-359 graus) para o número vencedor.
    //    Este é o ângulo em que a "fatia" do número vencedor deve estar alinhada com o ponteiro (topo).
    const targetNormalizedAngle = (360 - (winningNumber * anglePerSlot) + 360) % 360;
    
    // 2. Define quantas voltas completas "visuais" extras queremos que a roleta dê.
    const visualSpins = 10; // Por exemplo, 10 voltas rápidas.

    // 3. Calcula o ângulo visual atual da roleta (onde ela parou na última rodada, normalizado 0-359).
    const currentVisualAngle = (currentRotationRef.current % 360 + 360) % 360;

    // 4. Calcula a menor rotação para frente necessária para ir do ângulo visual atual ao ângulo de destino.
    const deltaToReachTarget = (targetNormalizedAngle - currentVisualAngle + 360) % 360;

    // 5. Calcula o novo ângulo de rotação final.
    //    Será a rotação acumulada da rodada anterior + as voltas visuais extras + o delta para o alvo.
    //    Isso garante que a roleta sempre gire para frente e complete as 'visualSpins'.
    const newFinalRotation = currentRotationRef.current + (visualSpins * 360) + deltaToReachTarget;

    // 6. Atualiza a referência da rotação acumulada para este novo valor final.
    currentRotationRef.current = newFinalRotation;

    // 7. Aplica a transição e a nova transformação de rotação.
    //    Não é necessário "resetar" a transição para 'none' com esta abordagem,
    //    pois o valor de `rotate()` está sempre aumentando, garantindo o giro contínuo.
    wheelRef.current.style.transition = "transform 5s cubic-bezier(0.25, 0.1, 0.25, 1)";
    wheelRef.current.style.transform = `rotate(${newFinalRotation}deg)`;
  };

  const handlePlay = async () => {
    if (betAmount <= 0) {
      alert("O valor da aposta deve ser maior que zero.");
      return;
    }
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
          multiplier: 36,
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
    const radius = 175;

    return numbers.map((num, index) => {
      const angle = index * anglePerSlot;
      const colorClass = getNumberColor(num);

      return (
        <div
          key={num}
          className="number-container"
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: '1px',
            height: '1px',
            transform: `rotate(${angle}deg)`,
          }}
        >
          <div
            className={`number-display ${colorClass}`}
            style={{
              position: 'absolute',
              transform: `translate(-50%, -${radius}px)`,
            }}
          >
            {num}
          </div>
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
        <div className="pointer"></div>
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

export class RouletteBet implements IBet {
  amount: number;
  choice: number;
  username: string;
  multiplier: number;

  constructor(amount: number, choice: number, username: string, multiplier: number) {
    this.amount = amount;
    this.choice = choice;
    this.username = username;
    this.multiplier = multiplier;
  }

  clone(): RouletteBet {
    return new RouletteBet(this.amount, this.choice, this.username, this.multiplier);
  }
}

export default Roulette;