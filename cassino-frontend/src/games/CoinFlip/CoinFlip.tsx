import React, { useState } from "react";
import { flipCoin } from "./CoinFlipLogic";
import "./CoinFlip.css"; // Importando os estilos

const CoinFlip: React.FC = () => {
  const [result, setResult] = useState<string | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);

  const handlePlay = () => {
    setIsFlipping(true);

    setTimeout(() => {
      const flipResult = flipCoin();
      setResult(flipResult);
      setIsFlipping(false);
    }, 1000); // Tempo da animação
  };

  return (
    <div>
      <h2>Coin Flip</h2>
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
