import React from "react";
import "./Home.css"; 

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <h1>🎰 Bem-vindo ao Cassino Virtual!</h1>
      <p>Escolha um dos jogos no menu acima e teste sua sorte!</p>
      <p>Você pode apostar em Coin Flip ou Roleta.</p>
    </div>
  );
};

export default Home;
