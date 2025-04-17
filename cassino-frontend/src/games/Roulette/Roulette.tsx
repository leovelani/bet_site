import React, { useState, useContext } from "react";
import GameContext from "../../context/GameContext";
import api from "../../services/api";
import "./Roulette.css";

const Roulette: React.FC = () => {
  const [choice, setChoice] = useState<number>(1);
  const [amount, setAmount] = useState<number>(10);
  const [result, setResult] = useState<number | null>(null);
  const [won, setWon] = useState<boolean | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const gameContext = useContext(GameContext);
  if (!gameContext) return null;
  const { balance, setBalance } = gameContext;

  const handlePlay = async () => {
    const nome = localStorage.getItem("username");
    if (!nome) return alert("Usuário não logado");

    setSpinning(true);

    setTimeout(async () => {
      try {
        const response = await api.post("/bet/roleta", null, {
          params: {
            nome,
            amount,
            choice,
            multiplier: 36,
          },
        });

        const resultado = response.data.resultado;
        const ganhou = response.data.ganhou;

        setResult(resultado);
        setWon(ganhou);
        setBalance(response.data.new_balance);

        // Efeito sonoro
        const audio = new Audio(ganhou ? "/sounds/win.mp3" : "/sounds/lose.mp3");
        audio.play();

        // Atualiza histórico
        setHistory(prev => [
          `Você apostou ${amount} no ${choice}. Saiu ${resultado}. Resultado: ${ganhou ? "✅ Vitória" : "❌ Derrota"}`,
          ...prev,
        ]);
      } catch (error) {
        console.error("Erro ao apostar na roleta:", error);
        alert("Erro na roleta.");
      } finally {
        setSpinning(false);
      }
    }, 2000); // tempo da animação
  };

  return (
    <div className="roulette-container">
      <h2>Roleta</h2>

      <div className="form-group">
        <label>Número (1 a 36):</label>
        <input
          type="number"
          min={1}
          max={36}
          value={choice}
          onChange={(e) => setChoice(Number(e.target.value))}
        />
      </div>

      <div className="form-group">
        <label>Valor da aposta:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </div>

      <div className={`roleta-animacao ${spinning ? "girando" : ""}`} />

      <button onClick={handlePlay} disabled={spinning}>
        {spinning ? "Girando..." : "Jogar"}
      </button>

      {result !== null && (
        <div className={`resultado ${won ? "ganhou" : "perdeu"}`}>
          Resultado: {result} <br />
          {won ? "Você ganhou!" : "Você perdeu!"}
        </div>
      )}

      {history.length > 0 && (
        <div className="historico">
          <h3>Histórico</h3>
          <ul>
            {history.map((entry, index) => (
              <li key={index}>{entry}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Roulette;
