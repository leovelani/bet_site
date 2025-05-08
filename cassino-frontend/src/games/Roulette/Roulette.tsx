import React, { useState, useContext, useRef } from "react";
import GameContext from "../../context/GameContext";
import "./Roulette.css";
import api from "../../services/api";
import { IBet } from "../../utils/helpers";

// Função para determinar a cor do número da roleta
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
  const [selectedNumber, setSelectedNumber] = useState<number>(0); // Default pode ser 0
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [result, setResult] = useState<number | null>(null);
  const [win, setWin] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);

  const gameContext = useContext(GameContext);
  const wheelRef = useRef<HTMLDivElement>(null);

  if (!gameContext) return null;
  const { balance, setBalance } = gameContext;

  const spinWheel = (winningNumber: number) => {
    const anglePerSlot = 360 / 37; // 37 números (0-36)
    const baseRotation = 360 * 10; // Girar várias vezes para efeito
    // Ajuste para que o número vencedor pare no topo (ponteiro)
    // O número 0 está na posição 0 graus. O número 1 em anglePerSlot, etc.
    // Queremos que o winningNumber * anglePerSlot chegue a 0 graus.
    // Então, rodamos por -(winningNumber * anglePerSlot)
    const finalAngle = 360 - (winningNumber * anglePerSlot);
    const totalRotation = baseRotation + finalAngle;

    if (wheelRef.current) {
      // Reset imediato (sem transição)
      wheelRef.current.style.transition = "none";
      wheelRef.current.style.transform = `rotate(0deg)`;
    
      // Aguarda um pequeno tempo para garantir que o reset seja aplicado
      setTimeout(() => {
        wheelRef.current!.style.transition = "transform 5s cubic-bezier(0.25, 0.1, 0.25, 1)";
        wheelRef.current!.style.transform = `rotate(${totalRotation}deg)`;
      }, 50); // pequeno delay para garantir que o reset foi reconhecido
    }
    
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
          multiplier: 36, // Este multiplicador é o padrão para aposta em número único
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
      }, 5200); // Tempo deve ser um pouco maior que a transição do CSS (5s)

    } catch (err: any) {
      alert("Erro ao processar aposta: " + (err.response?.data?.detail || err.message));
      setIsSpinning(false);
    }
  };

  const renderNumbers = () => {
    const numbers = Array.from({ length: 37 }, (_, i) => i); // 0 a 36
    const anglePerSlot = 360 / 37;
    const radius = 175; // Raio para posicionar os números (centro do círculo do número)

    return numbers.map((num, index) => {
      const angle = index * anglePerSlot; // Ângulo em graus
      const colorClass = getNumberColor(num);

      return (
        <div
          key={num}
          className="number-container" // Container para cada número, usado para rotação
          style={{
            position: 'absolute',
            left: '50%', // Centro da roleta
            top: '50%',   // Centro da roleta
            width: '1px', // Apenas um ponto de origem para a transformação
            height: '1px',
            transform: `rotate(${angle}deg)`, // Rotaciona o "braço" onde o número senta
          }}
        >
          <div
            className={`number-display ${colorClass}`} // O círculo visual do número
            style={{
              position: 'absolute',
              // Move o número para fora ao longo do "braço" rotacionado
              // translate(-50%, -radius) centraliza o número e o empurra para a borda
              transform: `translate(-50%, -${radius}px)`,
              // Os números vão girar com a roleta, mantendo sua orientação relativa à roleta
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
            min="0" // Alterado para permitir 0
            max="36"
          />
        </label>
      </div>

      <div className="pizza-container">
        <div className="pointer"></div> {/* Ponteiro adicionado aqui */}
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

// Classe de aposta para Roleta
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