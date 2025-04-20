import React, { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    const storedUsername = localStorage.getItem("username");

    if (!userId) {
      navigate("/");
    } else {
      setUsername(storedUsername || "");
    }
  }, []);

  const handleGameClick = (gamePath: string) => {
    navigate(gamePath);
  };

  return (
    <div className="home-container">
      <h1>🎰 Bem-vindo ao Cassino Virtual!</h1>
      <p>Olá, <strong>{username}</strong>! Escolha um dos jogos no menu acima e teste sua sorte!</p>
      <p>Você pode apostar em Coin Flip ou Roleta.</p>

      <div className="games-container">
        <div className="game-card" onClick={() => handleGameClick("/coinflip")}>
          <h3>🎲 Coin Flip</h3>
          <p>Escolha entre cara ou coroa e teste sua sorte!</p>
          <button>Jogar Agora</button>
        </div>

        <div className="game-card" onClick={() => handleGameClick("/roulette")}>
          <h3>🎡 Roleta</h3>
          <p>Escolha um número e tente a sorte na roleta!</p>
          <button>Jogar Agora</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
